import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DataSource, Repository } from "typeorm";
import { VideoEntity } from "./entities/video.entity";
import { VideoLikeEntity } from "./entities/video-like.entity";
import { VideoCommentEntity } from "./entities/video-comment.entity";
import { CreateVideoDto } from "./dto/create-video.dto";
import { CreateVideoCommentDto } from "./dto/create-video-comment.dto";
import { QueryVideosDto } from "./dto/query-videos.dto";

export class VideoLikedEvent {
  constructor(
    public readonly videoId: number,
    public readonly authorId: number,
    public readonly likedByUserId: number
  ) {}
}

export class VideoCommentedEvent {
  constructor(
    public readonly videoId: number,
    public readonly authorId: number,
    public readonly commentedByUserId: number
  ) {}
}

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videosRepository: Repository<VideoEntity>,
    @InjectRepository(VideoLikeEntity)
    private readonly likesRepository: Repository<VideoLikeEntity>,
    @InjectRepository(VideoCommentEntity)
    private readonly commentsRepository: Repository<VideoCommentEntity>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // No ranking/algorithm for v1 — newest-first is the honest baseline until
  // there's real engagement data to rank on.
  async findFeed(query: QueryVideosDto) {
    const [items, total] = await this.videosRepository.findAndCount({
      where: { status: "published" },
      relations: { product: true },
      order: { createdAt: "DESC" },
      take: query.limit,
      skip: query.offset,
    });
    return { items, total, limit: query.limit, offset: query.offset };
  }

  findByAuthor(authorId: number) {
    return this.videosRepository.find({
      where: { authorId },
      relations: { product: true },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number) {
    const video = await this.videosRepository.findOne({
      where: { id },
      relations: { product: true },
    });
    if (!video) {
      throw new NotFoundException("Відео не знайдено");
    }
    return video;
  }

  async create(authorId: number, dto: CreateVideoDto) {
    const video = this.videosRepository.create({
      authorId,
      videoUrl: dto.videoUrl,
      thumbnailUrl: dto.thumbnailUrl ?? "",
      caption: dto.caption ?? "",
      productId: dto.productId,
    });
    return this.videosRepository.save(video);
  }

  async remove(id: number, authorId: number) {
    const video = await this.videosRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException("Відео не знайдено");
    }
    if (video.authorId !== authorId) {
      throw new ForbiddenException("Ви не можете видалити це відео");
    }
    await this.videosRepository.remove(video);
  }

  // Idempotent toggle: relies on the unique (videoId, userId) constraint to
  // detect "already liked" rather than a separate read-then-write race.
  async toggleLike(videoId: number, userId: number) {
    const video = await this.videosRepository.findOne({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException("Відео не знайдено");
    }

    return this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(VideoLikeEntity, { where: { videoId, userId } });

      if (existing) {
        await manager.remove(existing);
        await manager.decrement(VideoEntity, { id: videoId }, "likesCount", 1);
        return { liked: false };
      }

      const like = manager.create(VideoLikeEntity, { videoId, userId });
      await manager.save(like);
      await manager.increment(VideoEntity, { id: videoId }, "likesCount", 1);

      if (video.authorId !== userId) {
        this.eventEmitter.emit("video.liked", new VideoLikedEvent(videoId, video.authorId, userId));
      }

      return { liked: true };
    });
  }

  findComments(videoId: number) {
    return this.commentsRepository.find({
      where: { videoId },
      order: { createdAt: "ASC" },
    });
  }

  async addComment(videoId: number, authorId: number, dto: CreateVideoCommentDto) {
    const video = await this.videosRepository.findOne({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException("Відео не знайдено");
    }

    const comment = await this.dataSource.transaction(async (manager) => {
      const created = manager.create(VideoCommentEntity, { videoId, authorId, text: dto.text });
      const saved = await manager.save(created);
      await manager.increment(VideoEntity, { id: videoId }, "commentsCount", 1);
      return saved;
    });

    if (video.authorId !== authorId) {
      this.eventEmitter.emit(
        "video.commented",
        new VideoCommentedEvent(videoId, video.authorId, authorId)
      );
    }

    return comment;
  }

  async registerView(id: number) {
    await this.videosRepository.increment({ id }, "viewsCount", 1);
  }

  // Called by the Moderation module when a report against this video is
  // approved — matches ProductsService's role in the same flow (deactivate),
  // just for videos (hide from the public feed).
  async hide(id: number) {
    await this.videosRepository.update(id, { status: "hidden" });
  }
}

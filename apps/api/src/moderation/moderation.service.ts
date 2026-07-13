import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReportEntity, ReportStatus } from "./entities/report.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { ReviewEntity } from "../reviews/entities/review.entity";
import { ChatMessageEntity } from "../realtime/entities/chat-message.entity";
import { VideoEntity } from "../videos/entities/video.entity";
import { CreateReportDto } from "./dto/create-report.dto";

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportsRepository: Repository<ReportEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessagesRepository: Repository<ChatMessageEntity>,
    @InjectRepository(VideoEntity)
    private readonly videosRepository: Repository<VideoEntity>
  ) {}

  async create(reporterId: number, dto: CreateReportDto) {
    await this.assertTargetExists(dto.targetType, dto.targetId);
    const report = this.reportsRepository.create({ ...dto, reporterId });
    return this.reportsRepository.save(report);
  }

  findPending() {
    return this.reportsRepository.find({
      where: { status: "pending" },
      order: { createdAt: "ASC" },
    });
  }

  findAll() {
    return this.reportsRepository.find({ order: { createdAt: "DESC" } });
  }

  async countPendingByTargetType() {
    const rows = await this.reportsRepository
      .createQueryBuilder("report")
      .select("report.targetType", "targetType")
      .addSelect("COUNT(*)", "count")
      .where("report.status = :status", { status: "pending" })
      .groupBy("report.targetType")
      .getRawMany<{ targetType: string; count: string }>();

    return Object.fromEntries(rows.map((r) => [r.targetType, Number(r.count)]));
  }

  // "approved" = the complaint is valid → the reported content is actioned
  // (product deactivated / review or message deleted). "rejected" = the
  // complaint is dismissed and the content is left untouched.
  async resolve(id: number, adminId: number, status: Extract<ReportStatus, "approved" | "rejected">) {
    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException("Скаргу не знайдено");
    }
    if (report.status !== "pending") {
      throw new NotFoundException("Скаргу вже розглянуто");
    }

    if (status === "approved") {
      await this.applyAction(report.targetType, report.targetId);
    }

    report.status = status;
    report.resolvedById = adminId;
    report.resolvedAt = new Date();
    return this.reportsRepository.save(report);
  }

  private async assertTargetExists(targetType: string, targetId: number) {
    if (targetType === "product") {
      const exists = await this.productsRepository.exist({ where: { id: targetId } });
      if (!exists) throw new NotFoundException("Товар не знайдено");
    } else if (targetType === "review") {
      const exists = await this.reviewsRepository.exist({ where: { id: targetId } });
      if (!exists) throw new NotFoundException("Відгук не знайдено");
    } else if (targetType === "chat_message") {
      const exists = await this.chatMessagesRepository.exist({ where: { id: targetId } });
      if (!exists) throw new NotFoundException("Повідомлення не знайдено");
    } else if (targetType === "video") {
      const exists = await this.videosRepository.exist({ where: { id: targetId } });
      if (!exists) throw new NotFoundException("Відео не знайдено");
    }
  }

  private async applyAction(targetType: string, targetId: number) {
    if (targetType === "product") {
      await this.productsRepository.update(targetId, { active: false });
    } else if (targetType === "review") {
      await this.reviewsRepository.delete(targetId);
    } else if (targetType === "chat_message") {
      await this.chatMessagesRepository.delete(targetId);
    } else if (targetType === "video") {
      await this.videosRepository.update(targetId, { status: "hidden" });
    }
  }
}

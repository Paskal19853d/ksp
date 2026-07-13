import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./entities/video.entity";
import { VideoLikeEntity } from "./entities/video-like.entity";
import { VideoCommentEntity } from "./entities/video-comment.entity";
import { VideosService } from "./videos.service";
import { VideosController } from "./videos.controller";

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, VideoLikeEntity, VideoCommentEntity])],
  providers: [VideosService],
  controllers: [VideosController],
  exports: [VideosService],
})
export class VideosModule {}

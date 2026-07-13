import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportEntity } from "./entities/report.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { ReviewEntity } from "../reviews/entities/review.entity";
import { ChatMessageEntity } from "../realtime/entities/chat-message.entity";
import { VideoEntity } from "../videos/entities/video.entity";
import { ModerationService } from "./moderation.service";
import { ModerationController } from "./moderation.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity, ProductEntity, ReviewEntity, ChatMessageEntity, VideoEntity]),
  ],
  providers: [ModerationService],
  controllers: [ModerationController],
  exports: [ModerationService],
})
export class ModerationModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { OrderNotificationsListener } from "./listeners/order-notifications.listener";
import { ReviewNotificationsListener } from "./listeners/review-notifications.listener";
import { PayoutNotificationsListener } from "./listeners/payout-notifications.listener";
import { VideoNotificationsListener } from "./listeners/video-notifications.listener";

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [
    NotificationsService,
    OrderNotificationsListener,
    ReviewNotificationsListener,
    PayoutNotificationsListener,
    VideoNotificationsListener,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}

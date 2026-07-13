import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications.service";
import { ReviewCreatedEvent } from "../../reviews/reviews.service";

@Injectable()
export class ReviewNotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent("review.created")
  async onReviewCreated(event: ReviewCreatedEvent) {
    await this.notificationsService.create({
      recipientId: event.sellerId,
      type: "review",
      title: `Новий відгук: ${"★".repeat(event.rating)}`,
      body: "",
      link: `/seller/reviews`,
    });
  }
}

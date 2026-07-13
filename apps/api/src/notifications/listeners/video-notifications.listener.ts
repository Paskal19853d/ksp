import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications.service";
import { VideoLikedEvent, VideoCommentedEvent } from "../../videos/videos.service";

@Injectable()
export class VideoNotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent("video.liked")
  async onVideoLiked(event: VideoLikedEvent) {
    await this.notificationsService.create({
      recipientId: event.authorId,
      type: "social",
      title: "Комусь сподобалось ваше відео",
      body: "",
      link: `/video?id=${event.videoId}`,
    });
  }

  @OnEvent("video.commented")
  async onVideoCommented(event: VideoCommentedEvent) {
    await this.notificationsService.create({
      recipientId: event.authorId,
      type: "social",
      title: "Новий коментар до вашого відео",
      body: "",
      link: `/video?id=${event.videoId}`,
    });
  }
}

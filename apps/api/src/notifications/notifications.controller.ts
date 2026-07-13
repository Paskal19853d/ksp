import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findMine(@CurrentUser() user: { id: number }) {
    return this.notificationsService.findMine(user.id);
  }

  @Get("unread-count")
  async countUnread(@CurrentUser() user: { id: number }) {
    const count = await this.notificationsService.countUnread(user.id);
    return { count };
  }

  @Patch(":id/read")
  markRead(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.notificationsService.markRead(id, user.id);
  }

  @Patch("read-all")
  async markAllRead(@CurrentUser() user: { id: number }) {
    await this.notificationsService.markAllRead(user.id);
    return { ok: true };
  }
}

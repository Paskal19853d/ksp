import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationEntity, NotificationType } from "./entities/notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepository: Repository<NotificationEntity>
  ) {}

  create(input: {
    recipientId: number;
    type: NotificationType;
    title: string;
    body?: string;
    link?: string;
  }) {
    const notification = this.notificationsRepository.create({
      recipientId: input.recipientId,
      type: input.type,
      title: input.title,
      body: input.body ?? "",
      link: input.link,
    });
    return this.notificationsRepository.save(notification);
  }

  findMine(recipientId: number) {
    return this.notificationsRepository.find({
      where: { recipientId },
      order: { createdAt: "DESC" },
      take: 100,
    });
  }

  countUnread(recipientId: number) {
    return this.notificationsRepository.count({ where: { recipientId, read: false } });
  }

  async markRead(id: number, recipientId: number) {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (!notification || notification.recipientId !== recipientId) {
      throw new NotFoundException("Сповіщення не знайдено");
    }
    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllRead(recipientId: number) {
    await this.notificationsRepository.update({ recipientId, read: false }, { read: true });
  }
}

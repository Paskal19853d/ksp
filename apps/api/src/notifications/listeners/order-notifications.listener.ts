import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications.service";
import { OrderCreatedEvent, OrderStatusChangedEvent } from "../../orders/orders.service";

const STATUS_LABELS: Record<string, string> = {
  packing: "пакується",
  shipping: "в дорозі",
  delivered: "доставлено",
  cancelled: "скасовано",
  return_requested: "запит на повернення",
};

@Injectable()
export class OrderNotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent("order.created")
  async onOrderCreated(event: OrderCreatedEvent) {
    await this.notificationsService.create({
      recipientId: event.sellerId,
      type: "order",
      title: "Нове замовлення",
      body: `Замовлення ${event.orderNo} очікує на обробку`,
      link: `/seller/orders`,
    });
  }

  @OnEvent("order.status_changed")
  async onOrderStatusChanged(event: OrderStatusChangedEvent) {
    const label = STATUS_LABELS[event.status];
    if (!label) return;

    await this.notificationsService.create({
      recipientId: event.buyerId,
      type: "order",
      title: `Замовлення ${event.orderNo}: ${label}`,
      body: "",
      link: `/profile`,
    });
  }
}

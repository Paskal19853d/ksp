import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications.service";
import { PayoutPaidEvent } from "../../finance/finance.service";

@Injectable()
export class PayoutNotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent("payout.paid")
  async onPayoutPaid(event: PayoutPaidEvent) {
    await this.notificationsService.create({
      recipientId: event.sellerId,
      type: "payout",
      title: "Виплату зараховано",
      body: `${event.netAmount.toLocaleString("uk-UA")} ₴ переказано на ваш рахунок`,
      link: `/seller/finance`,
    });
  }
}

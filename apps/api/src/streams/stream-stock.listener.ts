import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ProductPurchasedEvent } from "../orders/orders.service";
import { StreamsService } from "./streams.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";

@Injectable()
export class StreamStockListener {
  constructor(
    private readonly streamsService: StreamsService,
    private readonly realtimeGateway: RealtimeGateway
  ) {}

  @OnEvent("product.purchased")
  async onProductPurchased(event: ProductPurchasedEvent) {
    const liveStreams = await this.streamsService.findLiveFeaturingProduct(event.productId);
    for (const stream of liveStreams) {
      this.realtimeGateway.broadcastStockUpdate(stream.id, event.productId, event.newStock);
    }
  }
}

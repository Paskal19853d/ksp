import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StreamEntity } from "./entities/stream.entity";
import { StreamsService } from "./streams.service";
import { StreamsController } from "./streams.controller";
import { ProductsModule } from "../products/products.module";
import { RealtimeModule } from "../realtime/realtime.module";
import { StreamStockListener } from "./stream-stock.listener";

@Module({
  imports: [TypeOrmModule.forFeature([StreamEntity]), ProductsModule, RealtimeModule],
  providers: [StreamsService, StreamStockListener],
  controllers: [StreamsController],
  exports: [StreamsService],
})
export class StreamsModule {}

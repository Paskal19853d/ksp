import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { CommissionRuleEntity } from "../finance/entities/commission-rule.entity";
import { AffiliateLinkEntity } from "../blogger/entities/affiliate-link.entity";
import { OrdersService } from "./orders.service";
import { SellerStatsService } from "./seller-stats.service";
import { OrdersController } from "./orders.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, CommissionRuleEntity, AffiliateLinkEntity]),
  ],
  providers: [OrdersService, SellerStatsService],
  controllers: [OrdersController],
  exports: [OrdersService, SellerStatsService],
})
export class OrdersModule {}

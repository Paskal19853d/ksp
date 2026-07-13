import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AffiliateLinkEntity } from "./entities/affiliate-link.entity";
import { AffiliatePayoutEntity } from "./entities/affiliate-payout.entity";
import { OrderItemEntity } from "../orders/entities/order-item.entity";
import { ProductsModule } from "../products/products.module";
import { BloggerService } from "./blogger.service";
import { BloggerController } from "./blogger.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([AffiliateLinkEntity, AffiliatePayoutEntity, OrderItemEntity]),
    ProductsModule,
  ],
  providers: [BloggerService],
  controllers: [BloggerController],
  exports: [BloggerService],
})
export class BloggerModule {}

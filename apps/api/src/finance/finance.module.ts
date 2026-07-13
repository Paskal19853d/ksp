import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommissionRuleEntity } from "./entities/commission-rule.entity";
import { PayoutEntity } from "./entities/payout.entity";
import { OrderItemEntity } from "../orders/entities/order-item.entity";
import { CategoriesModule } from "../categories/categories.module";
import { FinanceService } from "./finance.service";
import { FinanceController } from "./finance.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommissionRuleEntity, PayoutEntity, OrderItemEntity]),
    CategoriesModule,
  ],
  providers: [FinanceService],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}

import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { OrdersModule } from "../orders/orders.module";
import { FinanceModule } from "../finance/finance.module";
import { ModerationModule } from "../moderation/moderation.module";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [UsersModule, OrdersModule, FinanceModule, ModerationModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

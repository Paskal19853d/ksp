import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { OrdersService } from "../orders/orders.service";
import { FinanceService } from "../finance/finance.service";
import { ModerationService } from "../moderation/moderation.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly financeService: FinanceService,
    private readonly moderationService: ModerationService
  ) {}

  async getDashboard() {
    const [totalUsers, totalSellers, totalOrders, financeSummary, gmvTrend, pendingByTargetType] =
      await Promise.all([
        this.usersService.countAll(),
        this.usersService.countByRole("seller"),
        this.ordersService.countAll(),
        this.financeService.getPlatformSummary(),
        this.financeService.getMonthlyGmvTrend(),
        this.moderationService.countPendingByTargetType(),
      ]);

    return {
      totalUsers,
      totalSellers,
      totalOrders,
      gmv: financeSummary.gmv,
      gmvTrend,
      pendingReports: {
        product: pendingByTargetType.product ?? 0,
        review: pendingByTargetType.review ?? 0,
        chat_message: pendingByTargetType.chat_message ?? 0,
        video: pendingByTargetType.video ?? 0,
      },
    };
  }
}

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { UpsertCommissionRuleDto } from "./dto/upsert-commission-rule.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get("commissions")
  @UseGuards(RolesGuard)
  @Roles("admin")
  findAllCommissionRules() {
    return this.financeService.findAllCommissionRules();
  }

  @Patch("commissions/:categoryId")
  @UseGuards(RolesGuard)
  @Roles("admin")
  upsertCommissionRule(
    @Param("categoryId", ParseIntPipe) categoryId: number,
    @Body() dto: UpsertCommissionRuleDto
  ) {
    return this.financeService.upsertCommissionRule(categoryId, dto);
  }

  @Get("finance/summary")
  @UseGuards(RolesGuard)
  @Roles("admin")
  getPlatformSummary() {
    return this.financeService.getPlatformSummary();
  }

  @Get("finance/gmv-trend")
  @UseGuards(RolesGuard)
  @Roles("admin")
  getMonthlyGmvTrend() {
    return this.financeService.getMonthlyGmvTrend();
  }

  @Get("payouts")
  @UseGuards(RolesGuard)
  @Roles("admin")
  findAllPayouts() {
    return this.financeService.findAllPayouts();
  }

  @Patch("payouts/:id/paid")
  @UseGuards(RolesGuard)
  @Roles("admin")
  markPayoutPaid(@Param("id", ParseIntPipe) id: number) {
    return this.financeService.markPayoutPaid(id);
  }

  @Get("seller/balance")
  @UseGuards(RolesGuard)
  @Roles("seller")
  getSellerBalance(@CurrentUser() user: { id: number }) {
    return this.financeService.getSellerBalance(user.id);
  }

  @Get("seller/payouts")
  @UseGuards(RolesGuard)
  @Roles("seller")
  findSellerPayouts(@CurrentUser() user: { id: number }) {
    return this.financeService.findSellerPayouts(user.id);
  }

  @Post("seller/payouts")
  @UseGuards(RolesGuard)
  @Roles("seller")
  requestPayout(@CurrentUser() user: { id: number }) {
    return this.financeService.requestPayout(user.id);
  }
}

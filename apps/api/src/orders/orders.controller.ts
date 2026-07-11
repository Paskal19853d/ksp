import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { SellerStatsService } from "./seller-stats.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { RequestReturnDto } from "./dto/request-return.dto";
import { QuerySellerStatsDto } from "./dto/query-seller-stats.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly sellerStatsService: SellerStatsService
  ) {}

  @Post()
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get("my")
  findMine(@CurrentUser() user: { id: number }) {
    return this.ordersService.findByBuyer(user.id);
  }

  @Get("seller")
  @UseGuards(RolesGuard)
  @Roles("seller")
  findForSeller(@CurrentUser() user: { id: number }) {
    return this.ordersService.findBySeller(user.id);
  }

  @Get("seller/stats")
  @UseGuards(RolesGuard)
  @Roles("seller")
  getSellerStats(@CurrentUser() user: { id: number }, @Query() query: QuerySellerStatsDto) {
    return this.sellerStatsService.getStats(user.id, query.period);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles("seller")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(id, user.id, dto.status);
  }

  @Patch(":id/return")
  requestReturn(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: RequestReturnDto
  ) {
    return this.ordersService.requestReturn(id, user.id, dto.reason);
  }
}

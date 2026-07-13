import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { QueryUsersDto } from "./dto/query-users.dto";
import { SetBlockedDto } from "./dto/set-blocked.dto";
import { ResolveSellerDto } from "./dto/resolve-seller.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("admin")
  findAllForAdmin(@Query() query: QueryUsersDto) {
    return this.usersService.findAllForAdmin(query);
  }

  @Patch("admin/:id/blocked")
  setBlocked(@Param("id", ParseIntPipe) id: number, @Body() dto: SetBlockedDto) {
    return this.usersService.setBlocked(id, dto.blocked);
  }

  @Get("admin/sellers/pending")
  findPendingSellers() {
    return this.usersService.findPendingSellers();
  }

  @Get("admin/sellers")
  findAllSellersForAdmin() {
    return this.usersService.findAllSellersForAdmin();
  }

  @Patch("admin/sellers/:id/resolve")
  resolveSeller(@Param("id", ParseIntPipe) id: number, @Body() dto: ResolveSellerDto) {
    return this.usersService.resolveSeller(id, dto.status);
  }
}

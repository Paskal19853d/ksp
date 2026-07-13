import { Body, Controller, Get, Param, Patch, Post, UseGuards, ParseIntPipe } from "@nestjs/common";
import { BloggerService } from "./blogger.service";
import { CreateAffiliateLinkDto } from "./dto/create-affiliate-link.dto";
import { UpdateAffiliateLinkDto } from "./dto/update-affiliate-link.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller()
export class BloggerController {
  constructor(private readonly bloggerService: BloggerService) {}

  @Post("affiliate-links/:code/click")
  registerClick(@Param("code") code: string) {
    return this.bloggerService.registerClick(code);
  }

  @Get("blogger/links")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("blogger")
  findMine(@CurrentUser() user: { id: number }) {
    return this.bloggerService.findMine(user.id);
  }

  @Post("blogger/links")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("blogger")
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateAffiliateLinkDto) {
    return this.bloggerService.create(user.id, dto);
  }

  @Patch("blogger/links/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("blogger")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateAffiliateLinkDto
  ) {
    return this.bloggerService.update(id, user.id, dto);
  }

  @Get("blogger/balance")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("blogger")
  getBalance(@CurrentUser() user: { id: number }) {
    return this.bloggerService.getBalance(user.id);
  }

  @Get("blogger/payouts")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("blogger")
  findPayouts(@CurrentUser() user: { id: number }) {
    return this.bloggerService.findPayouts(user.id);
  }

  @Post("blogger/payouts")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("blogger")
  requestPayout(@CurrentUser() user: { id: number }) {
    return this.bloggerService.requestPayout(user.id);
  }
}

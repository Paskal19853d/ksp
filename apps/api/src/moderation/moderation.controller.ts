import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ModerationService } from "./moderation.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { ResolveReportDto } from "./dto/resolve-report.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("reports")
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateReportDto) {
    return this.moderationService.create(user.id, dto);
  }

  @Get("pending")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findPending() {
    return this.moderationService.findPending();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findAll() {
    return this.moderationService.findAll();
  }

  @Patch(":id/resolve")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  resolve(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: ResolveReportDto
  ) {
    return this.moderationService.resolve(id, user.id, dto.status);
  }
}

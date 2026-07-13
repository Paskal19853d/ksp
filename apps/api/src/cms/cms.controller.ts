import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CmsService } from "./cms.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("cms/pages")
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get("public/:slug")
  findPublishedBySlug(@Param("slug") slug: string) {
    return this.cmsService.findPublishedBySlug(slug);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findAll() {
    return this.cmsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.cmsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  create(@CurrentUser() user: { id: number }, @Body() dto: CreatePageDto) {
    return this.cmsService.create(user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdatePageDto) {
    return this.cmsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.cmsService.remove(id);
  }
}

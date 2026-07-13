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
import { MarketingService } from "./marketing.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { UpdateAdCampaignStatusDto } from "./dto/update-ad-campaign-status.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller()
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get("banners/active")
  findActiveBanners() {
    return this.marketingService.findActiveBanners();
  }

  @Get("banners")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findAllBanners() {
    return this.marketingService.findAllBanners();
  }

  @Post("banners")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  createBanner(@Body() dto: CreateBannerDto) {
    return this.marketingService.createBanner(dto);
  }

  @Patch("banners/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  updateBanner(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
    return this.marketingService.updateBanner(id, dto);
  }

  @Delete("banners/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  removeBanner(@Param("id", ParseIntPipe) id: number) {
    return this.marketingService.removeBanner(id);
  }

  @Get("ad-campaigns")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  findAllAdCampaigns() {
    return this.marketingService.findAllAdCampaigns();
  }

  @Patch("ad-campaigns/:id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  updateAdCampaignStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAdCampaignStatusDto
  ) {
    return this.marketingService.updateAdCampaignStatus(id, dto.status);
  }
}

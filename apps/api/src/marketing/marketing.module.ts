import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BannerEntity } from "./entities/banner.entity";
import { AdCampaignEntity } from "./entities/ad-campaign.entity";
import { MarketingService } from "./marketing.service";
import { MarketingController } from "./marketing.controller";

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity, AdCampaignEntity])],
  providers: [MarketingService],
  controllers: [MarketingController],
  exports: [MarketingService],
})
export class MarketingModule {}

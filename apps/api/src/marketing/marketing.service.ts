import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BannerEntity } from "./entities/banner.entity";
import { AdCampaignEntity, AdCampaignStatus } from "./entities/ad-campaign.entity";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannersRepository: Repository<BannerEntity>,
    @InjectRepository(AdCampaignEntity)
    private readonly adCampaignsRepository: Repository<AdCampaignEntity>
  ) {}

  findActiveBanners() {
    return this.bannersRepository.find({
      where: { active: true },
      order: { createdAt: "DESC" },
    });
  }

  findAllBanners() {
    return this.bannersRepository.find({ order: { createdAt: "DESC" } });
  }

  async createBanner(dto: CreateBannerDto) {
    const banner = this.bannersRepository.create(dto);
    return this.bannersRepository.save(banner);
  }

  async updateBanner(id: number, dto: UpdateBannerDto) {
    const banner = await this.findBannerOrThrow(id);
    Object.assign(banner, dto);
    return this.bannersRepository.save(banner);
  }

  async removeBanner(id: number) {
    const banner = await this.findBannerOrThrow(id);
    await this.bannersRepository.remove(banner);
  }

  findAllAdCampaigns() {
    return this.adCampaignsRepository.find({
      relations: { seller: true, product: true },
      select: { seller: { id: true, name: true }, product: { id: true, name: true, imageSeed: true } },
      order: { createdAt: "DESC" },
    });
  }

  async updateAdCampaignStatus(id: number, status: AdCampaignStatus) {
    const campaign = await this.adCampaignsRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException("Рекламну кампанію не знайдено");
    }
    campaign.status = status;
    return this.adCampaignsRepository.save(campaign);
  }

  private async findBannerOrThrow(id: number) {
    const banner = await this.bannersRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException("Банер не знайдено");
    }
    return banner;
  }
}

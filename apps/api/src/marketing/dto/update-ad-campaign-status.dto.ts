import { IsIn } from "class-validator";
import type { AdCampaignStatus } from "../entities/ad-campaign.entity";

export class UpdateAdCampaignStatusDto {
  @IsIn(["active", "paused"])
  status: Extract<AdCampaignStatus, "active" | "paused">;
}

import { IsIn, IsOptional } from "class-validator";

export const STATS_PERIODS = ["day", "week", "month", "year"] as const;
export type StatsPeriod = (typeof STATS_PERIODS)[number];

export class QuerySellerStatsDto {
  @IsOptional()
  @IsIn(STATS_PERIODS)
  period?: StatsPeriod = "week";
}

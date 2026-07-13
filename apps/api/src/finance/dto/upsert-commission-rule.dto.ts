import { IsInt, Max, Min } from "class-validator";

export class UpsertCommissionRuleDto {
  @IsInt()
  @Min(0)
  @Max(100)
  pct: number;
}

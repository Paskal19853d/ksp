import { IsBoolean, IsOptional } from "class-validator";

export class UpdateAffiliateLinkDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

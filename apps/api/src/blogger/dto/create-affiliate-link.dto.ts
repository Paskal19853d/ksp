import { IsInt, IsOptional, Matches, Max, MaxLength, Min } from "class-validator";

export class CreateAffiliateLinkDto {
  @IsInt()
  productId: number;

  @Matches(/^[a-zA-Z0-9-]+$/, { message: "code must contain only letters, digits and hyphens" })
  @MaxLength(60)
  code: string;

  @IsInt()
  @Min(1)
  @Max(50)
  pct: number;

  @IsOptional()
  active?: boolean;
}

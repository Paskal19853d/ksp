import { IsInt, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateVideoDto {
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  videoUrl: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  caption?: string;

  @IsOptional()
  @IsInt()
  productId?: number;
}

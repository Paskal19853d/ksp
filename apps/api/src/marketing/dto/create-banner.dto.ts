import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  subtitle?: string;

  @IsUrl({ require_tld: false })
  @MaxLength(500)
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  link: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(60)
  name: string;

  @IsString()
  @MaxLength(8)
  icon: string;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}

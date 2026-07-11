import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateStreamDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsInt({ each: true })
  @Type(() => Number)
  productIds?: number[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

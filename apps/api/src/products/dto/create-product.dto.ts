import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

const VARIANT_OPTIONS = ["S", "M", "L", "XL", "Чорний", "Білий", "Синій"];

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsInt()
  @Min(1)
  @Max(10_000_000)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10_000_000)
  compareAtPrice?: number;

  @IsString()
  @MaxLength(40)
  imageSeed: string;

  @IsInt()
  @Min(0)
  @Max(1_000_000)
  stock: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  sku?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsIn(VARIANT_OPTIONS, { each: true })
  variants?: string[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsInt()
  categoryId: number;
}

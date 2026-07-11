import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class QueryReviewsDto {
  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}

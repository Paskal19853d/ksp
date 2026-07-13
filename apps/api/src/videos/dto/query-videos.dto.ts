import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class QueryVideosDto {
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

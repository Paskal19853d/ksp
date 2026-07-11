import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  orderItemId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  text: string;
}

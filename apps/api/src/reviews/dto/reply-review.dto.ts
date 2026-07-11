import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ReplyReviewDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(1000)
  reply: string;
}

import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import type { ReportTargetType } from "../entities/report.entity";

export class CreateReportDto {
  @IsIn(["product", "review", "chat_message", "video"])
  targetType: ReportTargetType;

  @IsInt()
  targetId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}

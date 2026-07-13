import { IsIn } from "class-validator";

export class ResolveReportDto {
  @IsIn(["approved", "rejected"])
  status: "approved" | "rejected";
}

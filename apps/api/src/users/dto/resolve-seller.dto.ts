import { IsIn } from "class-validator";

export class ResolveSellerDto {
  @IsIn(["approved", "rejected"])
  status: "approved" | "rejected";
}

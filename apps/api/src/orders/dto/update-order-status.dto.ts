import { IsIn } from "class-validator";
import type { OrderStatus } from "../entities/order.entity";

export const SELLER_SETTABLE_STATUSES = ["packing", "shipping", "delivered"] as const;
export type SellerSettableStatus = (typeof SELLER_SETTABLE_STATUSES)[number];

export class UpdateOrderStatusDto {
  @IsIn(SELLER_SETTABLE_STATUSES)
  status: SellerSettableStatus & OrderStatus;
}

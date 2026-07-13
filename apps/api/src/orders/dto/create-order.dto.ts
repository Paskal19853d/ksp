import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

const DELIVERY_METHODS = ["nova", "courier", "pickup"];
const PAYMENT_METHODS = ["card", "cod", "wallet"];

export class OrderItemInputDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];

  @IsString()
  @MaxLength(120)
  recipientName: string;

  @IsString()
  @Matches(/^\+?[0-9\s-]{7,20}$/, { message: "Некоректний номер телефону" })
  recipientPhone: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(200)
  address: string;

  @IsIn(DELIVERY_METHODS)
  deliveryMethod: string;

  @IsIn(PAYMENT_METHODS)
  paymentMethod: string;

  // Blogger affiliate link code, if the buyer arrived via one — attributed to
  // whichever cart item's productId matches the link's product (see
  // OrdersService.create). Absent for ordinary, non-referred purchases.
  @IsOptional()
  @IsString()
  @MaxLength(60)
  refCode?: string;
}

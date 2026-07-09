export interface Product {
  id: number;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  badgeLabel?: string;
  category?: string;
  stockQty: number;
  sellerId: number;
  sku?: string;
  salesCount?: number;
  active: boolean;
}

export type UserRole = "buyer" | "seller" | "blogger" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  blocked: boolean;
}

export interface Order {
  id: number;
  orderNo: string;
  status: string;
  sum: number;
  shippingAddress?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
}

export interface Stream {
  id: number;
  title: string;
  hostId: number;
  viewersCount: number;
  gmv: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  visible: boolean;
}

export interface ProductSeller {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  imageSeed: string;
  stock: number;
  sku: string;
  variants: string[];
  active: boolean;
  salesCount: number;
  rating: number;
  reviewCount: number;
  sellerId: number;
  categoryId: number;
  category?: Category;
  seller?: ProductSeller;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
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

export type OrderStatus =
  | "new"
  | "packing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "return_requested";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  qty: number;
  sellerId: number;
}

export interface Order {
  id: number;
  orderNo: string;
  buyerId: number;
  status: OrderStatus;
  sum: number;
  recipientName: string;
  recipientPhone: string;
  city: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
  returnReason?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  orderItemId: number;
  authorId: number;
  productId: number;
  sellerId: number;
  rating: number;
  text: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type StreamStatus = "scheduled" | "live" | "ended";

export interface Stream {
  id: number;
  hostId: number;
  title: string;
  description: string;
  status: StreamStatus;
  productIds: number[];
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  peakViewers: number;
  ordersCount: number;
  income: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  streamId: number;
  authorId: number;
  text: string;
  createdAt: string;
}

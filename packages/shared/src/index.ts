export interface Category {
  id: number;
  name: string;
  icon: string;
  visible: boolean;
}

export interface AdminCategory extends Category {
  productCount: number;
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
export type SellerStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  blocked: boolean;
  sellerStatus?: SellerStatus | null;
  storeCategory?: string | null;
  createdAt?: string;
}

export interface AdminUserListResponse {
  items: User[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminSeller extends User {
  revenue: number;
  orderCount: number;
  productCount: number;
  rating: number;
}

export interface AdminDashboard {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  gmv: number;
  gmvTrend: { bars: number[]; labels: string[] };
  pendingReports: {
    product: number;
    review: number;
    chat_message: number;
    video: number;
  };
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
  videoUrl: string;
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

export interface AdminStream extends Stream {
  currentViewers: number;
}

export interface AdminStreamsSummary {
  activeNow: number;
  scheduledToday: number;
  currentViewers: number;
}

export interface ChatMessage {
  id: number;
  streamId: number;
  authorId: number;
  text: string;
  createdAt: string;
}

export type PageStatus = "draft" | "published";

export type PageBlock =
  | { type: "heading"; text: string }
  | { type: "richtext"; html: string }
  | { type: "image"; url: string; alt: string };

export interface Page {
  id: number;
  title: string;
  slug: string;
  status: PageStatus;
  content: PageBlock[];
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  active: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export type AdCampaignStatus = "active" | "paused" | "finished";

export interface AdCampaignSellerSummary {
  id: number;
  name: string;
}

export interface AdCampaignProductSummary {
  id: number;
  name: string;
  imageSeed: string;
}

export interface AdCampaign {
  id: number;
  sellerId: number;
  productId: number;
  seller?: AdCampaignSellerSummary;
  product?: AdCampaignProductSummary;
  budget: number;
  spent: number;
  clicks: number;
  status: AdCampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReportTargetType = "product" | "review" | "chat_message" | "video";
export type ReportStatus = "pending" | "approved" | "rejected";

export interface Report {
  id: number;
  targetType: ReportTargetType;
  targetId: number;
  reporterId: number;
  reason: string;
  status: ReportStatus;
  resolvedById?: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionRule {
  id: number;
  categoryId: number;
  category?: Category;
  pct: number;
  createdAt: string;
  updatedAt: string;
}

export type PayoutStatus = "pending" | "paid";

export interface PayoutSellerSummary {
  id: number;
  name: string;
}

export interface Payout {
  id: number;
  sellerId: number;
  seller?: PayoutSellerSummary;
  gmv: number;
  commission: number;
  netAmount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerBalance {
  gmv: number;
  commission: number;
  netAmount: number;
}

export interface PlatformFinanceSummary {
  gmv: number;
  platformRevenue: number;
  pendingPayouts: number;
}

export interface AffiliateLink {
  id: number;
  bloggerId: number;
  productId: number;
  product?: Product;
  code: string;
  pct: number;
  active: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export type AffiliatePayoutStatus = "pending" | "paid";

export interface AffiliatePayout {
  id: number;
  bloggerId: number;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: AffiliatePayoutStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloggerBalance {
  available: number;
}

export type VideoStatus = "published" | "hidden";

export interface Video {
  id: number;
  authorId: number;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  productId?: number;
  product?: Product;
  status: VideoStatus;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoListResponse {
  items: Video[];
  total: number;
  limit: number;
  offset: number;
}

export interface VideoComment {
  id: number;
  videoId: number;
  authorId: number;
  text: string;
  likesCount: number;
  createdAt: string;
}

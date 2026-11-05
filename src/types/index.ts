export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  fabrics: string[];
  stock: number;
  isAvailable: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. CAA-2026-00001
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'cod' | 'instapay' | 'wallet';
  paymentReceiptUrl?: string;
  paymentStatus: 'pending' | 'verified' | 'rejected';
  orderStatus: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl: string;
  isMain?: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeNameArabic: string;
  logoUrl?: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  announcement: string;
  phones: string[];
  whatsapp: string;
  branches: Branch[];
  paymentSettings: {
    codEnabled: boolean;
    instapayEnabled: boolean;
    instapayHandle: string;
    instapayPhone: string;
    walletEnabled: boolean;
    walletNumber: string;
    walletProvider: string;
    walletBeneficiary: string;
  };
  shippingRate: number;
  freeShippingThreshold: number;
  aiAssistantEnabled: boolean;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  token?: string;
  username?: string;
  lastLogin?: string;
}

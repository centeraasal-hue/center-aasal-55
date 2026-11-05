import { Product, Category, Order, StoreSettings, CustomerReview, FAQItem } from '../types';

export const API = {
  // Public APIs
  async getProducts(params?: { category?: string; featured?: boolean; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);
    
    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('فشل جلب المنتجات');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('فشل جلب تفاصيل المنتج');
    return res.json();
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('فشل جلب الأقسام');
    return res.json();
  },

  async getSettings(): Promise<StoreSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('فشل جلب إعدادات المتجر');
    return res.json();
  },

  async getReviews(): Promise<CustomerReview[]> {
    const res = await fetch('/api/reviews');
    if (!res.ok) throw new Error('فشل جلب تقييمات العملاء');
    return res.json();
  },

  async getFaqs(): Promise<FAQItem[]> {
    const res = await fetch('/api/faqs');
    if (!res.ok) throw new Error('فشل جلب الأسئلة الشائعة');
    return res.json();
  },

  async createOrder(orderPayload: any): Promise<{ success: boolean; order: Order }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل إتمام الطلب');
    return data;
  },

  async trackOrder(orderCode: string, phone?: string): Promise<any> {
    const res = await fetch('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderCode, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'لم يتم العثور على الطلب');
    return data;
  },

  async chatWithAI(message: string, conversationHistory: any[]): Promise<string> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory }),
    });
    const data = await res.json();
    if (!res.ok && !data.reply) throw new Error(data.error || 'فشل معالجة الرسالة');
    return data.reply || 'مرحباً بك في سنتر العسال!';
  },

  // Admin APIs
  async adminLogin(password: string): Promise<{ success: boolean; token: string; username: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'كلمة المرور غير صحيحة');
    return data;
  },

  async adminChangePassword(token: string, newPassword: string): Promise<any> {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل تغيير كلمة المرور');
    return data;
  },

  async adminGetMetrics(token: string): Promise<any> {
    const res = await fetch('/api/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('فشل جلب المؤشرات الإدارية');
    return res.json();
  },

  async adminGetOrders(token: string): Promise<Order[]> {
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('فشل جلب الطلبات');
    return res.json();
  },

  async adminUpdateOrderStatus(
    token: string,
    orderId: string,
    payload: { orderStatus?: string; paymentStatus?: string; adminNotes?: string }
  ): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('فشل تحديث حالة الطلب');
    return res.json();
  },

  async adminCreateProduct(token: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('فشل إضافة المنتج');
    return res.json();
  },

  async adminUpdateProduct(token: string, id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('فشل تعديل المنتج');
    return res.json();
  },

  async adminDeleteProduct(token: string, id: string): Promise<any> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('فشل حذف المنتج');
    return res.json();
  },

  async adminCreateCategory(token: string, category: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error('فشل إضافة القسم');
    return res.json();
  },

  async adminUpdateCategory(token: string, id: string, category: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error('فشل تعديل القسم');
    return res.json();
  },

  async adminDeleteCategory(token: string, id: string): Promise<any> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('فشل حذف القسم');
    return res.json();
  },

  async adminUpdateSettings(token: string, settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('فشل حفظ الإعدادات');
    return res.json();
  },
};

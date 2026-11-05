import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { API } from '../services/api';
import { Product, Category, Order, StoreSettings } from '../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  ShieldAlert,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Upload,
  RefreshCw,
  Phone,
  Truck,
  DollarSign,
  Users,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminToken, setAdminToken, navigate, refreshSettings, refreshCategories } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'cms' | 'security'>('overview');

  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settingsForm, setSettingsForm] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals & form state
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Ensure user is authorized
  useEffect(() => {
    if (!adminToken) {
      navigate('admin-login');
      return;
    }
    loadData();
  }, [adminToken]);

  const loadData = async () => {
    if (!adminToken) return;
    try {
      setLoading(true);
      const [m, ords, prods, cats, sets] = await Promise.all([
        API.adminGetMetrics(adminToken),
        API.adminGetOrders(adminToken),
        API.getProducts(),
        API.getCategories(),
        API.getSettings(),
      ]);
      setMetrics(m);
      setOrders(ords);
      setProducts(prods);
      setCategories(cats);
      setSettingsForm(sets);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('401')) {
        setAdminToken(null);
        navigate('admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // 1. Order Status Updates
  const handleUpdateOrderStatus = async (
    orderId: string,
    payload: { orderStatus?: string; paymentStatus?: string; adminNotes?: string }
  ) => {
    if (!adminToken) return;
    try {
      const updated = await API.adminUpdateOrderStatus(adminToken, orderId, payload);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      notify('تم تحديث حالة الطلب بنجاح');
      // Refresh metrics
      API.adminGetMetrics(adminToken).then(setMetrics);
    } catch (err: any) {
      notify(err.message || 'فشل التحديث', 'error');
    }
  };

  // 2. Product Management
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingProduct) return;

    try {
      if (editingProduct.id) {
        // Update
        const updated = await API.adminUpdateProduct(adminToken, editingProduct.id, editingProduct);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        notify('تم تعديل المنتج بنجاح');
      } else {
        // Create
        const created = await API.adminCreateProduct(adminToken, {
          ...editingProduct,
          slug: (editingProduct.name || 'product').toLowerCase().replace(/\s+/g, '-'),
        });
        setProducts((prev) => [created, ...prev]);
        notify('تمت إضافة المنتج الجديد بنجاح');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      notify(err.message || 'فشل حفظ المنتج', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!adminToken || !window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) return;
    try {
      await API.adminDeleteProduct(adminToken, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify('تم حذف المنتج بنجاح');
    } catch (err: any) {
      notify(err.message || 'فشل حذف المنتج', 'error');
    }
  };

  // 3. Category Management
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingCategory) return;
    try {
      if (editingCategory.id) {
        const updated = await API.adminUpdateCategory(adminToken, editingCategory.id, editingCategory);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        notify('تم تعديل القسم بنجاح');
      } else {
        const created = await API.adminCreateCategory(adminToken, {
          ...editingCategory,
          slug: (editingCategory.name || 'category').toLowerCase().replace(/\s+/g, '-'),
        });
        setCategories((prev) => [...prev, created]);
        notify('تمت إضافة القسم بنجاح');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      refreshCategories();
    } catch (err: any) {
      notify(err.message || 'فشل حفظ القسم', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!adminToken || !window.confirm('هل تريد حذف هذا القسم؟')) return;
    try {
      await API.adminDeleteCategory(adminToken, id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      notify('تم حذف القسم');
      refreshCategories();
    } catch (err: any) {
      notify(err.message || 'فشل حذف القسم', 'error');
    }
  };

  // 4. CMS Settings Update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !settingsForm) return;
    try {
      const updated = await API.adminUpdateSettings(adminToken, settingsForm);
      setSettingsForm(updated);
      refreshSettings();
      notify('تم حفظ إعدادات وتعديلات الموقع بنجاح');
    } catch (err: any) {
      notify(err.message || 'فشل حفظ الإعدادات', 'error');
    }
  };

  // 5. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !newPassword) return;
    try {
      await API.adminChangePassword(adminToken, newPassword);
      notify('تم تحديث كلمة المرور الإدارية بنجاح');
      setNewPassword('');
    } catch (err: any) {
      notify(err.message || 'فشل تغيير كلمة المرور', 'error');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    navigate('home');
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
            CENTER AL ASSAL ADMIN PANEL
          </span>
          <h1 className="text-2xl font-black text-slate-900">لوحة تحكم سنتر العسال</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            إدارة متكاملة للطلبات، المخزون، الأسعار، الفروع، والمحتوى
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="p-2.5 text-slate-500 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('home')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            زيارة المتجر
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'نظرة عامة ومؤشرات', icon: LayoutDashboard },
          { id: 'orders', label: `إدارة الطلبات (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `المنتجات والمخزون (${products.length})`, icon: Package },
          { id: 'categories', label: `الأقسام (${categories.length})`, icon: Layers },
          { id: 'cms', label: 'إعدادات وهوية الموقع', icon: Settings },
          { id: 'security', label: 'الأمان والحساب', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------- TAB 1: OVERVIEW ----------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400">إجمالي المبيعات</span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {(metrics?.totalSales || 0).toLocaleString('ar-EG')} ج.م
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400">الطلبات الجديدة</span>
              <p className="text-xl sm:text-2xl font-black text-sky-600 mt-1 tabular-nums">
                {metrics?.newOrders || 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400">الطلبات المكتملة</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                {metrics?.completedOrders || 0}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400">عدد المنتجات</span>
              <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1 tabular-nums">
                {metrics?.totalProducts || products.length}
              </p>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">أحدث الطلبات الواردة</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-sky-700 font-semibold hover:underline"
              >
                عرض كل الطلبات
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 pb-2">
                    <th className="py-2">كود الطلب</th>
                    <th className="py-2">العميل</th>
                    <th className="py-2">المحافظة</th>
                    <th className="py-2">المبلغ</th>
                    <th className="py-2">طريقة الدفع</th>
                    <th className="py-2">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-sky-800">{ord.orderCode}</td>
                      <td className="py-3 font-semibold text-slate-800">{ord.customerName}</td>
                      <td className="py-3 text-slate-500">{ord.governorate}</td>
                      <td className="py-3 font-bold tabular-nums">{ord.total.toLocaleString('ar-EG')} ج.م</td>
                      <td className="py-3 text-slate-600">{ord.paymentMethod}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.orderStatus === 'new'
                              ? 'bg-sky-50 text-sky-700'
                              : ord.orderStatus === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: ORDERS MANAGEMENT ----------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {['all', 'new', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ${
                    orderStatusFilter === st
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {st === 'all'
                    ? 'جميع الطلبات'
                    : st === 'new'
                    ? 'جديد'
                    : st === 'processing'
                    ? 'قيد التجهيز'
                    : st === 'shipped'
                    ? 'خرج للشحن'
                    : st === 'delivered'
                    ? 'تم التسليم'
                    : 'ملغي'}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث بكود الطلب أو اسم العميل..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full text-xs p-2 pr-9 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600"
              />
            </div>
          </div>

          {/* Orders Cards List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 text-slate-400 text-xs">
                لا توجد طلبات تطابق هذا البحث أو الفلتر
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-4"
                >
                  {/* Order Head */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <span className="font-mono font-black text-sky-900 text-sm tracking-wider">
                        {ord.orderCode}
                      </span>
                      <span className="text-xs text-slate-400 mr-2">
                        · {new Date(ord.createdAt).toLocaleString('ar-EG')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, { orderStatus: e.target.value })
                        }
                        className="text-xs font-bold p-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                      >
                        <option value="new">جديد (New)</option>
                        <option value="processing">قيد التجهيز (Processing)</option>
                        <option value="shipped">خرج للشحن (Shipped)</option>
                        <option value="delivered">تم التسليم (Delivered)</option>
                        <option value="cancelled">ملغي (Cancelled)</option>
                      </select>

                      <select
                        value={ord.paymentStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, { paymentStatus: e.target.value })
                        }
                        className={`text-xs font-bold p-1.5 rounded-lg border cursor-pointer ${
                          ord.paymentStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.paymentStatus === 'rejected'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">دفع قيد المراجعة</option>
                        <option value="verified">دفع مؤكد ومعتمد</option>
                        <option value="rejected">إيصال دفع مرفوض</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-2xl">
                    <div>
                      <span className="text-slate-400 block text-[11px]">العميل:</span>
                      <p className="font-bold text-slate-900">{ord.customerName}</p>
                      <a href={`tel:${ord.customerPhone}`} className="text-sky-700 font-mono font-semibold hover:underline">
                        {ord.customerPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">العنوان:</span>
                      <p className="text-slate-800 font-medium">{ord.governorate} – {ord.city}</p>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{ord.address}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">طريقة الدفع والإجمالي:</span>
                      <p className="font-bold text-slate-900">{ord.paymentMethod.toUpperCase()}</p>
                      <p className="text-sky-800 font-extrabold text-sm tabular-nums">
                        {ord.total.toLocaleString('ar-EG')} ج.م
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-400 text-[11px] font-semibold">المفروشات المطلوبة:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                          <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-white shrink-0" />
                          <div className="flex-1 truncate">
                            <p className="font-semibold text-slate-900 truncate">{it.productName}</p>
                            <p className="text-[11px] text-slate-500">
                              {it.size} · {it.color} · كمية: {it.quantity}
                            </p>
                          </div>
                          <span className="font-bold tabular-nums shrink-0">
                            {(it.price * it.quantity).toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Receipt Link if uploaded */}
                  {ord.paymentReceiptUrl && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">تم إرفاق إيصال تحويل:</span>
                      <button
                        onClick={() => setSelectedReceipt(ord.paymentReceiptUrl!)}
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة إيصال التحويل</span>
                      </button>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="إضافة ملاحظة داخلية للإدارة (مثال: تم الاتصال وتأكيد ميعاد التسليم)..."
                      defaultValue={ord.adminNotes || ''}
                      onBlur={(e) => {
                        if (e.target.value !== ord.adminNotes) {
                          handleUpdateOrderStatus(ord.id, { adminNotes: e.target.value });
                        }
                      }}
                      className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: PRODUCTS ----------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  description: '',
                  categoryId: categories[0]?.id || 'cat-bedsheets',
                  price: 1000,
                  stock: 10,
                  isAvailable: true,
                  images: [],
                  sizes: ['كينج (240×260 سم)', 'كوين (220×240 سم)'],
                  colors: ['أبيض عاجي', 'بيج كريمي', 'سماوي'],
                  fabrics: ['قطن مصري 100%'],
                });
                setIsProductModalOpen(true);
              }}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد من الصفر</span>
            </button>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في المنتجات..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full text-xs p-2 pr-9 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
              .map((prod) => (
                <div key={prod.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <img
                      src={prod.images && prod.images.length > 0 ? prod.images[0] : '/src/assets/images/hero_luxury_bedding_1793871158417.jpg'}
                      alt=""
                      className="w-full aspect-4/3 object-cover rounded-2xl bg-slate-50"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold">{prod.categoryName || 'مفروشات'}</span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-sky-800 font-extrabold mt-1 tabular-nums">
                        {prod.price.toLocaleString('ar-EG')} ج.م{' '}
                        {prod.originalPrice && <span className="text-slate-400 line-through text-[11px] font-normal">{prod.originalPrice} ج.م</span>}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">المخزون: <strong className="text-slate-800">{prod.stock}</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg cursor-pointer"
                        title="تعديل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 4: CATEGORIES ----------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          <button
            onClick={() => {
              setEditingCategory({ name: '', description: '', image: '' });
              setIsCategoryModalOpen(true);
            }}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قسم جديد</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    {cat.image ? (
                      <img src={cat.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sky-500">ع</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{cat.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-lg cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 5: CMS SITE SETTINGS ----------------- */}
      {activeTab === 'cms' && settingsForm && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs space-y-8 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">إعدادات وهوية المتجر (CMS)</h2>
            <p className="text-xs text-slate-500">
              يمكنك تعديل النصوص، اللوجو، الفروع، وبيانات الدفع دون الحاجة لتعديل الأكواد
            </p>
          </div>

          {/* Logo & Identity */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-sky-800 uppercase">هوية البراند واللوجو</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم البراند الإنجليزي</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المتجر العربي</label>
                <input
                  type="text"
                  value={settingsForm.storeNameArabic}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeNameArabic: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رابط اللوجو أو رفع شعار جديد من الجهاز
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSettingsForm({ ...settingsForm, logoUrl: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
              />
              {settingsForm.logoUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={settingsForm.logoUrl} alt="Logo Preview" className="h-10 object-contain rounded border border-slate-200 p-1" />
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    إزالة اللوجو واستخدام النص الافتراضي
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hero Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-sky-800 uppercase">نصوص وصور الواجهة الرئيسية (Hero)</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">العنوان الرئيسي</label>
              <input
                type="text"
                value={settingsForm.heroHeadline}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الوصف الترويجي</label>
              <textarea
                rows={2}
                value={settingsForm.heroSubheadline}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شريط الإعلان العلوي</label>
              <input
                type="text"
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Payment Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-sky-800 uppercase">بيانات الدفع (InstaPay والمحافظ)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان InstaPay (IPA)</label>
                <input
                  type="text"
                  value={settingsForm.paymentSettings.instapayHandle}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      paymentSettings: { ...settingsForm.paymentSettings, instapayHandle: e.target.value },
                    })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم هاتف InstaPay</label>
                <input
                  type="text"
                  value={settingsForm.paymentSettings.instapayPhone}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      paymentSettings: { ...settingsForm.paymentSettings, instapayPhone: e.target.value },
                    })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم المحفظة الإلكترونية</label>
                <input
                  type="text"
                  value={settingsForm.paymentSettings.walletNumber}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      paymentSettings: { ...settingsForm.paymentSettings, walletNumber: e.target.value },
                    })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المستفيد من المحفظة</label>
                <input
                  type="text"
                  value={settingsForm.paymentSettings.walletBeneficiary}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      paymentSettings: { ...settingsForm.paymentSettings, walletBeneficiary: e.target.value },
                    })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Shipping & AI Assistant Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-sky-800 uppercase">الشحن والمساعد الذكي</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">سعر الشحن القياسي (ج.م)</label>
                <input
                  type="number"
                  value={settingsForm.shippingRate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, shippingRate: Number(e.target.value) })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">حد الشحن المجاني (ج.م)</label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="aiAssistantEnabled"
                checked={settingsForm.aiAssistantEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, aiAssistantEnabled: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <label htmlFor="aiAssistantEnabled" className="text-xs font-bold text-slate-800 cursor-pointer">
                تشغيل مساعد الذكاء الاصطناعي (ASSAL AI) للعملاء في المتجر
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            حفظ ونشر التعديلات على المتجر مباشرة
          </button>
        </form>
      )}

      {/* ----------------- TAB 6: SECURITY ----------------- */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900">تغيير كلمة المرور الإدارية</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              احرص على استخدام كلمة مرور قوية لحماية لوحة إدارة المتجر
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة (6 خانات على الأقل)..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center tracking-wider"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              تحديث كلمة المرور
            </button>
          </form>
        </div>
      )}

      {/* MODAL 1: Product Add / Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct.id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم التابع له *</label>
                  <select
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.id === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                        categoryName: cat?.name || '',
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">سعر البيع (ج.م) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => {
                      const orig = Number(e.target.value);
                      const cur = editingProduct.price || 0;
                      const disc = orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: orig,
                        discount: disc,
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الكمية بالمخزون *</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف التفصيلي للمنتج</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Upload image from device */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  رفع صورة من الجهاز مباشرة
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newImg = reader.result as string;
                        const existingImgs = editingProduct.images || [];
                        setEditingProduct({
                          ...editingProduct,
                          images: [newImg, ...existingImgs],
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 cursor-pointer"
                />
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {editingProduct.images.map((im, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img src={im} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = editingProduct.images?.filter((_, idx) => idx !== i);
                            setEditingProduct({ ...editingProduct, images: filtered });
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>متوفر للبيع</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>وصل حديثاً</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>الأكثر طلباً</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                حفظ المنتج
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Category Modal */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCategory.id ? 'تعديل القسم' : 'إضافة قسم جديد'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم القسم *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">وصف القسم</label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">صورة القسم من الجهاز</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingCategory({ ...editingCategory, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-sky-50 file:text-sky-700 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                حفظ القسم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Payment Receipt Viewer */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-4 max-w-xl w-full space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">إيصال التحويل البنكي / المحفظة</span>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 hover:text-slate-900 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-xl bg-slate-50 p-2 flex items-center justify-center">
              <img src={selectedReceipt} alt="Receipt" className="max-w-full h-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

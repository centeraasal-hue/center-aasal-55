import React from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingCost,
    total,
  } = useCart();
  const { navigate, settings } = useStore();

  if (!isCartOpen) return null;

  const freeThreshold = settings?.freeShippingThreshold || 1200;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#FAF8F5]/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-700" />
              <h2 className="text-base font-bold text-slate-900">سلة المشتريات</h2>
              <span className="text-xs text-slate-500 font-medium">({cart.length} منتجات)</span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-sky-50/70 border-b border-sky-100 text-xs">
            <div className="flex items-center justify-between text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-sky-600" />
                {subtotal >= freeThreshold ? (
                  <span className="text-emerald-700 font-semibold">تهانينا! لقد حصلت على شحن مجاني 🎉</span>
                ) : (
                  <span>
                    تبقّى <strong className="text-sky-800">{remainingForFree.toLocaleString('ar-EG')} ج.م</strong> للشحن المجاني
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-600 tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-sky-200/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">السلة فارغة حالياً</h3>
                <p className="text-xs text-slate-500 mb-6">استكشف أرقى تشكيلات المفروشات والملايات وأضف ما يناسبك</p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('products');
                  }}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex gap-3 p-3 bg-slate-50/60 rounded-xl border border-slate-100"
                >
                  <img
                    src={
                      item.product.images && item.product.images.length > 0
                        ? item.product.images[0]
                        : '/src/assets/images/hero_luxury_bedding_1793871158417.jpg'
                    }
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-1">
                        <span>المقاس: {item.selectedSize}</span>
                        <span>·</span>
                        <span>اللون: {item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>المجموع الفرعي</span>
                  <span className="tabular-nums font-medium text-slate-800">
                    {subtotal.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>الشحن</span>
                  <span className="tabular-nums font-medium text-slate-800">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-semibold">مجاني</span>
                    ) : (
                      `${shippingCost.toLocaleString('ar-EG')} ج.م`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>الإجمالي النهائي</span>
                  <span className="tabular-nums text-sky-800">
                    {total.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  navigate('checkout');
                }}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>متابعة إتمام الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

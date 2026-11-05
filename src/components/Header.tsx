import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Sparkles, Phone, Menu, X, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { settings, currentView, navigate, searchQuery, setSearchQuery } = useStore();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { label: 'الرئيسية', view: 'home' as const },
    { label: 'جميع المنتجات', view: 'products' as const },
    { label: 'الأقسام', view: 'categories' as const },
    { label: 'تتبع طلبك', view: 'track' as const },
    { label: 'فروعنا وتواصل', view: 'contact' as const },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {settings?.announcement && (
        <div className="bg-gradient-to-r from-sky-50 via-sky-100/70 to-emerald-50 border-b border-sky-100 text-slate-700 text-xs py-2 px-4 text-center font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="hidden sm:inline-block text-slate-500">
              📞 فرع أنور السادات: {settings.phones[0]} | فرع كرموز: {settings.phones[1]}
            </span>
            <span className="mx-auto font-medium text-sky-950">{settings.announcement}</span>
            <button
              onClick={() => navigate('track')}
              className="hidden md:inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
            >
              <span>تتبع شحنتك</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Zone 1: Brand Wordmark / Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('home')}
                className="flex items-center gap-3 text-right focus:outline-hidden group cursor-pointer"
              >
                {settings?.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.storeNameArabic}
                    className="h-12 w-auto object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
                    ع
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors font-sans">
                    CENTER AL ASSAL
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {settings?.storeNameArabic || 'سنتر العسال لتجارة المفروشات'}
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => navigate(link.view)}
                  className={`transition-colors whitespace-nowrap cursor-pointer hover:text-sky-700 py-1 ${
                    currentView === link.view
                      ? 'text-sky-700 font-semibold border-b-2 border-sky-600'
                      : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Zone 3: Actions & Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Toggle / Input */}
              <div className="relative">
                {isSearchOpen ? (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-sky-200 rounded-full shadow-md px-3 py-1.5 w-64 sm:w-72 z-50">
                    <Search className="w-4 h-4 text-sky-600 ml-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="ابحث عن ملاية، لحاف، بطانية..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          navigate('products');
                          setIsSearchOpen(false);
                        }
                      }}
                      autoFocus
                      className="w-full text-xs bg-transparent focus:outline-hidden text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="p-1 hover:text-slate-900 text-slate-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-full transition-colors cursor-pointer"
                    title="بحث في المتجر"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Shopping Cart Icon with Count */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-full transition-colors cursor-pointer"
                title="سلة المشتريات"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={() => navigate('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                title="لوحة تحكم الأدمن"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>لوحة الإدارة</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 px-4 pt-2 pb-6 space-y-3">
            <div className="py-2">
              <input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate('products');
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500"
              />
            </div>
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  navigate(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-right px-3 py-2 text-sm rounded-lg ${
                  currentView === link.view
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  navigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-sky-700 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة تحكم الإدارة</span>
              </button>
              <a
                href={`tel:${settings?.phones[0] || '01277714100'}`}
                className="text-xs text-sky-700 font-medium flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{settings?.phones[0] || '01277714100'}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

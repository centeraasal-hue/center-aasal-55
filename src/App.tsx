import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AssalAIAssistant } from './components/AssalAIAssistant';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './pages/AdminLoginPage';

const MainContent: React.FC = () => {
  const { currentView, adminToken } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'products':
      case 'categories':
        return <ProductsPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'track':
        return <TrackOrderPage />;
      case 'contact':
      case 'about':
        return <ContactPage />;
      case 'faqs':
        return <FaqsPage />;
      case 'policies':
        return <PoliciesPage />;
      case 'admin':
        return adminToken ? <AdminDashboard /> : <AdminLoginPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      default:
        return <HomePage />;
    }
  };

  const isAdminView = currentView === 'admin' || currentView === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800">
      <Header />
      <main className="flex-1">{renderView()}</main>
      {!isAdminView && <Footer />}
      <CartDrawer />
      <AssalAIAssistant />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </StoreProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings, Category, Product, Order } from '../types';
import { API } from '../services/api';

export type AppView =
  | 'home'
  | 'products'
  | 'categories'
  | 'product-detail'
  | 'checkout'
  | 'order-success'
  | 'track'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'policies'
  | 'admin'
  | 'admin-login';

interface StoreContextType {
  settings: StoreSettings | null;
  categories: Category[];
  currentView: AppView;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  lastOrder: Order | null;
  searchQuery: string;
  adminToken: string | null;
  isLoading: boolean;
  setSearchQuery: (q: string) => void;
  navigate: (view: AppView, params?: { productId?: string; categoryId?: string; order?: Order }) => void;
  openProduct: (id: string) => void;
  openCategory: (catId: string) => void;
  setLastOrder: (order: Order | null) => void;
  setAdminToken: (token: string | null) => void;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return localStorage.getItem('assal_admin_token') || null;
  });

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    if (token) {
      localStorage.setItem('assal_admin_token', token);
    } else {
      localStorage.removeItem('assal_admin_token');
    }
  };

  const refreshSettings = async () => {
    try {
      const data = await API.getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const cats = await API.getCategories();
      setCategories(cats);
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.allSettled([refreshSettings(), refreshCategories()]);
      setIsLoading(false);
    };
    init();
  }, []);

  const navigate = (
    view: AppView,
    params?: { productId?: string; categoryId?: string; order?: Order }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.order) setLastOrder(params.order);
    setCurrentView(view);
  };

  const openProduct = (id: string) => {
    navigate('product-detail', { productId: id });
  };

  const openCategory = (catId: string) => {
    navigate('products', { categoryId: catId });
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        currentView,
        selectedProductId,
        selectedCategoryId,
        lastOrder,
        searchQuery,
        adminToken,
        isLoading,
        setSearchQuery,
        navigate,
        openProduct,
        openCategory,
        setLastOrder,
        setAdminToken,
        refreshSettings,
        refreshCategories,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

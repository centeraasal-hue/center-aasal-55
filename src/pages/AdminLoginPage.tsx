import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { API } from '../services/api';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { setAdminToken, navigate } = useStore();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await API.adminLogin(password);
      if (res.success && res.token) {
        setAdminToken(res.token);
        navigate('admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-sky-800 tracking-wider uppercase block">
            CENTER AL ASSAL
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            لوحة تحكم الإدارة
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            بوابة الإدارة المركزية لمتابعة الطلبات، المنتجات، وإعدادات المتجر
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>كلمة مرور المشرف الإداري</span>
            </label>
            <input
              type="password"
              required
              placeholder="أدخل كلمة المرور..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white text-center font-mono text-base tracking-widest"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate('home')}
            className="text-xs text-slate-500 hover:text-sky-700 font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>الرجوع إلى واجهة المتجر الرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

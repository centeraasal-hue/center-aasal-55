import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageSquare, Clock, Mail, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
          تواصل مع سنتر العسال
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          معارضنا وأرقام خدمة العملاء
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          نسعد دائماً بالتواصل معكم والإجابة عن جميع استفساراتكم بخصوص المقاسات، الخامات، وعروض تجهيز العرائس.
        </p>
      </div>

      {/* Main Branches Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Branch 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-sky-50 text-sky-800 text-xs font-bold rounded-lg border border-sky-100">
              المعرض الرئيسي
            </span>
            <MapPin className="w-5 h-5 text-sky-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">الفرع الأول – أنور السادات</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              المعرض الرئيسي المتكامل لكافة تشكيلات أطقم الملايات، الألحفة الفندقية، والبطاطين المستوردة.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>العنوان: 8 شارع أنور السادات</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                الهاتف:{' '}
                <a href="tel:01277714100" className="text-sky-700 font-bold hover:underline">
                  01277714100
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>مواعيد العمل: يومياً من 10:00 صباحاً حتى 11:00 مساءً</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="tel:01277714100"
              className="flex-1 py-2.5 text-center bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              اتصال هاتفي
            </a>
            <a
              href="https://maps.google.com/?q=8+Anwar+El+Sadat+Street"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              عرض على الخريطة
            </a>
          </div>
        </div>

        {/* Branch 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-sky-50 text-sky-800 text-xs font-bold rounded-lg border border-sky-100">
              فرع كرموز
            </span>
            <MapPin className="w-5 h-5 text-sky-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">الفرع الثاني – عمود السواري</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              معرض متميز يضم أحدث أطقم المفارش العرائسية، الفوط والبشاكير والمخدات الطبية.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>العنوان: 95 عمود السواري – كرموز</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                الهاتف:{' '}
                <a href="tel:01279207793" className="text-sky-700 font-bold hover:underline">
                  01279207793
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>مواعيد العمل: يومياً من 11:00 صباحاً حتى 11:30 مساءً</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="tel:01279207793"
              className="flex-1 py-2.5 text-center bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              اتصال هاتفي
            </a>
            <a
              href="https://maps.google.com/?q=95+Pompeys+Pillar+Karmouz"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              عرض على الخريطة
            </a>
          </div>
        </div>
      </div>

      {/* Quick WhatsApp & Call Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-right">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">تواصل فوري عبر تطبيق واتساب</h3>
            <p className="text-xs text-slate-500">فريق خدمة عملاء سنتر العسال متاح للرد الفوري على مدار اليوم</p>
          </div>
        </div>

        <a
          href="https://wa.me/201277714100"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          محادثة واتساب 01277714100
        </a>
      </div>

      {/* Direct Contact Form */}
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          إرسال رسالة أو طلب خاص
        </h2>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>شكراً لتواصلك! تم استلام رسالتك وسنتواصل معك هاتفياً في أقرب وقت.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم الكريم</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="اسمك بالكامل"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="012XXXXXXXX"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تفاصيل الرسالة أو الطلب</label>
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="اكتب استفسارك عن المقاسات أو الكميات أو الاستفسار..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              إرسال الرسالة
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

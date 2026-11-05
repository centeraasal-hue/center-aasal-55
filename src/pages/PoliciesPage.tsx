import React from 'react';
import { ShieldCheck, RefreshCw, Truck, Lock } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          السياسات والشروط المعتمدة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          حقوق العميل وسياسات الاستبدال، الاسترجاع، والخصوصية في سنتر العسال
        </p>
      </div>

      <div className="space-y-8">
        {/* Return & Exchange */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-sky-700">
            <RefreshCw className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">سياسة الاستبدال والاسترجاع (14 يوماً)</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            في سنتر العسال، نضمن رضاكم التام عن كل منتج تشترونه. يحق لعملائنا الكرام استبدال أو استرجاع أي منتج خلال 14 يوماً من تاريخ استلام الشحنة، وفقاً للشروط التالية:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 pr-2">
            <li>أن يكون المنتج في حالته الأصلية، وفي غلافه وتغليفه الأصلي غير تالف.</li>
            <li>عدم غسل أو استعمال المنتج بأي شكل حفاظاً على معايير النظافة والصحة للمفروشات.</li>
            <li>إرفاق فاتورة الشراء أو كود الطلب المعتمد (CAA-2026-XXXXX).</li>
            <li>في حالة وجود عيب مصنعي في المنتج، يتحمل سنتر العسال كامل تكلفة الشحن والاستبدال.</li>
          </ul>
        </div>

        {/* Shipping & Delivery Inspection */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-sky-700">
            <Truck className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">سياسة الشحن ومعاينة الطلب</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            نحن نمنح العميل الحق الكامل في معاينة المفروشات والتأكد من المقاس واللون مع مندوب الشحن قبل سداد قيمة الطلب عند اختيار "الدفع عند الاستلام".
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 pr-2">
            <li>توصيل سريع داخل محافظة الإسكندرية خلال 24 - 48 ساعة.</li>
            <li>توصيل لجميع محافظات جمهورية مصر العربية خلال 2 - 4 أيام عمل.</li>
            <li>الشحن مجاني لجميع الطلبات التي تتجاوز قيمتها 1200 جنيه مصري.</li>
          </ul>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-sky-700">
            <Lock className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">سياسة الخصوصية وأمان البيانات</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            يلتزم سنتر العسال بحماية خصوصية بيانات جميع العملاء، واستخدامها حصراً لمعالجة طلبات الشحن والتواصل:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 pr-2">
            <li>لا يتم مشاركة أرقام الهواتف أو العناوين مع أي طرف ثالث خارج شركة الشحن المعنية بتسليم الطلب.</li>
            <li>لا نطلب أرقام بطاقات بنكية أو بيانات سرية عبر الهاتف.</li>
            <li>جميع إثباتات الدفع المرسلة عبر InstaPay أو المحافظ الإلكترونية يتم فحصها حصراً من قبل فريق الإدارة المعتمد.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

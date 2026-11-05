import React, { useEffect, useState } from 'react';
import { API } from '../services/api';
import { FAQItem } from '../types';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FaqsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    API.getFaqs().then(setFaqs).catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          الأسئلة الشائعة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          إجابات وافية عن أهم الاستفسارات حول الطلب، الشحن، الفروع، وطرق الدفع
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180 text-sky-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 animate-in fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

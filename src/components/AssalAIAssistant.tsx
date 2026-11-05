import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { API } from '../services/api';
import { Sparkles, MessageCircle, X, Send, Bot, User, ShoppingBag, MapPin, CheckCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  action?: {
    type: 'add_to_cart';
    productId: string;
    size?: string;
    color?: string;
  };
  time: string;
}

export const AssalAIAssistant: React.FC = () => {
  const { settings, openProduct } = useStore();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'مرحباً بك! أنا "ASSAL AI" المساعد الذكي لسنتر العسال للمفروشات 🌟. يسعدني مساعدتك في اختيار أرقى المفروشات، معرفة المقاسات والخامات، وتفاصيل فروعنا وطرق الدفع. كيف أخدمك اليوم؟',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'رشح لي أفضل أطقم الملايات للعرايس',
    'ما هي مقاسات اللحاف الشتوي؟',
    'ما هي عناوين ومواعيد الفروع؟',
    'كيف أدفع بواسطة InstaPay؟',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text,
      }));

      const reply = await API.chatWithAI(query, historyPayload);

      // Check if reply contains action directive: [ACTION:ADD_TO_CART:prodId:size:color]
      let cleanReply = reply;
      let actionObj: ChatMessage['action'] | undefined = undefined;

      const actionMatch = reply.match(/\[ACTION:ADD_TO_CART:([^:\]]+)(?::([^:\]]+))?(?::([^:\]]+))?\]/);
      if (actionMatch) {
        cleanReply = reply.replace(actionMatch[0], '').trim();
        actionObj = {
          type: 'add_to_cart',
          productId: actionMatch[1],
          size: actionMatch[2] || undefined,
          color: actionMatch[3] || undefined,
        };
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: cleanReply,
        action: actionObj,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-error-' + Date.now(),
          sender: 'ai',
          text: 'عذراً، أواجه صعوبة مؤقتة في الاتصال. يمكنك التواصل مع خدمة عملاء سنتر العسال مباشرة عبر واتساب: 01277714100.',
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionAddToCart = async (action: NonNullable<ChatMessage['action']>) => {
    try {
      const product = await API.getProduct(action.productId);
      if (product) {
        addToCart(product, action.size, action.color, 1);
        setMessages((prev) => [
          ...prev,
          {
            id: 'system-' + Date.now(),
            sender: 'ai',
            text: `تمت إضافة "${product.name}" بنجاح إلى سلة المشتريات! يمكنك فتح السلة الآن أو إتمام الطلب.`,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      openProduct(action.productId);
    }
  };

  if (!settings?.aiAssistantEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating Action Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-full p-3.5 sm:px-5 sm:py-3.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2.5 cursor-pointer group"
          title="مساعد سنتر العسال الذكي"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
          </div>
          <span className="hidden sm:inline-block font-semibold text-xs tracking-wide">
            ASSAL AI | المساعد الذكي
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-700 to-sky-800 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">ASSAL AI</h3>
                <p className="text-[11px] text-sky-100">مساعد سنتر العسال الذكي (متصل بالمتجر)</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* AI Action Button if returned */}
                  {msg.action && msg.action.type === 'add_to_cart' && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleActionAddToCart(msg.action!)}
                        className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>إضافة المنتج المقترح إلى السلة</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`text-[9px] mt-1 block text-left tabular-nums ${
                      msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-2 border border-slate-100 text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-500 mr-2">جاري التفكير...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded-md text-[11px] border border-slate-100 transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اكتب استفسارك هنا (مثال: أريد لحاف شتوي دافئ)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                input.trim() && !isLoading
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

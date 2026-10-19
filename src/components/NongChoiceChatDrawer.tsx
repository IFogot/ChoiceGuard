'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FoodProduct } from '../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Key,
  ExternalLink,
} from 'lucide-react';

interface NongChoiceChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onOpenSettings: () => void;
  contextProduct?: FoodProduct | null;
}

export const NongChoiceChatDrawer: React.FC<NongChoiceChatDrawerProps> = ({
  isOpen,
  onClose,
  apiKey,
  onOpenSettings,
  contextProduct,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'สวัสดีค่ะ! น้องช้อยส์ ยินดีต้อนรับสู่ ChoiceGuard ช้อยส์การ์ดค่ะ 🍃\n\nน้องช้อยส์สามารถช่วยอ่านฉลากโภชนาการ คำนวณงบโซเดียม-น้ำตาล แนะนำสินค้าตราทางเลือกสุขภาพ (อย.) หรือให้คำแนะนำเมื่อสินค้ามีประกาศเรียกคืนรายล็อตได้เลยนะคะ สามารถพิมพ์ถามได้เลยค่ะ!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          apiKey: apiKey.trim(),
          contextProduct,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'MISSING_API_KEY') {
          setErrorMessage('ยังไม่ได้ระบุ Groq API Key กรุณากดปุ่มตั้งค่าด้านล่างเพื่อใส่ API Key ค่ะ');
        } else {
          setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Groq AI');
        }
        setIsLoading(false);
        return;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'บะหมี่กึ่งสำเร็จรูปมีโซเดียมเท่าไรของงบวัน?',
    'คนเป็นความดันสูง เลี่ยงอาหารประเภทไหนดี?',
    'ตราทางเลือกสุขภาพของ อย. มีเกณฑ์อย่างไร?',
    'ถ้ารหัสล็อตตรงกับประกาศเรียกคืน ควรทำอย่างไร?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer Panel */}
      <div className="relative z-10 w-full sm:w-[440px] h-full shadow-2xl flex flex-col glass-modal-panel border-l-2 border-teal-500/30 rounded-none sm:rounded-l-3xl animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-teal-50/40">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Nong Choice"
            className="h-10 w-10 rounded-full object-contain shadow-md shadow-teal-500/25 ring-2 ring-teal-500/30 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-slate-900">น้องช้อยส์ (Nong Choice AI)</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-900">
                Groq LPU
              </span>
            </div>
            <p className="text-[11px] text-slate-500">ผู้ช่วยโภชนาการและความปลอดภัยอาหารเฉพาะบุคคล</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Context Badge if Viewing Product */}
      {contextProduct && (
        <div className="px-4 py-2 bg-teal-100/50 border-b border-teal-200/60 text-xs text-teal-900 flex items-center justify-between">
          <span className="truncate">
            กำลังวิเคราะห์: <strong>{contextProduct.name}</strong>
          </span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono font-bold text-teal-800">
            {contextProduct.nutrition.sodiumMg} mg Na
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex-shrink-0">
                {isUser ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold bg-slate-700 text-white">
                    <User className="h-4 w-4" />
                  </div>
                ) : (
                  <img
                    src="/logo.png"
                    alt="Nong Choice"
                    className="h-7 w-7 rounded-full object-contain ring-1 ring-teal-500/30 shadow-sm"
                  />
                )}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs md:text-sm max-w-[85%] leading-relaxed whitespace-pre-line ${
                  isUser
                    ? 'bg-teal-700 text-white rounded-tr-none shadow-sm'
                    : 'glass-card bg-white/90 text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    isUser ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="h-4 w-4 text-teal-600 animate-spin" />
            <span>น้องช้อยส์กำลังคิดและวิเคราะห์ข้อมูลโภชนาการ...</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>แจ้งเตือนจากระบบ</span>
            </div>
            <p>{errorMessage}</p>
            {!apiKey && (
              <button
                onClick={onOpenSettings}
                className="glass-button text-xs py-1.5 px-3 bg-white text-rose-700 font-bold border-rose-300 flex items-center gap-1"
              >
                <Key className="h-3.5 w-3.5" />
                <span>คลิกเพื่อใส่ Groq API Key</span>
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-3 border-t border-slate-200/60 bg-slate-50/50">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          คำถามที่พบบ่อย:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="flex-shrink-0 text-[11px] font-medium py-1 px-2.5 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-900 transition text-slate-600"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3.5 border-t border-slate-200/80 bg-white/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="พิมพ์ถามน้องช้อยส์ เช่น บะหมี่นี้กินได้ไหม..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="glass-input text-xs sm:text-sm py-2 px-3 flex-1"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="glass-button glass-button-primary p-2.5 rounded-xl disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-[9px] text-slate-400 text-center mt-2 leading-tight">
          น้องช้อยส์เป็น AI เพื่อการศึกษาและปรับพฤติกรรมโภชนาการ ไม่วินิจฉัยโรคหรือสั่งยา หากมีอาการเจ็บป่วยควรพบแพทย์
        </p>
      </div>
    </div>
    </div>
  );
};

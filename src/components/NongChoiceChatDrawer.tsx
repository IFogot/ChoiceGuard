'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FoodProduct, UserHealthProfile } from '../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';

interface NongChoiceChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextProduct?: FoodProduct | null;
  profile?: UserHealthProfile | null;
}

export const NongChoiceChatDrawer: React.FC<NongChoiceChatDrawerProps> = ({
  isOpen,
  onClose,
  contextProduct,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'สวัสดีค่ะ! น้องช้อยส์ ยินดีต้อนรับสู่ ChoiceGuard ช้อยส์การ์ดค่ะ 🍃✨\n\nน้องช้อยส์เชื่อมต่อกับระบบปัญญาประดิษฐ์ Groq LPU ประมวลผลความเร็วสูง พร้อมช่วยอ่านฉลากโภชนาการ คำนวณงบโซเดียม-น้ำตาล แนะนำสินค้าตราทางเลือกสุขภาพ (อย.) หรือให้คำแนะนำเมื่อสินค้ามีประกาศเรียกคืนรายล็อตได้ทันทีค่ะ พิมพ์ถามได้เลยนะคะ!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Voice speech synthesis in Thai if enabled
  const speakThai = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'th-TH';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors silently
    }
  };

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
          messages: [...messages, userMsg].map(({ sender, text }) => ({ sender, text })),
          contextProduct,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการประมวลผลคำตอบจาก AI');
        setIsLoading(false);
        return;
      }

      const botReply = data.reply || 'ขออภัยค่ะ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้';
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakThai(botReply);
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'บะหมี่ซองนี้มีโซเดียมเท่าไรและลดได้อย่างไร?',
    'คนเป็นความดันสูง วางแผนอาหาร 1 วันให้หน่อย',
    'รหัสล็อต LOT-2026-TYK มีประกาศเตือนภัยไหม?',
    'เกณฑ์ตราทางเลือกสุขภาพของ อย. มีอะไรบ้าง?',
    'เทคนิคลดโซเดียมในการทำอาหารตามประกาศ อย.',
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
      <div className="relative z-10 w-full sm:w-[460px] h-full shadow-2xl flex flex-col glass-modal-panel border-l-2 border-teal-500/30 rounded-none sm:rounded-l-3xl animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-teal-50/40">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Nong Choice"
              width={40}
              height={40}
              style={{ width: '40px', height: '40px', maxWidth: '40px', maxHeight: '40px' }}
              className="h-10 w-10 rounded-full object-contain shadow-md shadow-teal-500/25 ring-2 ring-teal-500/30 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900">น้องช้อยส์ (Nong Choice AI)</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-900 border border-teal-500/30">
                  Groq LPU Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">ผู้ช่วยโภชนาการและความปลอดภัยอาหารเฉพาะบุคคล (อย.)</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={`p-1.5 rounded-full transition ${
                isVoiceEnabled ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }`}
              title={isVoiceEnabled ? 'ปิดเสียงพูด' : 'เปิดเสียงพูดภาษาไทย'}
            >
              {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Context Badge if Viewing Product or Profile */}
        <div className="px-4 py-2 bg-gradient-to-r from-teal-50/70 to-cyan-50/70 border-b border-teal-200/60 text-xs text-teal-950 flex flex-wrap items-center justify-between gap-2">
          {contextProduct ? (
            <div className="truncate flex items-center gap-1.5">
              <span className="text-slate-500">สินค้าปัจจุบัน:</span>
              <strong className="truncate max-w-[200px]">{contextProduct.name}</strong>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono font-bold text-teal-800 border border-teal-200">
                {contextProduct.nutrition.sodiumMg} mg Na
              </span>
            </div>
          ) : (
            <span className="text-slate-600">พร้อมให้คำปรึกษาโภชนาการ &amp; สุขภาพ</span>
          )}

          {profile && (
            <span className="text-[10px] bg-teal-500/15 text-teal-900 font-semibold px-2 py-0.5 rounded-full border border-teal-500/25">
              โปรไฟล์: {profile.name}
            </span>
          )}
        </div>

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
                      width={28}
                      height={28}
                      style={{ width: '28px', height: '28px', maxWidth: '28px', maxHeight: '28px' }}
                      className="h-7 w-7 rounded-full object-contain ring-1 ring-teal-500/30 shadow-sm"
                    />
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs md:text-sm max-w-[85%] leading-relaxed whitespace-pre-line shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-tr-none'
                      : 'bg-white/90 border border-slate-200/70 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[9px] mt-1 text-right ${
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
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <Bot className="h-4 w-4 text-teal-600 animate-spin" />
              <span>น้องช้อยส์กำลังคิดและวิเคราะห์ผ่าน Groq LPU...</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="p-3 border-t border-slate-200/60 bg-slate-50/50">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            💡 คำถามแนะนำ (WELLNEXT Health Topics):
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="flex-shrink-0 text-[11px] font-medium py-1 px-2.5 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-900 transition text-slate-600 shadow-sm"
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
            น้องช้อยส์เป็น AI เพื่อการศึกษาและปรับพฤติกรรมโภชนาการ (อย.) ไม่ใช่วินิจฉัยโรคหรือจ่ายยา
          </p>
        </div>
      </div>
    </div>
  );
};

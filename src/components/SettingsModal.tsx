'use client';

import React, { useState } from 'react';
import {
  Settings,
  X,
  Key,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  Cpu,
  Shield,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(tempKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="glass-overlay">
      <div className="glass-modal-panel p-6 md:p-8 max-w-lg">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-slate-900">
                การตั้งค่าระบบ &amp; AI
              </h3>
              <p className="text-xs text-slate-500">
                กำหนดค่า Groq LPU API Key เพื่อเปิดใช้งาน &ldquo;น้องช้อยส์ AI&rdquo;
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Key className="h-4 w-4 text-teal-600" />
                Groq API Key (gsk_...)
              </span>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>รับ API Key ฟรีที่นี่</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="glass-input pr-10 text-xs sm:text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              * API Key จะถูกจัดเก็บอย่างปลอดภัยบนเครื่องของคุณ (Client-side) และส่งผ่าน HTTPS ไปยัง Groq LPU Endpoint เท่านั้น
            </p>
          </div>

          <div className="bg-teal-50/40 p-3.5 rounded-xl border border-teal-200/60 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-teal-900 flex items-center gap-1">
              <Cpu className="h-4 w-4 text-teal-700" />
              <span>ความสามารถของโมเดล Llama 3.3 70B บน Groq:</span>
            </div>
            <p>• อ่านและวิเคราะห์ฉลากโภชนาการเป็นภาษาไทยในเสี้ยววินาที (&gt;300 tokens/sec)</p>
            <p>• คำนวณคาร์โบไฮเดรตและงบโซเดียมพร้อมคำแนะนำตามบริบทสุขภาพ</p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="glass-button text-xs py-2 px-4 text-slate-600"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`glass-button text-xs py-2 px-5 font-bold transition flex items-center gap-1.5 ${
                isSaved ? 'bg-emerald-600 text-white' : 'glass-button-primary'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>บันทึกสำเร็จ</span>
                </>
              ) : (
                <span>บันทึกการตั้งค่า</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Activity, RefreshCw, AlertTriangle, Layers } from 'lucide-react';
import { UserHealthProfile } from '../types';

interface NavbarProps {
  activeTab: 'scan' | 'swap' | 'pantry' | 'dashboard';
  setActiveTab: (tab: 'scan' | 'swap' | 'pantry' | 'dashboard') => void;
  profile: UserHealthProfile;
  onOpenProfileModal: () => void;
  onOpenBmcModal?: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeRecallCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfileModal,
  onOpenBmcModal,
  onToggleChat,
  isChatOpen,
  activeRecallCount,
}) => {
  const conditionLabels: Record<string, { label: string; badge: string; color: string }> = {
    hypertension: { label: 'คุมความดัน (โซเดียม ≤ 1,500 มก.)', badge: 'Hypertension', color: '#0d9488' },
    diabetes: { label: 'คุมน้ำตาล/เบาหวาน (น้ำตาล ≤ 20 ก.)', badge: 'Diabetes', color: '#0284c7' },
    dyslipidemia: { label: 'คุมไขมัน/หลอดเลือด (ไขมันอิ่มตัว ≤ 10 ก.)', badge: 'Heart & Lipid', color: '#6366f1' },
    elderly: { label: 'ผู้สูงอายุ / ผู้ดูแล (สูตรสมดุล)', badge: 'Senior Care', color: '#8b5cf6' },
    general: { label: 'คนทั่วไป / วัยทำงาน (WHO 2,000 มก.)', badge: 'General', color: '#10b981' },
  };

  const currentCondition = conditionLabels[profile.condition] || conditionLabels.general;

  return (
    <header className="sticky top-4 z-40 px-3 md:px-6 mb-6">
      <nav
        className="glass-panel mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-3.5"
        style={{
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'var(--glass-blur-heavy)',
        }}
      >
        {/* Brand & Pitching Tag */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ChoiceGuard Logo"
            width={48}
            height={48}
            style={{ width: '48px', height: '48px', maxWidth: '48px', maxHeight: '48px' }}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-contain shadow-md shadow-teal-500/25 ring-2 ring-teal-500/30 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ChoiceGuard
              </span>
              <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-800 border border-teal-500/20">
                WELLNEXT Future
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hidden sm:inline">
                ACSP BIG4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              รู้ก่อนกิน • เลือกให้ตรงกับตัวเอง • ปลอดภัยทุกล็อต (อย.)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 order-3 md:order-2 w-full md:w-auto justify-center overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`glass-button text-xs md:text-sm py-1.5 px-3 md:px-4 ${
              activeTab === 'scan' ? 'glass-button-primary' : ''
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>รู้ & สแกน</span>
          </button>

          <button
            onClick={() => setActiveTab('swap')}
            className={`glass-button text-xs md:text-sm py-1.5 px-3 md:px-4 ${
              activeTab === 'swap' ? 'glass-button-primary' : ''
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>เลือก (Smart Swap)</span>
          </button>

          <button
            onClick={() => setActiveTab('pantry')}
            className={`glass-button text-xs md:text-sm py-1.5 px-3 md:px-4 relative ${
              activeTab === 'pantry' ? 'glass-button-primary' : ''
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>ปลอดภัย (Lot Alert)</span>
            {activeRecallCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                {activeRecallCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`glass-button text-xs md:text-sm py-1.5 px-3 md:px-4 ${
              activeTab === 'dashboard' ? 'glass-button-primary' : ''
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>แดชบอร์ด B2B/B2G</span>
          </button>
        </div>

        {/* Right Actions: Profile Switcher, BMC & SDG, and AI Copilot */}
        <div className="flex items-center gap-2 order-2 md:order-3">
          {/* BMC & SDG Pitch Deck Button */}
          {onOpenBmcModal && (
            <button
              onClick={onOpenBmcModal}
              className="glass-pill px-2.5 py-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 border-teal-500/30 hover:border-teal-500 transition hidden sm:flex items-center gap-1 shadow-xs"
              title="ดูแผนธุรกิจ Business Model Canvas & ผลกระทบ SDG 3, 9, 12"
            >
              <span>📋</span>
              <span>BMC &amp; SDG</span>
            </button>
          )}

          {/* Active Profile Pill */}
          <button
            onClick={onOpenProfileModal}
            className="glass-pill flex items-center gap-2 px-3 py-1.5 text-xs font-semibold hover:border-teal-400 transition"
            title="คลิกเพื่อสลับโปรไฟล์สุขภาพ"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: currentCondition.color }}
            />
            <span className="hidden lg:inline text-slate-700">{profile.name}:</span>
            <span className="text-teal-900 font-bold">{currentCondition.badge}</span>
          </button>

          {/* Nong Choice AI Trigger */}
          <button
            onClick={onToggleChat}
            className={`glass-button py-1.5 px-3.5 text-xs font-bold transition flex items-center gap-1.5 ${
              isChatOpen
                ? 'bg-teal-600 text-white shadow-teal-500/30'
                : 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-900 border-teal-500/30 hover:border-teal-500'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>น้องช้อยส์ AI</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

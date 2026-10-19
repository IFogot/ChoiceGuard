'use client';

import React from 'react';
import { UserHealthProfile } from '../types';
import { Flame, Droplets, HeartPulse } from 'lucide-react';

interface DailyBudgetProps {
  profile: UserHealthProfile;
}

export const DailyBudgetRing: React.FC<DailyBudgetProps> = ({ profile }) => {
  const { dailyBudget, dailyConsumed } = profile;

  // Percentage calculations
  const sodiumPercent = Math.min(150, Math.round((dailyConsumed.sodiumMg / dailyBudget.sodiumMg) * 100));
  const sugarPercent = Math.min(150, Math.round((dailyConsumed.sugarG / dailyBudget.sugarG) * 100));
  const satFatPercent = Math.min(150, Math.round((dailyConsumed.saturatedFatG / dailyBudget.saturatedFatG) * 100));

  // Circular SVG coordinates
  const radiusSodium = 54;
  const radiusSugar = 42;
  const radiusFat = 30;

  const circumferenceSodium = 2 * Math.PI * radiusSodium;
  const circumferenceSugar = 2 * Math.PI * radiusSugar;
  const circumferenceFat = 2 * Math.PI * radiusFat;

  const strokeOffsetSodium = circumferenceSodium - (Math.min(100, sodiumPercent) / 100) * circumferenceSodium;
  const strokeOffsetSugar = circumferenceSugar - (Math.min(100, sugarPercent) / 100) * circumferenceSugar;
  const strokeOffsetFat = circumferenceFat - (Math.min(100, satFatPercent) / 100) * circumferenceFat;

  return (
    <div className="glass-card p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Concentric Activity Rings */}
        <div className="flex items-center gap-5">
          <div
            className="relative flex items-center justify-center w-36 h-36 flex-shrink-0"
            style={{ width: '144px', height: '144px', minWidth: '144px', minHeight: '144px' }}
          >
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              {/* Background Tracks */}
              <circle cx="65" cy="65" r={radiusSodium} stroke="rgba(13, 148, 136, 0.15)" strokeWidth="9" fill="none" />
              <circle cx="65" cy="65" r={radiusSugar} stroke="rgba(2, 132, 199, 0.15)" strokeWidth="9" fill="none" />
              <circle cx="65" cy="65" r={radiusFat} stroke="rgba(244, 63, 94, 0.15)" strokeWidth="9" fill="none" />

              {/* Animated Progress Rings */}
              <circle
                cx="65"
                cy="65"
                r={radiusSodium}
                stroke={sodiumPercent > 100 ? '#ef4444' : '#0d9488'}
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumferenceSodium}
                strokeDashoffset={strokeOffsetSodium}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
              <circle
                cx="65"
                cy="65"
                r={radiusSugar}
                stroke={sugarPercent > 100 ? '#ef4444' : '#0284c7'}
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumferenceSugar}
                strokeDashoffset={strokeOffsetSugar}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
              <circle
                cx="65"
                cy="65"
                r={radiusFat}
                stroke={satFatPercent > 100 ? '#ef4444' : '#f43f5e'}
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumferenceFat}
                strokeDashoffset={strokeOffsetFat}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">งบวันนี้</span>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {sodiumPercent}%
              </span>
              <span className="text-[9px] text-teal-800 font-bold">โซเดียม</span>
            </div>
          </div>

          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              <span>โควตาโภชนาการประจำวันของคุณ</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
              เปรียบเทียบกับเกณฑ์ อย. และคำแนะนำของ WHO เพื่อลดความเสี่ยงโรค NCDs และควบคุมความดันอย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>

        {/* Right: Three Nutrient Metric Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto flex-1 max-w-xl">
          {/* Sodium */}
          <div className="glass-panel p-3.5 rounded-xl border border-teal-500/20 bg-teal-50/30">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-900 mb-1">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                โซเดียม (Sodium)
              </span>
              <span className={sodiumPercent > 100 ? 'text-rose-600 font-bold' : 'text-teal-700'}>
                {sodiumPercent}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {dailyConsumed.sodiumMg.toLocaleString()} / {dailyBudget.sodiumMg.toLocaleString()} <span className="text-xs font-normal text-slate-500">มก.</span>
            </div>
            <div className="w-full bg-teal-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  sodiumPercent > 100 ? 'bg-rose-500' : 'bg-teal-600'
                }`}
                style={{ width: `${Math.min(100, sodiumPercent)}%` }}
              />
            </div>
          </div>

          {/* Sugar */}
          <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-50/30">
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-900 mb-1">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-600" />
                น้ำตาล (Sugar)
              </span>
              <span className={sugarPercent > 100 ? 'text-rose-600 font-bold' : 'text-cyan-700'}>
                {sugarPercent}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {dailyConsumed.sugarG} / {dailyBudget.sugarG} <span className="text-xs font-normal text-slate-500">กรัม</span>
            </div>
            <div className="w-full bg-cyan-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  sugarPercent > 100 ? 'bg-rose-500' : 'bg-cyan-600'
                }`}
                style={{ width: `${Math.min(100, sugarPercent)}%` }}
              />
            </div>
          </div>

          {/* Saturated Fat */}
          <div className="glass-panel p-3.5 rounded-xl border border-rose-500/20 bg-rose-50/30">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-900 mb-1">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                ไขมันอิ่มตัว
              </span>
              <span className={satFatPercent > 100 ? 'text-rose-600 font-bold' : 'text-rose-700'}>
                {satFatPercent}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {dailyConsumed.saturatedFatG} / {dailyBudget.saturatedFatG} <span className="text-xs font-normal text-slate-500">กรัม</span>
            </div>
            <div className="w-full bg-rose-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  satFatPercent > 100 ? 'bg-rose-500' : 'bg-rose-600'
                }`}
                style={{ width: `${Math.min(100, satFatPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

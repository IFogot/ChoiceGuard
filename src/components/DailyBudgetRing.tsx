import React, { useState } from 'react';
import { UserHealthProfile, MealLogItem } from '../types';
import { Flame, Droplets, HeartPulse, Users, ShieldAlert, Heart, Sparkles, UserCheck, Utensils, ChevronDown, ChevronUp, Trash2, Clock, PlusCircle } from 'lucide-react';
import { playTactileTap } from '../lib/hapticAudio';

interface DailyBudgetProps {
  profile: UserHealthProfile;
  familyProfiles?: UserHealthProfile[];
  mealLogs?: MealLogItem[];
  onRemoveMealLog?: (id: string) => void;
  onSelectFamilyMember?: (profile: UserHealthProfile) => void;
  onOpenProfileSettings?: () => void;
}

export const DailyBudgetRing: React.FC<DailyBudgetProps> = ({
  profile,
  familyProfiles = [],
  mealLogs = [],
  onRemoveMealLog,
  onSelectFamilyMember,
  onOpenProfileSettings,
}) => {
  const [isDiaryExpanded, setIsDiaryExpanded] = useState(false);
  const { dailyBudget, dailyConsumed } = profile;

  // Percentage calculations
  const sodiumPercent = Math.min(150, Math.round((dailyConsumed.sodiumMg / dailyBudget.sodiumMg) * 100));
  const sugarPercent = Math.min(150, Math.round((dailyConsumed.sugarG / dailyBudget.sugarG) * 100));
  const satFatPercent = Math.min(150, Math.round((dailyConsumed.saturatedFatG / dailyBudget.saturatedFatG) * 100));

  // Remaining budget
  const sodiumRemaining = Math.max(0, dailyBudget.sodiumMg - dailyConsumed.sodiumMg);
  const sugarRemaining = Math.max(0, dailyBudget.sugarG - dailyConsumed.sugarG);

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

  const mealIcons: Record<string, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
  };

  return (
    <div className="glass-card p-5 md:p-6 mb-6 border border-slate-200/80 shadow-md">
      {/* 1. Multi-Profile Family Switcher (Elderly Caregiver Mode) */}
      {familyProfiles.length > 0 && (
        <div className="mb-5 pb-4 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800">
                โหมดครอบครัว &amp; ผู้ดูแลผู้สูงอายุ (Family Caregiver Mode):
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5 hidden md:inline">
                เลือกสมาชิกเพื่อปรับเกณฑ์ Choice Score และงบโภชนาการแบบจำเพาะบุคคล
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {familyProfiles.map((member) => {
              const isSelected = member.id === profile.id;
              return (
                <button
                  key={member.id}
                  onClick={() => {
                    playTactileTap();
                    onSelectFamilyMember && onSelectFamilyMember(member);
                  }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bouncy-hover ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-sm ring-2 ring-teal-500/40 scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">
                    {member.id === 'profile_dad' ? '👴' : member.id === 'profile_mom' ? '👵' : '💼'}
                  </span>
                  <span>{member.name}</span>
                  {member.age && <span className="opacity-75 text-[10px]">({member.age} ปี)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Main Budget Display */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
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
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease' }}
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
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease' }}
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
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease' }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">งบวันนี้</span>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {sodiumPercent}%
              </span>
              <span className="text-[9px] text-teal-800 font-bold">โซเดียม</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-teal-600" />
                <span>โควตาโภชนาการของ {profile.name}</span>
              </h2>
              {profile.tag && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                  {profile.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
              เกณฑ์จำเพาะทางการแพทย์เพื่อลดภาระไตและป้องกันหลอดเลือดสมอง เหลือโควตาโซเดียมอีก <strong>{sodiumRemaining.toLocaleString()} มก.</strong> วันนี้
            </p>
          </div>
        </div>

        {/* Right: Three Nutrient Metric Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto flex-1 max-w-xl">
          {/* Sodium */}
          <div className="glass-panel p-3.5 rounded-2xl border border-teal-500/20 bg-teal-50/40">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-900 mb-1">
              <span className="flex items-center gap-1 font-bold">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                โซเดียม (Sodium)
              </span>
              <span className={sodiumPercent > 100 ? 'text-rose-600 font-extrabold' : 'text-teal-700 font-extrabold'}>
                {sodiumPercent}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {dailyConsumed.sodiumMg.toLocaleString()} / {dailyBudget.sodiumMg.toLocaleString()} <span className="text-xs font-normal text-slate-500">มก.</span>
            </div>
            <div className="w-full bg-teal-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  sodiumPercent > 100 ? 'bg-rose-500' : 'bg-teal-600'
                }`}
                style={{ width: `${Math.min(100, sodiumPercent)}%` }}
              />
            </div>
          </div>

          {/* Sugar */}
          <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/20 bg-cyan-50/40">
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-900 mb-1">
              <span className="flex items-center gap-1 font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan-600" />
                น้ำตาล (Sugar)
              </span>
              <span className={sugarPercent > 100 ? 'text-rose-600 font-extrabold' : 'text-cyan-700 font-extrabold'}>
                {sugarPercent}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {dailyConsumed.sugarG} / {dailyBudget.sugarG} <span className="text-xs font-normal text-slate-500">กรัม</span>
            </div>
            <div className="w-full bg-cyan-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  sugarPercent > 100 ? 'bg-rose-500' : 'bg-cyan-600'
                }`}
                style={{ width: `${Math.min(100, sugarPercent)}%` }}
              />
            </div>
          </div>

          {/* Saturated Fat */}
          <div className="glass-panel p-3.5 rounded-2xl border border-rose-500/20 bg-rose-50/40">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-900 mb-1">
              <span className="flex items-center gap-1 font-bold">
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                ไขมันอิ่มตัว
              </span>
              <span className={satFatPercent > 100 ? 'text-rose-600 font-extrabold' : 'text-rose-700 font-extrabold'}>
                {satFatPercent}%
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {dailyConsumed.saturatedFatG} / {dailyBudget.saturatedFatG} <span className="text-xs font-normal text-slate-500">กรัม</span>
            </div>
            <div className="w-full bg-rose-200/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  satFatPercent > 100 ? 'bg-rose-500' : 'bg-rose-600'
                }`}
                style={{ width: `${Math.min(100, satFatPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Feature: Today's Meal Diary (บันทึกมื้ออาหารวันนี้ & คืนโควตาสด) */}
      <div className="mt-5 pt-4 border-t border-slate-200/70">
        <button
          onClick={() => {
            playTactileTap();
            setIsDiaryExpanded(!isDiaryExpanded);
          }}
          className="w-full flex items-center justify-between text-left group p-1.5 -m-1.5 rounded-xl hover:bg-slate-100/60 transition"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700">
              <Utensils className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              บันทึกมื้ออาหารวันนี้ ({mealLogs.length} รายการที่บริโภคแล้ว)
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 hidden sm:inline">
              แคลอรี่รวม: {dailyConsumed.caloriesKcal || mealLogs.reduce((acc, m) => acc + m.nutrition.calories, 0)} kcal
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
            <span>{isDiaryExpanded ? 'ย่อไดอารี่' : 'ดูรายละเอียดมื้ออาหาร'}</span>
            {isDiaryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {isDiaryExpanded && (
          <div className="mt-3.5 space-y-2 animate-fadeIn">
            {mealLogs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                ยังไม่มีบันทึกอาหารสำหรับวันนี้ — คลิก &quot;บันทึกลงมื้ออาหาร&quot; จากหน้าสแกน เพื่อติดตามโควตาแบบเรียลไทม์
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mealLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-slate-200 shadow-xs hover:border-teal-400 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-base flex-shrink-0" title={log.mealLabelTh}>
                        {mealIcons[log.mealType] || '🍽️'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                            {log.productName}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {log.portion}x
                          </span>
                          {log.healthierChoice && (
                            <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1 rounded border border-teal-200">
                              อย.
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="text-teal-700 font-bold">{log.nutrition.sodiumMg} mg Na</span>
                          <span>•</span>
                          <span>{log.nutrition.calories} kcal</span>
                          <span>•</span>
                          <span className="text-slate-400">{log.timestamp}</span>
                          {log.brothDrunkPercent !== undefined && log.brothDrunkPercent < 100 && (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                              ซดน้ำ {log.brothDrunkPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {onRemoveMealLog && (
                      <button
                        onClick={() => {
                          playTactileTap();
                          onRemoveMealLog(log.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="ลบรายการนี้ และคืนโควตาโภชนาการ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

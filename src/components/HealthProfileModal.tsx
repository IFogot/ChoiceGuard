'use client';

import React from 'react';
import { UserHealthProfile, HealthCondition } from '../types';
import {
  HeartPulse,
  X,
  Check,
  Activity,
  Flame,
  Droplets,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface HealthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserHealthProfile;
  onUpdateProfile: (newProfile: UserHealthProfile) => void;
}

export const HealthProfileModal: React.FC<HealthProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const conditionsList: {
    id: HealthCondition;
    title: string;
    subtitle: string;
    targetSodium: number;
    targetSugar: number;
    targetSatFat: number;
    color: string;
  }[] = [
    {
      id: 'hypertension',
      title: 'ความดันโลหิตสูง (Hypertension)',
      subtitle: 'ควบคุมโซเดียมเข้มงวด ลดเค็มป้องกันหลอดเลือดและไตเสื่อม',
      targetSodium: 1500,
      targetSugar: 24,
      targetSatFat: 14,
      color: '#0d9488',
    },
    {
      id: 'diabetes',
      title: 'เบาหวาน & ควบคุมน้ำตาล (Diabetes)',
      subtitle: 'จำกัดน้ำตาลและคาร์โบไฮเดรตส่วนเกิน นับคาร์บแม่นยำ',
      targetSodium: 2000,
      targetSugar: 18,
      targetSatFat: 14,
      color: '#0284c7',
    },
    {
      id: 'dyslipidemia',
      title: 'ไขมันในเลือดสูง & หลอดเลือดหัวใจ (Heart)',
      subtitle: 'จำกัดไขมันอิ่มตัวและคอเลสเตอรอล ป้องกันหลอดเลือดอุดตัน',
      targetSodium: 2000,
      targetSugar: 24,
      targetSatFat: 10,
      color: '#6366f1',
    },
    {
      id: 'elderly',
      title: 'ผู้สูงอายุ & ผู้ดูแล (Senior & Caregiver)',
      subtitle: 'สูตรสมดุล ย่อยง่าย โปรตีนเพียงพอ ชะลอมวลกล้ามเนื้อสลาย',
      targetSodium: 1600,
      targetSugar: 20,
      targetSatFat: 12,
      color: '#8b5cf6',
    },
    {
      id: 'general',
      title: 'บุคคลทั่วไป & คนวัยทำงาน (General Adult)',
      subtitle: 'เกณฑ์มาตรฐาน อย. และองค์การอนามัยโลก (WHO)',
      targetSodium: 2000,
      targetSugar: 24,
      targetSatFat: 15,
      color: '#10b981',
    },
  ];

  const handleSelectCondition = (item: typeof conditionsList[0]) => {
    onUpdateProfile({
      ...currentProfile,
      condition: item.id,
      dailyBudget: {
        ...currentProfile.dailyBudget,
        sodiumMg: item.targetSodium,
        sugarG: item.targetSugar,
        saturatedFatG: item.targetSatFat,
      },
    });
  };

  return (
    <div className="glass-overlay">
      <div className="glass-modal-panel p-6 md:p-8 max-w-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-slate-900">
                สลับโปรไฟล์สุขภาพเฉพาะบุคคล
              </h3>
              <p className="text-xs text-slate-500">
                เกณฑ์ Choice Score และงบสารอาหารจะถูกคำนวณใหม่ตามสภาวะที่คุณเลือก
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

        {/* Condition Cards */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {conditionsList.map((item) => {
            const isSelected = currentProfile.condition === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectCondition(item)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500 shadow-sm'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="h-3 w-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded">โซเดียม ≤ {item.targetSodium} mg</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">น้ำตาล ≤ {item.targetSugar} g</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded">ไขมันอิ่มตัว ≤ {item.targetSatFat} g</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center border flex-shrink-0 ml-3 ${
                    isSelected
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="glass-button glass-button-primary text-xs py-2 px-5 font-bold"
          >
            บันทึกและใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
};

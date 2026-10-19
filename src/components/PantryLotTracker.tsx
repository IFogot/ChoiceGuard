'use client';

import React, { useState } from 'react';
import { PantryItem, RecallNotice } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  Hash,
  ArrowUpRight,
  Send,
  Trash2,
  Check,
  Radio,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PantryLotTrackerProps {
  pantryItems: PantryItem[];
  recalls: RecallNotice[];
  onTriggerSimulateRecall: (recallId: string) => void;
  onConfirmRecallHandled: (pantryItemId: string) => void;
  onRemoveItem: (id: string) => void;
  onViewRecallDetails: (recall: RecallNotice, item: PantryItem) => void;
}

export const PantryLotTracker: React.FC<PantryLotTrackerProps> = ({
  pantryItems,
  recalls,
  onTriggerSimulateRecall,
  onConfirmRecallHandled,
  onRemoveItem,
  onViewRecallDetails,
}) => {
  const [selectedRecallId, setSelectedRecallId] = useState(recalls[0]?.id || '');

  return (
    <section className="space-y-6">
      {/* Top Banner: FSMA 204 & MOPH 420 Standards & Recall Drill Launcher */}
      <div className="glass-panel p-6 border-l-4 border-l-rose-500">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex-shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg md:text-xl text-slate-900">
                  ระบบตรวจสอบย้อนกลับรายล็อต & เตือนภัยอาหารเรียกคืน (Lot Alert)
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-800 border border-rose-500/20">
                  ประกาศ สธ. ฉบับที่ 420 & FSMA 204
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                ต่อปลายทางจากโรงงานและห้างค้าปลีกสู่มือผู้บริโภคโดยตรง เมื่อมีประกาศเรียกคืนสินค้าตามรหัสล็อต (Traceability Lot Code - TLC) ระบบจะแจ้งเตือนผ่าน LINE OA ทันทีภายใน 60 นาที
              </p>
            </div>
          </div>

          {/* Interactive Recall Drill Trigger Button */}
          <div className="flex items-center gap-2 w-full lg:w-auto bg-white/70 p-3 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="flex-1 lg:w-48">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                ทดสอบจำลองเหตุการณ์เรียกคืน (อย.):
              </label>
              <select
                value={selectedRecallId}
                onChange={(e) => setSelectedRecallId(e.target.value)}
                className="w-full text-xs font-semibold p-1.5 rounded-lg border border-slate-300 bg-white"
              >
                {recalls.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.recallLevel}] {r.productName.slice(0, 28)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onTriggerSimulateRecall(selectedRecallId)}
              className="glass-button glass-button-primary text-xs py-2 px-3 font-bold whitespace-nowrap bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 flex items-center gap-1.5"
            >
              <Radio className="h-4 w-4 animate-pulse" />
              <span>ยิงแจ้งเตือนด่วน (Drill)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pantry Inventory Cards with Lot Status */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-extrabold text-base md:text-lg text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              <span>คลังอาหารในบ้านของคุณ (My Food Pantry)</span>
            </h4>
            <p className="text-xs text-slate-500">
              สินค้าและรหัสล็อตที่สแกนและบันทึกไว้ในระบบเพื่อเฝ้าระวังอัตโนมัติ
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {pantryItems.length} รายการที่ติดตาม
          </span>
        </div>

        {pantryItems.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">ยังไม่มีสินค้าในคลัง</p>
            <p className="text-xs">ไปที่แท็บ &ldquo;รู้ &amp; สแกน&rdquo; แล้วกดบันทึกลงคลังเพื่อเริ่มเฝ้าระวังล็อต</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pantryItems.map((item) => {
              const matchedRecall = recalls.find(
                (r) => r.productId === item.productId && r.affectedLotCodes.includes(item.lotCode)
              );
              const isRecalled = item.recallStatus === 'recalled' || Boolean(matchedRecall);

              return (
                <div
                  key={item.id}
                  className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isRecalled
                      ? item.confirmedHandled
                        ? 'bg-slate-50/80 border-slate-300'
                        : 'bg-rose-50/70 border-rose-400 shadow-md shadow-rose-500/10'
                      : 'bg-white/60 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div>
                    {/* Header: Status Badge & Remove */}
                    <div className="flex items-center justify-between mb-2">
                      {isRecalled ? (
                        item.confirmedHandled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            จัดการทิ้ง/คืนแล้ว
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="h-3 w-3" />
                            ตรงกับประกาศเรียกคืน อย.!
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ปลอดภัย (Safe Lot)
                        </span>
                      )}

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="ลบออกจากคลัง"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Product Basic Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs md:text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h5>
                        <p className="text-[11px] text-slate-500">{item.product.brand}</p>
                        <span className="text-[10px] text-slate-400">
                          จำนวน: {item.quantity} ชิ้น
                        </span>
                      </div>
                    </div>

                    {/* Traceability Lot & Dates */}
                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Hash className="h-3 w-3 text-teal-600" />
                          Traceability Lot:
                        </span>
                        <span className="font-mono font-bold text-teal-900">{item.lotCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          วันหมดอายุ:
                        </span>
                        <span className="text-slate-700">{item.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recalled Action or Safe Notice */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    {isRecalled && !item.confirmedHandled && matchedRecall ? (
                      <div className="space-y-2">
                        <div className="text-[11px] text-rose-700 font-medium bg-rose-100/70 p-2 rounded-lg leading-tight">
                          <strong>สาเหตุ:</strong> {matchedRecall.hazardDescription}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onViewRecallDetails(matchedRecall, item)}
                            className="glass-button text-[11px] py-1.5 px-2 bg-white flex-1 text-slate-800"
                          >
                            <FileText className="h-3 w-3 text-rose-600" />
                            <span>ดูคำแนะนำ อย.</span>
                          </button>
                          <button
                            onClick={() => onConfirmRecallHandled(item.id)}
                            className="glass-button text-[11px] py-1.5 px-2.5 font-bold bg-rose-600 hover:bg-rose-700 text-white flex-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>ยืนยันทิ้งแล้ว</span>
                          </button>
                        </div>
                      </div>
                    ) : item.confirmedHandled ? (
                      <div className="text-[11px] text-slate-500 text-center py-1">
                        ✓ ปิดเคสความปลอดภัยเรียบร้อยแล้ว
                      </div>
                    ) : (
                      <div className="text-[11px] text-teal-700 flex items-center justify-between">
                        <span>สถานะ: ตรวจสอบปกติ</span>
                        <span className="font-mono text-[10px] text-slate-400">FSMA-204 OK</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

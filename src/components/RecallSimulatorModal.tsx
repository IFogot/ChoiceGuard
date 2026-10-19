'use client';

import React from 'react';
import { RecallNotice, PantryItem } from '../types';
import {
  ShieldAlert,
  AlertOctagon,
  X,
  CheckCircle2,
  PhoneCall,
  Clock,
  Building2,
  Hash,
  Share2,
  Trash2,
} from 'lucide-react';

interface RecallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recall: RecallNotice | null;
  pantryItem?: PantryItem | null;
  onConfirmHandled: (pantryItemId: string) => void;
}

export const RecallSimulatorModal: React.FC<RecallSimulatorModalProps> = ({
  isOpen,
  onClose,
  recall,
  pantryItem,
  onConfirmHandled,
}) => {
  if (!isOpen || !recall) return null;

  const handleConfirm = () => {
    if (pantryItem) {
      onConfirmHandled(pantryItem.id);
    }
    onClose();
  };

  return (
    <div className="glass-overlay">
      <div className="glass-modal-panel p-6 md:p-8 max-w-xl border-rose-500/40">
        {/* Top Simulated LINE OA Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/70">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#06C755] flex items-center justify-center text-white font-black text-sm shadow-sm">
              L
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>ChoiceGuard LINE OA</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">Official</span>
              </div>
              <div className="text-[10px] text-slate-400">แจ้งเตือนล็อตจำเพาะรายบุคคล (Push Notification)</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Urgent Alert Banner */}
        <div className="bg-rose-500 text-white p-4 rounded-2xl shadow-lg shadow-rose-500/20 mb-5">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-8 w-8 flex-shrink-0 animate-bounce" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase bg-white/25 px-2 py-0.5 rounded">
                  {recall.recallLevel} — เร่งด่วนสูงสุด
                </span>
                <span className="text-[11px] opacity-90">{recall.authorizingAgency}</span>
              </div>
              <h3 className="text-base font-extrabold mt-1">
                ตรวจพบสินค้าในคลังของคุณตรงกับประกาศเรียกคืน!
              </h3>
            </div>
          </div>
        </div>

        {/* Affected Product & Lot Details */}
        <div className="space-y-4">
          <div className="bg-white/80 p-4 rounded-xl border border-rose-200 text-xs space-y-2">
            <div className="font-extrabold text-sm text-slate-900">{recall.productName}</div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">รหัสล็อตที่พบในคลังคุณ:</span>
                <span className="font-mono font-bold text-rose-600 text-xs">
                  {pantryItem?.lotCode || recall.affectedLotCodes[0]}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">วันที่ประกาศคำสั่ง:</span>
                <span className="font-semibold text-slate-800">{recall.publishedDate}</span>
              </div>
            </div>
          </div>

          {/* Hazard Description */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
            <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5 text-rose-700">
              <ShieldAlert className="h-4 w-4" />
              สาเหตุและอันตรายที่ตรวจพบ:
            </h5>
            <p className="text-slate-600 leading-relaxed">{recall.hazardDescription}</p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs">
            <h5 className="font-bold text-amber-900 mb-2">วิธีปฏิบัติตามคำแนะนำของ อย. ทันที:</h5>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
              <li><strong>หยุดบริโภคทันที:</strong> แยกสินค้าออกจากจุดเก็บอาหารอื่นเพื่อป้องกันการหยิบผิด</li>
              <li><strong>ห้ามเปิดฝาหรือสัมผัส:</strong> หลีกเลี่ยงการชิมหรือดมกลิ่นเนื่องจากอาจมีสารพิษ</li>
              <li><strong>กำจัดหรือส่งคืน:</strong> นำไปส่งคืนที่จุดจำหน่ายเพื่อรับเงินคืน หรือทิ้งลงในถังขยะติดเชื้อ/ขยะอันตราย</li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirm}
            className="glass-button glass-button-primary flex-1 py-3 text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>ฉันได้จัดการทิ้ง / ส่งคืนแล้ว (ปิดเคสความปลอดภัย)</span>
          </button>
          <button
            onClick={onClose}
            className="glass-button py-2.5 px-4 text-xs font-semibold text-slate-600"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

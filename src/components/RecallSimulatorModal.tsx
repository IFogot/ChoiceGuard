'use client';

import React, { useState } from 'react';
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
  RefreshCw,
  MapPin,
  FileSpreadsheet,
  QrCode,
  ExternalLink,
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
  const [activeTab, setActiveTab] = useState<'line' | 'refund' | 'disposal'>('line');
  const [refundClaimed, setRefundClaimed] = useState(false);

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
            <div className="h-9 w-9 rounded-2xl bg-[#06C755] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#06C755]/30">
              LINE
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>ChoiceGuard Official OA</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-300">
                  Verified อย.
                </span>
              </div>
              <div className="text-[10px] text-slate-400">ระบบเตือนภัยด่วนถึงมือถือรายบุคคล (Push Notification)</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Subtabs: LINE Notice vs 1-Click Refund vs Safe Disposal */}
        <div className="flex gap-1.5 mb-4 p-1 bg-slate-100/90 rounded-xl">
          <button
            onClick={() => setActiveTab('line')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'line'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ข้อความเตือนภัยด่วน
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'refund'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ขอรับเงินคืน 1-คลิก
          </button>
          <button
            onClick={() => setActiveTab('disposal')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'disposal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            จุดทิ้ง/ส่งคืนปลอดภัย
          </button>
        </div>

        {activeTab === 'line' && (
          <div className="space-y-4">
            {/* Urgent Alert Banner */}
            <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-4 rounded-2xl shadow-lg shadow-rose-500/25">
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
            <div className="bg-white/90 p-4 rounded-xl border border-rose-200 text-xs space-y-2">
              <div className="font-extrabold text-sm text-slate-900">{recall.productName}</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">รหัสล็อตที่พบในคลังคุณ (TLC):</span>
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
            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs">
              <h5 className="font-bold text-amber-900 mb-2">วิธีปฏิบัติตามคำแนะนำของ อย. ทันที:</h5>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li><strong>หยุดบริโภคทันที:</strong> แยกสินค้าออกจากจุดเก็บอาหารอื่นเพื่อป้องกันการหยิบผิด</li>
                <li><strong>ห้ามเปิดฝาหรือสัมผัส:</strong> หลีกเลี่ยงการชิมหรือดมกลิ่นเนื่องจากอาจมีสารพิษ</li>
                <li><strong>ขอรับเงินคืนหรือกำจัด:</strong> ใช้แถบด้านบนเพื่อรับคูปองคืนเงิน หรือค้นหาจุดทิ้งขยะปลอดภัย</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                <QrCode className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-base text-emerald-950">
                ระบบคืนเงินค่าสินค้าอัตโนมัติ (1-Click Instant Refund)
              </h4>
              <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                ผู้ผลิตร่วมกับห้างค้าปลีกชั้นนำ ยินดีคืนเงินเต็มจำนวน 100% สำหรับผู้บริโภคที่ได้รับผลกระทบจากล็อตนี้
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">รหัสอ้างอิงการคืน:</span>
                <span className="font-mono font-bold text-slate-800">REF-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">จำนวนที่บันทึกในคลัง:</span>
                <span className="font-bold text-slate-800">{pantryItem?.quantity || 1} ชิ้น</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ช่องทางรับเงิน:</span>
                <span className="font-bold text-teal-700">พร้อมเพย์ / PromptPay QR ทันที</span>
              </div>
            </div>

            {refundClaimed ? (
              <div className="bg-emerald-100 text-emerald-900 p-3.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>ทำเรื่องคืนเงินสำเร็จแล้ว! เงินจะเข้าบัญชีภายใน 15 นาที</span>
              </div>
            ) : (
              <button
                onClick={() => setRefundClaimed(true)}
                className="glass-button glass-button-primary w-full py-3 text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm"
              >
                <span>กดยืนยันขอรับเงินคืน (100% Refund Voucher)</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'disposal' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                จุดดรอปส่งคืนและกำจัดปลอดภัยใกล้คุณ
              </h5>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">ศูนย์บริการลูกค้า โมเดิร์นเทรด/ซูเปอร์มาร์เก็ต</div>
                    <div className="text-[11px] text-slate-500">ทุกสาขาทั่วประเทศ (แสดงรหัส TLC เพื่อส่งคืน)</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">เปิดบริการ</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">สำนักงานสาธารณสุขจังหวัด (สสจ.) / รพ.สต.</div>
                    <div className="text-[11px] text-slate-500">ถังขยะอันตรายและตัวอย่างส่งตรวจ อย.</div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">จุดทางการ</span>
                </div>
              </div>
            </div>
          </div>
        )}

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

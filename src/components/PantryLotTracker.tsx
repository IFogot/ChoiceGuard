'use client';

import React, { useState } from 'react';
import { PantryItem, RecallNotice, CTEEvent } from '../types';
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
  Download,
  GitBranch,
  Layers,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileSpreadsheet,
  ThermometerSnowflake,
  ShieldCheck,
} from 'lucide-react';

interface PantryLotTrackerProps {
  pantryItems: PantryItem[];
  recalls: RecallNotice[];
  onTriggerSimulateRecall: (recallId: string) => void;
  onConfirmRecallHandled: (pantryItemId: string) => void;
  onRemoveItem: (id: string) => void;
  onViewRecallDetails: (recall: RecallNotice, item: PantryItem) => void;
}

// Sample FSMA 204 7 CTE/KDE Pipeline Events for interactive inspection
const MOCK_FSMA_CTE_EVENTS: CTEEvent[] = [
  {
    stepNumber: 1,
    cteType: 'harvesting',
    cteTitleTh: 'การเก็บเกี่ยววัตถุดิบ (Harvesting)',
    locationName: 'ฟาร์มประมงยั่งยืน อ่าวไทย เขต 4',
    glnLocationId: 'GLN 8859012300018',
    timestamp: '2026-08-28 05:30:00',
    kdeData: {
      tlc: 'RAW-TNA-2026-H88',
      referenceDocType: 'Harvest Log #HL-8821',
      quantity: '4,500 กิโลกรัม',
      temperatureLog: '3.2°C (ควบคุมความเย็น)',
      qualitySignOff: 'นายช่างประมง ชวลิต ส.',
    },
    verificationStatus: 'verified',
  },
  {
    stepNumber: 2,
    cteType: 'cooling',
    cteTitleTh: 'การลดอุณหภูมิเบื้องต้น (Cooling)',
    locationName: 'ห้องเย็นท่าเรือสัตหีบ ชลบุรี',
    glnLocationId: 'GLN 8859012300025',
    timestamp: '2026-08-28 08:15:00',
    kdeData: {
      tlc: 'RAW-TNA-2026-H88',
      referenceDocType: 'Cold Storage Manifest #CS-441',
      quantity: '4,500 กิโลกรัม',
      temperatureLog: '-1.8°C (Blast Chiller)',
      qualitySignOff: 'ฝ่ายควบคุมคุณภาพ ท่าเรือ',
    },
    verificationStatus: 'verified',
  },
  {
    stepNumber: 3,
    cteType: 'initial_packing',
    cteTitleTh: 'การบรรจุหีบห่อขั้นต้น (Initial Packing)',
    locationName: 'ศูนย์คัดแยกวัตถุดิบทางทะเล สยามฮับ',
    glnLocationId: 'GLN 8859012300032',
    timestamp: '2026-08-29 10:00:00',
    kdeData: {
      tlc: 'LOT-PRE-PACK-019',
      referenceDocType: 'Packer Slip #PS-901',
      quantity: '90 ลังบรรจุสุญญากาศ',
      temperatureLog: '0.5°C',
      qualitySignOff: 'วิศวกรอาหาร นันทพร ก.',
    },
    verificationStatus: 'verified',
  },
  {
    stepNumber: 4,
    cteType: 'first_land_based_receiving',
    cteTitleTh: 'การรับสินค้าบนบกครั้งแรก (First Land-Based Receiving)',
    locationName: 'คลังกระจายวัตถุดิบ สมุทรปราการ',
    glnLocationId: 'GLN 8859012300049',
    timestamp: '2026-08-30 06:45:00',
    kdeData: {
      tlc: 'LOT-PRE-PACK-019',
      referenceDocType: 'Bill of Lading #BOL-TH-77821',
      quantity: '90 ลัง (4,480 กก.)',
      temperatureLog: '2.0°C',
      qualitySignOff: 'หัวหน้าคลังสินค้า สันติ',
    },
    verificationStatus: 'verified',
  },
  {
    stepNumber: 5,
    cteType: 'shipping',
    cteTitleTh: 'การขนส่งควบคุมอุณหภูมิ (Shipping CTE)',
    locationName: 'รถขนส่งห้องเย็น ทะเบียน 70-8812 กทม.',
    glnLocationId: 'GLN 8859012300056',
    timestamp: '2026-09-01 14:00:00',
    kdeData: {
      tlc: 'LOT-PRE-PACK-019',
      referenceDocType: 'Transfer Waybill #WB-2026-99',
      quantity: '90 ลัง',
      temperatureLog: 'GPS Sensor Avg: 1.4°C',
      qualitySignOff: 'พนักงานขับส่งโลจิสติกส์ มั่นคง',
    },
    verificationStatus: 'verified',
  },
  {
    stepNumber: 6,
    cteType: 'receiving',
    cteTitleTh: 'การรับเข้าโรงงานแปรรูป (Receiving CTE)',
    locationName: 'โรงงานซีสตาร์ ฟู้ดส์ นิคมอุตสาหกรรมบางปู',
    glnLocationId: 'GLN 8859012300063',
    timestamp: '2026-09-02 08:30:00',
    kdeData: {
      tlc: 'LOT-PRE-PACK-019',
      referenceDocType: 'Inbound ASN #ASN-BP-112',
      quantity: '90 ลัง (ผ่านการสุ่มตรวจสเปค)',
      temperatureLog: '1.2°C',
      qualitySignOff: 'QA Manager ศุภชัย',
    },
    verificationStatus: 'verified',
  },
  {
    stepNumber: 7,
    cteType: 'transformation',
    cteTitleTh: 'การแปรรูป & สร้างรหัสล็อตจำเพาะ (Transformation CTE)',
    locationName: 'สายการผลิตกระป๋อง Line 3 (Retort & Sealing)',
    glnLocationId: 'GLN 8859012300070',
    timestamp: '2026-09-05 11:20:00',
    kdeData: {
      tlc: 'LOT-2026-TNA-RECALL-01', // Traceability Lot Code assigned!
      referenceDocType: 'Production Run Log #PR-2026-0905',
      quantity: '12,000 กระป๋อง (TLC สร้างเสร็จสมบูรณ์)',
      temperatureLog: 'หม้อฆ่าเชื้อ Retort Batch #14 (Under-temp Flagged)',
      qualitySignOff: 'ระบบตรวจสอบย้อนกลับ ChoiceGuard Trace',
    },
    verificationStatus: 'alert_flagged',
  },
];

export const PantryLotTracker: React.FC<PantryLotTrackerProps> = ({
  pantryItems,
  recalls,
  onTriggerSimulateRecall,
  onConfirmRecallHandled,
  onRemoveItem,
  onViewRecallDetails,
}) => {
  const [selectedRecallId, setSelectedRecallId] = useState(recalls[0]?.id || '');
  const [showCTEInspector, setShowCTEInspector] = useState(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  // Export electronic sortable spreadsheet (FSMA 204 24-hr electronic spreadsheet requirement)
  const handleExportFSMA204Spreadsheet = () => {
    const rows = [
      ['Traceability Lot Code (TLC)', 'Product Name', 'Brand', 'Category', 'Quantity', 'Expiry Date', 'Status', 'FSMA 204 Compliant'],
      ...pantryItems.map((item) => [
        item.lotCode,
        item.product.name,
        item.product.brand,
        item.product.categoryLabel,
        item.quantity.toString(),
        item.expiryDate,
        item.recallStatus === 'recalled' ? (item.confirmedHandled ? 'Disposed/Refunded' : 'ALERT_RECALLED') : 'SAFE',
        'TRUE (21 CFR 1.1300)',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ChoiceGuard_FSMA204_Pantry_Spreadsheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedStatus('ส่งออกไฟล์ CSV สำเร็จ (พร้อมส่ง อย. / US FDA ภายใน 24 ชม.)');
    setTimeout(() => setExportedStatus(null), 3000);
  };

  return (
    <section className="space-y-6">
      {/* 1. Top Banner: FSMA 204 & MOPH 420 Standards & Recall Drill Launcher */}
      <div className="glass-panel p-6 border-l-4 border-l-rose-500">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 flex-shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg md:text-xl text-slate-900">
                  ระบบตรวจสอบย้อนกลับรายล็อต &amp; เตือนภัยอาหารเรียกคืน (Lot Alert)
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-800 border border-rose-500/20">
                  ประกาศ สธ. ฉบับที่ 420 &amp; US FDA FSMA 204
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                เชื่อมต่อปลายทางจากโรงงานและห้างค้าปลีกสู่มือผู้บริโภคโดยตรง เมื่อมีประกาศเรียกคืนสินค้าตามรหัสล็อต (Traceability Lot Code - TLC) ระบบจะแจ้งเตือนผ่าน LINE OA ทันทีภายใน 60 นาที พร้อมระบบส่งออกสเปรดชีตอิเล็กทรอนิกส์ใน 24 ชม.
              </p>
            </div>
          </div>

          {/* Interactive Recall Drill Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex-1 lg:w-56">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                เลือกเหตุการณ์จำลองเรียกคืน (อย.):
              </label>
              <select
                value={selectedRecallId}
                onChange={(e) => setSelectedRecallId(e.target.value)}
                className="w-full text-xs font-semibold p-1.5 rounded-lg border border-slate-300 bg-white"
              >
                {recalls.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.recallLevel}] {r.productName.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onTriggerSimulateRecall(selectedRecallId)}
              className="glass-button glass-button-primary text-xs py-2 px-3.5 font-bold whitespace-nowrap bg-rose-600 hover:bg-rose-700 shadow-rose-500/30 text-white flex items-center justify-center gap-1.5"
            >
              <Radio className="h-4 w-4 animate-pulse" />
              <span>ยิงแจ้งเตือนด่วน (Drill)</span>
            </button>
          </div>
        </div>

        {/* Quick Toolbar: CTE Visualizer & Export Spreadsheet */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowCTEInspector(!showCTEInspector)}
            className="text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 flex items-center gap-1.5 transition"
          >
            <GitBranch className="h-4 w-4 text-teal-600" />
            <span>{showCTEInspector ? 'ซ่อนผัง 7 เหตุการณ์ตรวจสอบย้อนกลับ (CTE)' : 'ดูผัง 7 เหตุการณ์ตรวจสอบย้อนกลับ (FSMA 204 CTE/KDE)'}</span>
            {showCTEInspector ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            {exportedStatus && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fadeIn">
                ✓ {exportedStatus}
              </span>
            )}
            <button
              onClick={handleExportFSMA204Spreadsheet}
              className="glass-button text-xs py-1.5 px-3 font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" />
              <span>ส่งออกตารางอิเล็กทรอนิกส์ 24 ชม. (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive FSMA 204 7 CTE Supply Chain Inspector */}
      {showCTEInspector && (
        <div className="glass-panel p-6 border-2 border-teal-500/30 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                7
              </div>
              <div>
                <h4 className="font-extrabold text-sm md:text-base text-slate-900">
                  ห่วงโซ่อุปทาน 7 Critical Tracking Events (CTE) ตามเกณฑ์ US FDA FSMA 204
                </h4>
                <p className="text-[11px] text-slate-500">
                  บันทึก Key Data Elements (KDEs) ครบถ้วนทุกจุดเปลี่ยนมือตั้งแต่ต้นน้ำถึงมือผู้บริโภค
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full">
              มาตรฐานสากล 2028 Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 mt-4">
            {MOCK_FSMA_CTE_EVENTS.map((cte) => (
              <div
                key={cte.stepNumber}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  cte.verificationStatus === 'alert_flagged'
                    ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                    : 'bg-white/90 border-slate-200 hover:border-teal-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-xs text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      CTE #{cte.stepNumber}
                    </span>
                    {cte.verificationStatus === 'alert_flagged' ? (
                      <span className="text-[9px] font-bold text-rose-700 bg-rose-200 px-1 rounded">
                        จุดพบปัญหา
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                        ผ่านเกณฑ์
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">
                    {cte.cteTitleTh}
                  </h5>

                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{cte.locationName}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                    <div className="text-slate-600">
                      <strong>TLC:</strong> <span className="font-mono">{cte.kdeData.tlc}</span>
                    </div>
                    <div className="text-slate-500 truncate">
                      <strong>Doc:</strong> {cte.kdeData.referenceDocType}
                    </div>
                    {cte.kdeData.temperatureLog && (
                      <div className="text-teal-700 font-semibold truncate flex items-center gap-0.5">
                        <ThermometerSnowflake className="h-3 w-3" />
                        <span>{cte.kdeData.temperatureLog}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-200/50 text-[9px] text-slate-400">
                  {cte.timestamp.slice(0, 16)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Pantry Inventory Cards with Lot Status */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="font-extrabold text-base md:text-lg text-slate-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              <span>คลังอาหารในบ้านของคุณ (My Food Pantry)</span>
            </h4>
            <p className="text-xs text-slate-500">
              สินค้าและรหัสล็อตที่สแกนและบันทึกไว้ในระบบเพื่อเฝ้าระวังอัตโนมัติตลอด 24 ชม.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {pantryItems.length} รายการที่กำลังเฝ้าระวัง
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
                        : 'bg-rose-50/80 border-rose-400 shadow-md shadow-rose-500/10'
                      : 'bg-white/70 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div>
                    {/* Header: Status Badge & Remove */}
                    <div className="flex items-center justify-between mb-2">
                      {isRecalled ? (
                        item.confirmedHandled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            จัดการทิ้ง/คืนเงินแล้ว
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
                          จำนวนในคลัง: {item.quantity} ชิ้น
                        </span>
                      </div>
                    </div>

                    {/* Traceability Lot & Dates */}
                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Hash className="h-3 w-3 text-teal-600" />
                          Traceability Lot (TLC):
                        </span>
                        <span className="font-mono font-bold text-teal-900">{item.lotCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          วันหมดอายุ (EXP):
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
                        ✓ ปิดเคสความปลอดภัยเรียบร้อยแล้ว (ได้รับเงินคืน/กำจัดถูกต้อง)
                      </div>
                    ) : (
                      <div className="text-[11px] text-teal-700 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          สถานะ: ตรวจสอบปกติ
                        </span>
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

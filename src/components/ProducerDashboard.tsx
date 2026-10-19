'use client';

import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Users,
  Clock,
  Layers,
  BarChart3,
  CheckCircle,
  FileSpreadsheet,
  AlertOctagon,
  Percent,
  Briefcase,
  Award,
  Zap,
  Play,
  Check,
  FileCheck2,
  Share2,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export const ProducerDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'b2b' | 'b2g' | 'drill'>('b2b');

  // Simulated Reformulation Interactive Tool
  const [targetSodiumReduction, setTargetSodiumReduction] = useState(40);
  const [simulatedCategory, setSimulatedCategory] = useState<'instant_noodles' | 'condiments' | 'beverages' | 'ready_meals'>('instant_noodles');

  // Criteria thresholds for Thai FDA Healthier Choice (ตราทางเลือกสุขภาพ)
  const categoryConfig = {
    instant_noodles: {
      label: 'บะหมี่กึ่งสำเร็จรูป',
      originalSodium: 1680,
      thresholdSodium: 1000,
      unit: 'มก./ซอง (60 กรัม)',
      marketShareGain: '+18.5%',
    },
    condiments: {
      label: 'เครื่องปรุงรส (น้ำปลา/ซอส)',
      originalSodium: 1480,
      thresholdSodium: 900,
      unit: 'มก./ช้อนโต๊ะ (15 มล.)',
      marketShareGain: '+24.2%',
    },
    beverages: {
      label: 'เครื่องดื่มสุขภาพ / ชาเขียว',
      originalSodium: 85,
      thresholdSodium: 50,
      unit: 'มก./ขวด (น้ำตาล ≤ 6 กรัม/100 มล.)',
      marketShareGain: '+31.0%',
    },
    ready_meals: {
      label: 'อาหารพร้อมทานแช่แข็ง',
      originalSodium: 1250,
      thresholdSodium: 600,
      unit: 'มก./กล่อง (300 กรัม)',
      marketShareGain: '+15.8%',
    },
  };

  const currentConfig = categoryConfig[simulatedCategory];
  const originalSodium = currentConfig.originalSodium;
  const newSodium = Math.round(originalSodium * (1 - targetSodiumReduction / 100));
  const isEligibleForHealthierChoice = newSodium <= currentConfig.thresholdSodium;

  // 24-Hour Rapid Recall Drill Simulator State
  const [drillRunning, setDrillRunning] = useState(false);
  const [drillStep, setDrillStep] = useState(1);
  const [drillCompleted, setDrillCompleted] = useState(false);

  const startDrill = () => {
    setDrillRunning(true);
    setDrillStep(1);
    setDrillCompleted(false);

    const timer1 = setTimeout(() => setDrillStep(2), 700);
    const timer2 = setTimeout(() => setDrillStep(3), 1400);
    const timer3 = setTimeout(() => setDrillStep(4), 2100);
    const timer4 = setTimeout(() => setDrillStep(5), 2800);
    const timer5 = setTimeout(() => {
      setDrillStep(6);
      setDrillRunning(false);
      setDrillCompleted(true);
    }, 3500);
  };

  return (
    <section className="space-y-6">
      {/* Top Toggle: B2B Producer vs B2G Public Health vs 24-Hr Drill */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700 border border-indigo-500/20">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base md:text-lg text-slate-900">
              Enterprise &amp; Public Health Intelligence Suite
            </h3>
            <p className="text-xs text-slate-500">
              สำหรับผู้ผลิตอาหาร (B2B), ร้านค้าปลีก, และหน่วยงานสาธารณสุข สธ./สสส./ประกันสังคม (B2G)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl flex-wrap">
          <button
            onClick={() => setActiveSubTab('b2b')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeSubTab === 'b2b'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 inline mr-1" />
            ผู้ผลิตอาหาร (B2B Studio)
          </button>
          <button
            onClick={() => setActiveSubTab('drill')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeSubTab === 'drill'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5 inline mr-1" />
            ซ้อมเรียกคืน 24 ชม. (FDA Drill)
          </button>
          <button
            onClick={() => setActiveSubTab('b2g')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeSubTab === 'b2g'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 inline mr-1" />
            สุขภาพประชากร &amp; องค์กร (B2G)
          </button>
        </div>
      </div>

      {activeSubTab === 'b2b' && (
        /* B2B PRODUCER & REFORMULATION VIEW */
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-teal-600" />
                SKUs ที่เฝ้าระวัง
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">128 รายการ</div>
              <span className="text-[10px] text-teal-700 font-medium">เชื่อมโยงบาร์โค้ด GS1 2D</span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-cyan-600" />
                ล็อตที่บันทึก (TLC)
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">1,842 ล็อต</div>
              <span className="text-[10px] text-cyan-700 font-medium">บันทึก 7 CTE ครบถ้วน</span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                ผู้ใช้ที่เข้าถึงตอนเรียกคืน
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">3,420 ราย</div>
              <span className="text-[10px] text-indigo-700 font-medium">แจ้งเตือนตรงผ่าน LINE OA</span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                อัตราการปิดเคสเรียกคืน
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">88.4%</div>
              <span className="text-[10px] text-emerald-700 font-medium">เร็วขึ้นกว่าระบบเดิม 6 เท่า</span>
            </div>
          </div>

          {/* Interactive Reformulation Simulator */}
          <div className="glass-panel p-6 border-2 border-teal-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base md:text-lg text-slate-900">
                  เครื่องมือจำลองการปรับสูตรผลิตภัณฑ์ (Product Reformulation Studio)
                </h4>
                <p className="text-xs text-slate-500">
                  คำนวณสูตรเพื่อขอรับสัญลักษณ์โภชนาการ &ldquo;ทางเลือกสุขภาพ&rdquo; (อย.) สำหรับผู้ผลิตอาหาร
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Sliders */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    กลุ่มสินค้าตัวอย่าง:
                  </label>
                  <select
                    value={simulatedCategory}
                    onChange={(e) => setSimulatedCategory(e.target.value as any)}
                    className="glass-input text-xs font-semibold"
                  >
                    <option value="instant_noodles">บะหมี่กึ่งสำเร็จรูป (เกณฑ์ อย.: โซเดียม ≤ 1,000 มก./ซอง)</option>
                    <option value="condiments">น้ำปลา/เครื่องปรุงรส (เกณฑ์ อย.: โซเดียม ≤ 900 มก./15 มล.)</option>
                    <option value="beverages">เครื่องดื่ม/ชาเขียว (เกณฑ์ อย.: โซเดียม ≤ 50 มก., น้ำตาล ≤ 6g/100ml)</option>
                    <option value="ready_meals">อาหารแช่แข็งพร้อมทาน (เกณฑ์ อย.: โซเดียม ≤ 600 มก./กล่อง)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>เป้าหมายการลดโซเดียม:</span>
                    <span className="text-teal-700 font-extrabold text-sm">{targetSodiumReduction}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    step="5"
                    value={targetSodiumReduction}
                    onChange={(e) => setTargetSodiumReduction(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>10% (ขั้นต่ำ)</span>
                    <span>40% (สูตรมาตรฐาน อย.)</span>
                    <span>65% (สูตรคลีนพรีเมียม)</span>
                  </div>
                </div>

                {/* Value Added For Brand */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 text-teal-800">
                    <Sparkles className="h-3.5 w-3.5" />
                    คุณค่าทางธุรกิจที่ได้รับ:
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>การเติบโตส่วนแบ่งการตลาดคาดการณ์:</span>
                    <strong className="text-emerald-700">{currentConfig.marketShareGain}</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>สิทธิประโยชน์ลดภาษีความเค็ม/หวาน:</span>
                    <strong className="text-teal-800">ได้รับการยกเว้นภาษีพิเศษ</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between">
                    <span>สิทธิ์จัดวางบน Healthy Shelf ในโมเดิร์นเทรด:</span>
                    <strong className="text-teal-800">ได้สิทธิ์ทันที</strong>
                  </div>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="md:col-span-5 bg-white/95 p-5 rounded-2xl border border-teal-200 text-center shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">ผลลัพธ์หลังปรับสูตร</span>
                <div className="text-3xl font-black text-teal-800 mt-1">
                  {newSodium} <span className="text-xs font-normal text-slate-500">มก. โซเดียม</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  (จากเดิม {originalSodium} มก. ลดลง {originalSodium - newSodium} มก.)
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  {isEligibleForHealthierChoice ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold shadow-xs">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span>ผ่านเกณฑ์ตราทางเลือกสุขภาพ อย.!</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        ระดับโซเดียมต่ำกว่าเกณฑ์ควบคุม ({currentConfig.thresholdSodium} {currentConfig.unit})
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                        <AlertOctagon className="h-4 w-4 text-rose-600" />
                        <span>ยังไม่ผ่านเกณฑ์ (ต้องลดเพิ่มอีก {newSodium - currentConfig.thresholdSodium} มก.)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        เกณฑ์ควบคุม อย. อยู่ที่ ≤ {currentConfig.thresholdSodium} {currentConfig.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'drill' && (
        /* 24-HOUR RAPID RECALL DRILL SIMULATOR VIEW */
        <div className="space-y-6">
          <div className="glass-panel p-6 border-l-4 border-l-rose-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-base md:text-lg text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose-600" />
                  <span>โปรแกรมจำลองการซ้อมเรียกคืนอาหารฉุกเฉิน 24 ชั่วโมง (FDA Rapid Drill)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  จำลองการดำเนินการตามข้อกำหนด US FDA FSMA 204 และประกาศกระทรวงสาธารณสุข ฉบับที่ 420: ส่งมอบสเปรดชีตตรวจสอบย้อนกลับและแจ้งเตือนผู้บริโภค 100% ภายใน 24 ชั่วโมง
                </p>
              </div>

              <button
                onClick={startDrill}
                disabled={drillRunning}
                className="glass-button glass-button-primary text-xs py-2.5 px-4 font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 flex items-center gap-2 flex-shrink-0"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>{drillRunning ? 'กำลังรันการทดสอบ...' : 'เริ่มจำลองการซ้อม (Start Drill)'}</span>
              </button>
            </div>

            {/* Drill Timeline Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-6">
              {[
                { step: 1, time: '00:00 ชม.', title: 'รับคำสั่ง อย. Class I', desc: 'ตรวจพบสารพิษในล็อต' },
                { step: 2, time: '00:15 ชม.', title: 'สืบค้นฐานข้อมูล TLC', desc: 'พบ 3,420 คลังที่ตรงกัน' },
                { step: 3, time: '00:30 ชม.', title: 'ยิง LINE OA Push Alert', desc: 'ส่งข้อความเตือนด่วน' },
                { step: 4, time: '01:00 ชม.', title: 'อัตราการเปิดอ่าน 88%', desc: 'ผู้บริโภคแยกอาหาร' },
                { step: 5, time: '06:00 ชม.', title: 'รวบรวม Electronic Sheet', desc: 'สร้างไฟล์ 7 CTE/KDE' },
                { step: 6, time: '24:00 ชม.', title: 'ส่งมอบรายงานครบถ้วน', desc: 'ปิดเคสตามกฎหมาย' },
              ].map((item) => {
                const isActive = drillStep === item.step;
                const isPassed = drillStep > item.step;

                return (
                  <div
                    key={item.step}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isActive
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{item.time}</span>
                      {isPassed && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      {isActive && <div className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />}
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs">{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                );
              })}
            </div>

            {drillCompleted && (
              <div className="mt-5 p-4 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between gap-4 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                  <div>
                    <strong>การซ้อมเรียกคืนสำเร็จสมบูรณ์ (Audit Passed):</strong> ระบบสามารถระบุตัวผู้บริโภคและแจ้งเตือนครบ 100% ภายใน 1 ชั่วโมง และพร้อมส่งออก Electronic Sortable Spreadsheet ภายในเวลาที่กำหนด
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                  Compliance: 100%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'b2g' && (
        /* B2G PUBLIC HEALTH & WORKPLACE WELLNESS VIEW */
        <div className="space-y-6">
          {/* NCD Crisis Card (Khaosod Dec 2025 Data) */}
          <div className="glass-panel p-6 border-l-4 border-l-rose-500">
            <h4 className="font-extrabold text-base md:text-lg text-slate-900 mb-2">
              ภาพรวมวิกฤต NCDs และความสูญเสียทางเศรษฐกิจของประเทศไทย (สธ. &amp; สสส.)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              อ้างอิงข้อมูลสมัชชาสุขภาพแห่งชาติ ครั้งที่ 18 (2025): คนไทยเสียชีวิตจาก NCDs กว่า 400,000 รายต่อปี (77% ของการเสียชีวิตทั้งหมด) และสูญเสียทางเศรษฐกิจคิดเป็น 9.7% ของ GDP โดย 86% เกิดจากการออกจากตลาดแรงงานก่อนวัยอันควร
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-rose-50/80 p-3 rounded-xl border border-rose-200">
                <span className="text-[10px] text-rose-700 font-bold">เสียชีวิตจาก NCDs</span>
                <div className="text-xl font-extrabold text-rose-900">400,000+</div>
                <span className="text-[10px] text-rose-600">รายต่อปี (77% ของทั้งหมด)</span>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold">บริโภคโซเดียมเฉลี่ย</span>
                <div className="text-xl font-extrabold text-amber-900">3,636 มก.</div>
                <span className="text-[10px] text-amber-700">เกือบ 2 เท่าของเกณฑ์ WHO</span>
              </div>

              <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-200">
                <span className="text-[10px] text-indigo-700 font-bold">น้ำหนักเกิน / อ้วน</span>
                <div className="text-xl font-extrabold text-indigo-950">27 ล้านคน</div>
                <span className="text-[10px] text-indigo-600">ประชากรไทยอายุ 15+</span>
              </div>

              <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-200">
                <span className="text-[10px] text-teal-800 font-bold">สูญเสียทางเศรษฐกิจ</span>
                <div className="text-xl font-extrabold text-teal-950">9.7% GDP</div>
                <span className="text-[10px] text-teal-700">~1.6 ล้านล้านบาท/ปี</span>
              </div>
            </div>
          </div>

          {/* Workplace Health Case Study: J.H. Industrial Nakhon Ratchasima */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h5 className="font-extrabold text-base text-slate-900">
                  โมเดลสุขภาพองค์กรนำร่อง: J.H. Industrial Co. (สถาบันอุตสาหกรรม)
                </h5>
                <p className="text-xs text-slate-500">
                  ผลสัมฤทธิ์จากการใช้โปรแกรมนับคาร์โบไฮเดรตและคุมโซเดียมในสถานประกอบการจริง
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/80 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-600">การลาป่วยของพนักงาน (Sick Leave)</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">-10%</div>
                <p className="text-[11px] text-slate-500 mt-1">ประสิทธิภาพงานเพิ่มขึ้น พนักงานสุขภาพดี</p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-600">ค่าใช้จ่ายรักษาพยาบาล (Healthcare Cost)</div>
                <div className="text-2xl font-black text-teal-800 mt-1">-16%</div>
                <p className="text-[11px] text-slate-500 mt-1">ลดภาระกองทุนประกันสังคมและนายจ้าง</p>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-600">ความตระหนักรู้โภชนาการ (Carb/Na Counting)</div>
                <div className="text-2xl font-black text-cyan-600 mt-1">+78%</div>
                <p className="text-[11px] text-slate-500 mt-1">สอดคล้องกับกรอบ Ecosystem 3:5:5 สช.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

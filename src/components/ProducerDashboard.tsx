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
} from 'lucide-react';

export const ProducerDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'b2b' | 'b2g'>('b2b');

  // Simulated Reformulation Interactive Tool
  const [targetSodiumReduction, setTargetSodiumReduction] = useState(40);
  const [simulatedCategory, setSimulatedCategory] = useState('instant_noodles');

  // Calculation for Healthier Choice eligibility
  const originalSodium = simulatedCategory === 'instant_noodles' ? 1680 : 1480;
  const newSodium = Math.round(originalSodium * (1 - targetSodiumReduction / 100));
  const isEligibleForHealthierChoice =
    simulatedCategory === 'instant_noodles' ? newSodium <= 1000 : newSodium <= 900;

  return (
    <section className="space-y-6">
      {/* Top Toggle: B2B Producer vs B2G Public Health */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('b2b')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'b2b'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 inline mr-1" />
            ผู้ผลิตอาหาร (B2B Studio)
          </button>
          <button
            onClick={() => setActiveSubTab('b2g')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeSubTab === 'b2g'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 inline mr-1" />
            หน่วยงาน &amp; สุขภาพองค์กร (B2G)
          </button>
        </div>
      </div>

      {activeSubTab === 'b2b' ? (
        /* B2B PRODUCER & RECALL MANAGEMENT VIEW */
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-teal-600" />
                SKUs ที่เฝ้าระวัง
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">128</div>
              <span className="text-[10px] text-teal-700 font-medium">เชื่อมโยงระบบบาร์โค้ด GS1</span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-cyan-600" />
                ล็อตที่บันทึก (TLC)
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">1,842</div>
              <span className="text-[10px] text-cyan-700 font-medium">ตามเกณฑ์ FSMA 204</span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                ผู้ใช้ที่เข้าถึงตอนเรียกคืน
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">3,420</div>
              <span className="text-[10px] text-indigo-700 font-medium">แจ้งเตือนตรงถึงมือถือ (LINE)</span>
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

          {/* Real-time Recall Dissemination Timeline */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span>ความเร็วในการแจ้งเตือนผู้บริโภครายล็อต (Recall Speed Simulation)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  สถิติการเปิดอ่านและยืนยันการทำลายสินค้าหลัง อย. ออกคำสั่งประกาศ Class I
                </p>
              </div>
              <span className="text-xs font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                เป้าหมาย: ถึงผู้ใช้ใน 60 นาที
              </span>
            </div>

            {/* Timeline Progress Step Bars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">15 นาทีแรก</span>
                <div className="text-xl font-extrabold text-teal-800 mt-1">1,240 ราย</div>
                <div className="w-full bg-teal-200 h-1.5 rounded-full mt-2">
                  <div className="bg-teal-700 h-full rounded-full" style={{ width: '36%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">LINE Webhook Push อัตโนมัติ</span>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">30 นาที</span>
                <div className="text-xl font-extrabold text-teal-800 mt-1">2,380 ราย</div>
                <div className="w-full bg-teal-200 h-1.5 rounded-full mt-2">
                  <div className="bg-teal-700 h-full rounded-full" style={{ width: '69%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">การเปิดอ่านข้อความ 69%</span>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">1 ชั่วโมง</span>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">3,010 ราย</div>
                <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">บรรลุเป้าหมายนำร่อง (88%)</span>
              </div>

              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">6 ชั่วโมง</span>
                <div className="text-xl font-extrabold text-emerald-700 mt-1">3,318 ราย</div>
                <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: '97%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">ยืนยันทิ้ง/คืนสินค้าแล้ว 97%</span>
              </div>
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
                  คำนวณสูตรเพื่อขอรับสัญลักษณ์โภชนาการ &ldquo;ทางเลือกสุขภาพ&rdquo; (อย.) สำหรับผู้ผลิต
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
                    onChange={(e) => setSimulatedCategory(e.target.value)}
                    className="glass-input text-xs"
                  >
                    <option value="instant_noodles">บะหมี่กึ่งสำเร็จรูป (เกณฑ์ อย.: โซเดียม ≤ 1,000 มก./ซอง)</option>
                    <option value="condiments">น้ำปลา/เครื่องปรุงรส (เกณฑ์ อย.: โซเดียม ≤ 900 มก./15 มล.)</option>
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
              </div>

              {/* Simulation Result */}
              <div className="md:col-span-5 bg-white/90 p-5 rounded-2xl border border-teal-200 text-center shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase">ผลลัพธ์หลังปรับสูตร</span>
                <div className="text-2xl font-black text-teal-800 mt-1">
                  {newSodium} <span className="text-xs font-normal text-slate-500">มก. โซเดียม</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  (จากเดิม {originalSodium} มก. ลดลง {originalSodium - newSodium} มก.)
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  {isEligibleForHealthierChoice ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>ผ่านเกณฑ์ตราทางเลือกสุขภาพ อย.!</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      <AlertOctagon className="h-4 w-4 text-rose-600" />
                      <span>ยังไม่ผ่านเกณฑ์ (ต้องลดเพิ่มอีก {newSodium - (simulatedCategory === 'instant_noodles' ? 1000 : 900)} มก.)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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

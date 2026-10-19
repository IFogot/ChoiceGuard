'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Award,
  Globe2,
  X,
  Target,
  DollarSign,
  Users,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  TrendingUp,
  School,
  ExternalLink,
} from 'lucide-react';

interface PitchDeckBmcModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckBmcModal: React.FC<PitchDeckBmcModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bmc' | 'sdg' | 'team'>('bmc');

  if (!isOpen) return null;

  return (
    <div className="glass-overlay">
      <div className="glass-modal-panel p-6 md:p-8 max-w-4xl max-h-[92vh] overflow-y-auto border-teal-500/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-black text-slate-900">
                  Business Model Canvas &amp; SDG Impact Suite
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  WELLNEXT Future Pitching
                </span>
              </div>
              <p className="text-xs text-slate-500">
                แผนธุรกิจและการสร้างผลกระทบต่อสังคม อ้างอิงจากเอกสารนำเสนอฉบับทางการ
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

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 mb-5 p-1 bg-slate-100/90 rounded-2xl">
          <button
            onClick={() => setActiveTab('bmc')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'bmc'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            แผนธุรกิจ Business Model Canvas (9 กล่อง)
          </button>
          <button
            onClick={() => setActiveTab('sdg')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'sdg'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ผลกระทบต่อเศรษฐกิจ &amp; SDG 3, 9, 12
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'team'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทีมผู้พัฒนา (BIG4 อัสสัมชัญสมุทรปราการ)
          </button>
        </div>

        {/* TAB 1: BUSINESS MODEL CANVAS */}
        {activeTab === 'bmc' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Key Partners (1 col) */}
              <div className="glass-panel p-3.5 rounded-2xl border bg-white/70">
                <span className="font-extrabold text-teal-800 flex items-center gap-1 text-[11px] mb-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Key Partners
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• อย. และ สสส. (เกณฑ์และเครือข่าย)</li>
                  <li>• แบรนด์และร้านค้าปลีก</li>
                  <li>• โรงเรียนและโรงพยาบาลนำร่อง</li>
                  <li>• LINE, Vercel, Neon, Groq</li>
                </ul>
              </div>

              {/* Key Activities & Resources (1 col) */}
              <div className="space-y-3">
                <div className="glass-panel p-3.5 rounded-2xl border bg-white/70">
                  <span className="font-extrabold text-teal-800 text-[11px] mb-1.5 block">
                    Key Activities
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>• พัฒนาเว็บแอป PWA</li>
                    <li>• คัดข้อมูลและเกณฑ์โภชนาการ</li>
                    <li>• รับประกาศเรียกคืน อย. 24 ชม.</li>
                  </ul>
                </div>
                <div className="glass-panel p-3.5 rounded-2xl border bg-white/70">
                  <span className="font-extrabold text-teal-800 text-[11px] mb-1.5 block">
                    Key Resources
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>• ฐานข้อมูลสินค้าและรหัสล็อต</li>
                    <li>• โมเดล Groq LPU Llama 3.3</li>
                    <li>• ทีมพัฒนาและนักกำหนดอาหาร</li>
                  </ul>
                </div>
              </div>

              {/* Value Propositions (1 col) */}
              <div className="glass-panel p-3.5 rounded-2xl border-2 border-teal-500/40 bg-teal-50/40 shadow-xs">
                <span className="font-extrabold text-teal-900 flex items-center gap-1 text-[11px] mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  Value Propositions
                </span>
                <ul className="space-y-1.5 text-slate-700 text-[11px]">
                  <li>• <strong>รู้ว่าเหมาะกับตนเองใน 5 วินาที</strong></li>
                  <li>• <strong>ทางเลือกที่ดีกว่าทันที (Smart Swap)</strong></li>
                  <li>• <strong>แจ้งเตือนรายล็อตถึงมือถือ</strong> ผ่าน LINE OA ใน 60 นาที</li>
                  <li>• ใช้งานได้ทุกอุปกรณ์ ไม่ต้องติดตั้งแอป</li>
                </ul>
              </div>

              {/* Customer Relationships & Channels (1 col) */}
              <div className="space-y-3">
                <div className="glass-panel p-3.5 rounded-2xl border bg-white/70">
                  <span className="font-extrabold text-teal-800 text-[11px] mb-1.5 block">
                    Customer Relationships
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>• ผู้ช่วยส่วนตัวผ่าน LINE</li>
                    <li>• งบรายวันต่อเนื่อง</li>
                  </ul>
                </div>
                <div className="glass-panel p-3.5 rounded-2xl border bg-white/70">
                  <span className="font-extrabold text-teal-800 text-[11px] mb-1.5 block">
                    Channels
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>• เว็บแอป PWA, LINE OA</li>
                    <li>• QR Code หน้าร้านและโรงเรียน</li>
                  </ul>
                </div>
              </div>

              {/* Customer Segments (1 col) */}
              <div className="glass-panel p-3.5 rounded-2xl border bg-white/70">
                <span className="font-extrabold text-teal-800 text-[11px] mb-1.5 block">
                  Customer Segments
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>• ผู้ที่ต้องดูแลความดัน น้ำตาล ไขมัน</li>
                  <li>• ผู้ดูแลผู้สูงอายุ (Elderly Caregiver)</li>
                  <li>• คนวัยทำงานที่พึ่งอาหารพร้อมทาน</li>
                  <li>• ผู้ผลิตอาหารและร้านค้าปลีก</li>
                  <li>• หน่วยงานสุขภาพ สธ./สสส.</li>
                </ul>
              </div>
            </div>

            {/* Bottom Row: Cost Structure & Revenue Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="glass-panel p-4 rounded-2xl border bg-white/80">
                <span className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Cost Structure (โครงสร้างต้นทุน)
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>• ค่า Vercel และ Neon ตามการใช้งาน</div>
                  <div>• ค่า API ของ Groq LPU</div>
                  <div>• ค่าข้อความ LINE OA ตามแพ็กเกจ</div>
                  <div>• ค่าจัดทำและตรวจสอบข้อมูลสินค้า</div>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/40">
                <span className="font-extrabold text-emerald-950 block mb-1 text-xs">
                  Revenue Streams (4 โมเดลรายได้)
                </span>
                <div className="space-y-1 text-[11px] text-emerald-900">
                  <div><strong>1. ผู้ผลิตและร้านค้า (B2B):</strong> สมัครรายเดือนตามจำนวนสินค้า</div>
                  <div><strong>2. สมาชิก Premium &amp; Family (B2C):</strong> ดูแลประวัติสุขภาพหลายคนในครอบครัว</div>
                  <div><strong>3. โครงการร่วมองค์กร (B2G):</strong> เครื่องมือรณรงค์ลดโซเดียมในสถานประกอบการ</div>
                  <div><strong>4. สปอนเซอร์ทางเลือกสุขภาพ:</strong> แสดงสินค้าที่ผ่านเกณฑ์ อย. (คะแนนไม่ขึ้นกับผู้สนับสนุน)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SDG & IMPACT */}
        {activeTab === 'sdg' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            {/* 4 Core Pillars of Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="glass-panel p-4 rounded-2xl border bg-white/80">
                <span className="font-bold text-slate-500 text-[11px]">ผู้ใช้งาน (Consumers)</span>
                <div className="font-extrabold text-slate-900 text-sm mt-1">ตัดสินใจเร็วขึ้น</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  ลดการเผลอรับโซเดียมเกินงบรายวัน และรู้ทันทีเมื่อสินค้าที่ซื้อมีประกาศเรียกคืน
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border bg-white/80">
                <span className="font-bold text-slate-500 text-[11px]">เศรษฐกิจ (Economy)</span>
                <div className="font-extrabold text-teal-800 text-sm mt-1">ลดสูญเสีย 9.7% GDP</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  การป้องกัน NCDs ที่ต้นทางช่วยลดค่ารักษาพยาบาล และผู้ผลิตได้ข้อมูลจริงไปปรับสูตร
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border bg-white/80">
                <span className="font-bold text-slate-500 text-[11px]">สังคม (Society)</span>
                <div className="font-extrabold text-indigo-700 text-sm mt-1">เข้าถึงง่ายผ่าน LINE</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  สนับสนุนเป้าหมายประเทศในการลดการบริโภคโซเดียมลง 30% ตามนโยบาย สธ.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border bg-white/80">
                <span className="font-bold text-slate-500 text-[11px]">สิ่งแวดล้อม (Environment)</span>
                <div className="font-extrabold text-emerald-700 text-sm mt-1">ลดขยะอาหาร (Food Waste)</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  การเรียกคืนเฉพาะรหัสล็อตทำให้ขอบเขตแคบลง ลดการทิ้งสินค้าทั้งแบทช์เกินจำเป็น
                </p>
              </div>
            </div>

            {/* SDG Badges Row */}
            <div className="glass-panel p-5 rounded-2xl border-2 border-teal-500/20 bg-gradient-to-r from-teal-50/40 via-white/80 to-emerald-50/40">
              <h5 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-teal-600" />
                <span>ความสอดคล้องกับเป้าหมายการพัฒนาที่ยั่งยืนแห่งสหประชาชาติ (UN SDGs)</span>
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/90 border border-emerald-200">
                  <div className="flex items-center gap-2 font-black text-emerald-800 text-xs">
                    <span className="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <span>SDG 3: สุขภาพและความเป็นอยู่ที่ดี</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5">
                    Good Health &amp; Well-being: ลดการตายก่อนวัยอันควรจากโรค NCDs และควบคุมความดันโลหิต
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/90 border border-orange-200">
                  <div className="flex items-center gap-2 font-black text-orange-800 text-xs">
                    <span className="h-6 w-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                      9
                    </span>
                    <span>SDG 9: อุตสาหกรรม นวัตกรรม โครงสร้างพื้นฐาน</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5">
                    Industry, Innovation &amp; Infrastructure: เชื่อมต่อระบบตรวจสอบย้อนกลับดิจิทัล FSMA 204
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/90 border border-amber-200">
                  <div className="flex items-center gap-2 font-black text-amber-800 text-xs">
                    <span className="h-6 w-6 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                      12
                    </span>
                    <span>SDG 12: การบริโภคและการผลิตที่รับผิดชอบ</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1.5">
                    Responsible Consumption &amp; Production: ส่งเสริมผู้ผลิตปรับสูตรและเรียกคืนสินค้าแบบจำเพาะเจาะจง
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM CREDENTIALS */}
        {activeTab === 'team' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="glass-panel p-6 rounded-2xl border text-center bg-white/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white mx-auto mb-3 shadow-md">
                <School className="h-7 w-7" />
              </div>
              <h4 className="font-black text-base md:text-lg text-slate-900">
                ASSUMPTION COLLEGE SAMUTPRAKARN — BIG4 TEAM
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                โรงเรียนอัสสัมชัญสมุทรปราการ • การประกวด WELLNEXT Future Pitching
              </p>

              <div className="mt-4 pt-4 border-t border-slate-200 max-w-lg mx-auto text-slate-600 text-xs leading-relaxed">
                นวัตกรรม <strong>ChoiceGuard (ช้อยส์การ์ด)</strong> เกิดจากความตั้งใจที่จะแก้ปัญหาโรค NCDs ของคนไทยตั้งแต่ต้นทาง ด้วยการนำเทคโนโลยี AI, ระบบตรวจสอบย้อนกลับมาตรฐานโลก (FSMA 204), และแชตบอต LINE OA มาเชื่อมโยงระหว่างผู้บริโภค, ผู้ผลิตอาหาร, และสำนักงานคณะกรรมการอาหารและยา (อย.)
              </div>

              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs">
                <span>🌐 เว็บไซต์ต้นแบบ:</span>
                <a href="https://choiceguard-wellnext.vercel.app/" target="_blank" rel="noreferrer" className="underline flex items-center gap-1 text-teal-700">
                  choiceguard-wellnext.vercel.app
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer Close */}
        <div className="mt-6 pt-4 border-t border-slate-200/70 flex justify-end">
          <button
            onClick={onClose}
            className="glass-button py-2 px-5 text-xs font-bold text-slate-700 bg-white"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

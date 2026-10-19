'use client';

import React, { useState } from 'react';
import { FoodProduct, UserHealthProfile } from '../types';
import { calculateChoiceScore, ScoreBreakdown } from '../lib/scoreCalculator';
import {
  ScanBarcode,
  Search,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  Award,
  Sparkles,
  QrCode,
  Layers,
  ChevronRight,
  Upload,
  Zap,
  Activity,
  HeartPulse,
  Scale,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface ScannerSectionProps {
  products: FoodProduct[];
  selectedProduct: FoodProduct | null;
  onSelectProduct: (product: FoodProduct) => void;
  profile: UserHealthProfile;
  onAddToPantry: (product: FoodProduct) => void;
  onOpenSmartSwap: (targetSwapId: string) => void;
  onAskNongChoice: (product: FoodProduct) => void;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  profile,
  onAddToPantry,
  onOpenSmartSwap,
  onAskNongChoice,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isScanningSim, setIsScanningSim] = useState(false);
  const [isOcrMode, setIsOcrMode] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Custom food testing form
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('ผัดซีอิ๊วหมูเส้นใหญ่ (สตรีทฟู้ด)');
  const [customSodium, setCustomSodium] = useState(1950);
  const [customSugar, setCustomSugar] = useState(8);
  const [customSatFat, setCustomSatFat] = useState(7);
  const [customCalories, setCustomCalories] = useState(580);

  const activeProduct = selectedProduct || products[0];
  const scoreBreakdown: ScoreBreakdown = calculateChoiceScore(activeProduct, profile);

  const handleSimulateScan = (product: FoodProduct) => {
    setIsScanningSim(true);
    setTimeout(() => {
      onSelectProduct(product);
      setIsScanningSim(false);
    }, 450);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const match = products.find(
      (p) =>
        p.barcode.includes(barcodeInput.trim()) ||
        p.name.toLowerCase().includes(barcodeInput.toLowerCase()) ||
        p.brand.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    if (match) {
      onSelectProduct(match);
    }
  };

  const handleTriggerOcrScan = () => {
    setIsOcrMode(true);
    setOcrProgress(15);
    setTimeout(() => setOcrProgress(45), 400);
    setTimeout(() => setOcrProgress(80), 800);
    setTimeout(() => {
      setOcrProgress(100);
      setTimeout(() => {
        setIsOcrMode(false);
        // Switch to high-sodium instant noodles to demonstrate OCR result
        onSelectProduct(products[0]);
      }, 500);
    }, 1200);
  };

  const handleApplyCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    const customProd: FoodProduct = {
      id: `custom_${Date.now()}`,
      barcode: `885${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: customName,
      nameEn: 'Custom Analyzed Dish',
      brand: 'ทดสอบโภชนาการจำลอง',
      category: 'prepared_food',
      categoryLabel: 'อาหารปรุงสุก / จานด่วน',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
      nutrition: {
        servingSize: '1 จาน (350 กรัม)',
        servingsPerContainer: 1,
        calories: Number(customCalories),
        totalFatG: 18,
        saturatedFatG: Number(customSatFat),
        transFatG: 0,
        cholesterolMg: 45,
        sodiumMg: Number(customSodium),
        totalCarbG: 65,
        dietaryFiberG: 2,
        sugarG: Number(customSugar),
        proteinG: 22,
        potassiumMg: 120,
      },
      healthierChoiceCertified: Number(customSodium) <= 1000 && Number(customSugar) <= 6,
      traceabilityLotCode: `CUSTOM-LOT-${Date.now().toString().slice(-6)}`,
      mfgDate: '2026-10-20',
      expDate: '2026-10-21',
      manufacturer: 'ผู้ใช้บันทึกเอง',
      originCountry: 'ประเทศไทย',
      ingredients: ['เส้นก๋วยเตี๋ยว', 'เนื้อหมู', 'ซีอิ๊วดำ', 'ซีอิ๊วขาว', 'น้ำปลา', 'คะน้า'],
      allergens: ['ถั่วเหลือง', 'กลูเตน'],
      smartSwapId: products[7].id, // swaps to healthy basil chicken
      warningTags: Number(customSodium) > 1500 ? ['โซเดียมสูงเกินงบวัน', 'เสี่ยงความดันโลหิตสูง'] : [],
    };

    onSelectProduct(customProd);
    setShowCustomModal(false);
  };

  const filteredProducts = products.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <section className="space-y-6">
      {/* Top Search & Interactive OCR Viewfinder Bar */}
      <div className="glass-panel p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex-shrink-0">
              <ScanBarcode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg text-slate-900">
                  สแกนบาร์โค้ด หรือถ่ายรูปฉลากโภชนาการ (AI OCR)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-800 border border-teal-500/25">
                  อย. 5 วินาที
                </span>
              </div>
              <p className="text-xs text-slate-500">
                วิเคราะห์ Personalized Choice Score แบบเฉพาะบุคคล พร้อมตรวจสอบย้อนกลับรหัสล็อต (TLC)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleTriggerOcrScan}
              className="glass-button text-xs py-2 px-3.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-950 font-bold border-teal-500/30 hover:border-teal-500 flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="h-4 w-4 text-teal-600" />
              <span>จำลองถ่ายรูปฉลาก (OCR)</span>
            </button>

            <button
              onClick={() => setShowCustomModal(true)}
              className="glass-button text-xs py-2 px-3 bg-white/80 hover:bg-white text-slate-700 font-semibold flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              <span>ทดสอบอาหารกำหนดเอง</span>
            </button>
          </div>
        </div>

        {/* OCR Scanning Simulation Overlay */}
        {isOcrMode && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-2 font-mono font-bold text-teal-400">
                <Sparkles className="h-4 w-4 animate-spin text-teal-400" />
                กำลังสแกนวิเคราะห์ฉลากด้วย Computer Vision &amp; Groq LPU OCR...
              </span>
              <span className="font-mono text-teal-300 font-bold">{ocrProgress}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="bg-slate-800/80 p-2 rounded border border-teal-500/40 text-teal-300">
                ✓ Bounding Box: [Nutrition Facts]
              </div>
              <div className="bg-slate-800/80 p-2 rounded border border-teal-500/40 text-teal-300">
                ✓ Sodium Detected: 1,680 mg
              </div>
              <div className="bg-slate-800/80 p-2 rounded border border-teal-500/40 text-teal-300">
                ✓ Sugar Detected: 4 g
              </div>
              <div className="bg-slate-800/80 p-2 rounded border border-teal-500/40 text-teal-300">
                ✓ TLC Lot: LOT-2026-TYK-0941
              </div>
            </div>
          </div>
        )}

        {/* Barcode Search Form & Quick Presets Filter */}
        <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <form onSubmit={handleManualSearch} className="flex items-center gap-2 w-full md:w-96">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="กรอกรหัสบาร์โค้ด หรือชื่อสินค้า..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="glass-input pl-9 text-xs sm:text-sm py-2"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <button
              type="submit"
              className="glass-button glass-button-primary text-xs whitespace-nowrap py-2 px-3.5"
            >
              ค้นหา
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex gap-1 overflow-x-auto text-[11px] w-full md:w-auto scrollbar-thin">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'instant_noodles', label: 'บะหมี่กึ่งสำเร็จรูป' },
              { id: 'seasoning', label: 'เครื่องปรุงรส' },
              { id: 'beverage', label: 'เครื่องดื่ม' },
              { id: 'prepared_food', label: 'อาหารจานด่วน' },
              { id: 'canned_food', label: 'อาหารกระป๋อง' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap font-medium ${
                  filterCategory === cat.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 bg-white/50 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Quick Scan Carousel */}
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-teal-600" />
              คลิกเพื่อจำลองการสแกนสินค้าตัวอย่าง (ฐานข้อมูล อย. &amp; สสส.):
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {filteredProducts.map((p) => {
              const isSelected = activeProduct.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSimulateScan(p)}
                  className={`flex-shrink-0 flex items-center gap-2.5 p-2 rounded-xl text-left border transition ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-500 text-teal-950 font-semibold shadow-sm'
                      : 'bg-white/50 border-slate-200/70 hover:bg-white/80 text-slate-700'
                  }`}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    width={36}
                    height={36}
                    style={{ width: '36px', height: '36px', maxWidth: '36px', maxHeight: '36px' }}
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="max-w-[170px] truncate">
                    <div className="text-[11px] font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <span>{p.nutrition.sodiumMg} mg Na</span>
                      {p.healthierChoiceCertified && (
                        <span className="text-[9px] text-teal-800 font-bold bg-teal-100 px-1 rounded">
                          ★ ทางเลือกสุขภาพ
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Scanned Product Detail & Deep Multi-Metric Score Analysis */}
      <div className={`transition-all duration-300 ${isScanningSim ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Card & Nutrition Label */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="glass-card overflow-hidden p-5 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden mb-3 shadow-md border border-white/60">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  width={176}
                  height={176}
                  style={{ width: '176px', height: '176px', maxWidth: '176px', maxHeight: '176px' }}
                  className="w-full h-full object-cover"
                />
                {activeProduct.healthierChoiceCertified && (
                  <div className="absolute top-2 right-2 bg-teal-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    อย. รับรอง
                  </div>
                )}
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-1">
                {activeProduct.categoryLabel}
              </span>

              <h2 className="text-base md:text-lg font-extrabold text-slate-900 leading-snug">
                {activeProduct.name}
              </h2>
              <p className="text-xs text-slate-500 mb-3">{activeProduct.brand}</p>

              {/* Traceability Lot & Barcode Info Box */}
              <div className="w-full bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-left text-xs space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">บาร์โค้ด:</span>
                  <span className="font-mono font-bold text-slate-800">{activeProduct.barcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">รหัสล็อต (FSMA TLC):</span>
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-1 rounded border border-teal-200">
                    {activeProduct.traceabilityLotCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">วันผลิต / หมดอายุ:</span>
                  <span className="text-slate-700 font-medium">
                    {activeProduct.mfgDate} / {activeProduct.expDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={() => onAddToPantry(activeProduct)}
                  className="glass-button flex-1 text-xs py-2.5 bg-white/90 hover:bg-white text-slate-800 font-semibold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="h-4 w-4 text-teal-600" />
                  <span>บันทึกลงคลัง (Lot Alert)</span>
                </button>

                <button
                  onClick={() => onAskNongChoice(activeProduct)}
                  className="glass-button flex-1 text-xs py-2.5 bg-teal-500/20 text-teal-900 hover:bg-teal-500/30 font-bold border-teal-500/30 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span>ถามน้องช้อยส์ AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Dimensional Choice Score Radar & Nutrition Facts */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Top Score Summary Banner */}
            <div
              className="glass-panel p-6 border-l-4"
              style={{ borderLeftColor: scoreBreakdown.color }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle, #ffffff 60%, ${scoreBreakdown.color}25 100%)`,
                      border: `3px solid ${scoreBreakdown.color}`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black tracking-tight" style={{ color: scoreBreakdown.color }}>
                        {scoreBreakdown.finalScore}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-500 -mt-1">
                        เกรด {scoreBreakdown.grade}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Personalized Choice Score
                      </span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-bold text-white shadow-sm"
                        style={{ backgroundColor: scoreBreakdown.color }}
                      >
                        {scoreBreakdown.grade}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900 mt-0.5">
                      {scoreBreakdown.label}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-md leading-relaxed">
                      {scoreBreakdown.description} (ปรับเทียบสำหรับ:{' '}
                      <span className="font-semibold text-slate-800">{profile.name}</span>)
                    </p>
                  </div>
                </div>

                {/* Smart Swap CTA Button */}
                {activeProduct.smartSwapId && (
                  <button
                    onClick={() => onOpenSmartSwap(activeProduct.smartSwapId!)}
                    className="glass-button glass-button-primary text-xs md:text-sm py-2.5 px-4 shadow-md w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>ดูทางเลือกที่ดีกว่า (Smart Swap)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 4 Multi-Metric Health Indices */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200/60">
                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <HeartPulse className="h-3.5 w-3.5 text-rose-500" />
                    <span>ภาระความดันโลหิต</span>
                  </div>
                  <div className={`text-xs font-extrabold mt-1 ${activeProduct.nutrition.sodiumMg > 1200 ? 'text-rose-600' : 'text-teal-700'}`}>
                    {activeProduct.nutrition.sodiumMg > 1200 ? 'ความเสี่ยงสูง' : 'ระดับปลอดภัย'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((activeProduct.nutrition.sodiumMg / profile.dailyBudget.sodiumMg) * 100)}% ของงบวัน
                  </div>
                </div>

                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Activity className="h-3.5 w-3.5 text-amber-500" />
                    <span>ภาระการกรองของไต</span>
                  </div>
                  <div className="text-xs font-extrabold mt-1 text-slate-800">
                    {activeProduct.nutrition.sodiumMg > 1500 ? 'เสี่ยงไตทำงานหนัก' : 'ปกติ'}
                  </div>
                  <div className="text-[10px] text-slate-400">Glomerular load</div>
                </div>

                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Scale className="h-3.5 w-3.5 text-cyan-600" />
                    <span>ดัชนีน้ำตาลเพิ่ม</span>
                  </div>
                  <div className={`text-xs font-extrabold mt-1 ${activeProduct.nutrition.sugarG > 10 ? 'text-rose-600' : 'text-teal-700'}`}>
                    {activeProduct.nutrition.sugarG > 10 ? 'น้ำตาลสูง' : 'น้ำตาลต่ำ'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeProduct.nutrition.sugarG} กรัม / มื้อ
                  </div>
                </div>

                <div className="bg-white/60 p-2.5 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                    <span>ตราทางเลือกสุขภาพ</span>
                  </div>
                  <div className={`text-xs font-extrabold mt-1 ${activeProduct.healthierChoiceCertified ? 'text-teal-700' : 'text-slate-500'}`}>
                    {activeProduct.healthierChoiceCertified ? 'ผ่านเกณฑ์ อย.' : 'ยังไม่ได้รับรอง'}
                  </div>
                  <div className="text-[10px] text-slate-400">MOPH Standard</div>
                </div>
              </div>
            </div>

            {/* Nutrition Facts Table with Daily Percentage Bars */}
            <div className="glass-card p-5">
              <h4 className="font-extrabold text-sm md:text-base text-slate-900 mb-3 flex items-center justify-between">
                <span>ข้อมูลโภชนาการ (Nutrition Facts)</span>
                <span className="text-xs font-normal text-slate-500">
                  หนึ่งหน่วยบริโภค: {activeProduct.nutrition.servingSize}
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-medium">พลังงาน</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {activeProduct.nutrition.calories} <span className="text-xs font-normal">kcal</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${activeProduct.nutrition.sodiumMg > 1000 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <span className="text-[11px] text-slate-500 font-medium">โซเดียม (Sodium)</span>
                  <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.sodiumMg > 1000 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeProduct.nutrition.sodiumMg} <span className="text-xs font-normal">มก.</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {Math.round((activeProduct.nutrition.sodiumMg / profile.dailyBudget.sodiumMg) * 100)}% ของงบวัน
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${activeProduct.nutrition.sugarG > 12 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <span className="text-[11px] text-slate-500 font-medium">น้ำตาล (Sugar)</span>
                  <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.sugarG > 12 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeProduct.nutrition.sugarG} <span className="text-xs font-normal">กรัม</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {Math.round((activeProduct.nutrition.sugarG / profile.dailyBudget.sugarG) * 100)}% ของงบวัน
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${activeProduct.nutrition.saturatedFatG > 6 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                  <span className="text-[11px] text-slate-500 font-medium">ไขมันอิ่มตัว</span>
                  <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.saturatedFatG > 6 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeProduct.nutrition.saturatedFatG} <span className="text-xs font-normal">กรัม</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {Math.round((activeProduct.nutrition.saturatedFatG / profile.dailyBudget.saturatedFatG) * 100)}% ของงบวัน
                  </div>
                </div>
              </div>

              {/* Additives & Allergen Guard Box */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">ส่วนประกอบสำคัญ:</span>{' '}
                  {activeProduct.ingredients?.join(', ') || 'ไม่มีข้อมูล'}
                </div>

                {activeProduct.allergens && activeProduct.allergens.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-800 font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      สารก่อภูมิแพ้:
                    </span>
                    <div className="flex gap-1">
                      {activeProduct.allergens.map((alg, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-semibold">
                          {alg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Custom Food Testing Simulator */}
      {showCustomModal && (
        <div className="glass-overlay">
          <div className="glass-modal-panel p-6 max-w-md animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-teal-600" />
                ทดสอบคำนวณโภชนาการอาหารกำหนดเอง
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCustomFood} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่ออาหาร / เมนู:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="glass-input text-xs py-1.5 px-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">โซเดียม (มก.):</label>
                  <input
                    type="number"
                    value={customSodium}
                    onChange={(e) => setCustomSodium(Number(e.target.value))}
                    className="glass-input text-xs py-1.5 px-3"
                    required
                  />
                  <span className="text-[10px] text-slate-400">เกณฑ์ WHO ≤ 2,000 มก./วัน</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">น้ำตาล (กรัม):</label>
                  <input
                    type="number"
                    value={customSugar}
                    onChange={(e) => setCustomSugar(Number(e.target.value))}
                    className="glass-input text-xs py-1.5 px-3"
                    required
                  />
                  <span className="text-[10px] text-slate-400">เกณฑ์ อย. ≤ 24 กรัม/วัน</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ไขมันอิ่มตัว (กรัม):</label>
                  <input
                    type="number"
                    value={customSatFat}
                    onChange={(e) => setCustomSatFat(Number(e.target.value))}
                    className="glass-input text-xs py-1.5 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">พลังงาน (kcal):</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(Number(e.target.value))}
                    className="glass-input text-xs py-1.5 px-3"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="glass-button text-xs py-1.5 px-3 bg-white text-slate-700"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="glass-button glass-button-primary text-xs py-1.5 px-4"
                >
                  คำนวณ Choice Score ทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

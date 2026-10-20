'use client';

import React, { useState } from 'react';
import { FoodProduct, UserHealthProfile, MealPeriod, FoodAdditive } from '../types';
import { calculateChoiceScore, ScoreBreakdown } from '../lib/scoreCalculator';
import { getProductAdditives } from '../data/additives';
import { calculateBiomarkerForecast } from '../lib/biomarkerForecaster';
import { playScannerBeep, playSuccessChime, playTactileTap, triggerCelebrationConfetti } from '../lib/hapticAudio';
import {
  Scan,
  Camera,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Award,
  ChevronRight,
  Flame,
  Droplets,
  Layers,
  MessageSquare,
  PackagePlus,
  Zap,
  Info,
  Check,
  RotateCcw,
  Activity,
  Heart,
  QrCode,
  GitCompare,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ExternalLink,
  Utensils,
  PlusCircle,
  X,
  ShieldAlert,
  Sliders,
  Clock,
  Waves,
  Droplet,
  HeartCrack,
  AlertCircle,
} from 'lucide-react';

interface ScannerSectionProps {
  products: FoodProduct[];
  selectedProduct: FoodProduct;
  onSelectProduct: (product: FoodProduct) => void;
  profile: UserHealthProfile;
  onAddToPantry: (product: FoodProduct) => void;
  onOpenSmartSwap: (swapId: string) => void;
  onAskNongChoice: (product: FoodProduct) => void;
  onLogMeal?: (product: FoodProduct, mealType: MealPeriod, portion: number, brothPercent: number) => void;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  profile,
  onAddToPantry,
  onOpenSmartSwap,
  onAskNongChoice,
  onLogMeal,
}) => {
  // Navigation Mode: 'single' | 'compare' | 'gs1'
  const [activeMode, setActiveMode] = useState<'single' | 'compare' | 'gs1'>('single');

  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanningSim, setIsScanningSim] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // OCR simulation state
  const [isOcrMode, setIsOcrMode] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Custom food testing form
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('ผัดซีอิ๊วหมูเส้นใหญ่ (สตรีทฟู้ด)');
  const [customSodium, setCustomSodium] = useState(1950);
  const [customSugar, setCustomSugar] = useState(8);
  const [customSatFat, setCustomSatFat] = useState(7);
  const [customCalories, setCustomCalories] = useState(580);

  // On-Shelf Comparator Selected Products (up to 3)
  const [compareProductIds, setCompareProductIds] = useState<string[]>([
    products[0]?.id || '',
    products[1]?.id || '',
  ]);

  // GS1 Digital Link Simulator State
  const [gs1SelectedId, setGs1SelectedId] = useState<string>(products[0]?.id || '');
  const [gs1IngestSuccess, setGs1IngestSuccess] = useState(false);

  // Interactive Deep Feature States: Meal Logger, Additives Analyzer, & Biomarker Forecaster
  const [isMealLoggerOpen, setIsMealLoggerOpen] = useState(false);
  const [logMealPeriod, setLogMealPeriod] = useState<MealPeriod>('lunch');
  const [logPortion, setLogPortion] = useState<number>(1);
  const [logBrothPercent, setLogBrothPercent] = useState<number>(100);

  const [interactiveBrothForecaster, setInteractiveBrothForecaster] = useState<number>(100);
  const [selectedAdditiveModal, setSelectedAdditiveModal] = useState<FoodAdditive | null>(null);

  const activeProduct = selectedProduct || products[0];
  const scoreBreakdown: ScoreBreakdown = calculateChoiceScore(activeProduct, profile);
  const activeAdditives = getProductAdditives(activeProduct.ingredients, activeProduct.category);
  const clinicalForecast = calculateBiomarkerForecast(
    activeProduct.nutrition.sodiumMg,
    profile,
    interactiveBrothForecaster
  );

  const handleSimulateScan = (product: FoodProduct) => {
    setIsScanningSim(true);
    playScannerBeep();
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
        totalCarbG: 45,
        dietaryFiberG: 2,
        sugarG: Number(customSugar),
        proteinG: 16,
        potassiumMg: 120,
      },
      healthierChoiceCertified: false,
      traceabilityLotCode: `LOT-CUSTOM-${Date.now().toString().slice(-4)}`,
      mfgDate: new Date().toISOString().split('T')[0],
      expDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      manufacturer: 'ร้านอาหารปรุงสดตามสั่ง',
      originCountry: 'ประเทศไทย',
      ingredients: ['เส้นใหญ่ 40%', 'เนื้อหมู 25%', 'คะน้า 20%', 'ซีอิ๊วดำและน้ำมันหอย 15%'],
      allergens: ['ถั่วเหลือง', 'แป้งสาลี'],
      warningTags: Number(customSodium) > 1500 ? ['โซเดียมสูงวิกฤต (>1,500 มก.)'] : [],
    };

    onSelectProduct(customProd);
    setShowCustomModal(false);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter === 'all') return true;
    return p.category === selectedCategoryFilter;
  });

  // GS1 Product lookup
  const gs1Product = products.find((p) => p.id === gs1SelectedId) || products[0];
  const gs1Uri = `https://id.choiceguard.th/01/${gs1Product.barcode.padStart(14, '0')}/10/${gs1Product.traceabilityLotCode}/17/${gs1Product.expDate.replace(/-/g, '').slice(2)}/21/SN98412`;

  const handleSimulateGS1Ingest = () => {
    setGs1IngestSuccess(true);
    onAddToPantry(gs1Product);
    setTimeout(() => setGs1IngestSuccess(false), 2500);
  };

  return (
    <section className="space-y-6">
      {/* 1. Mode Switcher Ribbon (Single Scan vs On-Shelf 5-Sec Comparator vs GS1 2D) */}
      <div className="glass-panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl flex-wrap">
          <button
            onClick={() => setActiveMode('single')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeMode === 'single'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scan className="h-4 w-4" />
            <span>สแกนเดี่ยว &amp; วิเคราะห์ OCR</span>
          </button>

          <button
            onClick={() => setActiveMode('compare')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeMode === 'compare'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare className="h-4 w-4" />
            <span>เปรียบเทียบหน้าชั้นวาง 5 วิ (On-Shelf Assistant)</span>
          </button>

          <button
            onClick={() => setActiveMode('gs1')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeMode === 'gs1'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>บาร์โค้ด GS1 Digital Link 2D (Roadmap 2028)</span>
          </button>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="glass-button text-xs py-2 px-3.5 font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
          <span>คำนวณโภชนาการจานโปรด (Custom Dish)</span>
        </button>
      </div>

      {/* MODE 1: SINGLE SCAN & OCR SIMULATOR */}
      {activeMode === 'single' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search & Actions Bar */}
          <div className="glass-panel p-5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex-shrink-0">
                  <Scan className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-slate-900">
                    สแกนบาร์โค้ด หรือถ่ายรูปฉลากโภชนาการ
                  </h3>
                  <p className="text-xs text-slate-500">
                    วิเคราะห์ Choice Score เฉพาะบุคคลใน 5 วินาที พร้อมตรวจสอบย้อนกลับรหัสล็อต
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <form onSubmit={handleManualSearch} className="flex-1 sm:w-64 relative">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="กรอกรหัสบาร์โค้ด หรือชื่อสินค้า..."
                    className="glass-input text-xs pr-8 py-2.5"
                  />
                  <button type="submit" className="absolute right-2 top-2.5 text-slate-400 hover:text-teal-600">
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                <button
                  onClick={handleTriggerOcrScan}
                  disabled={isOcrMode}
                  className="glass-button glass-button-primary text-xs py-2.5 px-4 font-bold whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Camera className="h-4 w-4" />
                  <span>{isOcrMode ? `กำลังอ่าน OCR (${ocrProgress}%)...` : 'จำลองถ่ายรูปฉลาก OCR (AI Camera)'}</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-5 pt-4 border-t border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  คลิกเพื่อจำลองการสแกนสินค้าตัวอย่าง (อย. &amp; CDC 2023 Study):
                </span>
                <div className="flex items-center gap-1">
                  {['all', 'instant_noodles', 'condiments', 'beverages'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                        selectedCategoryFilter === cat
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'all' ? 'ทั้งหมด' : cat === 'instant_noodles' ? 'บะหมี่' : cat === 'condiments' ? 'เครื่องปรุง' : 'เครื่องดื่ม'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                {filteredProducts.map((p) => {
                  const isSelected = activeProduct.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSimulateScan(p)}
                      className={`flex-shrink-0 flex items-center gap-2 p-2 rounded-xl text-left border transition ${
                        isSelected
                          ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 shadow-sm'
                          : 'bg-white/60 hover:bg-white border-slate-200/70'
                      }`}
                    >
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{p.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>{p.nutrition.sodiumMg} mg Na</span>
                          {p.healthierChoiceCertified && <span className="text-teal-700 font-bold">★ อย.</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Product Analysis Card */}
          <div className="glass-card p-6">
            {/* Header: Score Ring + Grade + Details */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/70">
              <div className="flex items-center gap-4">
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
                      เกรด {scoreBreakdown.grade}
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* 1. Log to Daily Diary Button */}
                <button
                  onClick={() => {
                    playTactileTap();
                    setIsMealLoggerOpen(true);
                  }}
                  className="glass-button bouncy-hover text-xs py-2.5 px-4 font-bold text-teal-900 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border border-teal-300 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 shadow-sm"
                  title="บันทึกอาหารจานนี้ลงในไดอารี่วันนี้ เพื่อหักลบโควตาโซเดียมและแคลอรี่แบบเรียลไทม์"
                >
                  <Utensils className="h-4 w-4 text-teal-700" />
                  <span>บันทึกลงมื้ออาหาร (Log Meal)</span>
                </button>

                {activeProduct.smartSwapId && (
                  <button
                    onClick={() => onOpenSmartSwap(activeProduct.smartSwapId!)}
                    className="glass-button glass-button-primary bouncy-hover text-xs py-2.5 px-4 font-bold flex-1 sm:flex-initial flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>ดูทางเลือกที่ดีกว่า (Smart Swap)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    playTactileTap();
                    onAddToPantry(activeProduct);
                  }}
                  className="glass-button bouncy-hover text-xs py-2.5 px-3.5 font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PackagePlus className="h-4 w-4 text-teal-600" />
                  <span>บันทึกลงคลัง (เฝ้าระวังล็อต)</span>
                </button>

                <button
                  onClick={() => {
                    playTactileTap();
                    onAskNongChoice(activeProduct);
                  }}
                  className="glass-button bouncy-hover text-xs py-2.5 px-3 font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center justify-center gap-1"
                  title="ปรึกษาน้องช้อยส์ AI เกี่ยวกับสินค้านี้"
                >
                  <MessageSquare className="h-4 w-4 text-indigo-600" />
                  <span>ถามน้องช้อยส์ AI</span>
                </button>
              </div>
            </div>

            {/* Nutrients & Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className={`p-3.5 rounded-2xl border ${activeProduct.nutrition.sodiumMg > 1000 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                <span className="text-[11px] text-slate-500 font-medium">โซเดียม (Sodium)</span>
                <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.sodiumMg > 1000 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {activeProduct.nutrition.sodiumMg.toLocaleString()} <span className="text-xs font-normal">มก.</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {Math.round((activeProduct.nutrition.sodiumMg / profile.dailyBudget.sodiumMg) * 100)}% ของงบวัน
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${activeProduct.nutrition.sugarG > 10 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                <span className="text-[11px] text-slate-500 font-medium">น้ำตาล (Sugar)</span>
                <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.sugarG > 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {activeProduct.nutrition.sugarG} <span className="text-xs font-normal">กรัม</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {Math.round((activeProduct.nutrition.sugarG / profile.dailyBudget.sugarG) * 100)}% ของงบวัน
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${activeProduct.nutrition.saturatedFatG > 6 ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50/80 border-slate-200/60'}`}>
                <span className="text-[11px] text-slate-500 font-medium">ไขมันอิ่มตัว</span>
                <div className={`text-base font-extrabold mt-0.5 ${activeProduct.nutrition.saturatedFatG > 6 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {activeProduct.nutrition.saturatedFatG} <span className="text-xs font-normal">กรัม</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {Math.round((activeProduct.nutrition.saturatedFatG / profile.dailyBudget.saturatedFatG) * 100)}% ของงบวัน
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border bg-slate-50/80 border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-medium">พลังงาน (Energy)</span>
                <div className="text-base font-extrabold mt-0.5 text-slate-900">
                  {activeProduct.nutrition.calories} <span className="text-xs font-normal">kcal</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  หน่วยบริโภค: {activeProduct.nutrition.servingSize}
                </div>
              </div>
            </div>

            {/* Traceability Lot & Safety Notice */}
            <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">รหัสตรวจสอบย้อนกลับ (TLC):</span>
                <strong className="font-mono text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {activeProduct.traceabilityLotCode}
                </strong>
                <span className="text-slate-400">| วันหมดอายุ: {activeProduct.expDate}</span>
              </div>

              {activeProduct.healthierChoiceCertified ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  ตราทางเลือกสุขภาพ อย. รับรอง
                </span>
              ) : (
                <span className="text-amber-700 text-[11px] flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-amber-600" />
                  สูตรทั่วไปในท้องตลาด
                </span>
              )}
            </div>

            {/* DEEP FEATURE 1: Cardiovascular & Renal Fluid Retention Forecaster */}
            <div className="mt-6 pt-5 border-t border-slate-200/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    <HeartPulse className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm md:text-base text-slate-900 flex items-center gap-1.5">
                      <span>เครื่องพยากรณ์ผลต่อร่างกายหลังบริโภค 2-4 ชม.</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        Clinical Forecaster
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      พยากรณ์การกักน้ำนอกเซลล์และความดันโลหิตเฉียบพลัน ปรับเทียบเฉพาะ: <strong>{profile.name}</strong>
                    </p>
                  </div>
                </div>

                {/* Interactive Broth Reduction Slider (High Wow Factor for Thais) */}
                {(activeProduct.category === 'instant_noodles' || activeProduct.category === 'prepared_food') && (
                  <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Sliders className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                        <span>สัดส่วนน้ำซุปที่ซด:</span>
                        <span className="text-teal-700">{interactiveBrothForecaster}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={interactiveBrothForecaster}
                        onChange={(e) => {
                          playTactileTap();
                          setInteractiveBrothForecaster(Number(e.target.value));
                        }}
                        className="w-28 sm:w-36 h-1 mt-0.5"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Clinical Indicators Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Systolic Surge */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-50/60 to-white border border-rose-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-900">
                    <span>ความดันตัวบนพุ่ง</span>
                    <HeartCrack className="h-3.5 w-3.5 text-rose-500" />
                  </div>
                  <div className="text-lg font-black text-rose-600 mt-1">
                    +{clinicalForecast.systolicSpikeMmHg} <span className="text-xs font-normal text-slate-500">mmHg</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    พีคสูงสุดที่ 2-3 ชม.
                  </div>
                </div>

                {/* 2. Fluid Retention */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-50/60 to-white border border-cyan-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-900">
                    <span>คั่งน้ำนอกเซลล์</span>
                    <Waves className="h-3.5 w-3.5 text-cyan-600" />
                  </div>
                  <div className="text-lg font-black text-cyan-700 mt-1">
                    +{clinicalForecast.extracellularFluidMl} <span className="text-xs font-normal text-slate-500">มล.</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    เกลือ 1g กักน้ำ ~100ml
                  </div>
                </div>

                {/* 3. Renal Clearance Hours */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white border border-amber-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span>ระยะเวลาไตขับออก</span>
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div className="text-lg font-black text-amber-700 mt-1">
                    ~{clinicalForecast.clearanceHours} <span className="text-xs font-normal text-slate-500">ชม.</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ภาระไต: {clinicalForecast.renalLoadPercent}%
                  </div>
                </div>

                {/* 4. Water Flush Recommendation */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-50/60 to-white border border-teal-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-teal-900">
                    <span>ดื่มน้ำเปล่าชดเชย</span>
                    <Droplet className="h-3.5 w-3.5 text-teal-600" />
                  </div>
                  <div className="text-lg font-black text-teal-700 mt-1">
                    +{clinicalForecast.waterFlushRecommendedMl} <span className="text-xs font-normal text-slate-500">มล.</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ช่วยไตกรองโซเดียมทิ้ง
                  </div>
                </div>
              </div>

              {/* Advice Alert Callout */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">คำแนะนำทางคลินิก: </span>
                  <span>{clinicalForecast.adviceTh}</span>
                  {interactiveBrothForecaster < 100 && (
                    <span className="text-emerald-700 font-bold ml-1">
                      (คุณปรับลดน้ำซุปเหลือ {interactiveBrothForecaster}% ช่วยลดโซเดียมลงได้กว่า {Math.round((1 - (0.4 + 0.6 * (interactiveBrothForecaster / 100))) * 100)}%!)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DEEP FEATURE 2: Food Additives & E-Number Safety Analyzer */}
            <div className="mt-6 pt-5 border-t border-slate-200/70">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-700">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <h4 className="font-extrabold text-xs md:text-sm text-slate-900">
                    สารเจือปนอาหาร &amp; รหัส E-Numbers ({activeAdditives.length} รายการที่ตรวจพบ):
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  คลิกที่รหัสเพื่อตรวจสอบเกณฑ์ อย. และ Codex Alimentarius
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeAdditives.map((additive) => {
                  const statusColors = {
                    safe: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
                    caution: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
                    warning: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
                  };
                  const statusBadges = {
                    safe: 'อย. ปลอดภัย',
                    caution: 'ระวังกลุ่มเสี่ยง',
                    warning: 'ต้องควบคุมเข้มงวด',
                  };

                  return (
                    <button
                      key={additive.code}
                      onClick={() => {
                        playTactileTap();
                        setSelectedAdditiveModal(additive);
                      }}
                      className={`bouncy-hover flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${statusColors[additive.safetyStatus]}`}
                    >
                      <span className="font-mono font-black">{additive.code}</span>
                      <span className="truncate max-w-[130px]">{additive.nameTh.split('(')[0]}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white/70">
                        {statusBadges[additive.safetyStatus]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ON-SHELF 5-SEC QUICK DECISION COMPARATOR */}
      {activeMode === 'compare' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel p-6 border-l-4 border-l-teal-600">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-base md:text-lg text-slate-900 flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-teal-600" />
                  <span>ตัวช่วยตัดสินใจหน้าชั้นวางสินค้าใน 5 วินาที (On-Shelf Decision Helper)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  แก้วิกฤต <em>&ldquo;คนไม่ได้ขาดเจตนา แต่ขาดตัวช่วยตอนตัดสินใจหน้าชั้นวาง&rdquo;</em> (Insight งานวิจัย สธ. 2025): เปรียบเทียบสินค้าตรงหน้าพร้อมระบบสัญญาณไฟจราจร <strong>GO • SLOW • STOP</strong>
                </p>
              </div>

              <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full whitespace-nowrap">
                โปรไฟล์: {profile.name} ({profile.tag || 'คุมความดัน'})
              </span>
            </div>

            {/* Shelf Item Selector Bar */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">เลือกเทียบ:</span>
              {products.slice(0, 6).map((prod) => {
                const isChecked = compareProductIds.includes(prod.id);
                return (
                  <button
                    key={prod.id}
                    onClick={() => {
                      if (isChecked) {
                        if (compareProductIds.length > 1) {
                          setCompareProductIds(compareProductIds.filter((id) => id !== prod.id));
                        }
                      } else {
                        if (compareProductIds.length < 3) {
                          setCompareProductIds([...compareProductIds, prod.id]);
                        } else {
                          setCompareProductIds([compareProductIds[1], compareProductIds[2], prod.id]);
                        }
                      }
                    }}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                      isChecked
                        ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                        : 'bg-white/70 hover:bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {prod.name.slice(0, 20)}...
                  </button>
                );
              })}
            </div>
          </div>

          {/* On-Shelf Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compareProductIds.map((id) => {
              const product = products.find((p) => p.id === id) || products[0];
              const score = calculateChoiceScore(product, profile);
              const sodiumRatio = product.nutrition.sodiumMg / profile.dailyBudget.sodiumMg;

              // Traffic Light Recommendation: GO, SLOW, STOP
              let decisionStatus: 'GO' | 'SLOW' | 'STOP' = 'GO';
              let decisionColor = 'bg-emerald-600 text-white';
              let decisionText = 'GO: สารอาหารปลอดภัย ไม่เกินงบวัน';

              if (sodiumRatio > 0.7 || score.finalScore < 50) {
                decisionStatus = 'STOP';
                decisionColor = 'bg-rose-600 text-white animate-pulse';
                decisionText = 'STOP: โซเดียมสูงเกิน 70% ของโควตาวัน แนะนำเลี่ยง';
              } else if (sodiumRatio > 0.45 || score.finalScore < 70) {
                decisionStatus = 'SLOW';
                decisionColor = 'bg-amber-500 text-white';
                decisionText = 'SLOW: ทานได้ แต่แนะนำเลี่ยงซดน้ำซุปให้หมด';
              }

              return (
                <div
                  key={product.id}
                  className="glass-card p-5 rounded-2xl border flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    {/* Top Traffic Light Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-black px-3 py-1 rounded-full shadow-xs ${decisionColor}`}>
                        สัญญาณ: {decisionStatus}
                      </span>
                      <span className="text-xs font-extrabold text-slate-700">
                        Score {score.finalScore} (เกรด {score.grade})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">
                          {product.name}
                        </h5>
                        <p className="text-[11px] text-slate-500">{product.brand}</p>
                      </div>
                    </div>

                    {/* Decision Text Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200 text-xs mb-3 font-semibold text-slate-700">
                      {decisionText}
                    </div>

                    {/* Nutrients Checklist */}
                    <div className="space-y-1.5 text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span>โซเดียม:</span>
                        <strong className={product.nutrition.sodiumMg > 1000 ? 'text-rose-600' : 'text-slate-800'}>
                          {product.nutrition.sodiumMg.toLocaleString()} มก. ({Math.round(sodiumRatio * 100)}% งบวัน)
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>เทียบเท่าเกลือแกง:</span>
                        <strong className="text-slate-800">
                          {(product.nutrition.sodiumMg / 2000).toFixed(1)} ช้อนชา
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>น้ำตาล:</span>
                        <strong className="text-slate-800">{product.nutrition.sugarG} กรัม</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ไขมันอิ่มตัว:</span>
                        <strong className="text-slate-800">{product.nutrition.saturatedFatG} กรัม</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{product.traceabilityLotCode}</span>
                    <button
                      onClick={() => onAddToPantry(product)}
                      className="glass-button text-xs py-1.5 px-3 font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1 shadow-xs"
                    >
                      <PackagePlus className="h-3.5 w-3.5" />
                      <span>เลือกชิ้นนี้ (ลงคลัง)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: GS1 DIGITAL LINK 2D BARCODE SIMULATOR (ROADMAP 2028) */}
      {activeMode === 'gs1' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass-panel p-6 border-2 border-teal-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base md:text-lg text-slate-900">
                    เครื่องมือจำลองบาร์โค้ด 2 มิติมาตรฐานโลก (GS1 Digital Link 2D Barcode)
                  </h4>
                  <p className="text-xs text-slate-500">
                    เทคโนโลยีที่ทั่วโลกกำลังเปลี่ยนผ่านแทนบาร์โค้ดแท่งเดิมภายในปี 2027-2028 (บันทึกรหัสล็อต TLC และวันหมดอายุอัตโนมัติ)
                  </p>
                </div>
              </div>

              <select
                value={gs1SelectedId}
                onChange={(e) => setGs1SelectedId(e.target.value)}
                className="glass-input text-xs font-semibold max-w-xs"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-5">
              {/* QR Visualizer with Animated Laser Scan Line */}
              <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm relative overflow-hidden flex flex-col items-center">
                <div className="relative w-40 h-40 bg-slate-900 rounded-xl p-2 flex items-center justify-center shadow-md">
                  {/* Stylized QR Code Placeholder */}
                  <div className="w-full h-full border-2 border-dashed border-teal-400 rounded-lg flex flex-col items-center justify-center p-2 text-white">
                    <QrCode className="h-20 w-20 text-teal-300" />
                    <span className="text-[10px] font-mono text-teal-200 mt-1">GS1 2D DIGITAL LINK</span>
                  </div>
                  {/* Animated Laser Scanning Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-laserSweep shadow-teal-400 shadow-md pointer-events-none" />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 mt-3">
                  GTIN: {gs1Product.barcode}
                </span>
              </div>

              {/* Parsed Application Identifiers (AI) Breakdown */}
              <div className="md:col-span-8 space-y-3">
                <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200 text-xs font-mono break-all text-slate-700">
                  <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase mb-1">
                    GS1 Standard Digital Link Web URI:
                  </span>
                  <span className="text-teal-800 font-bold">{gs1Uri}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-teal-700 block">(01) GTIN รหัสสากล</span>
                    <span className="font-mono font-black text-slate-900 text-xs">{gs1Product.barcode}</span>
                  </div>

                  <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-teal-700 block">(10) Batch / Lot (TLC)</span>
                    <span className="font-mono font-black text-teal-900 text-xs">{gs1Product.traceabilityLotCode}</span>
                  </div>

                  <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-teal-700 block">(17) Expiry Date</span>
                    <span className="font-mono font-black text-slate-900 text-xs">{gs1Product.expDate}</span>
                  </div>

                  <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-teal-700 block">(21) Serial Number</span>
                    <span className="font-mono font-black text-slate-900 text-xs">SN98412</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    เมื่อสแกนด้วย ChoiceGuard ระบบจะแยกแยะข้อมูลทั้งหมดและบันทึกล็อตให้ทันที 0 manual input
                  </span>

                  <button
                    onClick={handleSimulateGS1Ingest}
                    className="glass-button glass-button-primary text-xs py-2.5 px-4 font-bold whitespace-nowrap bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1.5 shadow-sm"
                  >
                    {gs1IngestSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>นำเข้าระบบ &amp; บันทึกลงคลังสำเร็จ!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>ทดลองนำเข้าระบบทันที (Simulate Ingest)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Calculation Modal */}
      {showCustomModal && (
        <div className="glass-overlay">
          <div className="glass-modal-panel p-6 max-w-lg">
            <h4 className="font-extrabold text-lg text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <span>คำนวณ Choice Score อาหารจานโปรด / สตรีทฟู้ด</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              ทดสอบกรอกสารอาหารของเมนูตามสั่งเพื่อดูว่าเหมาะกับภาวะสุขภาพและโควตาวันนี้ของคุณหรือไม่
            </p>

            <form onSubmit={handleApplyCustomFood} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ชื่อเมนูอาหาร:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="glass-input text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">โซเดียม (มก.):</label>
                  <input
                    type="number"
                    value={customSodium}
                    onChange={(e) => setCustomSodium(Number(e.target.value))}
                    className="glass-input text-xs"
                    required
                  />
                  <span className="text-[10px] text-slate-400">เกณฑ์ WHO: ไม่เกิน 2,000 มก./วัน</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">น้ำตาล (กรัม):</label>
                  <input
                    type="number"
                    value={customSugar}
                    onChange={(e) => setCustomSugar(Number(e.target.value))}
                    className="glass-input text-xs"
                    required
                  />
                  <span className="text-[10px] text-slate-400">เกณฑ์ WHO: ไม่เกิน 24 กรัม/วัน</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ไขมันอิ่มตัว (กรัม):</label>
                  <input
                    type="number"
                    value={customSatFat}
                    onChange={(e) => setCustomSatFat(Number(e.target.value))}
                    className="glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">พลังงาน (kcal):</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(Number(e.target.value))}
                    className="glass-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="glass-button py-2 px-3 text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="glass-button glass-button-primary py-2 px-4 text-xs font-bold"
                >
                  คำนวณคะแนนทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEEP FEATURE MODAL 1: Interactive Meal Logger Sheet */}
      {isMealLoggerOpen && (
        <div className="glass-overlay">
          <div className="glass-modal-panel p-6 max-w-lg animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    บันทึกลงมื้ออาหาร (Log to Daily Diary)
                  </h3>
                  <p className="text-xs text-slate-500">
                    คำนวณสัดส่วนและหักลบโควตาประจำวันอัตโนมัติ
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playTactileTap();
                  setIsMealLoggerOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Selected Product Banner */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-slate-900 truncate">
                    {activeProduct.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {activeProduct.brand} • {activeProduct.nutrition.calories} kcal / เสิร์ฟ
                  </div>
                </div>
              </div>

              {/* Meal Period Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  เลือกมื้ออาหาร (Meal Period):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'breakfast', label: 'มื้อเช้า', icon: '🌅' },
                    { id: 'lunch', label: 'มื้อเที่ยง', icon: '☀️' },
                    { id: 'dinner', label: 'มื้อเย็น', icon: '🌙' },
                    { id: 'snack', label: 'ของว่าง', icon: '🍎' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playTactileTap();
                        setLogMealPeriod(m.id as MealPeriod);
                      }}
                      className={`bouncy-hover flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-bold transition ${
                        logMealPeriod === m.id
                          ? 'bg-teal-700 text-white border-teal-800 shadow-sm scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span className="mt-0.5 text-[11px]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Portion Multiplier Stepper */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  ขนาดบริโภค (Portion):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 1.0, 1.5, 2.0].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        playTactileTap();
                        setLogPortion(p);
                      }}
                      className={`bouncy-hover py-2 rounded-xl text-xs font-black border transition ${
                        logPortion === p
                          ? 'bg-teal-700 text-white border-teal-800 shadow-sm scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {p}x {p === 1.0 ? '(ปกติ)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Soup Broth Reduction Slider for noodle/soup */}
              {(activeProduct.category === 'instant_noodles' || activeProduct.category === 'prepared_food') && (
                <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-900 mb-1">
                    <span>ปริมาณน้ำซุปที่ซด (Broth Ingested):</span>
                    <span className="text-sm font-black text-teal-700">{logBrothPercent}%</span>
                  </div>
                  <p className="text-[10px] text-teal-800/80 mb-2">
                    น้ำซุปบะหมี่มีโซเดียมสะสม 60% ของซอง — ลดการซดน้ำเพื่อเซฟไตทันที
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={logBrothPercent}
                    onChange={(e) => {
                      playTactileTap();
                      setLogBrothPercent(Number(e.target.value));
                    }}
                    className="w-full"
                  />
                </div>
              )}

              {/* Live Nutrient Delta Preview */}
              {(() => {
                const brothFactor = activeProduct.category === 'instant_noodles' ? (0.4 + 0.6 * (logBrothPercent / 100)) : 1;
                const previewSodium = Math.round(activeProduct.nutrition.sodiumMg * logPortion * brothFactor);
                const previewCalories = Math.round(activeProduct.nutrition.calories * logPortion);
                const percentDay = Math.round((previewSodium / profile.dailyBudget.sodiumMg) * 100);

                return (
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-teal-400">สรุปโภชนาการที่จะบันทึก</span>
                      <div className="text-lg font-black text-white mt-0.5">
                        +{previewSodium.toLocaleString()} <span className="text-xs font-normal text-slate-300">มก. โซเดียม</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {previewCalories} kcal • คิดเป็น {percentDay}% ของงบรายวัน
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                        {profile.name}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playTactileTap();
                  setIsMealLoggerOpen(false);
                }}
                className="glass-button text-xs py-2 px-3.5 text-slate-600"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onLogMeal) {
                    onLogMeal(activeProduct, logMealPeriod, logPortion, logBrothPercent);
                  }
                  playSuccessChime();
                  triggerCelebrationConfetti();
                  setIsMealLoggerOpen(false);
                }}
                className="glass-button glass-button-primary bouncy-hover text-xs py-2.5 px-5 font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="h-4 w-4" />
                <span>ยืนยันบันทึกมื้อนี้</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEEP FEATURE MODAL 2: Food Additives & E-Number Safety Details Modal */}
      {selectedAdditiveModal && (
        <div className="glass-overlay">
          <div className="glass-modal-panel p-6 max-w-lg animate-slideUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-indigo-700 text-sm">
                      {selectedAdditiveModal.code}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedAdditiveModal.category}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 mt-0.5">
                    {selectedAdditiveModal.nameTh}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  playTactileTap();
                  setSelectedAdditiveModal(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed text-slate-700">
                <strong className="text-slate-900 block mb-1">ผลกระทบต่อสุขภาพและกลไก:</strong>
                {selectedAdditiveModal.safetySummaryTh}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                  <span className="text-[10px] text-teal-800 font-bold block">สถานะ อย. ไทย (Thai FDA):</span>
                  <span className="text-xs font-black text-teal-900">
                    {selectedAdditiveModal.fdaPermitted ? '✓ อนุญาตตามกฎหมายอาหาร' : '✗ ไม่อนุญาต'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-200">
                  <span className="text-[10px] text-cyan-800 font-bold block">เกณฑ์สากล Codex / JECFA:</span>
                  <span className="text-xs font-extrabold text-cyan-900 truncate block">
                    {selectedAdditiveModal.maxLimitCodex || 'GMP Standard'}
                  </span>
                </div>
              </div>

              {selectedAdditiveModal.sensitiveGroups.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
                  <div className="flex items-center gap-1.5 font-extrabold text-rose-900 mb-1">
                    <AlertOctagon className="h-4 w-4 text-rose-600" />
                    <span>กลุ่มผู้ป่วยที่ควรเฝ้าระวังเป็นพิเศษ:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-900/90 font-medium pl-1">
                    {selectedAdditiveModal.sensitiveGroups.map((group, idx) => (
                      <li key={idx}>{group}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  playTactileTap();
                  setSelectedAdditiveModal(null);
                }}
                className="glass-button glass-button-primary py-2 px-5 text-xs font-bold"
              >
                รับทราบข้อมูลความปลอดภัย
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

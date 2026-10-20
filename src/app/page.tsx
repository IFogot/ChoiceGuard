'use client';

import React, { useState } from 'react';
import { UserHealthProfile, FoodProduct, PantryItem, RecallNotice, MealLogItem, GroceryCartItem, MealPeriod } from '../types';
import { FOOD_PRODUCTS } from '../data/products';
import { RECALL_NOTICES } from '../data/recalls';
import { FAMILY_PROFILES } from '../data/familyProfiles';
import { Navbar } from '../components/Navbar';
import { DailyBudgetRing } from '../components/DailyBudgetRing';
import { ScannerSection } from '../components/ScannerSection';
import { SmartSwapSection } from '../components/SmartSwapSection';
import { PantryLotTracker } from '../components/PantryLotTracker';
import { ProducerDashboard } from '../components/ProducerDashboard';
import { NongChoiceChatDrawer } from '../components/NongChoiceChatDrawer';
import { HealthProfileModal } from '../components/HealthProfileModal';
import { RecallSimulatorModal } from '../components/RecallSimulatorModal';
import { ShieldCheck, Heart, Sparkles, Building, Award, Bell } from 'lucide-react';

export default function HomePage() {
  // 1. Initial State: Family Profiles (Caregiver Elderly Mode & Working Adult)
  const [familyProfiles, setFamilyProfiles] = useState<UserHealthProfile[]>(FAMILY_PROFILES);
  const [profile, setProfile] = useState<UserHealthProfile>(FAMILY_PROFILES[0]);

  // 2. Navigation & Modal States
  const [activeTab, setActiveTab] = useState<'scan' | 'swap' | 'pantry' | 'dashboard'>('scan');
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct>(FOOD_PRODUCTS[0]);
  const [targetSwapId, setTargetSwapId] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 3. Deep Feature: Daily Meal Diary & Nutrient Logging State
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>([
    {
      id: 'meal_init_1',
      mealType: 'breakfast',
      mealLabelTh: 'มื้อเช้า',
      productId: 'prod_egg_1',
      productName: 'ไข่ต้มสมุนไพร CP พร้อมทาน + ข้าวกล้อง',
      brand: 'ซีพี ซีเล็คชั่น',
      portion: 1,
      nutrition: {
        calories: 220,
        sodiumMg: 180,
        sugarG: 1,
        saturatedFatG: 2,
      },
      timestamp: '07:45 น.',
      healthierChoice: true,
      categoryLabel: 'อาหารพร้อมทาน',
    },
    {
      id: 'meal_init_2',
      mealType: 'snack',
      mealLabelTh: 'ของว่างสาย',
      productId: 'prod_bev_healthy_1',
      productName: 'นมถั่วเหลืองยูเอชที สูตรไม่เติมน้ำตาลทราย',
      brand: 'ดีน่า ไบโอ',
      portion: 1,
      nutrition: {
        calories: 90,
        sodiumMg: 65,
        sugarG: 1,
        saturatedFatG: 0.5,
      },
      timestamp: '10:15 น.',
      healthierChoice: true,
      categoryLabel: 'เครื่องดื่มเพื่อสุขภาพ',
    },
  ]);

  // 4. Deep Feature: Persistent Healthy Grocery Cart State
  const [groceryCart, setGroceryCart] = useState<GroceryCartItem[]>([
    {
      id: 'cart_init_1',
      product: FOOD_PRODUCTS.find((p) => p.id === 'prod_noodle_healthy_1') || FOOD_PRODUCTS[1],
      originalProduct: FOOD_PRODUCTS.find((p) => p.id === 'prod_noodle_regular_1') || FOOD_PRODUCTS[0],
      quantity: 2,
      sodiumSavedMg: 1580,
      sugarSavedG: 4,
      satFatSavedG: 8.4,
      checked: false,
      addedAt: 'วันนี้',
    },
    {
      id: 'cart_init_2',
      product: FOOD_PRODUCTS.find((p) => p.id === 'prod_sauce_healthy_1') || FOOD_PRODUCTS[3],
      originalProduct: FOOD_PRODUCTS.find((p) => p.id === 'prod_sauce_regular_1') || FOOD_PRODUCTS[2],
      quantity: 1,
      sodiumSavedMg: 880,
      sugarSavedG: 0,
      satFatSavedG: 0,
      checked: false,
      addedAt: 'วันนี้',
    },
  ]);

  // 5. Pantry & Food Recalls (Pre-loaded with sample items including active recalled lot)
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    {
      id: 'pantry_item_1',
      productId: 'prod_tuna_regular_1',
      product: FOOD_PRODUCTS.find((p) => p.id === 'prod_tuna_regular_1')!,
      purchasedDate: '2026-10-10',
      lotCode: 'LOT-2026-TNA-RECALL-01', // Active recall match!
      expiryDate: '2029-09-05',
      quantity: 2,
      recallStatus: 'recalled',
      activeRecallId: 'RECALL-TFDA-2026-001',
      confirmedHandled: false,
    },
    {
      id: 'pantry_item_2',
      productId: 'prod_sauce_healthy_1',
      product: FOOD_PRODUCTS.find((p) => p.id === 'prod_sauce_healthy_1')!,
      purchasedDate: '2026-10-12',
      lotCode: 'LOT-2026-GLS-0812',
      expiryDate: '2028-08-20',
      quantity: 1,
      recallStatus: 'safe',
    },
    {
      id: 'pantry_item_3',
      productId: 'prod_noodle_healthy_1',
      product: FOOD_PRODUCTS.find((p) => p.id === 'prod_noodle_healthy_1')!,
      purchasedDate: '2026-10-15',
      lotCode: 'LOT-2026-WTY-1082',
      expiryDate: '2027-03-01',
      quantity: 4,
      recallStatus: 'safe',
    },
  ]);

  // Active recall drill modal state
  const [activeRecallModal, setActiveRecallModal] = useState<{
    isOpen: boolean;
    recall: RecallNotice | null;
    pantryItem: PantryItem | null;
  }>({
    isOpen: false,
    recall: null,
    pantryItem: null,
  });

  const activeRecallCount = pantryItems.filter(
    (item) => item.recallStatus === 'recalled' && !item.confirmedHandled
  ).length;

  // Add product to pantry
  const handleAddToPantry = (product: FoodProduct) => {
    const newItem: PantryItem = {
      id: `pantry_${Date.now()}`,
      productId: product.id,
      product,
      purchasedDate: new Date().toISOString().split('T')[0],
      lotCode: product.traceabilityLotCode,
      expiryDate: product.expDate,
      quantity: 1,
      recallStatus: product.traceabilityLotCode.includes('RECALL') ? 'recalled' : 'safe',
      activeRecallId: product.traceabilityLotCode.includes('RECALL') ? 'RECALL-TFDA-2026-001' : undefined,
      confirmedHandled: false,
    };

    setPantryItems((prev) => [newItem, ...prev]);
    setActiveTab('pantry');
  };

  // Open Smart Swap from scanner
  const handleOpenSmartSwap = (swapId: string) => {
    setTargetSwapId(swapId);
    setActiveTab('swap');
  };

  // Apply swap savings to daily budget
  const handleApplySwapToConsumed = (orig: FoodProduct, swapped: FoodProduct) => {
    const sodiumDiff = Math.max(0, orig.nutrition.sodiumMg - swapped.nutrition.sodiumMg);
    const sugarDiff = Math.max(0, orig.nutrition.sugarG - swapped.nutrition.sugarG);
    const satFatDiff = Math.max(0, orig.nutrition.saturatedFatG - swapped.nutrition.saturatedFatG);

    setProfile((prev) => ({
      ...prev,
      dailyConsumed: {
        ...prev.dailyConsumed,
        sodiumMg: Math.max(0, prev.dailyConsumed.sodiumMg - sodiumDiff),
        sugarG: Math.max(0, prev.dailyConsumed.sugarG - sugarDiff),
        saturatedFatG: Math.max(0, prev.dailyConsumed.saturatedFatG - satFatDiff),
      },
    }));
  };

  // Handle adding meal to daily diary
  const handleAddMealLog = (
    product: FoodProduct,
    mealType: MealPeriod,
    portion: number,
    brothPercent: number = 100
  ) => {
    const brothFactor = product.category === 'instant_noodles' ? 0.4 + 0.6 * (brothPercent / 100) : 1;
    const addedSodium = Math.round(product.nutrition.sodiumMg * portion * brothFactor);
    const addedSugar = Math.round(product.nutrition.sugarG * portion);
    const addedSatFat = Math.round(product.nutrition.saturatedFatG * portion);
    const addedCalories = Math.round(product.nutrition.calories * portion);

    const mealLabels: Record<MealPeriod, string> = {
      breakfast: 'มื้อเช้า',
      lunch: 'มื้อเที่ยง',
      dinner: 'มื้อเย็น',
      snack: 'ของว่าง',
    };

    const newLog: MealLogItem = {
      id: `meal_${Date.now()}`,
      mealType,
      mealLabelTh: mealLabels[mealType],
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      portion,
      brothDrunkPercent: product.category === 'instant_noodles' ? brothPercent : undefined,
      nutrition: {
        calories: addedCalories,
        sodiumMg: addedSodium,
        sugarG: addedSugar,
        saturatedFatG: addedSatFat,
      },
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      healthierChoice: product.healthierChoiceCertified,
      categoryLabel: product.categoryLabel,
    };

    setMealLogs((prev) => [newLog, ...prev]);

    // Update real-time budget ring
    setProfile((prev) => ({
      ...prev,
      dailyConsumed: {
        sodiumMg: prev.dailyConsumed.sodiumMg + addedSodium,
        sugarG: prev.dailyConsumed.sugarG + addedSugar,
        saturatedFatG: prev.dailyConsumed.saturatedFatG + addedSatFat,
        caloriesKcal: (prev.dailyConsumed.caloriesKcal || 0) + addedCalories,
      },
    }));
  };

  // Handle removing meal from diary and restoring budget
  const handleRemoveMealLog = (id: string) => {
    const target = mealLogs.find((m) => m.id === id);
    if (!target) return;

    setMealLogs((prev) => prev.filter((m) => m.id !== id));

    setProfile((prev) => ({
      ...prev,
      dailyConsumed: {
        sodiumMg: Math.max(0, prev.dailyConsumed.sodiumMg - target.nutrition.sodiumMg),
        sugarG: Math.max(0, prev.dailyConsumed.sugarG - target.nutrition.sugarG),
        saturatedFatG: Math.max(0, prev.dailyConsumed.saturatedFatG - target.nutrition.saturatedFatG),
        caloriesKcal: Math.max(0, (prev.dailyConsumed.caloriesKcal || 0) - target.nutrition.calories),
      },
    }));
  };

  // Handle adding product to grocery cart
  const handleAddToGroceryCart = (swappedProduct: FoodProduct, originalProduct?: FoodProduct) => {
    const sodiumSaved = originalProduct ? Math.max(0, originalProduct.nutrition.sodiumMg - swappedProduct.nutrition.sodiumMg) : 0;
    const sugarSaved = originalProduct ? Math.max(0, originalProduct.nutrition.sugarG - swappedProduct.nutrition.sugarG) : 0;
    const satFatSaved = originalProduct ? Math.max(0, originalProduct.nutrition.saturatedFatG - swappedProduct.nutrition.saturatedFatG) : 0;

    const newItem: GroceryCartItem = {
      id: `cart_${Date.now()}`,
      product: swappedProduct,
      originalProduct,
      quantity: 1,
      sodiumSavedMg: sodiumSaved,
      sugarSavedG: sugarSaved,
      satFatSavedG: satFatSaved,
      checked: false,
      addedAt: 'เพิ่งเพิ่ม',
    };

    setGroceryCart((prev) => [newItem, ...prev]);
  };

  const handleToggleGroceryCartItem = (id: string) => {
    setGroceryCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleRemoveGroceryCartItem = (id: string) => {
    setGroceryCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Trigger recall drill simulation
  const handleTriggerSimulateRecall = (recallId: string) => {
    const recall = RECALL_NOTICES.find((r) => r.id === recallId) || RECALL_NOTICES[0];
    const item = pantryItems.find((p) => p.lotCode === recall.affectedLotCodes[0]) || pantryItems[0];
    setActiveRecallModal({
      isOpen: true,
      recall,
      pantryItem: item,
    });
  };

  // Confirm safe handling of recalled product
  const handleConfirmRecallHandled = (pantryItemId: string) => {
    setPantryItems((prev) =>
      prev.map((item) =>
        item.id === pantryItemId ? { ...item, confirmedHandled: true } : item
      )
    );
  };

  // Remove pantry item
  const handleRemovePantryItem = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Top Floating Liquid Glass Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeRecallCount={activeRecallCount}
      />

      {/* Main Container */}
      <main className="container-responsive flex-1">
        {/* Apple Watch-Style Concentric Daily Budget Rings, Family Profiles & Live Meal Diary */}
        <DailyBudgetRing
          profile={profile}
          familyProfiles={familyProfiles}
          mealLogs={mealLogs}
          onRemoveMealLog={handleRemoveMealLog}
          onSelectFamilyMember={(p) => setProfile(p)}
          onOpenProfileSettings={() => setIsProfileModalOpen(true)}
        />

        {/* Tab 1: Know & Scan (รู้ & สแกน) */}
        {activeTab === 'scan' && (
          <ScannerSection
            products={FOOD_PRODUCTS}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            profile={profile}
            onAddToPantry={handleAddToPantry}
            onOpenSmartSwap={handleOpenSmartSwap}
            onAskNongChoice={(prod) => {
              setSelectedProduct(prod);
              setIsChatOpen(true);
            }}
            onLogMeal={handleAddMealLog}
          />
        )}

        {/* Tab 2: Choose - Smart Swap (เลือก) */}
        {activeTab === 'swap' && (
          <SmartSwapSection
            products={FOOD_PRODUCTS}
            profile={profile}
            initialTargetSwapId={targetSwapId}
            groceryCart={groceryCart}
            onApplySwapToConsumed={handleApplySwapToConsumed}
            onAddToGroceryCart={handleAddToGroceryCart}
            onToggleCartItem={handleToggleGroceryCartItem}
            onRemoveCartItem={handleRemoveGroceryCartItem}
          />
        )}

        {/* Tab 3: Protect - Pantry & Lot Alert (ปลอดภัย) */}
        {activeTab === 'pantry' && (
          <PantryLotTracker
            pantryItems={pantryItems}
            recalls={RECALL_NOTICES}
            onTriggerSimulateRecall={handleTriggerSimulateRecall}
            onConfirmRecallHandled={handleConfirmRecallHandled}
            onRemoveItem={handleRemovePantryItem}
            onViewRecallDetails={(recall, item) => {
              setActiveRecallModal({
                isOpen: true,
                recall,
                pantryItem: item,
              });
            }}
          />
        )}

        {/* Tab 4: Producer & B2G Health Dashboard */}
        {activeTab === 'dashboard' && <ProducerDashboard />}
      </main>

      {/* Footer Public Health Attribution */}
      <footer className="container-responsive mt-12 pt-6 border-t border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ChoiceGuard Logo"
            width={24}
            height={24}
            style={{ width: '24px', height: '24px', maxWidth: '24px', maxHeight: '24px' }}
            className="h-6 w-6 rounded-full object-contain ring-1 ring-teal-500/30"
          />
          <div>
            <div>
              <strong>ChoiceGuard (ช้อยส์การ์ด)</strong> — ระบบปกป้องสุขภาพเชิงรุกตามเกณฑ์ อย. กระทรวงสาธารณสุข
            </div>
            <div className="text-[10px] text-slate-400">
              พัฒนาสำหรับคนไทยทุกคน • ข้อมูลโภชนาการอ้างอิงมาตรฐาน อย. &amp; FSMA 204 Traceability
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] text-slate-400 flex-wrap">
          <span className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            ✓ ตราทางเลือกสุขภาพ อย. (3,245+ รายการ)
          </span>
          <span>•</span>
          <span>FSMA 204 Rule</span>
          <span>•</span>
          <span>ประกาศกระทรวงสาธารณสุข ฉบับที่ 420</span>
        </div>
      </footer>

      {/* Modals & Floating Drawers */}
      <HealthProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={profile}
        onUpdateProfile={(newProfile) => {
          setProfile(newProfile);
          setIsProfileModalOpen(false);
        }}
      />

      <RecallSimulatorModal
        isOpen={activeRecallModal.isOpen}
        onClose={() => setActiveRecallModal({ isOpen: false, recall: null, pantryItem: null })}
        recall={activeRecallModal.recall}
        pantryItem={activeRecallModal.pantryItem}
        onConfirmHandled={handleConfirmRecallHandled}
      />

      <NongChoiceChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextProduct={selectedProduct}
        profile={profile}
      />
    </div>
  );
}


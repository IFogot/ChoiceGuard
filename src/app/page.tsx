'use client';

import React, { useState, useEffect } from 'react';
import { UserHealthProfile, FoodProduct, PantryItem, RecallNotice } from '../types';
import { FOOD_PRODUCTS } from '../data/products';
import { RECALL_NOTICES } from '../data/recalls';
import { Navbar } from '../components/Navbar';
import { DailyBudgetRing } from '../components/DailyBudgetRing';
import { ScannerSection } from '../components/ScannerSection';
import { SmartSwapSection } from '../components/SmartSwapSection';
import { PantryLotTracker } from '../components/PantryLotTracker';
import { ProducerDashboard } from '../components/ProducerDashboard';
import { NongChoiceChatDrawer } from '../components/NongChoiceChatDrawer';
import { HealthProfileModal } from '../components/HealthProfileModal';
import { SettingsModal } from '../components/SettingsModal';
import { RecallSimulatorModal } from '../components/RecallSimulatorModal';
import { ShieldCheck, Heart, Sparkles, Building, Award, Bell } from 'lucide-react';

export default function HomePage() {
  // 1. Initial State: Hypertension Profile (Aligned with Thai NCD Crisis & CDC 2023 Study)
  const [profile, setProfile] = useState<UserHealthProfile>({
    id: 'user_default',
    name: 'คุณสมชาย',
    condition: 'hypertension',
    dailyBudget: {
      sodiumMg: 1500, // Strict WHO/AHA guideline for hypertension
      sugarG: 24,
      saturatedFatG: 14,
      caloriesKcal: 2000,
    },
    dailyConsumed: {
      sodiumMg: 1180, // Currently at ~78% of budget
      sugarG: 12,
      saturatedFatG: 6,
      caloriesKcal: 1450,
    },
  });

  // 2. Navigation & Modal States
  const [activeTab, setActiveTab] = useState<'scan' | 'swap' | 'pantry' | 'dashboard'>('scan');
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct>(FOOD_PRODUCTS[0]);
  const [targetSwapId, setTargetSwapId] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 3. Groq API Key (Persisted in localStorage)
  const [groqApiKey, setGroqApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('choiceguard_groq_api_key');
    if (savedKey) setGroqApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setGroqApiKey(key);
    localStorage.setItem('choiceguard_groq_api_key', key);
  };

  // 4. Pantry & Food Recalls (Pre-loaded with sample items including recalled lot)
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
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeRecallCount={activeRecallCount}
      />

      {/* Main Container */}
      <main className="container-responsive flex-1">
        {/* Apple Watch-Style Concentric Daily Budget Rings */}
        <DailyBudgetRing profile={profile} />

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
          />
        )}

        {/* Tab 2: Choose - Smart Swap (เลือก) */}
        {activeTab === 'swap' && (
          <SmartSwapSection
            products={FOOD_PRODUCTS}
            profile={profile}
            initialTargetSwapId={targetSwapId}
            onApplySwapToConsumed={handleApplySwapToConsumed}
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

      {/* Footer Credentials & Public Health Attribution */}
      <footer className="container-responsive mt-12 pt-6 border-t border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>
            <strong>ChoiceGuard (ช้อยส์การ์ด)</strong> — WELLNEXT Future Pitching (อย. กระทรวงสาธารณสุข)
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>อย. ตราทางเลือกสุขภาพ (3,245+ รายการ)</span>
          <span>•</span>
          <span>FSMA 204 Traceability</span>
          <span>•</span>
          <span>สธ. ประกาศฉบับที่ 420</span>
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

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        apiKey={groqApiKey}
        onSaveApiKey={handleSaveApiKey}
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
        apiKey={groqApiKey}
        onOpenSettings={() => {
          setIsChatOpen(false);
          setIsSettingsModalOpen(true);
        }}
        contextProduct={selectedProduct}
      />
    </div>
  );
}

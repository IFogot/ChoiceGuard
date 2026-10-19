'use client';

import React, { useState, useEffect } from 'react';
import { UserHealthProfile, FoodProduct, PantryItem, RecallNotice } from '../types';
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
import { PitchDeckBmcModal } from '../components/PitchDeckBmcModal';
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
  const [isBmcModalOpen, setIsBmcModalOpen] = useState(false);

  // 3. Pantry & Food Recalls (Pre-loaded with sample items including recalled lot)
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
        onOpenBmcModal={() => setIsBmcModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeRecallCount={activeRecallCount}
      />

      {/* Main Container */}
      <main className="container-responsive flex-1">
        {/* Apple Watch-Style Concentric Daily Budget Rings & Family Profile Switcher */}
        <DailyBudgetRing
          profile={profile}
          familyProfiles={familyProfiles}
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
              <strong>ChoiceGuard (ช้อยส์การ์ด)</strong> — WELLNEXT Future Pitching (อย. กระทรวงสาธารณสุข)
            </div>
            <div className="text-[10px] text-slate-400">
              นำเสนอโดย ทีม BIG4 • โรงเรียนอัสสัมชัญสมุทรปราการ (Assumption College Samutprakarn)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] text-slate-400 flex-wrap">
          <button
            onClick={() => setIsBmcModalOpen(true)}
            className="text-teal-700 font-bold hover:underline bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
          >
            📋 Business Model Canvas &amp; SDGs
          </button>
          <span>•</span>
          <span>อย. ตราทางเลือกสุขภาพ (3,245+ รายการ)</span>
          <span>•</span>
          <span>FSMA 204</span>
          <span>•</span>
          <span>สธ. ประกาศฉบับที่ 420</span>
        </div>
      </footer>

      {/* Modals & Floating Drawers */}
      <PitchDeckBmcModal
        isOpen={isBmcModalOpen}
        onClose={() => setIsBmcModalOpen(false)}
      />

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

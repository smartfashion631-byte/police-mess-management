import React, { useState } from 'react';
import {
  Calculator,
  X,
  Sparkles,
  TrendingUp,
  Wallet,
  UtensilsCrossed,
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  DollarSign,
  Receipt,
  FileText,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber, formatTaka } from '../utils/bengaliUtils';

interface MessCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserId?: string;
}

export const MessCalculatorModal: React.FC<MessCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultUserId,
}) => {
  const { users, marketExpenses, advanceDeposits, mealRecords, settings } = useMess();

  // Mode: 'auto' (pulls live mess data) or 'custom' (interactive simulation)
  const [calcMode, setCalcMode] = useState<'auto' | 'custom'>('auto');

  // Auto mode member selector
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    defaultUserId || users[0]?.id || 'user-1'
  );

  // Custom simulation inputs
  const liveTotalBazar = marketExpenses.reduce((sum, e) => sum + e.amount, 0) || 15500;
  const liveTotalMessMeals = 310; // estimated active mess meals for month

  const [simTotalBazar, setSimTotalBazar] = useState<number>(liveTotalBazar);
  const [simTotalMessMeals, setSimTotalMessMeals] = useState<number>(liveTotalMessMeals);
  const [simMemberMeals, setSimMemberMeals] = useState<number>(42.5);
  const [simMemberDeposit, setSimMemberDeposit] = useState<number>(3000);
  const [simUtilityFee, setSimUtilityFee] = useState<number>(0);

  if (!isOpen) return null;

  // AUTO CALCULATION LOGIC:
  const selectedMember = users.find((u) => u.id === selectedMemberId) || users[0];

  // Total Bazar from expenses
  const autoTotalBazar = marketExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Total meals calculation:
  // Calculate total units from meal records or default active benchmark
  const recordUnits = mealRecords.reduce((sum, r) => sum + (r.totalUnits || 0), 0);
  const autoTotalMessMeals = Math.max(recordUnits, 310);

  // Live Auto Meal Rate
  const autoMealRate = autoTotalMessMeals > 0 ? autoTotalBazar / autoTotalMessMeals : settings.mealRate;

  // Member's meals
  const memberRecords = mealRecords.filter((r) => r.userId === selectedMember?.id);
  const memberMealUnits = memberRecords.length > 0
    ? memberRecords.reduce((sum, r) => sum + (r.totalUnits || 0), 0)
    : (selectedMember?.id === 'user-1' ? 42.5 : 40.0);

  // Member total deposits
  const memberDeposits = advanceDeposits
    .filter((d) => d.userId === selectedMember?.id && d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const memberTotalDeposit = memberDeposits > 0 ? memberDeposits : (selectedMember?.balance || 3000);

  // Member food cost
  const memberFoodCost = memberMealUnits * autoMealRate;
  // Net Balance
  const memberNetBalance = memberTotalDeposit - memberFoodCost;

  // CUSTOM SIMULATION LOGIC:
  const customMealRate = simTotalMessMeals > 0 ? simTotalBazar / simTotalMessMeals : 0;
  const customMemberFoodCost = simMemberMeals * customMealRate + simUtilityFee;
  const customNetBalance = simMemberDeposit - customMemberFoodCost;

  const currentRate = calcMode === 'auto' ? autoMealRate : customMealRate;
  const currentCost = calcMode === 'auto' ? memberFoodCost : customMemberFoodCost;
  const currentDeposit = calcMode === 'auto' ? memberTotalDeposit : simMemberDeposit;
  const currentBalance = calcMode === 'auto' ? memberNetBalance : customNetBalance;

  const handleResetCustom = () => {
    setSimTotalBazar(liveTotalBazar);
    setSimTotalMessMeals(liveTotalMessMeals);
    setSimMemberMeals(42.5);
    setSimMemberDeposit(3000);
    setSimUtilityFee(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#dce9ff] w-full max-w-2xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131b2e] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400 shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">স্বয়ংক্রিয় ম্যাস হিসাব ক্যালকুলেটর</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  অটো অডিট
                </span>
              </div>
              <p className="text-xs text-slate-300">
                বাজার খরচ ও মিল সংখ্যার ভিত্তিতে নির্ভুল রিয়েল-টাইম হিসাব
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4 pb-2 bg-[#f8f9ff] border-b border-[#eff4ff] flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setCalcMode('auto')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              calcMode === 'auto'
                ? 'bg-[#131b2e] text-white shadow-sm'
                : 'bg-white text-[#45464d] border border-[#dce9ff] hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>লাইভ ডেটা অটো হিসাব (Auto Mode)</span>
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('custom')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              calcMode === 'custom'
                ? 'bg-[#131b2e] text-white shadow-sm'
                : 'bg-white text-[#45464d] border border-[#dce9ff] hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-blue-500" />
            <span>কাস্টম হিসাব সিমুলেটর (Simulator)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {calcMode === 'auto' ? (
            /* AUTO LIVE MODE */
            <div className="space-y-4">
              {/* Member Selection */}
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#dce9ff]">
                <label className="block text-xs font-bold text-[#131b2e] mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#131b2e]" />
                  সদস্য নির্বাচন করুন (সদস্যের অটো হিসাব দেখতে)
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-sm text-[#0b1c30] font-bold focus:ring-2 focus:ring-[#131b2e] focus:outline-none cursor-pointer"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.rank} {u.name} (বিপি: {u.bpNumber || u.badgeNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Mess Formula Factors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-[#dce9ff] shadow-2xs">
                  <span className="text-[11px] font-medium text-[#76777d] block">চলতি মাসের বাজার খরচ</span>
                  <p className="text-lg font-bold text-[#0b1c30] mt-0.5">{formatTaka(autoTotalBazar)}</p>
                  <span className="text-[10px] text-slate-500">মোট রেকর্ডকৃত খরচ</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#dce9ff] shadow-2xs">
                  <span className="text-[11px] font-medium text-[#76777d] block">মেসের সর্বমোট মিল</span>
                  <p className="text-lg font-bold text-[#131b2e] mt-0.5">{toBengaliNumber(autoTotalMessMeals.toFixed(1))} টি</p>
                  <span className="text-[10px] text-slate-500">সকল সদস্যের মিল</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#dce9ff] shadow-2xs col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-medium text-[#76777d] block">সদস্যের মোট মিল</span>
                  <p className="text-lg font-bold text-amber-600 mt-0.5">{toBengaliNumber(memberMealUnits.toFixed(1))} ইউনিট</p>
                  <span className="text-[10px] text-slate-500">গৃহীত মিল ইউনিট</span>
                </div>
              </div>
            </div>
          ) : (
            /* CUSTOM SIMULATION MODE */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#45464d]">
                  ইনপুট পরিবর্তন করে তাৎক্ষণিক ফলাফল দেখুন:
                </span>
                <button
                  type="button"
                  onClick={handleResetCustom}
                  className="text-xs font-bold text-[#131b2e] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  রিসেট করুন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    মোট বাজার খরচ (৳)
                  </label>
                  <input
                    type="number"
                    value={simTotalBazar}
                    onChange={(e) => setSimTotalBazar(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] font-bold focus:ring-2 focus:ring-[#131b2e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    মেসে খাওয়া মোট মিল সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={simTotalMessMeals}
                    onChange={(e) => setSimTotalMessMeals(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] font-bold focus:ring-2 focus:ring-[#131b2e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    নির্দিষ্ট সদস্যের মিল সংখ্যা
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={simMemberMeals}
                    onChange={(e) => setSimMemberMeals(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] font-bold focus:ring-2 focus:ring-[#131b2e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    সদস্যের দেওয়া অগ্রিম জমা (৳)
                  </label>
                  <input
                    type="number"
                    value={simMemberDeposit}
                    onChange={(e) => setSimMemberDeposit(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] font-bold focus:ring-2 focus:ring-[#131b2e] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MAIN CALCULATION RESULT CARD */}
          <div className="bg-linear-to-br from-[#131b2e] to-[#0b1c30] text-white rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4" />
                হিসাবের ফলাফল সারসংক্ষেপ
              </span>
              <span className="text-xs text-slate-300">
                {calcMode === 'auto' ? `সদস্য: ${selectedMember?.name}` : 'সিমুলেশন ফলাফল'}
              </span>
            </div>

            {/* Calculated Rate Spotlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <span className="text-xs text-slate-300 font-medium block">
                  প্রতি মিল রেট (Meal Rate)
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                  ৳ {currentRate.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-300">/মিল</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  মোট বাজার খরচ ÷ মোট মিল
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <span className="text-xs text-slate-300 font-medium block">
                  সদস্যের খাবার বাবদ খরচ
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  ৳ {Math.round(currentCost).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {calcMode === 'auto' ? memberMealUnits.toFixed(1) : simMemberMeals} মিল × ৳ {currentRate.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Final Balance Outcome Banner */}
            <div
              className={`rounded-xl p-4 border flex items-center justify-between ${
                currentBalance >= 0
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-500/20 border-red-500/40 text-red-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">
                  {currentBalance >= 0
                    ? '✅ ফেরত পাবে / অবশিষ্ট জমা ব্যালেন্স (Refund/Balance)'
                    : '⚠️ মেসে বকেয়া পরিশোধ করতে হবে (Due/Payable)'}
                </span>
                <p className="text-2xl font-black mt-0.5">
                  ৳ {Math.abs(Math.round(currentBalance)).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-300 block">মোট জমা ছিল:</span>
                <span className="font-bold text-white text-sm">
                  ৳ {currentDeposit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Step-by-Step Mathematical Explanation */}
            <div className="bg-black/30 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5 font-mono">
              <p className="text-[11px] text-amber-300 font-bold uppercase font-sans">
                গাণিতিক সূত্র ও কার্যপদ্ধতি (Audit Formula):
              </p>
              <p>
                ১. মিল রেট = ৳ {(calcMode === 'auto' ? autoTotalBazar : simTotalBazar).toLocaleString('en-IN')} ÷{' '}
                {(calcMode === 'auto' ? autoTotalMessMeals : simTotalMessMeals).toFixed(1)} মিল = ৳ {currentRate.toFixed(2)}
              </p>
              <p>
                ২. সদস্যের খরচ = {(calcMode === 'auto' ? memberMealUnits : simMemberMeals).toFixed(1)} মিল × ৳{' '}
                {currentRate.toFixed(2)} = ৳ {Math.round(currentCost).toLocaleString('en-IN')}
              </p>
              <p>
                ৩. ব্যালেন্স = ৳ {currentDeposit.toLocaleString('en-IN')} (জমা) - ৳{' '}
                {Math.round(currentCost).toLocaleString('en-IN')} (খরচ) ={' '}
                <strong className={currentBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  ৳ {Math.round(currentBalance).toLocaleString('en-IN')}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#eff4ff] flex justify-between items-center shrink-0">
          <p className="text-xs text-[#76777d]">
            * বাংলাদেশ পুলিশ ম্যাস স্ট্যান্ডার্ড নীতিমালা অনুযায়ী গণনাকৃত
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#131b2e] hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};

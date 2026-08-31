import React, { useState } from 'react';
import {
  Users,
  UtensilsCrossed,
  ShoppingCart,
  Wallet,
  Plus,
  CheckCircle2,
  XCircle,
  Pencil,
  Check,
  Sparkles,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber, formatTaka } from '../utils/bengaliUtils';
import { MealEntryModal } from './MealEntryModal';
import { MealRecord } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    totalMembersCount,
    todayMealsCount,
    todayMarketCost,
    currentFundAmount,
    mealRecords,
    toggleMeal,
    addMarketExpense,
    advanceDeposits,
    approveDeposit,
    setActiveTab,
  } = useMess();

  // Form states for Market Expense Entry
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseSuccessMsg, setExpenseSuccessMsg] = useState(false);

  // Meal Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealRecord | null>(null);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !amount) return;

    const numAmount = parseFloat(amount) || 0;
    addMarketExpense({
      itemName,
      quantity: quantity || '১ টি',
      amount: numAmount,
    });

    setItemName('');
    setQuantity('');
    setAmount('');
    setExpenseSuccessMsg(true);
    setTimeout(() => setExpenseSuccessMsg(false), 2500);
  };

  const handleOpenEditModal = (meal: MealRecord) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Mobile Title */}
      <div className="md:hidden flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0b1c30]">ড্যাশবোর্ড</h2>
        <span className="text-xs bg-[#6cf8bb] text-[#002113] font-semibold px-2.5 py-1 rounded-full">
          লাইভ আপডেট
        </span>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">মোট সদস্য</span>
            <div className="p-2.5 bg-[#eff4ff] rounded-xl text-[#131b2e]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">
              {toBengaliNumber(totalMembersCount)}{' '}
              <span className="text-base font-normal text-[#45464d]">জন</span>
            </h3>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">আজকের মিল</span>
            <div className="p-2.5 bg-[#6cf8bb]/30 rounded-xl text-[#006c49]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">
              {toBengaliNumber(todayMealsCount)}{' '}
              <span className="text-base font-normal text-[#45464d]">টি</span>
            </h3>
          </div>
        </div>

        {/* Today's Market Cost */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">আজকের বাজার খরচ</span>
            <div className="p-2.5 bg-[#ffdad6]/60 rounded-xl text-[#ba1a1a]">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">
              {formatTaka(todayMarketCost || 15500)}
            </h3>
          </div>
        </div>

        {/* Current Fund */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">বর্তমান তহবিল</span>
            <div className="p-2.5 bg-[#6cf8bb] rounded-xl text-[#002113]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">
              {formatTaka(currentFundAmount)}
            </h3>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Meal Log (Takes 2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#c6c6cd]/30 flex justify-between items-center bg-[#eff4ff]/80">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">দৈনিক মিলের হিসাব</h3>
              <p className="text-xs text-[#76777d]">ক্লিক করে মিল স্ট্যাটাস পরিবর্তন করুন</p>
            </div>
            <button
              type="button"
              id="admin-add-meal-button"
              onClick={() => {
                setEditingMeal(null);
                setIsModalOpen(true);
              }}
              className="bg-black text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#213145] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>মিল এন্ট্রি</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-[#d3e4fe]/40 text-[#45464d] text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4 border-b border-[#c6c6cd]/30">সদস্যের নাম</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30">পদবি</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30 text-center">সকাল</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30 text-center">দুপুর</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30 text-center">রাত</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]/20">
                {mealRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-[#eff4ff]/60 transition-colors ${
                      index % 2 === 1 ? 'bg-[#f8f9ff]/50' : ''
                    }`}
                  >
                    <td className="p-4 text-sm font-semibold text-[#0b1c30]">
                      {record.userName}
                    </td>
                    <td className="p-4 text-xs font-medium text-[#45464d]">
                      {record.userRank}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleMeal(record.userId, 'breakfast', record.date)}
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-transform active:scale-90 cursor-pointer"
                        title="সকালের মিল টগল করুন"
                      >
                        {record.breakfast ? (
                          <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#76777d]/70" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleMeal(record.userId, 'lunch', record.date)}
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-transform active:scale-90 cursor-pointer"
                        title="দুপুরের মিল টগল করুন"
                      >
                        {record.lunch ? (
                          <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#76777d]/70" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleMeal(record.userId, 'dinner', record.date)}
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-transform active:scale-90 cursor-pointer"
                        title="রাতের মিল টগল করুন"
                      >
                        {record.dinner ? (
                          <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#76777d]/70" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(record)}
                        className="p-1.5 text-[#45464d] hover:text-black hover:bg-[#dce9ff] rounded-lg transition-colors cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Market Expense & Advance */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Market Expense Entry */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 flex flex-col">
            <h3 className="text-base font-bold text-[#0b1c30] mb-3">
              বাজার খরচ এন্ট্রি
            </h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-3 flex-1">
              <div>
                <label className="block text-xs font-semibold text-[#45464d] mb-1">
                  আইটেমের নাম
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="যেমন: চাল, ডাল, সবজি"
                  required
                  className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#45464d] mb-1">
                    পরিমাণ
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="কেজি/লিটার"
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#45464d] mb-1">
                    মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              </div>

              {expenseSuccessMsg && (
                <div className="p-2 rounded-lg bg-[#6cf8bb]/30 text-[#006c49] text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>বাজার খরচ সফলভাবে যুক্ত হয়েছে!</span>
                </div>
              )}

              <button
                type="submit"
                id="add-expense-button"
                className="w-full bg-[#131b2e] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-black active:scale-[0.98] transition-all cursor-pointer shadow-xs mt-2"
              >
                যোগ করুন
              </button>
            </form>
          </div>

          {/* Member Advance Deposits */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-[#0b1c30]">
                সদস্য অগ্রিম জমা
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('expenses')}
                className="text-xs font-bold text-black hover:underline cursor-pointer"
              >
                সব দেখুন
              </button>
            </div>

            <div className="space-y-2.5">
              {advanceDeposits.slice(0, 3).map((dep) => (
                <div
                  key={dep.id}
                  className="flex justify-between items-center p-3 border border-[#c6c6cd]/25 rounded-xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        dep.userName.startsWith('র')
                          ? 'bg-[#6cf8bb] text-[#002113]'
                          : dep.userName.startsWith('ক')
                          ? 'bg-[#ffddb8] text-[#2a1700]'
                          : 'bg-[#dce9ff] text-[#131b2e]'
                      }`}
                    >
                      {dep.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0b1c30]">{dep.userName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dep.status === 'approved' ? 'bg-[#006c49]' : 'bg-[#b87500]'
                          }`}
                        />
                        <span
                          className={`text-[11px] font-medium ${
                            dep.status === 'approved'
                              ? 'text-[#006c49]'
                              : 'text-[#b87500]'
                          }`}
                        >
                          {dep.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমান'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                      {formatTaka(dep.amount)}
                    </span>
                    {dep.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => approveDeposit(dep.id)}
                        className="px-2 py-1 bg-[#6cf8bb] text-[#002113] hover:bg-[#4edea3] rounded-md text-[10px] font-bold transition-all"
                        title="অনুমোদন করুন"
                      >
                        অনুমোদন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meal Modal */}
      <MealEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        initialMeal={editingMeal}
      />
    </div>
  );
};

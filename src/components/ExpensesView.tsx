import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Calculator,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber, formatTaka } from '../utils/bengaliUtils';
import { DepositModal } from './DepositModal';
import { MessCalculatorModal } from './MessCalculatorModal';

export const ExpensesView: React.FC = () => {
  const {
    marketExpenses,
    addMarketExpense,
    deleteMarketExpense,
    advanceDeposits,
    approveDeposit,
    currentRole,
    settings,
  } = useMess();

  const [activeSubTab, setActiveSubTab] = useState<'bazaar' | 'deposits'>('bazaar');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // New expense form
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'staple' | 'meat_fish' | 'vegetable' | 'spices' | 'utilities'>('staple');

  const totalBazaar = marketExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalApprovedDeposits = advanceDeposits
    .filter((d) => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);
  const totalPendingDeposits = advanceDeposits
    .filter((d) => d.status === 'pending')
    .reduce((sum, d) => sum + d.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !amount) return;

    addMarketExpense({
      itemName,
      quantity: quantity || '১ কেজি',
      amount: parseFloat(amount) || 0,
      category,
    });

    setItemName('');
    setQuantity('');
    setAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">খরচ ও হিসাব</h2>
          <p className="text-sm text-[#45464d]">
            দৈনিক বাজার খরচ, মিল রেট অটো-ক্যালকুলেশন এবং অগ্রিম জমা খতিয়ান
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCalculatorOpen(true)}
            className="bg-white hover:bg-slate-50 border border-[#c6c6cd] text-[#131b2e] text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>অটো হিসাব ক্যালকুলেটর</span>
          </button>

          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={() => setIsDepositModalOpen(true)}
              className="bg-[#131b2e] hover:bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>সদস্যের জমা এন্ট্রি দিন</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Bazaar */}
        <div className="bg-white rounded-2xl p-5 border border-[#c6c6cd]/30 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">চলতি মাসের বাজার খরচ</span>
            <div className="p-2 bg-[#ffdad6]/60 rounded-xl text-[#ba1a1a]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
              {formatTaka(totalBazaar)}
            </h3>
            <p className="text-xs text-[#76777d] mt-1">মোট এন্ট্রি: {toBengaliNumber(marketExpenses.length)} টি</p>
          </div>
        </div>

        {/* Calculated Meal Rate */}
        <div className="bg-white rounded-2xl p-5 border border-[#c6c6cd]/30 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">নির্ধারিত মিল রেট</span>
            <div className="p-2 bg-[#dce9ff] rounded-xl text-[#131b2e]">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#006c49]">
              {formatTaka(settings.mealRate)} <span className="text-xs font-normal text-[#45464d]">/ইউনিট</span>
            </h3>
            <p className="text-xs text-[#76777d] mt-1">স্বয়ংক্রিয় হিসাব অনুযায়ী</p>
          </div>
        </div>

        {/* Advance Deposits Total */}
        <div className="bg-white rounded-2xl p-5 border border-[#c6c6cd]/30 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-[#45464d]">মোট সংগৃহীত তহবিল</span>
            <div className="p-2 bg-[#6cf8bb] rounded-xl text-[#002113]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
              {formatTaka(totalApprovedDeposits)}
            </h3>
            <p className="text-xs text-[#b87500] mt-1">
              অপেক্ষমান: {formatTaka(totalPendingDeposits)}
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#c6c6cd]/30 pb-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('bazaar')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'bazaar'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
        >
          বাজার খরচের তালিকা
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('deposits')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'deposits'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
        >
          সদস্যদের অগ্রিম জমা খতিয়ান
        </button>
      </div>

      {activeSubTab === 'bazaar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 overflow-hidden">
            <div className="p-4 border-b border-[#c6c6cd]/30 bg-[#eff4ff]/80 flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0b1c30]">বাজার খরচের বিবরণী</h3>
              <span className="text-xs text-[#76777d]">
                সর্বমোট: {formatTaka(totalBazaar)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#d3e4fe]/40 text-[#45464d] text-xs font-semibold uppercase">
                    <th className="p-4 border-b border-[#c6c6cd]/30">আইটেম</th>
                    <th className="p-4 border-b border-[#c6c6cd]/30">পরিমাণ</th>
                    <th className="p-4 border-b border-[#c6c6cd]/30">বাজারকারী</th>
                    <th className="p-4 border-b border-[#c6c6cd]/30 text-right">মূল্য (৳)</th>
                    {currentRole === 'admin' && (
                      <th className="p-4 border-b border-[#c6c6cd]/30 text-center">অ্যাকশন</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd]/20">
                  {marketExpenses.map((item) => (
                    <tr key={item.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-semibold text-[#0b1c30]">{item.itemName}</p>
                        <span className="text-[11px] text-[#76777d]">{item.time || item.date}</span>
                      </td>
                      <td className="p-4 text-xs font-medium text-[#45464d]">{item.quantity}</td>
                      <td className="p-4 text-xs text-[#45464d]">{item.purchasedBy}</td>
                      <td className="p-4 text-right text-sm font-bold text-[#0b1c30]">
                        {formatTaka(item.amount)}
                      </td>
                      {currentRole === 'admin' && (
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => deleteMarketExpense(item.id)}
                            className="p-1 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Market Item Form */}
          {currentRole === 'admin' && (
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 p-5 h-fit">
              <h3 className="text-base font-bold text-[#0b1c30] mb-3">নতুন বাজার খরচ যোগ করুন</h3>
              <form onSubmit={handleAddExpense} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#45464d] mb-1">
                    আইটেমের নাম
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="যেমন: মাছ, মুরগি, আলু"
                    required
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
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
                      placeholder="যেমন: ৫ কেজি"
                      className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
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
                      className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#131b2e] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-black transition-all cursor-pointer shadow-xs mt-2"
                >
                  বাজার এন্ট্রি সংরক্ষণ
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* Deposits Table */
        <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 overflow-hidden">
          <div className="p-4 border-b border-[#c6c6cd]/30 bg-[#eff4ff]/80 flex justify-between items-center">
            <h3 className="text-base font-bold text-[#0b1c30]">সদস্যদের জমা রেকর্ড</h3>
            <span className="text-xs text-[#006c49] font-bold">
              অনুমোদিত মোট: {formatTaka(totalApprovedDeposits)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#d3e4fe]/40 text-[#45464d] text-xs font-semibold uppercase">
                  <th className="p-4 border-b border-[#c6c6cd]/30">সদস্যের নাম</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30">পদবি</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30">তারিখ</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30">পেমেন্ট মেথড</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30">পরিমাণ (৳)</th>
                  <th className="p-4 border-b border-[#c6c6cd]/30 text-center">স্ট্যাটাস</th>
                  {currentRole === 'admin' && (
                    <th className="p-4 border-b border-[#c6c6cd]/30 text-right">অ্যাকশন</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]/20">
                {advanceDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                    <td className="p-4 text-sm font-semibold text-[#0b1c30]">{dep.userName}</td>
                    <td className="p-4 text-xs font-medium text-[#45464d]">{dep.userRank}</td>
                    <td className="p-4 text-xs text-[#76777d]">{dep.date}</td>
                    <td className="p-4 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] border border-[#c6c6cd]/50 font-semibold text-[#131b2e]">
                        {dep.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0b1c30]">{formatTaka(dep.amount)}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          dep.status === 'approved'
                            ? 'bg-[#6cf8bb]/30 text-[#006c49] border border-[#6cf8bb]'
                            : 'bg-[#ffddb8] text-[#653e00] border border-[#ffb95f]'
                        }`}
                      >
                        {dep.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমান'}
                      </span>
                    </td>
                    {currentRole === 'admin' && (
                      <td className="p-4 text-right">
                        {dep.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => approveDeposit(dep.id)}
                            className="px-3 py-1 bg-[#6cf8bb] text-[#002113] hover:bg-[#4edea3] rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            অনুমোদন দিন
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />

      <MessCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

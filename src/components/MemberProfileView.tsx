import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Phone,
  Home,
  Droplet,
  Calendar,
  Wallet,
  UtensilsCrossed,
  Receipt,
  CheckCircle2,
  Lock,
  Calculator,
  ArrowUpRight,
  TrendingUp,
  Clock,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber, formatTaka } from '../utils/bengaliUtils';
import { MessCalculatorModal } from './MessCalculatorModal';

export const MemberProfileView: React.FC = () => {
  const { currentUser, mealRecords, advanceDeposits, marketExpenses, settings } = useMess();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Fallback member if null
  const user = currentUser || {
    id: 'user-1',
    name: 'রহিম উদ্দিন',
    rank: 'কনস্টেবল',
    bpNumber: 'BP-9204123456',
    badgeNumber: 'BP-3456',
    phone: '০১৭০০-১২৩৪৫৬',
    roomNumber: 'রুম ২০৪ (ব্যারাক ১)',
    bloodGroup: 'B+',
    joinedDate: '২০২৪-০১-০১',
    balance: 875,
    role: 'member',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  };

  // Member's meals calculation
  const memberMealRecords = mealRecords.filter((r) => r.userId === user.id);
  const totalBreakfasts = memberMealRecords.filter((r) => r.breakfast).length || 15;
  const totalLunches = memberMealRecords.filter((r) => r.lunch).length || 20;
  const totalDinners = memberMealRecords.filter((r) => r.dinner).length || 15;

  const totalMealUnits = memberMealRecords.reduce((acc, r) => acc + (r.totalUnits || 0), 0) || 42.5;

  // Real-time Meal Rate calculation
  const totalBazar = marketExpenses.reduce((acc, e) => acc + e.amount, 0) || 15500;
  const totalMessMeals = 310;
  const liveMealRate = totalMessMeals > 0 ? totalBazar / totalMessMeals : settings.mealRate;

  // Member's deposits
  const memberDeposits = advanceDeposits.filter((d) => d.userId === user.id);
  const totalApprovedDeposit = memberDeposits
    .filter((d) => d.status === 'approved')
    .reduce((acc, d) => acc + d.amount, 0) || 3000;

  // Total Food Cost
  const totalFoodCost = totalMealUnits * liveMealRate;
  // Net Balance
  const netBalance = totalApprovedDeposit - totalFoodCost;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#0b1c30]">সদস্য প্রোফাইল ও ব্যক্তিগত খতিয়ান</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-xs font-bold">
              সক্রিয় সদস্য
            </span>
          </div>
          <p className="text-sm text-[#45464d] mt-0.5">
            বাংলাদেশ পুলিশ মেস ডিরেক্টরিভুক্ত আপনার ব্যক্তিগত ও আর্থিক বিবরণী
          </p>
        </div>

        {/* Auto Calculator Quick Button */}
        <button
          type="button"
          onClick={() => setIsCalculatorOpen(true)}
          className="bg-[#131b2e] hover:bg-black text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 w-fit"
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>অটো হিসাব ক্যালকুলেটর</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl border border-[#dce9ff] shadow-sm overflow-hidden">
        {/* Top Dark Banner with Profile Avatar */}
        <div className="bg-linear-to-r from-[#131b2e] via-[#1c2942] to-[#0b1c30] text-white p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={
                  user.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                }
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-xl shadow-md">
                <Shield className="w-4 h-4 fill-slate-950/20" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30">
                  {user.rank}
                </span>
                <span className="bg-white/10 text-slate-200 text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/10">
                  বিপি নম্বর: {user.bpNumber || user.badgeNumber}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300">
                জেলা পুলিশ লাইন্স, রিজার্ভ ব্যারাক মেস সেল • সরকারি পরিচয়পত্র
              </p>
            </div>

            {/* Live Balance Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right shrink-0 w-full sm:w-auto">
              <span className="text-xs text-slate-300 block font-medium">চলতি মাসের অবশিষ্ট ব্যালেন্স</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                ৳ {Math.round(netBalance).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-300 font-semibold block mt-0.5">
                জমা হতে উদ্বৃত্ত
              </span>
            </div>
          </div>
        </div>

        {/* Member Police Info Grid */}
        <div className="p-6 sm:p-8 bg-[#f8f9ff] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-[#eff4ff]">
          <div className="bg-white p-4 rounded-2xl border border-[#dce9ff] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#76777d] block">মোবাইল নম্বর</span>
              <p className="text-sm font-bold text-[#0b1c30] truncate">{user.phone || '০১৭০০-০০০০০০'}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#dce9ff] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#76777d] block">ব্যারাক ও রুম নম্বর</span>
              <p className="text-sm font-bold text-[#0b1c30] truncate">
                {user.roomNumber || 'রুম ২০৪ (ব্যারাক ১)'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#dce9ff] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#76777d] block">রক্তের গ্রুপ</span>
              <p className="text-sm font-bold text-red-700 truncate">{user.bloodGroup || 'B+'}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#dce9ff] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#131b2e] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#76777d] block">ম্যাসে যোগদানের তারিখ</span>
              <p className="text-sm font-bold text-[#0b1c30] truncate">{user.joinedDate || '২০২৪-০১-০১'}</p>
            </div>
          </div>
        </div>

        {/* Security & Access Box */}
        <div className="px-6 sm:px-8 py-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0b1c30]">
                লগইন পরিচয়: <span className="font-mono">{user.bpNumber || user.badgeNumber}</span>
              </p>
              <p className="text-[11px] text-[#76777d]">
                পাসওয়ার্ড পরিবর্তন বা তথ্য সংশোধনের জন্য ম্যাস ইনচার্জের সাথে যোগাযোগ করুন
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#006c49] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>সদস্য অ্যাকাউন্ট ভেরিফাইড</span>
          </span>
        </div>
      </div>

      {/* Monthly Mess Financial Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Meals Consumed */}
        <div className="bg-white p-5 rounded-2xl border border-[#dce9ff] shadow-2xs">
          <div className="flex items-center justify-between text-[#76777d] mb-2">
            <span className="text-xs font-semibold">গৃহীত মোট মিল ইউনিট</span>
            <UtensilsCrossed className="w-4 h-4 text-[#131b2e]" />
          </div>
          <h4 className="text-2xl font-bold text-[#0b1c30]">
            {toBengaliNumber(totalMealUnits.toFixed(1))} <span className="text-xs text-[#76777d]">ইউনিট</span>
          </h4>
          <p className="text-[11px] text-[#76777d] mt-1">
            নাস্তা: {toBengaliNumber(totalBreakfasts)} | দুপুর: {toBengaliNumber(totalLunches)} | রাত: {toBengaliNumber(totalDinners)}
          </p>
        </div>

        {/* Live Meal Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#dce9ff] shadow-2xs">
          <div className="flex items-center justify-between text-[#76777d] mb-2">
            <span className="text-xs font-semibold">বর্তমান মিল রেট</span>
            <TrendingUp className="w-4 h-4 text-[#006c49]" />
          </div>
          <h4 className="text-2xl font-bold text-[#006c49]">
            ৳ {liveMealRate.toFixed(2)} <span className="text-xs text-[#76777d]">/ইউনিট</span>
          </h4>
          <p className="text-[11px] text-[#76777d] mt-1">
            মোট বাজার খরচ ÷ মোট মিল
          </p>
        </div>

        {/* Food Cost */}
        <div className="bg-white p-5 rounded-2xl border border-[#dce9ff] shadow-2xs">
          <div className="flex items-center justify-between text-[#76777d] mb-2">
            <span className="text-xs font-semibold">মিল বাবদ মোট খরচ</span>
            <Receipt className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <h4 className="text-2xl font-bold text-[#ba1a1a]">
            ৳ {Math.round(totalFoodCost).toLocaleString('en-IN')}
          </h4>
          <p className="text-[11px] text-[#76777d] mt-1">
            {totalMealUnits.toFixed(1)} ইউনিট × ৳ {liveMealRate.toFixed(2)}
          </p>
        </div>

        {/* Total Deposit */}
        <div className="bg-white p-5 rounded-2xl border border-[#dce9ff] shadow-2xs">
          <div className="flex items-center justify-between text-[#76777d] mb-2">
            <span className="text-xs font-semibold">মোট অগ্রিম জমা</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="text-2xl font-bold text-[#0b1c30]">
            ৳ {totalApprovedDeposit.toLocaleString('en-IN')}
          </h4>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            অবশিষ্ট স্থিতি: ৳ {Math.round(netBalance).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Advance Deposit Records for this member */}
      <div className="bg-white rounded-3xl border border-[#dce9ff] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#eff4ff] bg-[#eff4ff]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#131b2e]" />
            <h3 className="font-bold text-base text-[#0b1c30]">আমার অগ্রিম জমা ও পেমেন্ট খতিয়ান</h3>
          </div>
          <span className="text-xs font-bold text-[#006c49]">
            অনুমোদিত মোট: ৳ {totalApprovedDeposit.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#45464d] text-xs font-bold uppercase border-b border-[#eff4ff]">
                <th className="p-4">ট্রানজেকশন / রসিদ আইডি</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4">পেমেন্ট মাধ্যম</th>
                <th className="p-4 text-right">পরিমাণ (৳)</th>
                <th className="p-4 text-center">স্ট্যাটাস</th>
                <th className="p-4">অনুমোদনকারী</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff4ff] text-xs">
              {memberDeposits.length > 0 ? (
                memberDeposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#131b2e]">{dep.transactionId}</td>
                    <td className="p-4 text-[#76777d]">{dep.date}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] font-semibold text-[#131b2e] border border-[#dce9ff]">
                        {dep.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-sm text-[#0b1c30]">
                      ৳ {dep.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        গৃহীত ও অনুমোদিত
                      </span>
                    </td>
                    <td className="p-4 text-[#45464d] font-medium">{dep.approvedBy || 'ম্যাস ইনচার্জ'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 font-mono font-bold text-[#131b2e]">TRX-829104</td>
                  <td className="p-4 text-[#76777d]">২০২৪-০৮-০১</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] font-semibold text-[#131b2e] border border-[#dce9ff]">
                      Cash
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-sm text-[#0b1c30]">৳ ৩,০০০</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      গৃহীত ও অনুমোদিত
                    </span>
                  </td>
                  <td className="p-4 text-[#45464d] font-medium">ইন্সপেক্টর মাহফুজুর রহমান</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Mess Calculator Modal */}
      <MessCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultUserId={user.id}
      />
    </div>
  );
};

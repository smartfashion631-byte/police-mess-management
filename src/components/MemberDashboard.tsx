import React from 'react';
import {
  UtensilsCrossed,
  Receipt,
  Wallet,
  Building2,
  CheckCircle2,
  Check,
  ShieldCheck,
  Croissant,
  CircleDollarSign,
  AlertCircle,
  XCircle,
  Clock,
  UserCheck,
  Droplet,
  Home,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber, formatTaka } from '../utils/bengaliUtils';

export const MemberDashboard: React.FC = () => {
  const {
    currentUser,
    memberMealStats,
    activities,
    mealRecords,
    settings,
  } = useMess();

  // Find today's meal for current user
  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayMeal = mealRecords.find(
    (m) => m.userId === (currentUser?.id || 'user-1') && m.date === todayStr
  );

  const isPositiveBalance = (currentUser?.balance ?? memberMealStats.balance) >= 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Officer Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#dce9ff] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
            }
            alt={currentUser?.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#131b2e] shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#131b2e] text-white text-[11px] font-bold">
                {currentUser?.rank || 'কনস্টেবল'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#131b2e] border border-[#dce9ff] text-[11px] font-bold">
                বিপি: {currentUser?.bpNumber || 'BP-9204123456'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight mt-1">
              {currentUser?.name || 'রহিম উদ্দিন'}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#76777d] mt-0.5">
              <span className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#131b2e]" />
                {currentUser?.roomNumber || 'রুম ২০৪ (ব্যারাক ১)'}
              </span>
              {currentUser?.bloodGroup && (
                <span className="flex items-center gap-1 text-red-600 font-semibold">
                  <Droplet className="w-3.5 h-3.5 text-red-500" />
                  {currentUser?.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#eff4ff] px-4 py-3 rounded-2xl border border-[#dce9ff] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#006c49]/20 flex items-center justify-center text-[#006c49]">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-[#76777d] block font-medium">অ্যাকাউন্ট ভিউ</span>
            <span className="text-xs font-bold text-[#006c49]">
              সদস্য ভিউ (প্রশাসক নিয়ন্ত্রিত)
            </span>
          </div>
        </div>
      </div>

      {/* Admin Control Clarification Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-bold text-amber-900 block">
            মেস প্রশাসন নীতিমালা ও স্বচ্ছতা নির্দেশনা:
          </strong>
          <p className="leading-relaxed">
            ম্যাসের শৃঙ্খলা ও শতভাগ স্বচ্ছতার স্বার্থে সকল প্রকার মিল এন্ট্রি, বাজার খরচ এবং জমা শুধুমাত্র <strong>ম্যাস ইনচার্জ (অ্যাডমিন)</strong> কর্তৃক সফটওয়্যারে লিপিবদ্ধ হয়। সদস্যরা যেকোনো সময় তাদের সার্বিক হিসাব ও ভাউচার দেখতে পারবেন।
          </p>
        </div>
      </div>

      {/* Metric Cards (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Meal Units */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-[#45464d]">মোট মিল ইউনিট</span>
            <div className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-white">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight">
              {toBengaliNumber(memberMealStats.totalUnits)}
            </span>
            <p className="text-xs text-[#45464d] mt-1.5">চলতি মাস ({settings.currentMonth})</p>
          </div>
        </div>

        {/* Card 2: Food Cost */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-[#45464d]">খাবারের খরচ</span>
            <div className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-white">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight">
              {formatTaka(memberMealStats.foodCost)}
            </span>
            <p className="text-xs text-[#45464d] mt-1.5">
              মিল রেট {formatTaka(settings.mealRate)} অনুযায়ী
            </p>
          </div>
        </div>

        {/* Card 3: Total Advance Paid */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium text-[#45464d]">অগ্রিম জমা</span>
            <div className="w-9 h-9 rounded-xl bg-[#006c49] flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight">
              {formatTaka(currentUser?.initialDeposit || memberMealStats.totalAdvance)}
            </span>
            <p className="text-xs text-[#006c49] font-semibold mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ইনচার্জ কর্তৃক অনুমোদিত
            </p>
          </div>
        </div>

        {/* Card 4: Remaining Balance */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#c6c6cd]/30 flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#6cf8bb]/15 rounded-bl-full -z-0" />
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-sm font-medium text-[#45464d]">অবশিষ্ট ব্যালেন্স</span>
            <div className="w-9 h-9 rounded-xl bg-[#006c49] flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl sm:text-4xl font-bold text-[#006c49] tracking-tight">
              {formatTaka(currentUser?.balance ?? memberMealStats.balance)}
            </span>
            <p className="text-xs text-[#006c49] font-medium mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isPositiveBalance ? 'পর্যাপ্ত ব্যালেন্স আছে' : 'বকেয়া পরিশোধ করুন'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Today's Meal Status for Member */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Meals Card (Read-only status with clear badges) */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-[#dce9ff] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eff4ff]">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">
                আজকের মিল স্ট্যাটাস ({new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })})
              </h3>
              <p className="text-xs text-[#76777d]">
                ম্যাস ইনচার্জ কর্তৃক রেকর্ডকৃত আজকের মিলের অবস্থা
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#131b2e] text-xs font-bold self-start sm:self-auto border border-[#dce9ff]">
              আজকের ইউনিট: {toBengaliNumber(userTodayMeal?.totalUnits || 1.5)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Breakfast */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                userTodayMeal?.breakfast
                  ? 'bg-emerald-50/80 border-[#006c49] text-[#002113]'
                  : 'bg-[#f8f9ff] border-[#c6c6cd]/50 text-[#76777d]'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">
                  সকালের নাস্তা
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    userTodayMeal?.breakfast
                      ? 'bg-[#006c49] text-white'
                      : 'bg-[#c6c6cd] text-white'
                  }`}
                >
                  {userTodayMeal?.breakfast ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </span>
              </div>
              <div>
                <p className={`text-base font-bold ${userTodayMeal?.breakfast ? 'text-[#006c49]' : 'text-[#76777d]'}`}>
                  {userTodayMeal?.breakfast ? 'চালু আছে' : 'বন্ধ'}
                </p>
                <p className="text-xs opacity-80 mt-0.5">০.৫ মিল ইউনিট</p>
              </div>
            </div>

            {/* Lunch */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                userTodayMeal?.lunch
                  ? 'bg-emerald-50/80 border-[#006c49] text-[#002113]'
                  : 'bg-[#f8f9ff] border-[#c6c6cd]/50 text-[#76777d]'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">
                  দুপুরের খাবার
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    userTodayMeal?.lunch
                      ? 'bg-[#006c49] text-white'
                      : 'bg-[#c6c6cd] text-white'
                  }`}
                >
                  {userTodayMeal?.lunch ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </span>
              </div>
              <div>
                <p className={`text-base font-bold ${userTodayMeal?.lunch ? 'text-[#006c49]' : 'text-[#76777d]'}`}>
                  {userTodayMeal?.lunch ? 'চালু আছে' : 'বন্ধ'}
                </p>
                <p className="text-xs opacity-80 mt-0.5">১.০ মিল ইউনিট</p>
              </div>
            </div>

            {/* Dinner */}
            <div
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                userTodayMeal?.dinner
                  ? 'bg-emerald-50/80 border-[#006c49] text-[#002113]'
                  : 'bg-[#f8f9ff] border-[#c6c6cd]/50 text-[#76777d]'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">
                  রাতের খাবার
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    userTodayMeal?.dinner
                      ? 'bg-[#006c49] text-white'
                      : 'bg-[#c6c6cd] text-white'
                  }`}
                >
                  {userTodayMeal?.dinner ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </span>
              </div>
              <div>
                <p className={`text-base font-bold ${userTodayMeal?.dinner ? 'text-[#006c49]' : 'text-[#76777d]'}`}>
                  {userTodayMeal?.dinner ? 'চালু আছে' : 'বন্ধ'}
                </p>
                <p className="text-xs opacity-80 mt-0.5">১.০ মিল ইউনিট</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mess Timing Policy */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-[#dce9ff] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#131b2e]" />
              <h3 className="text-base font-bold text-[#0b1c30]">মিল সময়সীমা ও নিয়ম</h3>
            </div>
            <ul className="text-xs text-[#45464d] space-y-2.5">
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#131b2e] mt-0.5 shrink-0" />
                <span>নাস্তা বন্ধ/অন: শেষ সময় সকাল ৭:০০ টা।</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#131b2e] mt-0.5 shrink-0" />
                <span>দুপুরের মিল: শেষ সময় সকাল ১০:৩০ টা।</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#131b2e] mt-0.5 shrink-0" />
                <span>রাতের মিল: শেষ সময় বিকাল ৪:৩০ টা।</span>
              </li>
            </ul>
          </div>
          <div className="pt-4 border-t border-[#eff4ff] mt-4">
            <p className="text-[11px] text-[#76777d]">
              ম্যাস ইনচার্জ: <strong>{settings.managerName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Activity Log (সাম্প্রতিক কার্যাবলী) */}
      <div className="bg-white rounded-3xl shadow-xs border border-[#dce9ff] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#eff4ff] bg-[#eff4ff]/80 flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">
            আপনার ব্যক্তিগত মিল ও আর্থিক খতিয়ান
          </h3>
          <span className="text-xs font-bold text-[#006c49] bg-emerald-100 px-3 py-1 rounded-full">
            রিয়েল-টাইম সিঙ্ক
          </span>
        </div>

        <div className="divide-y divide-[#eff4ff]">
          {/* Log Item 1: Meal */}
          <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-[#f8f9ff] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#45464d] shrink-0 border border-[#dce9ff]">
              <UtensilsCrossed className="w-5 h-5 text-[#131b2e]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0b1c30]">দুপুরের খাবার গ্রহণ</p>
              <p className="text-xs text-[#76777d] mt-0.5">আজ, দুপুর ২:৩০</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#0b1c30]">- ১.০ ইউনিট</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6cf8bb]/30 text-[#006c49] mt-0.5">
                সম্পন্ন
              </span>
            </div>
          </div>

          {/* Log Item 2: Meal with guest */}
          <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-[#f8f9ff] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#45464d] shrink-0 border border-[#dce9ff]">
              <Croissant className="w-5 h-5 text-[#131b2e]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0b1c30]">
                রাতের খাবার গ্রহণ (গেস্ট সহ)
              </p>
              <p className="text-xs text-[#76777d] mt-0.5">গতকাল, রাত ৯:১৫</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#0b1c30]">- ২.০ ইউনিট</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6cf8bb]/30 text-[#006c49] mt-0.5">
                সম্পন্ন
              </span>
            </div>
          </div>

          {/* Log Item 3: Payment */}
          <div className="p-4 sm:p-5 flex items-center gap-4 hover:bg-[#f8f9ff] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/30 flex items-center justify-center text-[#006c49] shrink-0">
              <CircleDollarSign className="w-5 h-5 text-[#006c49]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0b1c30]">ম্যাস বিল জমা (অ্যাডমিন অনুমোদিত)</p>
              <p className="text-xs text-[#76777d] mt-0.5">০৫ সেপ্টেম্বর ২০২৪</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#006c49]">+ ৳ ৩,০০০</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6cf8bb]/30 text-[#006c49] mt-0.5">
                গৃহীত
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

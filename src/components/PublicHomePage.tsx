import React, { useState } from 'react';
import {
  Shield,
  Utensils,
  Clock,
  CheckCircle2,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
  Eye,
  ChevronRight,
  TrendingUp,
  Receipt,
  UserCheck,
  Calculator,
  Search,
  Check,
  DollarSign,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  HeartHandshake,
  Users,
  BadgeCheck,
  FileText,
  Menu as MenuIcon,
  X as CloseIcon,
  LogIn,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber, formatTaka } from '../utils/bengaliUtils';
import { MessCalculatorModal } from './MessCalculatorModal';

interface PublicHomePageProps {
  onOpenLogin: () => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({ onOpenLogin }) => {
  const {
    currentUser,
    totalMembersCount,
    todayMealsCount,
    todayMarketCost,
    currentFundAmount,
    settings,
    users,
    marketExpenses,
    setIsPublicHome,
  } = useMess();

  const [activeMenuTab, setActiveMenuTab] = useState<'breakfast' | 'lunch' | 'dinner' | 'special'>('lunch');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBp, setSearchBp] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Live Auto Calculator Interactive Widget State
  const [simBazar, setSimBazar] = useState<number>(15500);
  const [simTotalMeals, setSimTotalMeals] = useState<number>(310);
  const [simMemberMeals, setSimMemberMeals] = useState<number>(25);
  const [simMemberDeposit, setSimMemberDeposit] = useState<number>(2000);

  // Active FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live Auto Rate based on actual mess expenses
  const actualTotalBazar = marketExpenses.reduce((sum, e) => sum + e.amount, 0) || 15500;
  const actualTotalMessMeals = 310;
  const liveMealRate = actualTotalMessMeals > 0 ? actualTotalBazar / actualTotalMessMeals : settings.mealRate;

  // Simulator dynamic values
  const simMealRate = simTotalMeals > 0 ? simBazar / simTotalMeals : 0;
  const simMemberCost = simMemberMeals * simMealRate;
  const simBalance = simMemberDeposit - simMemberCost;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBp.trim()) return;
    setHasSearched(true);
    const found = users.find(
      (u) =>
        (u.bpNumber && u.bpNumber.toLowerCase().includes(searchBp.toLowerCase().trim())) ||
        (u.badgeNumber && u.badgeNumber.toLowerCase().includes(searchBp.toLowerCase().trim())) ||
        (u.phone && u.phone.includes(searchBp.trim()))
    );
    setSearchResult(found || null);
  };

  const menuDetails = {
    breakfast: {
      time: 'সকাল ০৭:০০ - ০৯:০০',
      deadline: settings.breakfastDeadline || '০৭:০০ সকাল',
      rate: '০.৫ ইউনিট',
      items: [
        'গরম আটার লাল রুটি / তাজা পরোটা',
        'দেশি মুরগির ডিম ভাজি / সেদ্ধ ডিম',
        'ঘন ছোলার ডাল চচ্চড়ি ও সুজি হালুয়া',
        'স্পেশাল মিল্ক টি ও পাকা কলা',
      ],
      nutrition: 'হাই-প্রোটিন ও দীর্ঘস্থায়ী এনার্জি ডায়েট',
      status: 'পরিবেশন সম্পন্ন',
    },
    lunch: {
      time: 'দুপুর ০১:০০ - ০৩:০০',
      deadline: settings.lunchDeadline || '১০:৩০ সকাল',
      rate: '১.০ ইউনিট',
      items: [
        'সুগন্ধি মিনিকেট চালের গরম ভাত',
        'তাজা রুই মাছের দোপেঁয়াজা / দেশি মুরগির ঝোল',
        'সবুজ শাক ও পাঁচমিশালি সবজি ভাজি',
        'ঘন মুসুর ডাল, কাঁচা মরিচ ও শসা-লেবু সালাদ',
      ],
      nutrition: 'ব্যালেন্সড পুষ্টি (প্রোটিন + মাইক্রোনিউট্রিয়েন্ট)',
      status: 'চলমান',
    },
    dinner: {
      time: 'রাত ০৮:৩০ - ১০:৩০',
      deadline: settings.dinnerDeadline || '০৪:৩০ বিকাল',
      rate: '১.০ ইউনিট',
      items: [
        'চিকন চালের ভাত / পাতলা তাওয়া রুটি',
        'খাসির রেজালা / স্পেশাল ডিম ভুনা',
        'মুসুর ডাল ফোড়ন ও আলুর স্পেশাল ভর্তা',
        'মিষ্টি দই ও মৌসুমি ফল',
      ],
      nutrition: 'সহজপাচ্য ও স্বাস্থ্যকর নাইট ডায়েট',
      status: 'প্রস্তুতি চলছে',
    },
    special: {
      time: 'বিশেষ আয়োজন (শুক্রবার ও উৎসব)',
      deadline: 'পূর্ববর্তী দিন বিকাল ০৫:০০',
      rate: '১.৫ ইউনিট',
      items: [
        'ঘিয়ে ভাজা সুগন্ধি বাসমতী কাচ্চি বিরিয়ানি',
        'স্পেশাল খাসির মাংসের রোস্ট ও বোরহানি',
        'স্পেশাল জালি কাবাব ও রায়তা সালাদ',
        'শাহী ফিরনি ও মিষ্টি পান',
      ],
      nutrition: 'উৎসবমুখর পুলিশ ডাইনিং প্রীতিভোজ',
      status: 'আসন্ন শুক্রবার',
    },
  };

  const weeklyRoutine = [
    { day: 'শনিবার', breakfast: 'রুটি, ডিম ভাজি, ডাল', lunch: 'ভাত, রুই মাছের ঝোল, সবজি, ডাল', dinner: 'ভাত/রুটি, মুরগির মাংস, ডাল' },
    { day: 'রবিবার', breakfast: 'পরোটা, সবজি ভাজি, ডিম', lunch: 'ভাত, মুরগির মাংস, শাক, ডাল', dinner: 'ভাত/রুটি, ডিম ভুনা, ভর্তা, ডাল' },
    { day: 'সোমবার', breakfast: 'রুটি, ছোলার ডাল, ডিম', lunch: 'ভাত, কাতল মাছ, সবজি ভাজি, ডাল', dinner: 'ভাত/রুটি, দেশি মুরগি, ডাল' },
    { day: 'মঙ্গলবার', breakfast: 'খিচুড়ি, ডিম ভুনা, আচার', lunch: 'ভাত, রুই মাছের কালিয়া, শাক, ডাল', dinner: 'ভাত/রুটি, খাসির মাংস, সালাদ' },
    { day: 'বুধবার', breakfast: 'রুটি, ডাল চচ্চড়ি, ডিম', lunch: 'ভাত, দেশি মুরগির ঝোল, সবজি, ডাল', dinner: 'ভাত/রুটি, রুই মাছ, ভর্তা, ডাল' },
    { day: 'বৃহস্পতিবার', breakfast: 'পরোটা, ডিম সেদ্ধ, হালুয়া', lunch: 'ভাত, পাবদা মাছ, সবজি, ডাল', dinner: 'ভাত/রুটি, মুরগির ভুনা, ডাল' },
    { day: 'শুক্রবার', breakfast: 'স্পেশাল ভুনা খিচুড়ি, ডিম', lunch: 'স্পেশাল খাসির বিরিয়ানি / পোলাও ও বোরহানি', dinner: 'ভাত/রুটি, হালকা ঝোল, দই-মিষ্টি' },
  ];

  const notices = [
    {
      id: 1,
      title: 'সেপ্টেম্বর মাসের মেস কমিটি মিটিং ও বিশেষ প্রীতিভোজ',
      date: '০৮ সেপ্টেম্বর ২০২৪',
      priority: 'high',
      body: 'সকল অফিসার ও ফোর্স সদস্যদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ১৫ সেপ্টেম্বর ২০২৪ তারিখে জেলা পুলিশ লাইন্স মেস কমিটির মাসিক অডিট মিটিং ও স্পেশাল ডিনার অনুষ্ঠিত হবে।',
      author: 'ম্যাস ইনচার্জ (আরআই)',
    },
    {
      id: 2,
      title: 'মিলের সময়সীমা ও এন্ট্রি সংক্রান্ত কঠোর শৃঙ্খলা নির্দেশনা',
      date: '০৫ সেপ্টেম্বর ২০২৪',
      priority: 'medium',
      body: 'মেসের খাবারের সঠিক হিসাব নিশ্চিত করতে মিল এন্ট্রি ও জমার হিসাব শুধুমাত্র ম্যাস ইনচার্জ ও ম্যানেজমেন্ট সেল দ্বারা সংরক্ষিত হয়। কোনো অননুমোদিত পরিবর্তন গ্রহণযোগ্য নয়।',
      author: 'পুলিশ লাইন্স মেস প্রশাসন',
    },
    {
      id: 3,
      title: 'দৈনিক বাজার খরচের ডিজিটাল ভাউচার ও স্বচ্ছ হিসাব অডিট',
      date: '০২ সেপ্টেম্বর ২০২৪',
      priority: 'normal',
      body: 'প্রতিদিনের চাল, ডাল, তেল, মাছ ও মাংসের ক্রয়কৃত বাজার রসিদ ডিজিটাল ভাউচার হিসেবে পোর্টালে যুক্ত করা হচ্ছে। সকল সদস্য স্বচ্ছতার সাথে তাদের ব্যক্তিগত খরচ দেখতে পাবেন।',
      author: 'মেস অডিট সেল',
    },
  ];

  const faqs = [
    {
      q: 'মেসের মিল রেট কিভাবে স্বয়ংক্রিয়ভাবে হিসাব করা হয়?',
      a: 'প্রতি মাসের মোট বাজার খরচকে মেসে খাওয়া মোট মিলের সংখ্যা দিয়ে ভাগ করে স্বয়ংক্রিয়ভাবে প্রতি মিলের নিখুঁত রেট বের করা হয়। এরপর প্রতিটি সদস্যের খাওয়া মিল দিয়ে গুণ করে মোট খাবার বিল নির্ধারিত হয়।',
    },
    {
      q: 'সদস্যরা কীভাবে তাদের মিল স্ট্যাটাস ও ব্যালেন্স চেক করবেন?',
      a: 'পুলিশ সদস্যরা তাদের বিপি নম্বর এবং পাসওয়ার্ড ব্যবহার করে লগইন করবেন। লগইন করার পর ড্যাশবোর্ডে আজকের মিল, মোট মিলের সংখ্যা, চলতি খাবার বিল এবং জমা থেকে অবশিষ্ট ব্যালেন্স সরাসরি দেখা যাবে।',
    },
    {
      q: 'কোনো সদস্য কি নিজে মিল এন্ট্রি করতে বা পরিবর্তন করতে পারেন?',
      a: 'না। তথ্যের সর্বোচ্চ নিরাপত্তা ও শৃঙ্খলা বজায় রাখার জন্য মিল এন্ট্রি এবং জমার হিসাব শুধুমাত্র ম্যাস ইনচার্জ (অ্যাডমিন) কর্তৃক এন্ট্রি ও সংরক্ষিত হয়। সদস্যরা শুধুমাত্র তাদের স্বচ্ছ খতিয়ান দেখতে পারবেন।',
    },
    {
      q: 'গেস্ট মিল বা বিশেষ ডিনারের জন্য কী নিয়ম অনুসরণ করতে হবে?',
      a: 'কোনো সদস্যের অতিথি (Guest) থাকলে নির্ধারিত সময়ের অন্তত ৩ ঘণ্টা পূর্বে ম্যাস ইনচার্জকে অবহিত করতে হবে, যাতে প্রয়োজনীয় খাদ্যসামগ্রী যথাযথভাবে প্রস্তুত করা যায়।',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] text-[#0b1c30] font-['Hind_Siliguri','Inter',sans-serif] flex flex-col selection:bg-[#131b2e] selection:text-white">
      {/* Top Police Branding Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#131b2e] text-white border-b border-[#2a3854] shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0d1322] flex items-center justify-center border border-amber-300/30">
                <Shield className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  বাংলাদেশ পুলিশ
                </span>
                <span className="text-[11px] text-slate-300 hidden sm:inline-block">জেলা পুলিশ লাইন্স</span>
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white leading-snug">
                কেন্দ্রীয় ম্যাস ম্যানেজমেন্ট পোর্টাল
              </h1>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <a
              href="#menu"
              className="text-xs xl:text-sm font-semibold text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              খাদ্যতালিকা
            </a>
            <a
              href="#routine"
              className="text-xs xl:text-sm font-semibold text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              সাপ্তাহিক রুটিন
            </a>
            <a
              href="#calculator"
              className="text-xs xl:text-sm font-semibold text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              অটো ক্যালকুলেটর
            </a>
            <a
              href="#rules"
              className="text-xs xl:text-sm font-semibold text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              নীতিমালা
            </a>
            <a
              href="#notices"
              className="text-xs xl:text-sm font-semibold text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              বিজ্ঞপ্তি
            </a>
            <a
              href="#faq"
              className="text-xs xl:text-sm font-semibold text-slate-200 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              জিজ্ঞাসা
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs border border-white/15 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>ক্যালকুলেটর</span>
            </button>

            {currentUser ? (
              <button
                type="button"
                onClick={() => setIsPublicHome(false)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>ড্যাশবোর্ডে যান</span>
              </button>
            ) : (
              <button
                type="button"
                id="portal-login-btn-header"
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>লগইন করুন</span>
                <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
              aria-label="মেনু টগল"
            >
              {mobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d1322] border-b border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5"
            >
              🍽️ খাদ্যতালিকা (Daily Menu)
            </a>
            <a
              href="#routine"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5"
            >
              📅 সাপ্তাহিক রুটিন (Weekly Routine)
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5"
            >
              🧮 অটো ক্যালকুলেটর (Auto Calculator)
            </a>
            <a
              href="#rules"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5"
            >
              📜 ডাইনিং শৃঙ্খলা নীতিমালা
            </a>
            <a
              href="#notices"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5"
            >
              📢 ডিজিটাল নোটিশ বোর্ড
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5"
            >
              ❓ সাধারণ জিজ্ঞাসা (FAQ)
            </a>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCalculatorOpen(true);
                }}
                className="flex-1 bg-white/10 text-amber-300 font-bold py-2 rounded-xl text-xs text-center border border-white/10"
              >
                হিসাব ক্যালকুলেটর
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="flex-1 bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs text-center"
              >
                লগইন করুন
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0d1322] text-white py-14 sm:py-20 lg:py-24 border-b border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>স্মার্ট পুলিশ ম্যাস প্রশাসন • ১০০% ডিজিটাল স্বচ্ছতা</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                শৃঙ্খলা, সততা ও প্রযুক্তির সমন্বয়ে <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">
                  পুলিশ ম্যাস ম্যানেজমেন্ট
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                জেলা পুলিশ লাইন্সের সকল অফিসার ও ফোর্স সদস্যদের জন্য দৈনিক মিল ব্যবস্থাপনা, ডিজিটাল বাজার ভাউচার অডিট, বিপি নম্বর ভিত্তিক স্বচ্ছ খতিয়ান এবং কেন্দ্রীয় প্রশাসনিক নিয়ন্ত্রণ।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  id="hero-login-button"
                  onClick={onOpenLogin}
                  className="flex items-center gap-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Lock className="w-5 h-5" />
                  <span>সদস্য / অ্যাডমিন লগইন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-amber-300 px-5 py-3.5 rounded-xl font-bold text-base border border-slate-700 transition-colors cursor-pointer"
                >
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>স্বয়ংক্রিয় হিসাব ক্যালকুলেটর</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ইনচার্জ নিয়ন্ত্রিত নির্ভুল এন্ট্রি</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>বিপি নম্বর ও পাসওয়ার্ড নিরাপত্তা</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>লাইভ বাজার ভাউচার অডিট</span>
                </div>
              </div>
            </div>

            {/* Right Column Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">লাইভ ড্যাশবোর্ড কমান্ড সেন্টার</h4>
                      <p className="text-xs text-slate-400">জেলা পুলিশ লাইন্স ম্যাস সেল</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    সক্রিয় সেশন
                  </span>
                </div>

                {/* Live Stats Bento */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-medium">নিবন্ধিত সদস্য</span>
                    <p className="text-2xl font-bold text-white mt-1">{toBengaliNumber(totalMembersCount)} জন</p>
                    <span className="text-[11px] text-emerald-400 mt-1 block">ব্যারাক ও মেস সদস্য</span>
                  </div>
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-medium">আজকের মোট মিল</span>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{toBengaliNumber(todayMealsCount)} টি</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">সকাল, দুপুর ও রাত</span>
                  </div>
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-medium">চলতি মিল রেট</span>
                    <p className="text-2xl font-bold text-white mt-1">৳ {liveMealRate.toFixed(1)}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">প্রতি মিল ইউনিট</span>
                  </div>
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-medium">বর্তমান মেস তহবিল</span>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">৳ {currentFundAmount.toLocaleString('en-IN')}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">রিজার্ভ ব্যালেন্স</span>
                  </div>
                </div>

                {/* Quick Search for Member Status */}
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-amber-300 block">
                    সদস্য দ্রুত তথ্য অনুসন্ধান (Quick Status Search):
                  </span>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      type="text"
                      value={searchBp}
                      onChange={(e) => setSearchBp(e.target.value)}
                      placeholder="বিপি নম্বর দিন (যেমন: BP-9204)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>যাচাই</span>
                    </button>
                  </form>

                  {hasSearched && (
                    <div className="pt-2 border-t border-slate-700/60 text-xs">
                      {searchResult ? (
                        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-emerald-300">
                              {searchResult.rank} {searchResult.name}
                            </p>
                            <p className="text-[11px] text-slate-300">
                              বিপি: {searchResult.bpNumber} • রুম: {searchResult.roomNumber}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={onOpenLogin}
                            className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 cursor-pointer"
                          >
                            লগইন করুন
                          </button>
                        </div>
                      ) : (
                        <p className="text-red-400 text-[11px]">
                          কোনো সদস্য পাওয়া যায়নি। সঠিক বিপি নম্বর প্রদান করুন অথবা ইনচার্জের সাথে যোগাযোগ করুন।
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 1. Today's Daily Mess Menu Section */}
        <section id="menu" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#c6c6cd]/40 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006c49] uppercase tracking-wider mb-1">
                <Utensils className="w-4 h-4" />
                <span>দৈনিক ডাইনিং ও পরিবেশন সময়সূচী</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
                আজকের খাদ্যতালিকা (Daily Mess Menu)
              </h3>
            </div>
            <p className="text-sm text-[#45464d] font-medium">
              তারিখ: {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Menu Category Switcher Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#eff4ff] rounded-2xl max-w-lg border border-[#c6c6cd]/40">
            <button
              type="button"
              id="menu-tab-breakfast"
              onClick={() => setActiveMenuTab('breakfast')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMenuTab === 'breakfast'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#45464d] hover:text-black'
              }`}
            >
              সকালের নাস্তা
            </button>
            <button
              type="button"
              id="menu-tab-lunch"
              onClick={() => setActiveMenuTab('lunch')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMenuTab === 'lunch'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#45464d] hover:text-black'
              }`}
            >
              দুপুরের খাবার
            </button>
            <button
              type="button"
              id="menu-tab-dinner"
              onClick={() => setActiveMenuTab('dinner')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMenuTab === 'dinner'
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#45464d] hover:text-black'
              }`}
            >
              রাতের খাবার
            </button>
            <button
              type="button"
              id="menu-tab-special"
              onClick={() => setActiveMenuTab('special')}
              className={`flex-1 py-2.5 px-3 text-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMenuTab === 'special'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-[#45464d] hover:text-black'
              }`}
            >
              স্পেশাল ভোজ
            </button>
          </div>

          {/* Menu Card Display */}
          <div className="bg-white rounded-3xl border border-[#dce9ff] shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#dce9ff] text-[#131b2e] text-xs font-bold">
                  {menuDetails[activeMenuTab].time}
                </span>
                <span className="text-xs text-[#006c49] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  রেট: {menuDetails[activeMenuTab].rate}
                </span>
                <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                  {menuDetails[activeMenuTab].status}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                {activeMenuTab === 'breakfast'
                  ? 'সকালের পুষ্টিকর নাস্তা'
                  : activeMenuTab === 'lunch'
                  ? 'দুপুরের প্রধান আহার'
                  : activeMenuTab === 'dinner'
                  ? 'রাতের তৃপ্তিদায়ক খাবার'
                  : 'বিশেষ প্রীতিভোজ ও উৎসব ডিনার'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {menuDetails[activeMenuTab].items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#f8f9ff] border border-[#eff4ff]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#006c49] shrink-0" />
                    <span className="text-sm font-semibold text-[#0b1c30]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#76777d] pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#ba1a1a]" />
                  এন্ট্রি সময়সীমা: <strong>{menuDetails[activeMenuTab].deadline}</strong>
                </span>
                <span>•</span>
                <span>ডায়েট মান: <strong>{menuDetails[activeMenuTab].nutrition}</strong></span>
              </div>
            </div>

            <div className="md:col-span-5 bg-linear-to-br from-[#eff4ff] to-[#dce9ff] p-6 rounded-2xl border border-[#c6c6cd]/40 space-y-3">
              <h5 className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#131b2e]" />
                মেস ডাইনিং নিয়মাবলী
              </h5>
              <ul className="text-xs text-[#45464d] space-y-2 list-disc list-inside">
                <li>নির্ধারিত সময়ের মধ্যে ডাইনিং হলে উপস্থিত হয়ে খাবার গ্রহণ করুন।</li>
                <li>গেস্ট মিলের প্রয়োজন হলে পূর্বেই ম্যাস ইনচার্জকে অবহিত করুন।</li>
                <li>খাবার অপচয় কঠোরভাবে নিষিদ্ধ। পরিমিত খাবার গ্রহণ করুন।</li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="w-full bg-[#131b2e] hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>আপনার ব্যক্তিগত মিল স্ট্যাটাস দেখুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Weekly 7-Day Routine Table */}
        <section id="routine" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#c6c6cd]/40 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006c49] uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>সাপ্তাহিক নিয়মিত ডায়েট চার্ট</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
                ৭ দিনের সুষম খাদ্য তালিকা (Weekly Routine)
              </h3>
            </div>
            <span className="text-xs bg-slate-200 text-slate-800 px-3 py-1 rounded-full font-bold">
              মেস কমিটি কর্তৃক অনুমোদিত
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#dce9ff] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#131b2e] text-white border-b border-slate-700">
                    <th className="py-3.5 px-4 font-bold">দিন</th>
                    <th className="py-3.5 px-4 font-bold">সকালের নাস্তা (০৭:০০-০৯:০০)</th>
                    <th className="py-3.5 px-4 font-bold">দুপুরের খাবার (০১:০০-০৩:০০)</th>
                    <th className="py-3.5 px-4 font-bold">রাতের খাবার (০৮:৩০-১০:৩০)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eff4ff]">
                  {weeklyRoutine.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-[#f8f9ff] hover:bg-slate-50'}
                    >
                      <td className="py-3 px-4 font-bold text-[#131b2e] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {row.day}
                      </td>
                      <td className="py-3 px-4 text-[#45464d]">{row.breakfast}</td>
                      <td className="py-3 px-4 font-medium text-[#0b1c30]">{row.lunch}</td>
                      <td className="py-3 px-4 text-[#45464d]">{row.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. Dedicated Live Interactive Auto Calculator Showcase */}
        <section id="calculator" className="scroll-mt-24 space-y-6">
          <div className="bg-linear-to-br from-[#131b2e] via-[#1a253c] to-[#0b1c30] text-white rounded-3xl p-6 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column Text & Formula */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>স্মার্ট হিসাব প্রযুক্তি • সম্পূর্ণ স্বয়ংক্রিয়</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  স্বয়ংক্রিয় ম্যাস হিসাব ক্যালকুলেটর
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  ম্যানুয়াল খাতা-কলমের জটিল হিসাব ছাড়াই মেসের মোট বাজার খরচকে মোট সক্রিয় মিল সংখ্যা দিয়ে স্বয়ংক্রিয়ভাবে ভাগ করে মিল রেট, সদস্যের মোট খাবার খরচ এবং জমা থেকে অবশিষ্ট ব্যালেন্স সেকেন্ডেই হিসাব করুন।
                </p>

                {/* Formula breakdown */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2 font-mono text-xs">
                  <p className="text-amber-300 font-sans font-bold text-xs">অটো হিসাবের নির্ভুল সূত্র:</p>
                  <p className="text-slate-300">১. মিল রেট = মোট বাজার খরচ ÷ মোট মিল সংখ্যা</p>
                  <p className="text-slate-300">২. সদস্যের খরচ = সদস্যের মিল × মিল রেট</p>
                  <p className="text-slate-300">৩. চূড়ান্ত ব্যালেন্স = মোট জমা - সদস্যের খরচ</p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCalculatorOpen(true)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>ফুল স্ক্রিন ক্যালকুলেটর চালু করুন</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive Calculator Simulator Widget */}
              <div className="lg:col-span-6 bg-white/5 border border-white/15 rounded-3xl p-6 space-y-5 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    লাইভ সিমুলেটর (Live Interactive Simulator)
                  </h4>
                  <span className="text-[11px] text-slate-400">মান পরিবর্তন করে পরীক্ষা করুন</span>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 block">মোট বাজার খরচ (৳):</label>
                    <input
                      type="number"
                      value={simBazar}
                      onChange={(e) => setSimBazar(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 block">মেসে খাওয়া মোট মিল:</label>
                    <input
                      type="number"
                      value={simTotalMeals}
                      onChange={(e) => setSimTotalMeals(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 block">সদস্যের খাওয়া মিল:</label>
                    <input
                      type="number"
                      value={simMemberMeals}
                      onChange={(e) => setSimMemberMeals(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 block">সদস্যের জমা টাকা (৳):</label>
                    <input
                      type="number"
                      value={simMemberDeposit}
                      onChange={(e) => setSimMemberDeposit(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Real-time Dynamic Results Card */}
                <div className="bg-black/40 rounded-2xl p-4 border border-white/10 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2">
                    <span className="text-[11px] text-slate-400 block">মিল রেট</span>
                    <span className="text-base sm:text-lg font-bold text-amber-400">
                      ৳ {simMealRate.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2 border-x border-white/10">
                    <span className="text-[11px] text-slate-400 block">সদস্যের খরচ</span>
                    <span className="text-base sm:text-lg font-bold text-white">
                      ৳ {simMemberCost.toFixed(0)}
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="text-[11px] text-slate-400 block">অবশিষ্ট ব্যালেন্স</span>
                    <span
                      className={`text-base sm:text-lg font-bold ${
                        simBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      ৳ {simBalance.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Police Mess Rules & Dining Discipline */}
        <section id="rules" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">
              শৃঙ্খলা ও পরিচালনা বিধান
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
              মেস ও ডাইনিং শৃঙ্খলা নীতিমালা
            </h3>
            <p className="text-sm text-[#45464d]">
              বাংলাদেশ পুলিশ লাইন্স মেসের সার্বিক শৃঙ্খলা ও স্বাস্থ্যবিধি রক্ষার সুনির্দিষ্ট নিয়মাবলী
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#dce9ff] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#131b2e] text-amber-400 flex items-center justify-center shadow-xs">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#0b1c30]">১. ডাইনিং সময়নিষ্ঠতা</h4>
              <p className="text-xs text-[#45464d] leading-relaxed">
                সকল সদস্যকে নির্ধারিত সময়সূচীর মধ্যে ডাইনিং হলে উপস্থিত হয়ে খাবার গ্রহণ করতে হবে। অপচয় রোধে সময়মত মিল অন/অফ নিশ্চিত করা জরুরি।
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#dce9ff] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#006c49] text-white flex items-center justify-center shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#0b1c30]">২. কেন্দ্রীয় অডিট নিয়ন্ত্রণ</h4>
              <p className="text-xs text-[#45464d] leading-relaxed">
                মিল এন্ট্রি, বাজার রসিদ ও ব্যালেন্স শুধুমাত্র ম্যাস ইনচার্জ ও অডিট সেল দ্বারা পরিচালিত হয়। কোনো অননুমোদিত তথ্য পরিবর্তন গ্রহণযোগ্য নয়।
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#dce9ff] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1a253c] text-amber-300 flex items-center justify-center shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#0b1c30]">৩. গেস্ট মিল ও ছুটি</h4>
              <p className="text-xs text-[#45464d] leading-relaxed">
                অতিথি মিল অথবা সাময়িক ছুটির ক্ষেত্রে অন্তত ৩ ঘণ্টা পূর্বে ইনচার্জকে অবহিত করে অনুমোদন নিতে হবে।
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#dce9ff] shadow-xs flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0b1c30] text-emerald-400 flex items-center justify-center shadow-xs">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#0b1c30]">৪. মানসম্মত খাদ্য ও স্বাস্থ্য</h4>
              <p className="text-xs text-[#45464d] leading-relaxed">
                দৈনিক তাজা ও পুষ্টিকর বাজার ক্রয় করা হয় এবং স্বাস্থ্যসম্মত পরিবেশে রান্না ও পরিবেশন সার্বক্ষণিক তদারকি করা হয়।
              </p>
            </div>
          </div>
        </section>

        {/* 5. Police Lines Mess Management Cell */}
        <section className="bg-linear-to-r from-[#131b2e] to-[#0b1c30] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                <Shield className="w-4 h-4" />
                <span>মেস পরিচালনা ও তদারকি পরিষদ</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                স্বচ্ছতা ও জবাবদিহিতায় কেন্দ্রীয় মেস প্রশাসন
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                জেলা পুলিশ লাইন্সের তত্ত্বাবধানে মেস কমিটি নিয়মিত বাজার দর যাচাই, খাদ্যমান পরিদর্শন ও মাসিক অডিট নিশ্চিত করে থাকে। প্রতিটি সদস্যের প্রাপ্য অধিকার ও হিসাব সংরক্ষিত।
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  পোর্টালে প্রবেশ করুন
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 text-xs text-slate-200">
              <h5 className="font-bold text-amber-400 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                সদস্যদের জন্য সহজ ৩ ধাপ:
              </h5>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    ১
                  </span>
                  <p>ইনচার্জ থেকে বিপি নম্বর ও পাসওয়ার্ড গ্রহণ করুন।</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    ২
                  </span>
                  <p>পোর্টালে প্রবেশ করে দৈনিক মিল স্ট্যাটাস যাচাই করুন।</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    ৩
                  </span>
                  <p>মাস শেষে স্বয়ংক্রিয় ব্যালেন্স ও রসিদ ডাউনলোড করুন।</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Digital Notice Board */}
        <section id="notices" className="scroll-mt-24 space-y-6">
          <div className="flex items-center justify-between border-b border-[#c6c6cd]/40 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a] uppercase tracking-wider mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>ম্যাস প্রশাসনিক আদেশনামা</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
                ডিজিটাল নোটিশ বোর্ড (Notice Board)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-3xl p-6 border border-[#dce9ff] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        notice.priority === 'high'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : notice.priority === 'medium'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-[#eff4ff] text-[#131b2e]'
                      }`}
                    >
                      {notice.priority === 'high' ? 'জরুরি নোটিশ' : notice.priority === 'medium' ? 'গুরুত্বপূর্ণ' : 'সাধারণ'}
                    </span>
                    <span className="text-xs text-[#76777d]">{notice.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#0b1c30] leading-snug">{notice.title}</h4>
                  <p className="text-xs text-[#45464d] leading-relaxed">{notice.body}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#eff4ff] flex items-center justify-between text-xs text-[#76777d]">
                  <span>স্বাক্ষরিত: <strong>{notice.author}</strong></span>
                  <span className="font-bold text-[#131b2e]">জেলা পুলিশ লাইন্স</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Frequently Asked Questions (FAQ) Section */}
        <section id="faq" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">
              সহায়তা ও পরামর্শ
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
              সচরাচর জিজ্ঞাসা (FAQ)
            </h3>
            <p className="text-sm text-[#45464d]">
              পুলিশ ম্যাস ব্যবস্থাপনা এবং অ্যাকাউন্ট সম্পর্কিত সাধারণ প্রশ্নের উত্তর
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#dce9ff] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#0b1c30] flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#45464d] leading-relaxed border-t border-[#eff4ff] bg-[#f8f9ff]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1c30] text-slate-400 text-xs border-t border-slate-800 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
                  <Shield className="w-5 h-5 fill-slate-950" />
                </div>
                <span className="font-bold text-base">পুলিশ ম্যাস ম্যানেজমেন্ট</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                জেলা পুলিশ লাইন্স, কেন্দ্রীয় ম্যাস প্রশাসন ও অডিট সেল। শতভাগ স্বচ্ছ ও ডিজিটাল খাদ্য ব্যবস্থাপনা।
              </p>
            </div>

            <div className="space-y-2">
              <h6 className="font-bold text-white text-xs uppercase tracking-wider">জরুরি যোগাযোগ</h6>
              <p>পুলিশ কন্ট্রোল রুম: ৯৯৯ / ০১৩২০-০০০০০০</p>
              <p>রিজার্ভ অফিস (আরআই): ০১৭১৩-৩৭৩০০০</p>
              <p>ম্যাস ইনচার্জ হেল্পডেস্ক: ০১৭০০-০০০০০০</p>
            </div>

            <div className="space-y-2">
              <h6 className="font-bold text-white text-xs uppercase tracking-wider">ডাইনিং সময়সূচী</h6>
              <p>সকালের নাস্তা: ০৭:০০ - ০৯:০০</p>
              <p>দুপুরের খাবার: ০১:০০ - ০৩:০০</p>
              <p>রাতের খাবার: ০৮:৩০ - ১০:৩০</p>
            </div>

            <div className="space-y-3">
              <h6 className="font-bold text-white text-xs uppercase tracking-wider">পোর্টালে প্রবেশ</h6>
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Lock className="w-4 h-4" />
                <span>লগইন স্ক্রিনে যান</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} বাংলাদেশ পুলিশ ম্যাস ম্যানেজমেন্ট সিস্টেম। সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="text-slate-400">সরকারি ও অভ্যন্তরীণ দাপ্তরিক ব্যবহারের জন্য প্রস্তুতকৃত পোর্টাল</p>
          </div>
        </div>
      </footer>

      {/* Global Auto Calculator Modal */}
      <MessCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

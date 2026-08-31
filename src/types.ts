export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  rank: string; // পদবি e.g. কনস্টেবল, এসআই, ইন্সপেক্টর
  bpNumber: string; // বিপি নম্বর e.g. BP-9204123456
  badgeNumber: string; // ব্যাজ নম্বর
  phone: string;
  password?: string; // লগইন পাসওয়ার্ড
  role: UserRole;
  avatarUrl?: string; // প্রোফাইল ছবি
  roomNumber?: string; // রুম / ব্যারাক নম্বর
  bloodGroup?: string; // রক্তের গ্রুপ
  initialDeposit?: number; // প্রারম্ভিক জমা
  balance?: number; // বর্তমান ব্যালেন্স
  active: boolean;
  joinedDate: string;
}

export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  userId: string;
  userName: string;
  userRank: string;
  breakfast: boolean; // সকাল
  lunch: boolean; // দুপুর
  dinner: boolean; // রাত
  guestBreakfast?: number;
  guestLunch?: number;
  guestDinner?: number;
  totalUnits: number; // e.g. 0.5 + 1.0 + 1.0 = 2.5
  notes?: string;
}

export interface MarketExpense {
  id: string;
  date: string;
  itemName: string; // আইটেমের নাম e.g. চাল, ডাল, মুরগির মাংস
  category: 'staple' | 'meat_fish' | 'vegetable' | 'spices' | 'utilities';
  quantity: string; // পরিমাণ e.g. ২০ কেজি, ৫ লিটার
  amount: number; // মূল্য (৳)
  purchasedBy: string; // বাজারকারী
  receiptNo?: string;
  time?: string;
}

export interface AdvanceDeposit {
  id: string;
  userId: string;
  userName: string;
  userRank: string;
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank';
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  transactionId?: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName?: string;
  title: string; // e.g. দুপুরের খাবার গ্রহণ
  time: string; // e.g. আজ, দুপুর ২:৩০
  date: string;
  type: 'meal' | 'deposit' | 'expense' | 'system';
  changeText: string; // e.g. - ১ ইউনিট, + ৳ ৩,০০০
  statusText: string; // e.g. সম্পন্ন, গৃহীত, অপেক্ষমান
  statusType: 'success' | 'pending' | 'neutral';
  iconType: 'restaurant' | 'bakery' | 'payments' | 'wallet';
}

export interface MessSettings {
  messName: string;
  policeStation: string;
  currentMonth: string;
  mealRate: number; // ৳ ৫০
  breakfastRate: number; // 0.5 unit
  lunchRate: number; // 1.0 unit
  dinnerRate: number; // 1.0 unit
  breakfastDeadline: string; // 07:00 AM
  lunchDeadline: string; // 10:30 AM
  dinnerDeadline: string; // 04:30 PM
  managerName: string;
}

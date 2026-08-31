import React, { useState } from 'react';
import { X, Check, Utensils, User as UserIcon } from 'lucide-react';
import { useMess } from '../context/MessContext';
import { MealRecord } from '../types';

interface MealEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeal?: MealRecord | null;
}

export const MealEntryModal: React.FC<MealEntryModalProps> = ({
  isOpen,
  onClose,
  initialMeal,
}) => {
  const { users, toggleMeal, updateMealRecord, mealRecords, settings } = useMess();

  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialMeal?.userId || users[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    initialMeal?.date || new Date().toISOString().split('T')[0]
  );
  const [breakfast, setBreakfast] = useState<boolean>(initialMeal?.breakfast ?? true);
  const [lunch, setLunch] = useState<boolean>(initialMeal?.lunch ?? true);
  const [dinner, setDinner] = useState<boolean>(initialMeal?.dinner ?? false);
  const [guestLunch, setGuestLunch] = useState<number>(initialMeal?.guestLunch || 0);
  const [guestDinner, setGuestDinner] = useState<number>(initialMeal?.guestDinner || 0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialMeal) {
      updateMealRecord(initialMeal.id, {
        breakfast,
        lunch,
        dinner,
        guestLunch,
        guestDinner,
      });
    } else {
      // Create/update meal for selected user
      const existing = mealRecords.find(
        (m) => m.userId === selectedUserId && m.date === selectedDate
      );
      if (existing) {
        updateMealRecord(existing.id, {
          breakfast,
          lunch,
          dinner,
          guestLunch,
          guestDinner,
        });
      } else {
        const user = users.find((u) => u.id === selectedUserId);
        let units = 0;
        if (breakfast) units += settings.breakfastRate;
        if (lunch) units += settings.lunchRate;
        if (dinner) units += settings.dinnerRate;
        units += guestLunch * settings.lunchRate + guestDinner * settings.dinnerRate;

        // Toggling will initialize properly
        if (breakfast) toggleMeal(selectedUserId, 'breakfast', selectedDate);
        if (lunch) toggleMeal(selectedUserId, 'lunch', selectedDate);
        if (dinner) toggleMeal(selectedUserId, 'dinner', selectedDate);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c6c6cd]/50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eff4ff] bg-[#eff4ff]">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#131b2e]" />
            <h3 className="font-bold text-base text-[#0b1c30]">
              {initialMeal ? 'মিলের হিসাব পরিবর্তন করুন' : 'নতুন মিল এন্ট্রি'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#76777d] hover:bg-white hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Member Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#45464d] mb-1">
              সদস্য নির্বাচন করুন
            </label>
            <div className="relative">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={!!initialMeal}
                className="w-full bg-[#eff4ff]/60 border border-[#c6c6cd] rounded-xl px-3 py-2.5 text-sm font-medium text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-70"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.rank}) - {u.badgeNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-[#45464d] mb-1">তারিখ</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Meal Options */}
          <div className="space-y-2 pt-1">
            <span className="block text-xs font-semibold text-[#45464d]">
              মিলের বিবরণ (টিক চিহ্ন দিন)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Breakfast */}
              <button
                type="button"
                onClick={() => setBreakfast(!breakfast)}
                className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  breakfast
                    ? 'bg-[#6cf8bb]/30 border-[#006c49] text-[#002113] font-bold shadow-xs'
                    : 'bg-[#eff4ff]/40 border-[#c6c6cd] text-[#76777d]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    breakfast ? 'bg-[#006c49] text-white' : 'bg-[#c6c6cd] text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs">সকাল (০.৫)</span>
              </button>

              {/* Lunch */}
              <button
                type="button"
                onClick={() => setLunch(!lunch)}
                className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  lunch
                    ? 'bg-[#6cf8bb]/30 border-[#006c49] text-[#002113] font-bold shadow-xs'
                    : 'bg-[#eff4ff]/40 border-[#c6c6cd] text-[#76777d]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    lunch ? 'bg-[#006c49] text-white' : 'bg-[#c6c6cd] text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs">দুপুর (১.০)</span>
              </button>

              {/* Dinner */}
              <button
                type="button"
                onClick={() => setDinner(!dinner)}
                className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  dinner
                    ? 'bg-[#6cf8bb]/30 border-[#006c49] text-[#002113] font-bold shadow-xs'
                    : 'bg-[#eff4ff]/40 border-[#c6c6cd] text-[#76777d]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    dinner ? 'bg-[#006c49] text-white' : 'bg-[#c6c6cd] text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs">রাত (১.০)</span>
              </button>
            </div>
          </div>

          {/* Guest Meals */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                গেস্ট দুপুর মিল (সংখ্যা)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={guestLunch}
                onChange={(e) => setGuestLunch(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                গেস্ট রাত মিল (সংখ্যা)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={guestDinner}
                onChange={(e) => setGuestDinner(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#c6c6cd] text-sm font-semibold text-[#45464d] hover:bg-[#eff4ff] transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-[#213145] transition-colors shadow-sm"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Save, Check } from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber } from '../utils/bengaliUtils';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, currentRole } = useMess();
  const [messName, setMessName] = useState(settings.messName);
  const [policeStation, setPoliceStation] = useState(settings.policeStation);
  const [mealRate, setMealRate] = useState(settings.mealRate.toString());
  const [breakfastRate, setBreakfastRate] = useState(settings.breakfastRate.toString());
  const [lunchRate, setLunchRate] = useState(settings.lunchRate.toString());
  const [dinnerRate, setDinnerRate] = useState(settings.dinnerRate.toString());
  const [breakfastDeadline, setBreakfastDeadline] = useState(settings.breakfastDeadline);
  const [lunchDeadline, setLunchDeadline] = useState(settings.lunchDeadline);
  const [dinnerDeadline, setDinnerDeadline] = useState(settings.dinnerDeadline);
  const [managerName, setManagerName] = useState(settings.managerName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      messName,
      policeStation,
      mealRate: parseFloat(mealRate) || 50,
      breakfastRate: parseFloat(breakfastRate) || 0.5,
      lunchRate: parseFloat(lunchRate) || 1.0,
      dinnerRate: parseFloat(dinnerRate) || 1.0,
      breakfastDeadline,
      lunchDeadline,
      dinnerDeadline,
      managerName,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0b1c30]">ম্যাস সেটিংস ও নীতিমালা</h2>
        <p className="text-sm text-[#45464d]">
          ম্যাসের সার্বিক কনফিগারেশন, মিল ইউনিট পরিমাপ এবং সময়সীমা নিয়ন্ত্রণ
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#c6c6cd]/30 shadow-xs space-y-6">
        {/* General Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#0b1c30] border-b border-[#eff4ff] pb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#131b2e]" />
            <span>সাধারণ তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                ম্যাসের নাম
              </label>
              <input
                type="text"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                পুলিশ লাইন্স / থানা ইউনিট
              </label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#45464d] mb-1">
              বর্তমান ম্যাস ইনচার্জ
            </label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              disabled={currentRole !== 'admin'}
              className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
            />
          </div>
        </div>

        {/* Meal Unit Weights & Rates */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-[#0b1c30] border-b border-[#eff4ff] pb-2">
            মিল ইউনিট ওয়েট ও মিল রেট
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                ডিফল্ট মিল রেট (৳)
              </label>
              <input
                type="number"
                value={mealRate}
                onChange={(e) => setMealRate(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm font-bold text-[#006c49] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                সকালের নাস্তা ইউনিট
              </label>
              <input
                type="number"
                step="0.1"
                value={breakfastRate}
                onChange={(e) => setBreakfastRate(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                দুপুরের মিল ইউনিট
              </label>
              <input
                type="number"
                step="0.1"
                value={lunchRate}
                onChange={(e) => setLunchRate(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                রাতের মিল ইউনিট
              </label>
              <input
                type="number"
                step="0.1"
                value={dinnerRate}
                onChange={(e) => setDinnerRate(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Meal Deadlines */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-[#0b1c30] border-b border-[#eff4ff] pb-2">
            মিল চালু/বন্ধ করার সময়সীমা
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                সকালের মিল কাট-অফ
              </label>
              <input
                type="text"
                value={breakfastDeadline}
                onChange={(e) => setBreakfastDeadline(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                দুপুরের মিল কাট-অফ
              </label>
              <input
                type="text"
                value={lunchDeadline}
                onChange={(e) => setLunchDeadline(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#45464d] mb-1">
                রাতের মিল কাট-অফ
              </label>
              <input
                type="text"
                value={dinnerDeadline}
                onChange={(e) => setDinnerDeadline(e.target.value)}
                disabled={currentRole !== 'admin'}
                className="w-full bg-[#f8f9ff] border border-[#c6c6cd]/60 rounded-xl p-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-[#6cf8bb]/30 border border-[#6cf8bb] rounded-xl text-[#006c49] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}

        {currentRole === 'admin' && (
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#213145] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Pencil,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { MealEntryModal } from './MealEntryModal';
import { MealRecord } from '../types';

export const MealManagementView: React.FC = () => {
  const { mealRecords, toggleMeal, users, currentRole } = useMess();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealRecord | null>(null);

  const filteredRecords = mealRecords.filter(
    (m) =>
      m.date === selectedDate &&
      (m.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.userRank.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Compute daily totals
  const totalBreakfast = filteredRecords.filter((r) => r.breakfast).length;
  const totalLunch = filteredRecords.filter((r) => r.lunch).length;
  const totalDinner = filteredRecords.filter((r) => r.dinner).length;
  const totalMealUnits = filteredRecords.reduce((acc, r) => acc + (r.totalUnits || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30]">মিল ব্যবস্থাপনা</h2>
          <p className="text-sm text-[#45464d]">
            সকল পুলিশ সদস্যের দৈনিক ও মাসিক মিলের পূর্ণাঙ্গ বিবরণী
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] shadow-xs focus:ring-2 focus:ring-black focus:outline-none"
          />
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={() => {
                setEditingMeal(null);
                setIsModalOpen(true);
              }}
              className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#213145] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>মিল এন্ট্রি</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#c6c6cd]/30 shadow-xs">
          <p className="text-xs font-semibold text-[#76777d]">মোট সকালের নাস্তা</p>
          <p className="text-2xl font-bold text-[#0b1c30] mt-1">
            {toBengaliNumber(totalBreakfast)} <span className="text-xs font-normal">জন</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#c6c6cd]/30 shadow-xs">
          <p className="text-xs font-semibold text-[#76777d]">মোট দুপুরের খাবার</p>
          <p className="text-2xl font-bold text-[#006c49] mt-1">
            {toBengaliNumber(totalLunch)} <span className="text-xs font-normal">জন</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#c6c6cd]/30 shadow-xs">
          <p className="text-xs font-semibold text-[#76777d]">মোট রাতের খাবার</p>
          <p className="text-2xl font-bold text-[#0b1c30] mt-1">
            {toBengaliNumber(totalDinner)} <span className="text-xs font-normal">জন</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#c6c6cd]/30 shadow-xs bg-[#eff4ff]">
          <p className="text-xs font-semibold text-[#131b2e]">মোট মিল ইউনিট</p>
          <p className="text-2xl font-bold text-[#131b2e] mt-1">
            {toBengaliNumber(totalMealUnits)} <span className="text-xs font-normal">ইউনিট</span>
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#c6c6cd]/30 overflow-hidden">
        <div className="p-4 border-b border-[#c6c6cd]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#eff4ff]/60">
          <input
            type="text"
            placeholder="সদস্যের নাম বা পদবি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 bg-white border border-[#c6c6cd] rounded-xl px-3 py-1.5 text-xs text-[#0b1c30] focus:ring-2 focus:ring-black focus:outline-none"
          />

          <span className="text-xs text-[#76777d]">
            তারিখ: {new Date(selectedDate).toLocaleDateString('bn-BD')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#d3e4fe]/40 text-[#45464d] text-xs font-semibold uppercase">
                <th className="p-4 border-b border-[#c6c6cd]/30">সদস্যের নাম</th>
                <th className="p-4 border-b border-[#c6c6cd]/30">পদবি</th>
                <th className="p-4 border-b border-[#c6c6cd]/30 text-center">সকাল (০.৫)</th>
                <th className="p-4 border-b border-[#c6c6cd]/30 text-center">দুপুর (১.০)</th>
                <th className="p-4 border-b border-[#c6c6cd]/30 text-center">রাত (১.০)</th>
                <th className="p-4 border-b border-[#c6c6cd]/30 text-center">গেস্ট মিল</th>
                <th className="p-4 border-b border-[#c6c6cd]/30 text-center">মোট ইউনিট</th>
                {currentRole === 'admin' && (
                  <th className="p-4 border-b border-[#c6c6cd]/30 text-right">অ্যাকশন</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]/20">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                    <td className="p-4 text-sm font-semibold text-[#0b1c30]">
                      {record.userName}
                    </td>
                    <td className="p-4 text-xs font-medium text-[#45464d]">
                      {record.userRank}
                    </td>
                    <td className="p-4 text-center">
                      {currentRole === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => toggleMeal(record.userId, 'breakfast', record.date)}
                          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-black/5 active:scale-90 cursor-pointer"
                          title="টগল করতে ক্লিক করুন (অ্যাডমিন)"
                        >
                          {record.breakfast ? (
                            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#76777d]/70" />
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          {record.breakfast ? (
                            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#76777d]/50" />
                          )}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {currentRole === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => toggleMeal(record.userId, 'lunch', record.date)}
                          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-black/5 active:scale-90 cursor-pointer"
                          title="টগল করতে ক্লিক করুন (অ্যাডমিন)"
                        >
                          {record.lunch ? (
                            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#76777d]/70" />
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          {record.lunch ? (
                            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#76777d]/50" />
                          )}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {currentRole === 'admin' ? (
                        <button
                          type="button"
                          onClick={() => toggleMeal(record.userId, 'dinner', record.date)}
                          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-black/5 active:scale-90 cursor-pointer"
                          title="টগল করতে ক্লিক করুন (অ্যাডমিন)"
                        >
                          {record.dinner ? (
                            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#76777d]/70" />
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center">
                          {record.dinner ? (
                            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
                          ) : (
                            <XCircle className="w-5 h-5 text-[#76777d]/50" />
                          )}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center text-xs font-medium text-[#45464d]">
                      {(record.guestLunch || 0) + (record.guestDinner || 0) > 0
                        ? `${toBengaliNumber((record.guestLunch || 0) + (record.guestDinner || 0))} টি`
                        : '-'}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-[#0b1c30]">
                      {toBengaliNumber(record.totalUnits)}
                    </td>
                    {currentRole === 'admin' && (
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMeal(record);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-[#45464d] hover:text-black hover:bg-[#dce9ff] rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-[#76777d]">
                    এই তারিখের জন্য কোন মিল রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

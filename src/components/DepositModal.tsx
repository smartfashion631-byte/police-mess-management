import React, { useState } from 'react';
import { X, Wallet, Check, UserCheck, ShieldCheck } from 'lucide-react';
import { useMess } from '../context/MessContext';
import { AdvanceDeposit } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { users, addAdvanceDeposit, currentRole } = useMess();
  const [selectedUserId, setSelectedUserId] = useState<string>(users[1]?.id || 'user-1');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<AdvanceDeposit['paymentMethod']>('Cash');
  const [trxId, setTrxId] = useState('');
  const [note, setNote] = useState('ম্যাস চলতি মাসের অগ্রিম বিল বাবদ');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    addAdvanceDeposit({
      userId: selectedUserId,
      amount: parseFloat(amount) || 0,
      paymentMethod: method,
      transactionId: trxId || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const selectedMember = users.find((u) => u.id === selectedUserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#dce9ff] w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eff4ff] bg-[#131b2e] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">সদস্যের অগ্রিম জমা এন্ট্রি</h3>
              <p className="text-[11px] text-slate-300">ম্যাস ইনচার্জ প্রশাসনিক ক্যাশ এন্ট্রি</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg text-[#0b1c30]">জমা সফলভাবে রেকর্ড হয়েছে!</h4>
            <p className="text-xs text-[#45464d]">
              {selectedMember?.name}-এর অ্যাকাউন্টে ৳ {parseFloat(amount).toLocaleString('en-IN')} যোগ করা হয়েছে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Member Selection */}
            <div>
              <label className="block text-xs font-bold text-[#45464d] mb-1">
                সদস্য নির্বাচন করুন
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-[#eff4ff] border border-[#dce9ff] rounded-xl px-3.5 py-2.5 text-sm text-[#0b1c30] font-semibold focus:ring-2 focus:ring-[#131b2e] focus:outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.rank} {u.name} ({u.bpNumber || u.badgeNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Deposit Amount */}
            <div>
              <label className="block text-xs font-bold text-[#45464d] mb-1">
                জমার পরিমাণ (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="যেমন: ৩০০০"
                required
                className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-base font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-[#45464d] mb-1">
                পেমেন্ট মাধ্যম
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Cash', 'bKash', 'Nagad', 'Bank'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      method === m
                        ? 'bg-[#131b2e] text-white border-[#131b2e] shadow-xs'
                        : 'bg-[#eff4ff]/60 border-[#dce9ff] text-[#45464d] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {m === 'Cash' ? 'ক্যাশ (Cash)' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID if digital */}
            {method !== 'Cash' && (
              <div>
                <label className="block text-xs font-bold text-[#45464d] mb-1">
                  ট্রানজেকশন আইডি / রেফারেন্স
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="যেমন: 8XJ90K12"
                  className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-mono"
                />
              </div>
            )}

            <div className="pt-3 flex gap-3 border-t border-[#eff4ff]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#c6c6cd] text-sm font-bold text-[#45464d] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#131b2e] hover:bg-black text-white text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                জমা নিশ্চিত করুন
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

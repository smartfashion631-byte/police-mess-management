import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Shield,
  Search,
  CheckCircle2,
  X,
  Lock,
  KeyRound,
  Image as ImageIcon,
  Home,
  Droplet,
  Eye,
  EyeOff,
  Upload,
  Calendar,
  Wallet,
  BadgeAlert,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { toBengaliNumber } from '../utils/bengaliUtils';
import { User } from '../types';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
];

export const MembersView: React.FC = () => {
  const { users, addMember, deleteMember, currentRole, totalMembersCount } = useMess();
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<User | null>(null);

  // New member form states
  const [name, setName] = useState('');
  const [rank, setRank] = useState('কনস্টেবল');
  const [bpNumber, setBpNumber] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('123456');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [roomNumber, setRoomNumber] = useState('রুম ২০৪ (ব্যারাক ১)');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [formError, setFormError] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.bpNumber && u.bpNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.badgeNumber && u.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.phone.includes(searchTerm);

    const matchesRank = rankFilter === 'all' || u.rank.includes(rankFilter);
    return matchesSearch && matchesRank;
  });

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('সদস্যের নাম দিন');
      return;
    }
    if (!bpNumber.trim()) {
      setFormError('সদস্যের বিপি নম্বর (BP Number) দিন');
      return;
    }
    if (!password.trim()) {
      setFormError('সদস্যের লগইন পাসওয়ার্ড দিন');
      return;
    }

    addMember({
      name: name.trim(),
      rank,
      bpNumber: bpNumber.trim(),
      badgeNumber: badgeNumber.trim() || `BP-${bpNumber.slice(-4)}`,
      phone: phone.trim() || '০১৭১২-XXXXXX',
      password: password.trim(),
      avatarUrl: avatarUrl || PRESET_AVATARS[0],
      roomNumber: roomNumber.trim(),
      bloodGroup,
      balance: 0,
      role: 'member',
      active: true,
      joinedDate: new Date().toISOString().split('T')[0],
    });

    // Reset form
    setName('');
    setBpNumber('');
    setBadgeNumber('');
    setPhone('');
    setPassword('123456');
    setAvatarUrl(PRESET_AVATARS[0]);
    setRoomNumber('রুম ২০৪ (ব্যারাক ১)');
    setBloodGroup('B+');
    setFormError('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#0b1c30]">পুলিশ সদস্য ডিরেক্টরি</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#131b2e] text-white text-xs font-bold">
              {toBengaliNumber(totalMembersCount)} জন সদস্য
            </span>
          </div>
          <p className="text-sm text-[#45464d] mt-0.5">
            {currentRole === 'admin'
              ? 'ম্যাস ইনচার্জ কর্তৃক পুলিশ সদস্য নিবন্ধন, বিপি নম্বর ও পাসওয়ার্ড ব্যবস্থাপনা'
              : 'সকল নিবন্ধিত পুলিশ সদস্যদের তালিকা ও মেস স্ট্যাটাস (শুধুমাত্র প্রদর্শন)'}
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            type="button"
            id="open-add-member-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#131b2e] hover:bg-black text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন সদস্য যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-[#c6c6cd]/40 shadow-xs">
        <div className="sm:col-span-8 flex items-center gap-3 bg-[#f8f9ff] px-3.5 py-2.5 rounded-xl border border-[#eff4ff]">
          <Search className="w-4 h-4 text-[#76777d]" />
          <input
            type="text"
            placeholder="নাম, বিপি নম্বর (BP No), পদবি বা ফোন দিয়ে সদস্য খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#76777d] hover:text-black"
            >
              মুছুন
            </button>
          )}
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="w-full bg-[#f8f9ff] border border-[#eff4ff] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#0b1c30] focus:outline-none"
          >
            <option value="all">সকল পদবি (All Ranks)</option>
            <option value="কনস্টেবল">কনস্টেবল</option>
            <option value="নায়েক">নায়েক</option>
            <option value="এএসআই">এএসআই</option>
            <option value="এসআই">এসআই</option>
            <option value="ইন্সপেক্টর">ইন্সপেক্টর</option>
          </select>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl p-5 border border-[#dce9ff] shadow-xs flex flex-col justify-between hover:shadow-md transition-all hover:border-[#131b2e]/30"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                  }
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border border-[#dce9ff] shrink-0 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-base text-[#0b1c30] truncate">{user.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6cf8bb]/30 text-[#006c49] shrink-0">
                      সক্রিয়
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#006c49] mt-0.5">{user.rank}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-[#eff4ff] text-[#131b2e] rounded-md border border-[#dce9ff]">
                      {user.bpNumber || user.badgeNumber}
                    </span>
                    {user.bloodGroup && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-50 text-red-700 rounded-md flex items-center gap-0.5">
                        <Droplet className="w-2.5 h-2.5 text-red-600" />
                        {user.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="bg-[#f8f9ff] rounded-xl p-3 space-y-1.5 text-xs text-[#45464d] border border-[#eff4ff]">
                <div className="flex items-center justify-between">
                  <span className="text-[#76777d] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#131b2e]" />
                    ফোন:
                  </span>
                  <span className="font-semibold text-[#0b1c30]">{user.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#76777d] flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-[#131b2e]" />
                    ব্যারাক/রুম:
                  </span>
                  <span className="font-medium text-[#0b1c30] truncate max-w-[150px]">
                    {user.roomNumber || 'ব্যারাক ১'}
                  </span>
                </div>
                {currentRole === 'admin' && (
                  <div className="flex items-center justify-between border-t border-[#dce9ff]/60 pt-1.5">
                    <span className="text-[#76777d] flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      লগইন পাসওয়ার্ড:
                    </span>
                    <span className="font-mono font-bold text-[#131b2e] bg-white px-2 py-0.5 rounded border border-[#c6c6cd]/40">
                      {user.password || '123'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#eff4ff] flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-[#76777d] block">চলতি ব্যালেন্স</span>
                <span className="font-bold text-[#006c49]">
                  ৳ {(user.balance || (user.id === 'user-1' ? 875 : 1200)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedMemberDetail(user)}
                  className="px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#131b2e] font-bold text-xs transition-colors cursor-pointer"
                >
                  প্রোফাইল দেখুন
                </button>
                {currentRole === 'admin' && user.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`আপনি কি ${user.name}-কে মেস তালিকা থেকে অপসারণ করতে চান?`)) {
                        deleteMember(user.id);
                      }
                    }}
                    className="p-1.5 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="সদস্য অপসারণ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Profile Detail Modal */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#dce9ff] w-full max-w-lg overflow-hidden">
            <div className="bg-[#131b2e] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedMemberDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedMemberDetail.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                  }
                  alt={selectedMemberDetail.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                    বাংলাদেশ পুলিশ সদস্য খতিয়ান
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{selectedMemberDetail.name}</h3>
                  <p className="text-xs text-slate-300 font-semibold">{selectedMemberDetail.rank}</p>
                  <span className="inline-block mt-1 bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded">
                    বিপি নম্বর: {selectedMemberDetail.bpNumber || selectedMemberDetail.badgeNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#0b1c30]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#76777d] block text-[11px]">যোগদানের তারিখ</span>
                  <p className="font-bold text-sm text-[#0b1c30] mt-0.5">
                    {selectedMemberDetail.joinedDate || '২০২৪-০১-০১'}
                  </p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#76777d] block text-[11px]">ব্যারাক ও রুম</span>
                  <p className="font-bold text-sm text-[#0b1c30] mt-0.5">
                    {selectedMemberDetail.roomNumber || 'রুম ২০৪ (ব্যারাক ১)'}
                  </p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#76777d] block text-[11px]">মোবাইল নম্বর</span>
                  <p className="font-bold text-sm text-[#0b1c30] mt-0.5">{selectedMemberDetail.phone}</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[#76777d] block text-[11px]">রক্তের গ্রুপ</span>
                  <p className="font-bold text-sm text-red-700 mt-0.5">
                    {selectedMemberDetail.bloodGroup || 'B+'}
                  </p>
                </div>
              </div>

              {currentRole === 'admin' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    প্রশাসনিক নিরাপত্তা তথ্য (Admin Only)
                  </span>
                  <p className="text-[11px] text-amber-800">
                    লগইন বিপি নম্বর: <strong>{selectedMemberDetail.bpNumber}</strong> | পাসওয়ার্ড:{' '}
                    <strong>{selectedMemberDetail.password || '123'}</strong>
                  </p>
                </div>
              )}

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">চলতি মেস ব্যালেন্স</span>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">
                    ৳{' '}
                    {(
                      selectedMemberDetail.balance ||
                      (selectedMemberDetail.id === 'user-1' ? 875 : 1200)
                    ).toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">
                  পর্যাপ্ত ফান্ড
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9ff] border-t border-[#eff4ff] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMemberDetail(null)}
                className="bg-[#131b2e] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#c6c6cd]/50 w-full max-w-xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#131b2e] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">নতুন পুলিশ সদস্য নিবন্ধন ফরম</h3>
                  <p className="text-xs text-slate-300">
                    বিপি নম্বর, পাসওয়ার্ড ও প্রোফাইল ছবিসহ সদস্য যুক্ত করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center gap-2">
                  <BadgeAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Member Profile Photo Selection & Upload */}
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#dce9ff] space-y-3">
                <label className="block text-xs font-bold text-[#131b2e]">
                  ১. সদস্যের প্রোফাইল ছবি (Profile Photo)
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={avatarUrl}
                    alt="প্রিভিউ"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#131b2e] shadow-sm"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-[#c6c6cd] text-xs font-semibold px-3 py-2 rounded-xl text-[#0b1c30] cursor-pointer shadow-xs">
                      <Upload className="w-4 h-4 text-[#131b2e]" />
                      <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-[#76777d]">বা নিচের অফিসিয়াল ডেমো ছবি থেকে বেছে নিন:</p>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div className="flex gap-2 pt-1 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        avatarUrl === url
                          ? 'border-[#131b2e] scale-105 shadow-md ring-2 ring-amber-400'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`avatar-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Full Name & Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    সদস্যের পুরো নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: কনস্টেবল মো: সেলিম রেজা"
                    required
                    className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">পদবি (Rank)</label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-semibold"
                  >
                    <option value="কনস্টেবল">কনস্টেবল (Constable)</option>
                    <option value="নায়েক">নায়েক (Naik)</option>
                    <option value="এএসআই">এএসআই (ASI)</option>
                    <option value="এসআই">এসআই (SI)</option>
                    <option value="ইন্সপেক্টর">ইন্সপেক্টর (Inspector)</option>
                  </select>
                </div>
              </div>

              {/* 3. BP Number & Badge Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    বিপি নম্বর (BP Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#76777d]">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={bpNumber}
                      onChange={(e) => setBpNumber(e.target.value)}
                      placeholder="যেমন: BP-9204123456"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    লগইন পাসওয়ার্ড (Password) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#76777d]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="সদস্যের পাসওয়ার্ড দিন"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#76777d] hover:text-black"
                    >
                      {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Phone & Room/Barrack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">মোবাইল নম্বর</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#76777d]">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#45464d] mb-1">
                    ব্যারাক ও রুম নম্বর
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#76777d]">
                      <Home className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="যেমন: রুম ২০৪ (ব্যারাক ১)"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Blood Group */}
              <div>
                <label className="block text-xs font-bold text-[#45464d] mb-1">রক্তের গ্রুপ</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#131b2e] focus:outline-none font-semibold"
                >
                  <option value="A+">A+ (A Positive)</option>
                  <option value="A-">A- (A Negative)</option>
                  <option value="B+">B+ (B Positive)</option>
                  <option value="B-">B- (B Negative)</option>
                  <option value="O+">O+ (O Positive)</option>
                  <option value="O-">O- (O Negative)</option>
                  <option value="AB+">AB+ (AB Positive)</option>
                  <option value="AB-">AB- (AB Negative)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#eff4ff] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#c6c6cd] text-sm font-semibold text-[#45464d] hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  id="submit-member-btn"
                  className="flex-1 py-3 rounded-xl bg-[#131b2e] hover:bg-black text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  সদস্য নিবন্ধন সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

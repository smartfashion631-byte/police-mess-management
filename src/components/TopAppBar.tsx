import React, { useState } from 'react';
import {
  Bell,
  Shield,
  Menu,
  X,
  CheckCircle2,
  DollarSign,
  Globe,
  LogOut,
  UserCheck,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import { useMess } from '../context/MessContext';

interface TopAppBarProps {
  onToggleMobileSidebar: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onToggleMobileSidebar }) => {
  const { currentUser, currentRole, switchRole, logout, setIsPublicHome, isFirestoreSyncing } = useMess();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'অগ্রিম জমা রেকর্ড',
      desc: 'কনস্টেবল রহিমের ৩,০০০ টাকার জমা ইনচার্জ কর্তৃক অনুমোদিত',
      time: '১০ মিনিট আগে',
      type: 'deposit',
    },
    {
      id: 2,
      title: 'রাতের মিল রিমাইন্ডার',
      desc: 'আজকের রাতের মিলের তালিকা ইনচার্জ কর্তৃক চূড়ান্ত করা হয়েছে',
      time: '১ ঘন্টা আগে',
      type: 'meal',
    },
    {
      id: 3,
      title: 'বাজার খরচ যুক্ত হয়েছে',
      desc: 'আজকের সকালের বাজার খরচ ১৫,৫০০ টাকা রেকর্ড করা হয়েছে',
      time: '৩ ঘন্টা আগে',
      type: 'expense',
    },
  ];

  return (
    <header className="bg-[#d3e4fe] border-b border-[#c6c6cd]/50 shadow-xs flex justify-between items-center w-full px-4 sm:px-6 py-3 z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-xl text-[#0b1c30] hover:bg-[#cbdbf5] transition-colors cursor-pointer"
          aria-label="মেনু খুলুন"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-[#131b2e] flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
          <Shield className="w-5 h-5 fill-amber-400/20" />
        </div>

        <div>
          <h1 className="text-base sm:text-xl font-bold text-[#0b1c30] tracking-tight leading-tight">
            বাংলাদেশ পুলিশ লাইন্স ম্যাস
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-semibold text-[#006c49] block">
              {currentRole === 'admin' ? '🛡️ ম্যাস ইনচার্জ কন্ট্রোল প্যানেল' : '👤 সদস্য ড্যাশবোর্ড (শুধুমাত্র প্রদর্শন)'}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100/90 text-emerald-800 text-[9px] font-bold border border-emerald-300/60">
              <Cloud className="w-2.5 h-2.5 text-emerald-600" />
              <span>ফায়ারবেস লাইভ</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 relative">
        {/* Return to Public Website Button */}
        <button
          type="button"
          onClick={() => setIsPublicHome(true)}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#131b2e] bg-white hover:bg-slate-50 border border-[#dce9ff] px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          title="ম্যাস হোমপেজে যান"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>মূল ওয়েবসাইট</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            id="notifications-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/70 hover:bg-white flex items-center justify-center text-[#45464d] border border-[#dce9ff] transition-all relative cursor-pointer active:scale-95 shadow-xs"
            aria-label="বিজ্ঞপ্তি"
          >
            <Bell className="w-4 h-4 text-[#131b2e]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#dce9ff] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-5 pb-3 border-b border-[#eff4ff]">
                <h4 className="font-bold text-sm text-[#0b1c30]">মেস নোটিফিকেশন</h4>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[#76777d] hover:text-black p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-[#eff4ff] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-[#eff4ff]/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#dce9ff] flex items-center justify-center shrink-0 mt-0.5">
                        {n.type === 'deposit' ? (
                          <DollarSign className="w-4 h-4 text-[#006c49]" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#131b2e]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0b1c30]">{n.title}</p>
                        <p className="text-xs text-[#45464d] mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-[#76777d] mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button
            type="button"
            id="user-profile-menu-button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#dce9ff] transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
          >
            <img
              src={
                currentUser?.avatarUrl ||
                (currentRole === 'admin'
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwK6U0mTOSaqXBqJxZt2qxqGZ3qL7GHv1nszMZKuKnThtvS5qhI2VbnCF-WWFW3V1-wm-TV37CmifDYKhpSGO7MoiEQhwEh5vmwJf8ci4QwkvYnjwoNdCdPEUgBENX-e--Z1j1dURZQ7Se2tiJ-bbDmJs9uZWiIb9XZTvyNEimey6Gun64ECF5kBSxBPUz6k7-Un9hagB1giPVkQEXUMceRGGVZcyM4qow8onBF_KlSJbQvQhGsYk9YQ'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300')
              }
              alt="প্রোফাইল ছবি"
              referrerPolicy="no-referrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-[#131b2e]"
            />
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-[#0b1c30] block leading-tight truncate max-w-[130px]">
                {currentUser?.name || (currentRole === 'admin' ? 'মাহফুজুর রহমান' : 'কনস্টেবল রহিম')}
              </span>
              <span className="text-[10px] text-[#006c49] font-bold block leading-tight">
                {currentUser?.bpNumber || (currentRole === 'admin' ? 'BP-7501019920' : 'BP-9204123456')}
              </span>
            </div>
          </button>

          {/* Profile Quick Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-[#dce9ff] p-4 z-50 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-[#eff4ff]">
                <img
                  src={
                    currentUser?.avatarUrl ||
                    (currentRole === 'admin'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwK6U0mTOSaqXBqJxZt2qxqGZ3qL7GHv1nszMZKuKnThtvS5qhI2VbnCF-WWFW3V1-wm-TV37CmifDYKhpSGO7MoiEQhwEh5vmwJf8ci4QwkvYnjwoNdCdPEUgBENX-e--Z1j1dURZQ7Se2tiJ-bbDmJs9uZWiIb9XZTvyNEimey6Gun64ECF5kBSxBPUz6k7-Un9hagB1giPVkQEXUMceRGGVZcyM4qow8onBF_KlSJbQvQhGsYk9YQ'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300')
                  }
                  alt="প্রোফাইল"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#131b2e]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0b1c30] truncate">
                    {currentUser?.name || (currentRole === 'admin' ? 'মাহফুজুর রহমান' : 'কনস্টেবল রহিম')}
                  </p>
                  <p className="text-xs text-[#006c49] font-bold">
                    {currentUser?.rank || (currentRole === 'admin' ? 'ম্যাস ইনচার্জ (ইন্সপেক্টর)' : 'কনস্টেবল')}
                  </p>
                  <p className="text-[10px] text-[#76777d] font-mono">
                    {currentUser?.bpNumber || (currentRole === 'admin' ? 'BP-7501019920' : 'BP-9204123456')}
                  </p>
                </div>
              </div>

              <div className="py-2.5 space-y-1.5 text-xs">
                {/* Switch Role */}
                <button
                  type="button"
                  onClick={() => {
                    switchRole(currentRole === 'admin' ? 'member' : 'admin');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 font-bold text-[#131b2e] hover:bg-[#eff4ff] rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                    ভূমিকা পরিবর্তন করুন
                  </span>
                  <span className="bg-[#dce9ff] text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {currentRole === 'admin' ? 'সদস্য হন' : 'অ্যাডমিন হন'}
                  </span>
                </button>

                {/* Back to Home */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPublicHome(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 font-bold text-[#131b2e] hover:bg-[#eff4ff] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>মূল ওয়েবসাইটে যান</span>
                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2.5 font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer border-t border-[#eff4ff] mt-1 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

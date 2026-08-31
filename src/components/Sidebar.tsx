import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  Users,
  Settings,
  LogOut,
  UserCheck,
  Globe,
  ArrowRight,
  User,
  Calculator,
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { MessCalculatorModal } from './MessCalculatorModal';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { currentRole, activeTab, setActiveTab, logout, switchRole, setIsPublicHome } = useMess();
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const navItems =
    currentRole === 'admin'
      ? [
          { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
          { id: 'meals', label: 'মিল ব্যবস্থাপনা', icon: UtensilsCrossed },
          { id: 'expenses', label: 'খরচ ও হিসাব', icon: Receipt },
          { id: 'members', label: 'সদস্য তালিকা', icon: Users },
          { id: 'settings', label: 'ম্যাস সেটিংস', icon: Settings },
        ]
      : [
          { id: 'dashboard', label: 'হোম ড্যাশবোর্ড', icon: LayoutDashboard },
          { id: 'meals', label: 'মিল বুকিং ও তথ্য', icon: UtensilsCrossed },
          { id: 'expenses', label: 'খরচ ও জমা বিবরণী', icon: Receipt },
          { id: 'profile', label: 'আমার প্রোফাইল', icon: User },
        ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleGoHome = () => {
    setIsPublicHome(true);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <nav className="bg-[#eff4ff] border-r border-[#dce9ff] shadow-xs h-screen w-64 flex flex-col py-4 px-3 shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-4 px-2">
        <div className="w-10 h-10 rounded-2xl bg-[#131b2e] flex items-center justify-center text-amber-400 shrink-0 shadow-md">
          <Shield className="w-5 h-5 fill-amber-400/20" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0b1c30] tracking-tight leading-tight">
            পুলিশ ম্যাস
          </h2>
          <p className="text-xs font-semibold text-[#006c49]">
            {currentRole === 'admin' ? 'ম্যাস ইনচার্জ প্যানেল' : 'সদস্য পোর্টাল'}
          </p>
        </div>
      </div>

      {/* Return to Public Website Button */}
      <div className="px-1 mb-2">
        <button
          type="button"
          onClick={handleGoHome}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#dce9ff] text-xs font-bold text-[#131b2e] shadow-2xs transition-all cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
            <span>মূল ওয়েবসাইট হোমপেজ</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#76777d]" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || (item.id === 'profile' && activeTab === 'settings');
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#131b2e] text-white shadow-sm'
                  : 'text-[#45464d] hover:bg-[#dce9ff]/70 hover:text-[#0b1c30]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-[#45464d]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Quick Auto Calculator Tool */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsCalcOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-700" />
            <span>হিসাব ক্যালকুলেটর</span>
          </button>
        </div>
      </div>

      {/* Quick View Switcher & Logout */}
      <div className="mt-auto pt-3 border-t border-[#dce9ff] space-y-2">
        {/* Switch Role */}
        <button
          type="button"
          id="switch-view-btn"
          onClick={() => switchRole(currentRole === 'admin' ? 'member' : 'admin')}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#131b2e] bg-white hover:bg-[#dce9ff] border border-[#dce9ff] rounded-xl transition-colors cursor-pointer"
          title="ভিউ পরিবর্তন করুন"
        >
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#006c49]" />
            {currentRole === 'admin' ? 'সদস্য ভিউতে যান' : 'অ্যাডমিন ভিউতে যান'}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#131b2e] text-white font-bold">
            {currentRole === 'admin' ? 'Admin' : 'Member'}
          </span>
        </button>

        {/* Logout */}
        <button
          type="button"
          id="logout-btn"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট</span>
        </button>
      </div>

      {/* Global Calculator Modal */}
      <MessCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </nav>
  );
};

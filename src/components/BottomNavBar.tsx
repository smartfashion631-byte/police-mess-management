import React from 'react';
import { Home, UtensilsCrossed, Wallet, User as UserIcon, Users } from 'lucide-react';
import { useMess } from '../context/MessContext';

export const BottomNavBar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useMess();

  const tabs =
    currentRole === 'admin'
      ? [
          { id: 'dashboard', label: 'হোম', icon: Home },
          { id: 'meals', label: 'মিল', icon: UtensilsCrossed },
          { id: 'expenses', label: 'হিসাব', icon: Wallet },
          { id: 'members', label: 'সদস্য', icon: Users },
        ]
      : [
          { id: 'dashboard', label: 'হোম', icon: Home },
          { id: 'meals', label: 'মিল', icon: UtensilsCrossed },
          { id: 'expenses', label: 'হিসাব', icon: Wallet },
          { id: 'settings', label: 'প্রোফাইল', icon: UserIcon },
        ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#d3e4fe] border-t border-[#c6c6cd]/30 rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center rounded-full px-4 py-1.5 transition-all active:scale-90 ${
              isActive
                ? 'bg-[#6cf8bb] text-[#002113] font-bold shadow-xs'
                : 'text-[#45464d] hover:bg-[#cbdbf5]'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-xs">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

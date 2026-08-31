import React, { useState } from 'react';
import { MessProvider, useMess } from './context/MessContext';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { AdminDashboard } from './components/AdminDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { MealManagementView } from './components/MealManagementView';
import { ExpensesView } from './components/ExpensesView';
import { MembersView } from './components/MembersView';
import { SettingsView } from './components/SettingsView';
import { MemberProfileView } from './components/MemberProfileView';
import { PublicHomePage } from './components/PublicHomePage';

const MainLayout: React.FC = () => {
  const { currentUser, currentRole, activeTab, isPublicHome, setIsPublicHome } = useMess();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is viewing the public website page
  if (isPublicHome) {
    return <PublicHomePage onOpenLogin={() => setIsPublicHome(false)} />;
  }

  // If not logged in and not on public home, show login
  if (!currentUser) {
    return <LoginScreen onBackToHome={() => setIsPublicHome(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentRole === 'admin' ? <AdminDashboard /> : <MemberDashboard />;
      case 'meals':
        return <MealManagementView />;
      case 'expenses':
        return <ExpensesView />;
      case 'members':
        return <MembersView />;
      case 'profile':
        return <MemberProfileView />;
      case 'settings':
        return currentRole === 'admin' ? <SettingsView /> : <MemberProfileView />;
      default:
        return currentRole === 'admin' ? <AdminDashboard /> : <MemberDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9ff] text-[#0b1c30] font-['Hind_Siliguri','Inter',sans-serif]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 w-64 h-full bg-[#eff4ff]">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <TopAppBar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 bg-[#f8f9ff]">
          {renderContent()}
        </main>

        {/* Bottom Mobile Navigation */}
        <BottomNavBar />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <MessProvider>
      <MainLayout />
    </MessProvider>
  );
}

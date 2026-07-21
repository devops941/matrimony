import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DirectoryPage from './pages/DirectoryPage';
import MatcherPage from './pages/MatcherPage';
import RecommendPage from './pages/RecommendPage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import AdminPage from './pages/AdminPage';
import CompanyPage from './pages/CompanyPage';
import SocialPage from './pages/SocialPage';
import ConfirmedMatchesPage from './pages/ConfirmedMatchesPage';
import HelpPage from './pages/HelpPage';
import NakshatraPage from './pages/NakshatraPage';
import ProfileDetailModal from './components/modals/ProfileDetailModal';
import ProfileFormModal from './components/modals/ProfileFormModal';
import PaymentModal from './components/modals/PaymentModal';
import CommunityFormModal from './components/modals/CommunityFormModal';
import NakshatraFormModal from './components/modals/NakshatraFormModal';
import { Surface, Composites } from './theme';

type TabType = 'dashboard' | 'directory' | 'matcher' | 'recommend' | 'employees' | 'admin' | 'help' | 'company' | 'social' | 'confirmed' | 'attendance' | 'nakshatra';

const VALID_TABS: ReadonlySet<string> = new Set<string>([
  'dashboard', 'directory', 'matcher', 'recommend', 'employees',
  'attendance', 'admin', 'company', 'social', 'confirmed', 'help', 'nakshatra',
]);

function getTabFromPath(): TabType {
  const segments = window.location.pathname.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length === 0) return 'dashboard';

  if (segments[0] === 'dashboard') {
    if (segments.length === 1) return 'dashboard';
    if (VALID_TABS.has(segments[1])) return segments[1] as TabType;
    return 'dashboard';
  }

  if (VALID_TABS.has(segments[0])) {
    return segments[0] as TabType;
  }

  return 'dashboard';
}

function AppShell() {
  const { currentUser, activeTab, setActiveTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath());
    };
    window.addEventListener('popstate', handlePopState);

    const path = window.location.pathname.replace(/^\//, '').split('/').filter(Boolean);
    const currentTab = getTabFromPath();
    const isValidDashboardNested = path[0] === 'dashboard' && path.length > 1 && VALID_TABS.has(path[1]);
    const isValidTopLevel = path.length === 1 && VALID_TABS.has(path[0]);

    if (window.location.pathname === '/') {
      window.history.replaceState(null, '', '/dashboard');
    } else if (isValidTopLevel && path[0] !== 'dashboard') {
      window.history.replaceState(null, '', `/dashboard/${path[0]}`);
    } else if (!isValidDashboardNested && !isValidTopLevel) {
      window.history.replaceState(null, '', '/dashboard');
    }

    setActiveTab(currentTab);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveTab]);

  const handleNavigate = (tab: string) => {
    const targetPath = tab === 'dashboard' ? '/dashboard' : `/dashboard/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setActiveTab(tab as TabType);
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen w-screen flex flex-col items-center justify-center ${Surface[900]} font-sans antialiased relative px-4 overflow-y-auto py-12`}>
        <Toaster />
        <LoginPage />
      </div>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':   return <DashboardPage />;
      case 'directory':   return <DirectoryPage />;
      case 'matcher':     return <MatcherPage />;
      case 'recommend':   return <RecommendPage />;
      case 'employees':   return <EmployeesPage />;
      case 'attendance':  return <AttendancePage />;
      case 'admin':       return <AdminPage />;
      case 'company':     return <CompanyPage />;
      case 'social':      return <SocialPage />;
      case 'confirmed':   return <ConfirmedMatchesPage />;
      case 'nakshatra':   return <NakshatraPage />;
      case 'help':        return <HelpPage />;
      default:            return <DashboardPage />;
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${Surface[50]} ${Surface.text[800]} font-sans antialiased`}>
      <Toaster />

      {/* Sidebar — full height, left side, collapsible */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} onNavigate={handleNavigate} />

      {/* Right side: header (top) + content (bottom) */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader />
        <main className={`flex-1 overflow-y-auto ${Surface.opacity.bg_50_50}`}>
          {renderPage()}
        </main>
      </div>

      <ProfileDetailModal />
      <ProfileFormModal />
      <PaymentModal />
      <CommunityFormModal />
      <NakshatraFormModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </AppProvider>
  );
}

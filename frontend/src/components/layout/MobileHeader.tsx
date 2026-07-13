import React from 'react';
import { useApp } from '../../store/AppContext';
import {
  Heart,
  Menu,
  X,
  BarChart3,
  Users,
  Compass,
  Sparkles,
  ClipboardList,
  Settings,
  Building,
  MessageSquare,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import Avatar from '../Avatar';
import { Primary, Surface, Danger } from '../../theme';

interface MobileHeaderProps {
  onNavigate?: (tab: string) => void;
}

export default function MobileHeader({ onNavigate }: MobileHeaderProps) {
  const {
    currentUser,
    setCurrentUser,
    activeTab,
    setActiveTab,
    mobileMenuOpen,
    setMobileMenuOpen,
    showToast,
  } = useApp();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard Hub', Icon: BarChart3 },
    { key: 'directory', label: 'Manage Profiles (CRUD)', Icon: Users },
    { key: 'matcher', label: 'Porutham Matcher', Icon: Compass },
    { key: 'recommend', label: 'AI Matches Engine', Icon: Sparkles },
    { key: 'employees', label: 'Employee & Attendance', Icon: ClipboardList },
    { key: 'admin', label: 'Admin Console', Icon: Settings },
    { key: 'company', label: 'Company Profile', Icon: Building },
    { key: 'social', label: 'Media & Reviews', Icon: MessageSquare },
    { key: 'confirmed', label: 'Confirmed Matches', Icon: Heart },
    { key: 'help', label: 'Matching Rules & Info', Icon: HelpCircle },
  ] as const;

  const handleNav = (tab: string) => {
    setActiveTab(tab as typeof activeTab);
    setMobileMenuOpen(false);
    onNavigate?.(tab);
  };

  return (
    <div className="md:hidden flex flex-col w-full h-full overflow-hidden">
      <header className={`flex items-center justify-between px-6 py-4 ${Surface[900]} text-white shrink-0`}>
        <div className="flex items-center space-x-2">
          <Heart className={`h-5 w-5 ${Primary.text[400]} ${Primary.fill[400]}`} />
          <span className="font-bold text-sm tracking-tight">Manappandal Matrimony</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-1 ${Surface.text[400]} hover:text-white cursor-pointer`}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className={`absolute top-16 left-0 right-0 z-40 ${Surface[900]} ${Surface.border[800]} shadow-2xl p-4 flex flex-col space-y-1`}>
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleNav(key)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-semibold ${
                activeTab === key ? `${Primary[600]} text-white` : `${Surface.text[300]} ${Surface.hover.bg[800]}`
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{label}</span>
            </button>
          ))}

          <div className={`pt-4 mt-2 ${Surface.border[800]} flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Avatar type={currentUser?.avatarUrl || 'male_1'} className="h-8 w-8 rounded-full" />
              <div>
                <p className="text-[11px] font-bold text-white leading-none">{currentUser?.name}</p>
                <p className={`text-[9px] ${Primary.text[400]} mt-1 uppercase font-semibold`}>{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('matrimony_logged_user');
                setCurrentUser(null);
                setMobileMenuOpen(false);
                showToast('Logged out successfully', 'info');
              }}
              className={`flex items-center space-x-1.5 text-xs ${Danger.text[400]} ${Danger.opacity.bg_10} hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg transition`}
            >
              <LogOut className="h-3 w-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

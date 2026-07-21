import { Heart, BarChart3, Building, Users, Compass, Sparkles, ClipboardList, Calendar, Settings, MessageSquare, HelpCircle, ChevronLeft, ChevronRight, Star, HeartHandshake } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useApp } from '../../store/AppContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Primary, Surface, Static } from '../../theme';
import { motion } from 'motion/react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: (tab: string) => void;
}

const NAV_ITEMS = [
  { key: 'dashboard', labelKey: 'dashboard', Icon: BarChart3 },
  { key: 'company', labelKey: 'companyProfile', Icon: Building },
  { key: 'directory', labelKey: 'manageProfiles', Icon: Users },
  { key: 'matcher', labelKey: 'poruthamMatcher', Icon: Compass },
  { key: 'nakshatra', labelKey: 'nakshatraPorutham', Icon: Star },
  { key: 'confirmed', labelKey: 'confirmedMatches', Icon: HeartHandshake },
  { key: 'attendance', labelKey: 'attendanceEntry', Icon: Calendar },
  { key: 'admin', labelKey: 'userCreationSettings', Icon: Settings },
] as const;

export default function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const { t } = useI18n();

  const handleNav = (tab: string) => {
    setActiveTab(tab as any);
    onNavigate?.(tab);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        relative h-full ${Static.white} ${Surface.border[200]} border-r
        flex flex-col shrink-0 z-40
        transition-all duration-300 ease-in-out shadow-sm
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`absolute top-6 -right-3.5 z-50 w-7 h-7 flex items-center justify-center rounded-full ${Static.white} border ${Surface.border[200]} ${Surface.text[400]} hover:${Primary.text[600]} hover:border-${Primary.border[200]} hover:bg-indigo-50/50 transition-all cursor-pointer shadow-sm`}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Brand Header */}
      <div className={`
        h-20 flex items-center shrink-0 border-b ${Surface.border[100]}
        ${collapsed ? 'justify-center' : 'justify-start px-6'}
      `}>
        {!collapsed ? (
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md flex items-center justify-center`}>
              <Heart className={`h-5 w-5 ${Static.textWhite} fill-white shrink-0`} />
            </div>
            <span className={`text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap`}>
              Manappandal
            </span>
          </div>
        ) : (
          <div className={`p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md flex items-center justify-center`}>
            <Heart className={`h-5 w-5 ${Static.textWhite} fill-white shrink-0`} />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ key, labelKey, Icon }) => {
          if (key === 'attendance' && !currentUser?.permissions.viewAttendance) return null;
          const isActive = activeTab === key;
          const label = t(labelKey);

          const button = (
            <button
              onClick={() => handleNav(key)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                isActive 
                  ? 'bg-indigo-50/50 text-indigo-700 shadow-sm border border-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : Surface.text[400]}`} />
              {!collapsed && <span className="truncate">{label}</span>}
              {isActive && !collapsed && (
                <motion.div layoutId="activeNav" className="absolute right-0 w-1 h-6 bg-indigo-600 rounded-l-full" />
              )}
            </button>
          );

          if (collapsed) {
            return (
              <div key={key} className="relative">
                <Tooltip>
                  <TooltipTrigger render={<div />}>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="bg-slate-800 text-white border-none rounded-lg font-medium">
                    {label}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          }

          return (
            <div key={key} className="relative">
              {button}
            </div>
          );
        })}
      </nav>
      
      {/* Bottom Profile Hint (if not collapsed) */}
      {!collapsed && (
        <div className={`p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/30 flex items-center space-x-3`}>
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 border border-indigo-200">
            {currentUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-700 truncate">{currentUser?.name || 'Admin User'}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser?.role || 'Administrator'}</p>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

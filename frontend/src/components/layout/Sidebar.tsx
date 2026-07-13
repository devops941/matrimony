import { Heart, BarChart3, Building, Users, Compass, Sparkles, ClipboardList, Calendar, Settings, MessageSquare, HelpCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useApp } from '../../store/AppContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Primary, Surface, Static } from '../../theme';

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
  { key: 'recommend', labelKey: 'aiMatchesEngine', Icon: Sparkles },
  { key: 'employees', labelKey: 'employeeAttendance', Icon: ClipboardList },
  { key: 'attendance', labelKey: 'attendanceEntry', Icon: Calendar },
  { key: 'admin', labelKey: 'adminConsole', Icon: Settings },
  { key: 'social', labelKey: 'mediaReview', Icon: MessageSquare },
  { key: 'confirmed', labelKey: 'confirmedMatches', Icon: Heart },
  { key: 'help', labelKey: 'matchingRulesInfo', Icon: HelpCircle },
] as const;

export default function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const { t } = useI18n();

  const handleNav = (tab: string) => {
    setActiveTab(tab as any);
    onNavigate?.(tab);
  };

  return (
    <aside
      className={`
        relative h-full ${Surface[900]} ${Surface.text[300]} ${Surface.border[800]}
        flex flex-col shrink-0 z-40
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[56px]' : 'w-60'}
      `}
    >
      {/* Toggle button — centered on right border of sidebar */}
      <button
        onClick={onToggle}
        className={`absolute top-5 right-0 translate-x-1/2 z-50 w-7 h-7 flex items-center justify-center rounded-full ${Surface[900]} border ${Surface.border[700]} ${Surface.text[400]} ${Primary.hover.bg[600]} ${Primary.hover.text[400]} transition-all cursor-pointer shadow-lg`}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Brand Header */}
      <div className={`
        h-12 ${Surface.border[800]} flex items-center ${Surface.opacity.bg_950_40} shrink-0
        ${collapsed ? 'justify-center' : 'justify-start px-3 pr-10'}
      `}>
        {!collapsed ? (
          <div className="flex items-center space-x-2 min-w-0">
            <Heart className={`h-4 w-4 ${Primary.text[400]} ${Primary.fill[400]} shrink-0`} />
            <span className="text-[11px] font-bold tracking-tight text-white leading-none whitespace-nowrap">Manappandal</span>
          </div>
        ) : (
          <Heart className={`h-4 w-4 ${Primary.text[400]} ${Primary.fill[400]}`} />
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ key, labelKey, Icon }) => {
          if (key === 'attendance' && !currentUser?.permissions.viewAttendance) return null;
          const isActive = activeTab === key;
          const label = t(labelKey);

          const button = (
            <button
              onClick={() => handleNav(key)}
              className={`
                w-full flex items-center gap-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer
                ${collapsed ? 'justify-center py-2.5 px-0' : 'py-2.5 px-3'}
                ${isActive
                  ? `${Primary[600]} text-white ${Primary.shadow['950_30']}`
                  : `${Surface.text[400]} ${Surface.hover.bg[800]} ${Surface.hover.text[100]}`
                }
              `}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );

          if (collapsed) {
            return (
              <div key={key} className="relative px-2">
                <Tooltip>
                  <TooltipTrigger render={<div />}>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {label}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          }

          return (
            <div key={key} className="relative px-2">
              {button}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

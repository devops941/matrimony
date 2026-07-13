import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import Avatar from '../Avatar';
import { useApp } from '../../store/AppContext';
import { useI18n } from '../../i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Primary, Surface, Static } from '../../theme';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  directory: 'Directory',
  matcher: 'Porutham Matcher',
  recommend: 'AI Recommendations',
  employees: 'Employees',
  attendance: 'Attendance',
  admin: 'Admin Console',
  company: 'Company Profile',
  social: 'Media & Reviews',
  confirmed: 'Confirmed Matches',
  help: 'Help & Rules',
};

export default function TopHeader() {
  const { currentUser, setCurrentUser, activeTab, showToast } = useApp();
  const { language, setLanguage } = useI18n();

  const handleLogout = () => {
    localStorage.removeItem('matrimony_logged_user');
    setCurrentUser(null);
    showToast('Successfully logged out.', 'info');
  };

  return (
    <header className={`h-12 ${Static.white} ${Surface.border[200]} flex items-center justify-between px-5 shrink-0`}>
      {/* Left: page title */}
      <h1 className={`text-sm font-bold ${Surface.text[800]} tracking-tight`}>
        {PAGE_TITLES[activeTab] || 'Dashboard'}
      </h1>

      {/* Right: language select + user profile dropdown */}
      <div className="flex items-center space-x-2">
        {/* Language selector */}
        <Select value={language} onValueChange={(val) => setLanguage(val as 'en' | 'ta')}>
          <SelectTrigger size="sm" className="text-[11px] font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ta">தமிழ்</SelectItem>
          </SelectContent>
        </Select>

        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center space-x-2 p-1.5 rounded-xl ${Surface.hover.bg[100]} transition cursor-pointer outline-none`}>
              <Avatar
                type={currentUser.avatarUrl || (currentUser.role === 'Admin' ? 'male_1' : 'female_1')}
                className={`h-7 w-7 rounded-full ring-2 ${Primary.opacity.ring_20}`}
              />
              <div className="hidden sm:block text-left">
                <p className={`text-[11px] font-bold ${Surface.text[800]} leading-none`}>{currentUser.name}</p>
                <p className={`text-[9px] ${Surface.text[400]} mt-0.5`}>{currentUser.designation}</p>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-52">
              <div className={`px-3 py-3 ${Surface.border[100]}`}>
                <p className={`text-xs font-bold ${Surface.text[800]}`}>{currentUser.name}</p>
                <p className={`text-[10px] ${Surface.text[400]} mt-0.5`}>{currentUser.email}</p>
                <span className={`inline-block mt-1.5 text-[9px] ${Primary[50]} ${Primary.text[600]} font-bold uppercase px-2 py-0.5 rounded-full`}>
                  {currentUser.role}
                </span>
              </div>
              <DropdownMenuItem>
                <User className={`h-3.5 w-3.5 ${Surface.text[400]}`} />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className={`h-3.5 w-3.5 ${Surface.text[400]}`} />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className={`h-3.5 w-3.5 ${Surface.text[400]}`} />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" />
                <span className="font-semibold">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

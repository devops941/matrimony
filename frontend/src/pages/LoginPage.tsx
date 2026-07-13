import { Heart, Lock, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Primary, Surface, Danger } from '../theme';

export default function LoginPage() {
  const {
    employees,
    setCurrentUser,
    loginUsername,
    setLoginUsername,
    loginPassword,
    setLoginPassword,
    loginError,
    setLoginError,
    showToast,
  } = useApp();

  return (
    <div className={`min-h-screen w-screen flex flex-col items-center justify-center ${Surface[900]} font-sans antialiased relative px-4 overflow-y-auto py-12`}>
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${Primary.opacity.bg_10} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${Danger.opacity.bg_10} rounded-full blur-3xl pointer-events-none`} />

      <div className={`w-full max-w-md ${Surface[950]} border ${Surface.opacity.bd_800_80} rounded-3xl shadow-2xl p-8 relative z-10`}>
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className={`h-14 w-14 rounded-2xl ${Primary.opacity.bg_600_10} ${Primary.opacity.border_20} flex items-center justify-center mb-4`}>
            <Heart className={`h-8 w-8 ${Primary.text[400]} ${Primary.fill[400]}`} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-display">Manappandal Matrimony Portal</h1>
          <p className={`text-xs ${Surface.text[400]} mt-1`}>Staff Operations & Franchise Manager</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const found = employees.find(emp => emp.username.toLowerCase() === loginUsername.trim().toLowerCase() && emp.password === loginPassword);
          if (found) {
            setCurrentUser(found);
            localStorage.setItem('matrimony_logged_user', JSON.stringify(found));
            showToast(`Welcome back, ${found.name}!`, 'success');
            setLoginUsername('');
            setLoginPassword('');
            setLoginError('');
          } else {
            setLoginError('Invalid username or password. Please try again.');
          }
        }} className="space-y-4">
          <div className="space-y-2">
            <label className={`text-xs font-bold ${Surface.text[300]} uppercase tracking-wider`}>Username</label>
            <Input
              required
              placeholder="Enter employee username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className={`${Surface[900]} ${Surface.border[800]} ${Primary.focus.border} text-white placeholder:text-slate-600 rounded-xl h-11`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold ${Surface.text[300]} uppercase tracking-wider`}>Password</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className={`${Surface[900]} ${Surface.border[800]} ${Primary.focus.border} text-white placeholder:text-slate-600 rounded-xl h-11`}
            />
          </div>

          {loginError && (
            <div className={`flex items-center space-x-2 ${Danger.text[400]} ${Danger.opacity.bg_10} border ${Danger.opacity.border_20} rounded-xl p-3 text-xs`}>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <Button
            type="submit"
            className={`w-full ${Primary[600]} ${Primary.hover.bg[500]} text-white font-semibold py-3.5 rounded-xl text-xs shadow-lg ${Primary.shadow['600_25']} ${Primary.hoverShadow['500_35']}`}
          >
            <Lock className="h-4 w-4" />
            <span>Authenticate & Enter Portal</span>
          </Button>
        </form>

        <div className={`mt-8 pt-6 border-t ${Surface.opacity.bd_800_80}`}>
          <h3 className={`text-[10px] font-bold ${Surface.text[400]} uppercase tracking-wider mb-3 flex items-center justify-between`}>
            <span>Demo Accounts (Role-Based Testing)</span>
            <span className={`text-[9px] lowercase font-normal ${Primary.text[400]} font-semibold animate-pulse`}>Click to autofill</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {employees.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => {
                  setLoginUsername(emp.username);
                  setLoginPassword('password');
                  setLoginError('');
                }}
                className={`flex flex-col text-left p-2.5 rounded-xl border ${Surface.border[800]} ${Surface.hover.border[700]} ${Surface.hoverOpacity.bg_900_40} transition text-[10px] cursor-pointer`}
              >
                <span className="font-bold text-white truncate">{emp.name}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className={`${Primary.text[400]} font-extrabold uppercase text-[8px]`}>{emp.role === 'Admin' ? 'Admin' : 'Employee'}</span>
                  <span className={`${Surface.text[500]} text-[8px] italic truncate max-w-[60px]`}>
                    {emp.permissions.delete ? 'Full' : emp.permissions.edit ? 'Edit/Create' : emp.permissions.create ? 'Create' : 'View'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <p className={`text-[10px] ${Surface.text[500]} mt-6 relative z-10`}>Manappandal Matrimony Operational Interface v2.5.0</p>
    </div>
  );
}

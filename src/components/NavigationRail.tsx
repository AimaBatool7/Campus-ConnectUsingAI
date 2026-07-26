import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  CreditCard, 
  CalendarDays, 
  Megaphone, 
  Bot, 
  QrCode, 
  ShieldCheck 
} from 'lucide-react';
import { AppRole } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'registration'
  | 'fees'
  | 'schedule'
  | 'announcements'
  | 'ai_bot'
  | 'digital_id'
  | 'admin';

interface NavigationRailProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  role: AppRole;
  pendingRegCount: number;
  pendingFeeCount: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  onChangeTab,
  role,
  pendingRegCount,
  pendingFeeCount,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'registration' as NavTab, label: 'Register', icon: UserPlus, badge: pendingRegCount > 0 ? pendingRegCount : undefined },
    { id: 'fees' as NavTab, label: 'Fees & Pay', icon: CreditCard, badge: pendingFeeCount > 0 ? pendingFeeCount : undefined },
    { id: 'schedule' as NavTab, label: 'Schedule', icon: CalendarDays },
    { id: 'announcements' as NavTab, label: 'Notices', icon: Megaphone },
    { id: 'ai_bot' as NavTab, label: 'AI Assistant', icon: Bot, isHighlight: true },
    { id: 'digital_id' as NavTab, label: 'Digital ID', icon: QrCode },
  ];

  if (role === 'admin') {
    navItems.push({ id: 'admin' as NavTab, label: 'Registrar', icon: ShieldCheck });
  }

  return (
    <>
      {/* Desktop & Tablet Side Navigation Rail */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-3 min-h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : item.isHighlight
                    ? 'text-teal-300 hover:bg-slate-800/80 bg-teal-950/30 border border-teal-900/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : item.isHighlight ? 'text-teal-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Help Card in Sidebar */}
        <div className="mt-auto pt-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/70 text-slate-200">
            <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold text-xs">
              <Bot className="w-4 h-4" />
              <span>Need Assistance?</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Ask Gemini 2.5 Flash for registration help, fee waivers, or class schedules.
            </p>
            <button
              onClick={() => onChangeTab('ai_bot')}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm"
            >
              Open AI Assistant
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Material 3 Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-0 right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

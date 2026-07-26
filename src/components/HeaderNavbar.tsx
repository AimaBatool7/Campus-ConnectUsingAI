import React, { useState } from 'react';
import { 
  GraduationCap, 
  Smartphone, 
  Monitor, 
  UserCheck, 
  ShieldCheck, 
  Bell, 
  QrCode, 
  Sparkles,
  ChevronRight,
  LogOut,
  LogIn,
  X
} from 'lucide-react';
import { AppRole, Announcement, StudentProfile } from '../types';

interface HeaderNavbarProps {
  role: AppRole;
  onToggleRole: (newRole: AppRole) => void;
  isAndroidFrame: boolean;
  onToggleFrame: () => void;
  announcements: Announcement[];
  profile: StudentProfile;
  onOpenDigitalId: () => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  role,
  onToggleRole,
  isAndroidFrame,
  onToggleFrame,
  announcements,
  profile,
  onOpenDigitalId,
  onSelectAnnouncement,
  onOpenAuth,
  isAuthenticated,
  onSignOut,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const urgentCount = announcements.filter(a => a.isUrgent).length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & App Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CampusConnect <span className="text-emerald-400 font-extrabold">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800/60">
                <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Material 3
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart Student Registration & Fee Management System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Frame View Toggle (Android Phone Preview vs Responsive Web) */}
          <button
            onClick={onToggleFrame}
            title={isAndroidFrame ? "Switch to Full Desktop View" : "Switch to Android Mobile View"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isAndroidFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Android Frame</span>
              </>
            )}
          </button>

          {/* Digital ID Shortcut */}
          <button
            onClick={onOpenDigitalId}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-colors"
            title="View Student Digital ID"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ID Pass</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 relative transition-colors"
              title="Announcements & Alerts"
            >
              <Bell className="w-4 h-4" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-100 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs">University Announcements</span>
                  </div>
                  <button 
                    onClick={() => setShowNotifs(false)}
                    className="p-1 hover:bg-slate-700 rounded-md text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectAnnouncement(item);
                        setShowNotifs(false);
                      }}
                      className="p-3 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isUrgent ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill (Student vs Registrar/Admin) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onToggleRole('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                role === 'student'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student</span>
            </button>
            <button
              onClick={() => onToggleRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* User Auth Controls */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                  title={`${profile.name} (${role})`}
                />
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

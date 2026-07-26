import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Smartphone,
  X
} from 'lucide-react';
import { AppRole } from '../types';

interface AuthUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  rollNumber?: string;
}

interface AuthScreenProps {
  onAuthSuccess: (user: AuthUser) => void;
  onCancel?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [selectedRole, setSelectedRole] = useState<AppRole>('student');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Demo Logins
  const handleDemoLogin = (role: AppRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        uid: role === 'student' ? 'STU-2026-8842' : 'ADM-9021',
        name: role === 'student' ? 'Aisha Malik' : 'Prof. Dr. Tariq Hassan (Registrar)',
        email: role === 'student' ? 'aisha.malik@campusconnect.edu' : 'registrar@campusconnect.edu',
        phone: '+1 (555) 234-5678',
        role,
        rollNumber: role === 'student' ? 'BSCS-2026-042' : 'EMP-REG-01',
      });
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form Validations
    if (authMethod === 'email') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Please enter a valid academic email address.');
        return;
      }
      if (mode !== 'forgot_password' && (!password || password.length < 6)) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
    } else {
      if (!phone || phone.length < 8) {
        setErrorMessage('Please enter a valid phone number with country code.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (mode === 'forgot_password') {
        setSuccessMessage(`Password reset link sent to ${email}. Check your inbox!`);
        return;
      }

      if (authMethod === 'mobile' && !isOtpSent) {
        setIsOtpSent(true);
        setSuccessMessage(`6-digit OTP code sent via SMS to ${phone}. Enter 123456 to verify.`);
        return;
      }

      if (authMethod === 'mobile' && isOtpSent) {
        if (otpCode !== '123456' && otpCode !== '000000') {
          setErrorMessage('Invalid OTP code. Please enter 123456 for demo verification.');
          return;
        }
      }

      // Successful Auth
      onAuthSuccess({
        uid: `USER-${Math.floor(100000 + Math.random() * 900000)}`,
        name: fullName || (selectedRole === 'student' ? 'Student User' : 'Campus Administrator'),
        email: email || `${phone.replace(/\D/g, '')}@campusconnect.edu`,
        phone: phone || '+1 (555) 000-1122',
        role: selectedRole,
        rollNumber: selectedRole === 'student' ? 'BSCS-2026-099' : 'EMP-ADM-02',
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
        
        {/* Cancel Button if modal */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              CampusConnect <span className="text-emerald-400">AI</span>
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'login' ? 'Sign in to access student dashboard & fee portal' : mode === 'register' ? 'Create student account & store credentials' : 'Reset your password'}
            </p>
          </div>
        </div>

        {/* Role Selector Tabs (Student vs Admin) */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'student'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin / Registrar</span>
          </button>
        </div>

        {/* Auth Method Toggle: Email vs Mobile OTP */}
        {mode !== 'forgot_password' && (
          <div className="flex items-center justify-center gap-4 text-xs border-b border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setIsOtpSent(false);
              }}
              className={`font-semibold flex items-center gap-1 pb-1 border-b-2 transition-colors ${
                authMethod === 'email' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile');
                setIsOtpSent(false);
              }}
              className={`font-semibold flex items-center gap-1 pb-1 border-b-2 transition-colors ${
                authMethod === 'mobile' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
          </div>
        )}

        {/* Error / Success Feedback Banners */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                placeholder="e.g. Aisha Malik"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {authMethod === 'email' || mode === 'forgot_password' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Academic Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="student@campusconnect.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {mode !== 'forgot_password' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot_password')}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Mobile Number & OTP Verification */
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {isOtpSent && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">6-Digit OTP Code</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-widest text-center text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? authMethod === 'mobile' && !isOtpSent ? 'Send OTP Code' : 'Sign In to CampusConnect'
                    : mode === 'register' ? 'Complete Registration' : 'Send Password Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Login Shortcuts */}
        <div className="pt-3 border-t border-slate-800 text-center space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Quick Demo Login</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Footer Toggle Mode */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {mode === 'login' ? (
            <p>
              New student?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-400 font-bold hover:underline"
              >
                Register Online
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-400 font-bold hover:underline"
              >
                Sign In Here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

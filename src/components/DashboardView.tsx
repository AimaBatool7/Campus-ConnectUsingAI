import React, { useState } from 'react';
import { 
  GraduationCap, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Sparkles,
  TrendingUp,
  FileText,
  User,
  BookOpen,
  Users,
  Building2,
  Download,
  Receipt,
  Mail,
  Phone,
  Search,
  Check,
  ChevronRight,
  Printer,
  XCircle
} from 'lucide-react';
import { StudentProfile, FeeItem, ScheduleItem, Announcement, ClassFeeChallan } from '../types';
import { RegistrationSlipModal } from './RegistrationSlipModal';
import { INITIAL_CLASS_CHALLANS } from './FeeManagementView';

interface DashboardViewProps {
  profile: StudentProfile;
  fees: FeeItem[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
  onNavigateTab: (tab: any) => void;
  onPayFee: (fee: FeeItem) => void;
}

// Faculty / Teacher Directory
export interface TeacherInfo {
  id: string;
  name: string;
  title: string;
  subject: string;
  code: string;
  email: string;
  office: string;
  consultationHours: string;
  avatar: string;
}

export const FACULTY_TEACHERS: TeacherInfo[] = [
  {
    id: 'TCH-01',
    name: 'Dr. Robert Vance',
    title: 'Professor & Head of AI Lab',
    subject: 'Machine Learning & Neural Networks',
    code: 'CS-401',
    email: 'r.vance@campusconnect.edu',
    office: 'Room 402, AI Tower',
    consultationHours: 'Mon & Wed: 02:00 PM - 04:00 PM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'TCH-02',
    name: 'Prof. Sarah Jenkins',
    title: 'Associate Professor',
    subject: 'Database Systems Architecture',
    code: 'CS-308',
    email: 's.jenkins@campusconnect.edu',
    office: 'Hall B, Science Block',
    consultationHours: 'Tue & Thu: 11:00 AM - 01:00 PM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'TCH-03',
    name: 'Eng. Marcus Thorne',
    title: 'Senior Cloud Architect',
    subject: 'Cloud Infrastructure & DevOps',
    code: 'CS-420',
    email: 'm.thorne@campusconnect.edu',
    office: 'Server Lab 2, Tech Complex',
    consultationHours: 'Wed: 10:00 AM - 12:00 PM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'TCH-04',
    name: 'Dr. Elena Rostova',
    title: 'Senior Lecturer',
    subject: 'Software Engineering Principles',
    code: 'CS-312',
    email: 'e.rostova@campusconnect.edu',
    office: 'Room 305, Academic Block',
    consultationHours: 'Fri: 01:00 PM - 03:00 PM',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  fees,
  schedule,
  announcements,
  onNavigateTab,
  onPayFee,
}) => {
  const [isRegistrationSlipOpen, setIsRegistrationSlipOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');

  // Sync Class Fee Challans from LocalStorage for Payment History
  const [classChallans] = useState<ClassFeeChallan[]>(() => {
    const saved = localStorage.getItem('campus_connect_class_challans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse challans:', e);
      }
    }
    return INITIAL_CLASS_CHALLANS;
  });

  const pendingFees = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const totalPendingAmount = pendingFees.reduce((acc, f) => acc + f.amount, 0);

  // Daily Schedule filtering
  const daySchedule = schedule.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-10">
      
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: WELCOME HERO & QUICK PDF REGISTRATION SLIP ACTION */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Student Account
              </span>
              <span className="text-xs text-slate-300 font-medium">Roll #: <code className="font-mono text-emerald-400 font-bold">{profile.rollNumber}</code></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {profile.program} • {profile.department} (Semester {profile.semester})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* REGISTRATION SLIP PDF DOWNLOAD BUTTON */}
            <button
              onClick={() => setIsRegistrationSlipOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Registration Slip (PDF)</span>
            </button>

            <button
              onClick={() => onNavigateTab('ai_bot')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: PROFILE CARD (Material 3 Surface Tonal Container) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          
          <div className="flex items-center gap-4">
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {profile.registrationStatus}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {profile.id}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
              <p className="text-xs text-slate-300 font-medium">Guardian: {profile.guardianName} ({profile.guardianPhone})</p>
              <p className="text-xs text-slate-400 flex items-center gap-2 pt-0.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> {profile.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0 text-left md:text-right">
            <button
              onClick={() => setIsRegistrationSlipOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Download Official Registration Slip</span>
            </button>
          </div>

        </div>

        {/* Profile Metrics Grid (Material 3 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Academic GPA</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white">{profile.gpa.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-400 font-bold">/ 4.0</span>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <TrendingUp className="w-3 h-3" /> Honor Roll
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Attendance Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white">{profile.attendancePct}%</span>
            </div>
            <span className="text-[10px] text-teal-400 font-semibold">Regular Standing</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Enrolled Program</span>
            <span className="text-sm font-bold text-white block line-clamp-1">{profile.program}</span>
            <span className="text-[10px] text-slate-400 block font-mono">Sem {profile.semester}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Registration Date</span>
            <span className="text-sm font-bold text-white block">{profile.registrationDate}</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">Status: Active</span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3 & 4: FEE STATUS & PAYMENT HISTORY (Material 3 Cards) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FEE STATUS CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Fee Status Summary</h3>
              </div>
              <button
                onClick={() => onNavigateTab('fees')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <span>Class 1-8 / Semester Fees</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Outstanding Semester Fee</span>
                <span className="text-xl font-extrabold text-amber-400">${totalPendingAmount}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{pendingFees.length} Pending Invoices</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Class 1–8 Challan Status</span>
                <span className="text-xl font-extrabold text-emerald-400">
                  {classChallans.filter(c => c.status === 'Approved').length} Approved
                </span>
                <span className="text-[10px] text-amber-300 block mt-0.5">
                  {classChallans.filter(c => c.status === 'Pending').length} Pending Review
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Recent Pending Fees:</span>
              {pendingFees.slice(0, 2).map((fee) => (
                <div key={fee.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{fee.title}</span>
                    <span className="text-[10px] text-slate-400">Due: {fee.dueDate}</span>
                  </div>
                  <span className="font-extrabold text-emerald-400">${fee.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('fees')}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Fees & Upload Deposit Challans</span>
            </button>
          </div>
        </div>

        {/* PAYMENT HISTORY CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Verified Payment History</h3>
            </div>
            <span className="text-[10px] bg-slate-950 text-slate-300 px-2.5 py-1 rounded-full font-mono border border-slate-800">
              Transaction Logs
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {fees.filter(f => f.status === 'Paid').map((paid) => (
              <div key={paid.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      PAID
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{paid.invoiceNumber}</span>
                  </div>
                  <h4 className="font-bold text-white">{paid.title}</h4>
                  <p className="text-[10px] text-slate-400">Date: {paid.paidDate} • Method: {paid.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-400">${paid.amount}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">TXN Verified</span>
                </div>
              </div>
            ))}

            {classChallans.map((challan) => (
              <div key={challan.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      challan.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      CHALLAN: {challan.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{challan.selectedClass}</span>
                  </div>
                  <h4 className="font-bold text-white">Challan #: {challan.challanNumber}</h4>
                  <p className="text-[10px] text-slate-400">Submitted: {challan.submittedAt}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-400">Rs. {challan.totalFee.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">Bank Slip</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: ENROLLED SUBJECTS & CLASSROOM LOCATIONS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Enrolled Subjects & Designated Classrooms
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Course details, assigned credits, attendance tracking, and physical lab/hall locations.
            </p>
          </div>
          <span className="text-[10px] bg-slate-950 text-emerald-400 px-3 py-1 rounded-full border border-slate-800 font-bold">
            Semester {profile.semester} Active
          </span>
        </div>

        {/* Subjects Grid (Material 3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {item.code}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded uppercase">
                  {item.type}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">{item.subject}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.instructor}</p>
              </div>

              {/* Classroom Location Info */}
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Classroom Location</span>
                  <span className="font-bold text-white">{item.room}</span>
                </div>
              </div>

              {/* Attendance Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Attendance:</span>
                  <span className="font-bold text-emerald-400">{item.attendanceRate}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${item.attendanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 6: TEACHERS & FACULTY DIRECTORY */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Assigned Teachers & Faculty Consultation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contact course professors directly and view office consultation hours.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACULTY_TEACHERS.map((teacher) => (
            <div key={teacher.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-4 shadow-md">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
              />
              <div className="space-y-1 text-xs w-full">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {teacher.code} • {teacher.subject}
                </span>
                <h4 className="font-bold text-sm text-white pt-1">{teacher.name}</h4>
                <p className="text-[11px] text-slate-400">{teacher.title}</p>
                <div className="pt-2 text-[11px] text-slate-300 space-y-1">
                  <p className="flex items-center gap-1 text-slate-400">
                    <Mail className="w-3 h-3 text-emerald-400" /> {teacher.email}
                  </p>
                  <p className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-amber-400" /> Office: {teacher.office}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium pt-0.5">
                    Consultation: {teacher.consultationHours}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 7: MONTHLY TIMETABLE / WEEKLY LECTURE SCHEDULE */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Monthly Timetable & Interactive Schedule
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select day to view daily class timetable, timings, and classroom allocations.
            </p>
          </div>

          {/* Day Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedDay === day
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable List */}
        <div className="space-y-3">
          {daySchedule.length > 0 ? (
            daySchedule.map((slot) => (
              <div key={slot.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {slot.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{slot.type}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{slot.subject}</h4>
                  <p className="text-xs text-slate-400">{slot.instructor}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono font-bold text-white">{slot.time}</span>
                  </div>
                  <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-white">{slot.room}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
              No lectures scheduled for {selectedDay}.
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 8: ANNOUNCEMENTS & CAMPUS NOTICES */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              University Notices & Official Announcements
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official circulars from Bursar Office, Registrar, and Examination Cell.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('announcements')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <span>All Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  ann.isUrgent ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {ann.category}
                </span>
                <span className="text-[10px] text-slate-400">{ann.date}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{ann.title}</h4>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{ann.content}</p>
              <span className="text-[10px] text-emerald-400 font-medium block pt-1">
                Issued by: {ann.author}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* REGISTRATION SLIP PDF MODAL */}
      <RegistrationSlipModal
        profile={profile}
        isOpen={isRegistrationSlipOpen}
        onClose={() => setIsRegistrationSlipOpen(false)}
      />

    </div>
  );
};

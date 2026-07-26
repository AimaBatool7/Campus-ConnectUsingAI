import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Users, 
  DollarSign, 
  FileText, 
  Sparkles,
  AlertCircle,
  Clock,
  Check,
  X,
  CreditCard,
  Building,
  CheckSquare,
  Search,
  Edit3,
  Plus,
  Trash2,
  Calendar,
  BookOpen,
  Send,
  UserCheck,
  Filter,
  Save,
  Download,
  Receipt,
  Mail,
  Phone,
  ArrowRight,
  Layers
} from 'lucide-react';
import { 
  StudentProfile, 
  FeeItem, 
  ScheduleItem, 
  Announcement, 
  ClassFeeChallan, 
  AdminStudentRecord, 
  TeacherRecord 
} from '../types';
import { CLASS_FEE_STRUCTURES, INITIAL_CLASS_CHALLANS, ClassFeeStructure } from './FeeManagementView';
import { FACULTY_TEACHERS } from './DashboardView';
import { initialSchedule, initialAnnouncements } from '../data/initialData';

interface AdminPortalViewProps {
  studentProfile?: StudentProfile;
  onUpdateProfile?: (updated: StudentProfile) => void;
  onAddAnnouncement?: (announcement: Omit<Announcement, 'id'>) => void;
  onUpdateSchedule?: (updatedSchedule: ScheduleItem[]) => void;
  onUpdateFees?: (updatedFees: FeeItem[]) => void;
}

// Default Admin Students List
const INITIAL_ADMIN_STUDENTS: AdminStudentRecord[] = [
  {
    id: 'STU-2026-001',
    name: 'Ahmad Hassan',
    cnic: '42101-9928174-2',
    rollNumber: 'BSCS-2022-042',
    email: 'ahmad.hassan@campusconnect.edu',
    phone: '+92 300 1234567',
    department: 'Computer Science',
    program: 'BS Computer Science',
    semester: 6,
    gpa: 3.82,
    attendancePct: 94,
    guardianName: 'Hassan Mahmood',
    guardianPhone: '+92 300 7654321',
    status: 'Active',
    registrationDate: '2022-08-15',
  },
  {
    id: 'STU-2026-002',
    name: 'Aisha Malik',
    cnic: '42101-2222222-2',
    rollNumber: 'BSCS-2022-019',
    email: 'aisha.malik@campusconnect.edu',
    phone: '+92 301 9876543',
    department: 'Computer Science',
    program: 'BS Computer Science',
    semester: 6,
    gpa: 3.91,
    attendancePct: 98,
    guardianName: 'Tariq Malik',
    guardianPhone: '+92 301 1122334',
    status: 'Active',
    registrationDate: '2022-08-16',
  },
  {
    id: 'STU-2026-003',
    name: 'Usman Farooq',
    cnic: '42101-3333333-3',
    rollNumber: 'BSAI-2023-088',
    email: 'usman.farooq@campusconnect.edu',
    phone: '+92 302 4455667',
    department: 'Artificial Intelligence',
    program: 'BS Artificial Intelligence',
    semester: 4,
    gpa: 3.45,
    attendancePct: 88,
    guardianName: 'Farooq Ahmed',
    guardianPhone: '+92 302 9988776',
    status: 'Pending Review',
    registrationDate: '2023-08-20',
  },
  {
    id: 'STU-2026-004',
    name: 'Zainab Fatima',
    cnic: '42101-4444444-4',
    rollNumber: 'BSSE-2024-012',
    email: 'zainab.f@campusconnect.edu',
    phone: '+92 303 5566778',
    department: 'Software Engineering',
    program: 'BS Software Engineering',
    semester: 2,
    gpa: 3.70,
    attendancePct: 92,
    guardianName: 'Muhammad Ali',
    guardianPhone: '+92 303 1122445',
    status: 'Active',
    registrationDate: '2024-08-18',
  },
  {
    id: 'STU-2026-005',
    name: 'Bilal Khan',
    cnic: '42101-5555555-5',
    rollNumber: 'BSEE-2023-034',
    email: 'bilal.k@campusconnect.edu',
    phone: '+92 304 8899001',
    department: 'Electrical Engineering',
    program: 'BS Electrical Engineering',
    semester: 4,
    gpa: 3.10,
    attendancePct: 82,
    guardianName: 'Shahid Khan',
    guardianPhone: '+92 304 3344556',
    status: 'Approved',
    registrationDate: '2023-08-22',
  },
];

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  studentProfile,
  onUpdateProfile,
  onAddAnnouncement,
  onUpdateSchedule,
  onUpdateFees,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'students' | 'fee_approvals' | 'subjects' | 'teachers' | 'timetable' | 'fee_structure' | 'announcements' | 'payments'
  >('students');

  // Search Filters
  const [searchName, setSearchName] = useState('');
  const [searchCnic, setSearchCnic] = useState('');

  // 1. STUDENTS STATE
  const [students, setStudents] = useState<AdminStudentRecord[]>(() => {
    const saved = localStorage.getItem('campus_connect_admin_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing students:', e);
      }
    }
    return INITIAL_ADMIN_STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem('campus_connect_admin_students', JSON.stringify(students));
  }, [students]);

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<AdminStudentRecord | null>(null);

  // 2. CLASS FEE CHALLANS STATE
  const [challans, setChallans] = useState<ClassFeeChallan[]>(() => {
    const saved = localStorage.getItem('campus_connect_class_challans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing challans:', e);
      }
    }
    return INITIAL_CLASS_CHALLANS;
  });

  useEffect(() => {
    localStorage.setItem('campus_connect_class_challans', JSON.stringify(challans));
  }, [challans]);

  // Reject reason prompt
  const [rejectingChallanId, setRejectingChallanId] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  // 3. SUBJECTS / COURSES STATE
  const [subjectsList, setSubjectsList] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('campus_connect_subjects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing subjects:', e);
      }
    }
    return initialSchedule;
  });

  useEffect(() => {
    localStorage.setItem('campus_connect_subjects', JSON.stringify(subjectsList));
    if (onUpdateSchedule) onUpdateSchedule(subjectsList);
  }, [subjectsList]);

  // Subject Modal State
  const [editingSubject, setEditingSubject] = useState<Partial<ScheduleItem> | null>(null);

  // 4. TEACHERS / FACULTY STATE
  const [teachersList, setTeachersList] = useState<TeacherRecord[]>(() => {
    const saved = localStorage.getItem('campus_connect_teachers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing teachers:', e);
      }
    }
    return FACULTY_TEACHERS;
  });

  useEffect(() => {
    localStorage.setItem('campus_connect_teachers', JSON.stringify(teachersList));
  }, [teachersList]);

  // Teacher Modal State
  const [editingTeacher, setEditingTeacher] = useState<Partial<TeacherRecord> | null>(null);

  // 5. TIMETABLE STATE
  const [timetableList, setTimetableList] = useState<ScheduleItem[]>(subjectsList);

  useEffect(() => {
    setTimetableList(subjectsList);
  }, [subjectsList]);

  // Timetable Slot Modal State
  const [editingSlot, setEditingSlot] = useState<Partial<ScheduleItem> | null>(null);

  // 6. CLASS FEE STRUCTURES STATE
  const [feeStructures, setFeeStructures] = useState<ClassFeeStructure[]>(() => {
    const saved = localStorage.getItem('campus_connect_fee_structures');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing fee structures:', e);
      }
    }
    return CLASS_FEE_STRUCTURES;
  });

  useEffect(() => {
    localStorage.setItem('campus_connect_fee_structures', JSON.stringify(feeStructures));
  }, [feeStructures]);

  // Fee Structure Edit Modal
  const [editingFeeStructure, setEditingFeeStructure] = useState<ClassFeeStructure | null>(null);

  // 7. ANNOUNCEMENT BROADCAST FORM
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState<'Academic' | 'Fee Alert' | 'Exam' | 'Event' | 'General'>('General');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementAuthor, setAnnouncementAuthor] = useState('Registrar Office');
  const [announcementIsUrgent, setAnnouncementIsUrgent] = useState(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // --------------------------------------------------------------------------
  // ACTIONS & HANDLERS
  // --------------------------------------------------------------------------

  // Search Filtering
  const filteredStudents = students.filter(s => {
    const matchesName = !searchName.trim() || s.name.toLowerCase().includes(searchName.toLowerCase().trim());
    const matchesCnic = !searchCnic.trim() || s.cnic.includes(searchCnic.trim()) || s.rollNumber.toLowerCase().includes(searchCnic.toLowerCase().trim());
    return matchesName && matchesCnic;
  });

  // Approve Challan
  const handleApproveChallan = (id: string) => {
    setChallans(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Approved',
          verifiedAt: new Date().toLocaleString(),
          notes: undefined,
        };
      }
      return c;
    }));
  };

  // Reject Challan
  const handleConfirmRejectChallan = (id: string) => {
    setChallans(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Rejected',
          verifiedAt: new Date().toLocaleString(),
          notes: rejectReasonText.trim() || 'Bank deposit record not verified in account statement.',
        };
      }
      return c;
    }));
    setRejectingChallanId(null);
    setRejectReasonText('');
  };

  // Save Edit Student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));

    // If editing the main active student profile, update it in App
    if (studentProfile && onUpdateProfile && editingStudent.id === 'STU-2026-001') {
      onUpdateProfile({
        ...studentProfile,
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        rollNumber: editingStudent.rollNumber,
        department: editingStudent.department,
        program: editingStudent.program,
        semester: editingStudent.semester,
        gpa: editingStudent.gpa,
        attendancePct: editingStudent.attendancePct,
        guardianName: editingStudent.guardianName,
        guardianPhone: editingStudent.guardianPhone,
      });
    }

    setEditingStudent(null);
  };

  // Save Subject
  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.subject) return;

    if (editingSubject.id) {
      // Edit existing
      setSubjectsList(prev => prev.map(s => s.id === editingSubject.id ? (editingSubject as ScheduleItem) : s));
    } else {
      // Add new
      const newSubject: ScheduleItem = {
        id: `SUB-${Date.now()}`,
        subject: editingSubject.subject || 'New Subject',
        code: editingSubject.code || 'CS-101',
        instructor: editingSubject.instructor || 'Staff Instructor',
        room: editingSubject.room || 'Room 101',
        day: editingSubject.day || 'Monday',
        time: editingSubject.time || '09:00 AM - 10:30 AM',
        duration: '1.5 Hours',
        type: editingSubject.type || 'Lecture',
        attendanceRate: 90,
        totalClasses: 30,
        attendedClasses: 27,
      };
      setSubjectsList(prev => [...prev, newSubject]);
    }
    setEditingSubject(null);
  };

  // Delete Subject
  const handleDeleteSubject = (id: string) => {
    setSubjectsList(prev => prev.filter(s => s.id !== id));
  };

  // Save Teacher
  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher || !editingTeacher.name) return;

    if (editingTeacher.id) {
      setTeachersList(prev => prev.map(t => t.id === editingTeacher.id ? (editingTeacher as TeacherRecord) : t));
    } else {
      const newTeacher: TeacherRecord = {
        id: `TCH-${Date.now()}`,
        name: editingTeacher.name || 'New Faculty',
        title: editingTeacher.title || 'Assistant Professor',
        subject: editingTeacher.subject || 'General Studies',
        code: editingTeacher.code || 'CS-101',
        email: editingTeacher.email || 'faculty@campusconnect.edu',
        office: editingTeacher.office || 'Academic Block',
        consultationHours: editingTeacher.consultationHours || 'Mon 10:00 AM - 12:00 PM',
        avatar: editingTeacher.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      };
      setTeachersList(prev => [...prev, newTeacher]);
    }
    setEditingTeacher(null);
  };

  // Delete Teacher
  const handleDeleteTeacher = (id: string) => {
    setTeachersList(prev => prev.filter(t => t.id !== id));
  };

  // Save Fee Structure
  const handleSaveFeeStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeeStructure) return;

    setFeeStructures(prev => prev.map(f => f.className === editingFeeStructure.className ? editingFeeStructure : f));
    setEditingFeeStructure(null);
  };

  // Handle Send Announcement
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) return;

    const newNotice = {
      title: announcementTitle.trim(),
      category: announcementCategory,
      content: announcementContent.trim(),
      author: announcementAuthor.trim() || 'Registrar Office',
      isUrgent: announcementIsUrgent,
      date: new Date().toISOString().split('T')[0],
      pinned: announcementIsUrgent,
    };

    if (onAddAnnouncement) {
      onAddAnnouncement(newNotice);
    } else {
      const currentAnn = JSON.parse(localStorage.getItem('campus_connect_announcements') || JSON.stringify(initialAnnouncements));
      localStorage.setItem('campus_connect_announcements', JSON.stringify([{ ...newNotice, id: `ANN-${Date.now()}` }, ...currentAnn]));
    }

    setAnnouncementSuccess(true);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setTimeout(() => setAnnouncementSuccess(false), 3000);
  };

  const pendingChallansCount = challans.filter(c => c.status === 'Pending').length;
  const approvedChallansCount = challans.filter(c => c.status === 'Approved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner & Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase tracking-wider">
              Registrar & Controller Admin Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">Firestore & Local Sync Active</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Campus Control & Administration Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage students, approve/reject fee deposits, update subjects, teachers, timetables, fee schedules, and broadcast announcements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>System Authority: <strong>Admin Access Granted</strong></span>
        </div>
      </div>

      {/* Admin Quick Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Total Registered Students</span>
          <span className="text-2xl font-black text-white">{students.length}</span>
          <span className="text-[10px] text-emerald-400 block font-semibold">Active Enrollment</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Pending Fee Approvals</span>
          <span className="text-2xl font-black text-amber-400">{pendingChallansCount}</span>
          <span className="text-[10px] text-amber-300 block font-semibold">Challans Awaiting Review</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Active Faculty Teachers</span>
          <span className="text-2xl font-black text-indigo-300">{teachersList.length}</span>
          <span className="text-[10px] text-indigo-400 block font-semibold">Assigned Instructors</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Class 1–8 Fee Structures</span>
          <span className="text-2xl font-black text-emerald-400">{feeStructures.length}</span>
          <span className="text-[10px] text-slate-400 block">Grade Schedules</span>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'students', label: `Students (${students.length})`, icon: Users },
          { id: 'fee_approvals', label: `Fee Approvals (${pendingChallansCount})`, icon: CreditCard },
          { id: 'subjects', label: `Subjects (${subjectsList.length})`, icon: BookOpen },
          { id: 'teachers', label: `Teachers (${teachersList.length})`, icon: UserCheck },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'fee_structure', label: 'Fee Structures', icon: Layers },
          { id: 'announcements', label: 'Send Announcement', icon: Send },
          { id: 'payments', label: 'Payment History', icon: Receipt },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VIEW & SEARCH STUDENTS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Enrolled Students Directory & Search
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Search students by Name or CNIC/Roll Number. Edit profile details in real-time.
              </p>
            </div>

            <button
              onClick={() => {
                const newStu: AdminStudentRecord = {
                  id: `STU-2026-00${students.length + 1}`,
                  name: '',
                  cnic: '42101-1234567-8',
                  rollNumber: `BSCS-2026-0${students.length + 1}`,
                  email: 'student@campusconnect.edu',
                  phone: '+92 300 0000000',
                  department: 'Computer Science',
                  program: 'BS Computer Science',
                  semester: 1,
                  gpa: 3.50,
                  attendancePct: 90,
                  guardianName: 'Guardian Name',
                  guardianPhone: '+92 300 0000000',
                  status: 'Active',
                  registrationDate: new Date().toISOString().split('T')[0],
                };
                setEditingStudent(newStu);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>

          {/* SEARCH FILTERS: SEARCH BY NAME & SEARCH BY CNIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Search by Student Name:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Ahmad Hassan"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Search by CNIC or Roll Number:
              </label>
              <div className="relative">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. 42101-9928174-2 or BSCS-2022"
                  value={searchCnic}
                  onChange={(e) => setSearchCnic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* RESPONSIVE TABLE FOR STUDENTS */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Roll # / ID</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">CNIC / B-Form</th>
                  <th className="p-3.5">Program & Dept</th>
                  <th className="p-3.5">Sem</th>
                  <th className="p-3.5">GPA</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-indigo-400">
                        {stu.rollNumber}
                        <span className="block text-[10px] text-slate-500 font-normal">{stu.id}</span>
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {stu.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{stu.email}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">{stu.cnic}</td>
                      <td className="p-3.5 text-slate-300">
                        {stu.program}
                        <span className="block text-[10px] text-slate-400">{stu.department}</span>
                      </td>
                      <td className="p-3.5 font-bold text-white">{stu.semester}</td>
                      <td className="p-3.5 font-extrabold text-emerald-400">{stu.gpa.toFixed(2)}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          stu.status === 'Active' || stu.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {stu.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setEditingStudent(stu)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/30 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      No students found matching search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPROVE / REJECT FEES (Class 1–8 Challans & Invoices) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'fee_approvals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                Fee Approvals & Bank Challan Audit
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify deposited bank challans. Manual review active. Click <strong className="text-emerald-400">Approve</strong> or <strong className="text-rose-400">Reject</strong>.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-xl">
              Manual Verification Mode
            </span>
          </div>

          <div className="space-y-4">
            {challans.map((challan) => (
              <div
                key={challan.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  challan.status === 'Pending'
                    ? 'bg-slate-950 border-amber-800/80 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {challan.id}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {challan.selectedClass}
                      </span>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        challan.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : challan.status === 'Rejected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {challan.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {challan.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-400" />}
                        {challan.status === 'Pending' && <Clock className="w-3 h-3 text-amber-400 animate-pulse" />}
                        <span>Status: {challan.status}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">
                      {challan.studentName} <span className="text-xs text-slate-400 font-mono font-normal">({challan.studentCnic})</span>
                    </h4>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Fee Amount</span>
                    <span className="text-lg font-extrabold text-emerald-400">Rs. {challan.totalFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bank Deposit Challan #</span>
                    <code className="font-mono font-bold text-emerald-400 text-sm">{challan.challanNumber || 'N/A'}</code>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Submission Timestamp</span>
                    <span className="text-slate-200 font-medium">{challan.submittedAt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Admission + Monthly Fee</span>
                    <span className="text-slate-200">Rs. {challan.admissionFee.toLocaleString()} + Rs. {challan.monthlyFee.toLocaleString()}</span>
                  </div>
                </div>

                {challan.notes && (
                  <div className="text-xs text-rose-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
                    <strong>Rejection Reason:</strong> {challan.notes}
                  </div>
                )}

                {rejectingChallanId === challan.id && (
                  <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl space-y-2">
                    <label className="block text-xs font-semibold text-rose-200">
                      Specify Rejection Reason:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deposit record not found in bank statement."
                      value={rejectReasonText}
                      onChange={(e) => setRejectReasonText(e.target.value)}
                      className="w-full bg-slate-900 border border-rose-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setRejectingChallanId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmRejectChallan(challan.id)}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    {challan.verifiedAt ? `Last updated: ${challan.verifiedAt}` : 'Awaiting admin decision'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveChallan(challan.id)}
                      disabled={challan.status === 'Approved'}
                      className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{challan.status === 'Approved' ? 'Approved' : 'Approve Fee'}</span>
                    </button>

                    <button
                      onClick={() => setRejectingChallanId(challan.id)}
                      disabled={challan.status === 'Rejected'}
                      className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 disabled:opacity-40 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Fee</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: UPDATE SUBJECTS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'subjects' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Manage Academic Subjects & Courses
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, or delete registered subjects, course codes, and assigned instructors.
              </p>
            </div>

            <button
              onClick={() => setEditingSubject({ subject: '', code: '', instructor: '', room: '', day: 'Monday', time: '09:00 AM - 10:30 AM', type: 'Lecture' })}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Subject Title</th>
                  <th className="p-3.5">Instructor</th>
                  <th className="p-3.5">Classroom Room</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                {subjectsList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-400">{sub.code}</td>
                    <td className="p-3.5 font-bold text-white">{sub.subject}</td>
                    <td className="p-3.5 text-slate-300">{sub.instructor}</td>
                    <td className="p-3.5 text-slate-300">{sub.room}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {sub.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex justify-end gap-2">
                      <button
                        onClick={() => setEditingSubject(sub)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: UPDATE TEACHERS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'teachers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                Manage Faculty Teachers & Instructors
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, or delete teaching faculty details, office rooms, and consultation schedules.
              </p>
            </div>

            <button
              onClick={() => setEditingTeacher({ name: '', title: 'Assistant Professor', subject: '', code: '', email: '', office: '', consultationHours: 'Mon 10:00 AM - 12:00 PM' })}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Teacher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachersList.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-4 shadow-md justify-between">
                <div className="flex items-start gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      {t.code} • {t.subject}
                    </span>
                    <h4 className="font-bold text-sm text-white pt-1">{t.name}</h4>
                    <p className="text-[11px] text-slate-400">{t.title}</p>
                    <p className="text-[10px] text-slate-300">Office: {t.office} | {t.consultationHours}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => setEditingTeacher(t)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteTeacher(t.id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: UPDATE TIMETABLE */}
      {/* ========================================================================= */}
      {activeAdminTab === 'timetable' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Manage Master Timetable Schedule
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update lecture timings, days of week, and assigned lecture halls for all subjects.
              </p>
            </div>

            <button
              onClick={() => setEditingSubject({ subject: '', code: '', instructor: '', room: '', day: 'Monday', time: '09:00 AM - 10:30 AM', type: 'Lecture' })}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Timetable Slot</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Day</th>
                  <th className="p-3.5">Timing</th>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Instructor</th>
                  <th className="p-3.5">Room</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                {subjectsList.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-indigo-300">{slot.day}</td>
                    <td className="p-3.5 font-mono text-emerald-400">{slot.time}</td>
                    <td className="p-3.5 font-mono font-bold text-white">{slot.code}</td>
                    <td className="p-3.5 font-semibold text-slate-200">{slot.subject}</td>
                    <td className="p-3.5 text-slate-300">{slot.instructor}</td>
                    <td className="p-3.5 text-slate-300">{slot.room}</td>
                    <td className="p-3.5 text-right">
                      <button onClick={() => setEditingSubject(slot)} className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:bg-slate-700">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: UPDATE FEES (Class 1-8 Structure) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'fee_structure' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Update Class 1 – 8 Fee Schedules & Amounts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Modify Admission Fee, Monthly Fee, and Total Fee rates for grade levels Class 1 to Class 8.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {feeStructures.map((f) => (
              <div key={f.className} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                    {f.className}
                  </span>
                  <button
                    onClick={() => setEditingFeeStructure(f)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Admission:</span>
                    <span className="font-bold text-white">Rs. {f.admissionFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly:</span>
                    <span className="font-bold text-white">Rs. {f.monthlyFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 font-extrabold text-emerald-400">
                    <span>Total Fee:</span>
                    <span>Rs. {f.totalFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: SEND ANNOUNCEMENT */}
      {/* ========================================================================= */}
      {activeAdminTab === 'announcements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
          
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" />
              Broadcast Official Announcement
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send circulars, exam notices, fee alerts, or campus event news directly to all student dashboards.
            </p>
          </div>

          {announcementSuccess && (
            <div className="p-3.5 bg-emerald-950 border border-emerald-800 rounded-2xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Announcement published and broadcasted successfully!</span>
            </div>
          )}

          <form onSubmit={handleBroadcastAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Midterm Examination Schedule & Fee Deadline"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={announcementCategory}
                  onChange={(e) => setAnnouncementCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="General">General Notice</option>
                  <option value="Academic">Academic Notice</option>
                  <option value="Fee Alert">Fee Alert</option>
                  <option value="Exam">Exam Notice</option>
                  <option value="Event">Campus Event</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Issuer / Author</label>
                <input
                  type="text"
                  placeholder="e.g. Bursar Office"
                  value={announcementAuthor}
                  onChange={(e) => setAnnouncementAuthor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Announcement Content *</label>
              <textarea
                required
                rows={4}
                placeholder="Type the full announcement message here..."
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="urgent-tag"
                checked={announcementIsUrgent}
                onChange={(e) => setAnnouncementIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <label htmlFor="urgent-tag" className="text-slate-300 font-medium">
                Mark as URGENT & Pin to top of Student Dashboard
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement Now</span>
            </button>
          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: VIEW PAYMENT HISTORY */}
      {/* ========================================================================= */}
      {activeAdminTab === 'payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                Verified Payment History & Financial Audit Logs
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete log of approved challans and verified bank transactions.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Approved Records Only
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Challan / Ref #</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Class / Category</th>
                  <th className="p-3.5">Challan Number</th>
                  <th className="p-3.5">Total Paid</th>
                  <th className="p-3.5">Approval Date</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                {challans.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-indigo-400">{c.id}</td>
                    <td className="p-3.5 font-bold text-white">
                      {c.studentName}
                      <span className="block text-[10px] text-slate-400 font-normal">{c.studentCnic}</span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300">{c.selectedClass}</td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{c.challanNumber || 'N/A'}</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">Rs. {c.totalFee.toLocaleString()}</td>
                    <td className="p-3.5 text-slate-400">{c.verifiedAt || c.submittedAt}</td>
                    <td className="p-3.5 text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT STUDENT */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white my-8 relative">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              Edit Student Profile ({editingStudent.rollNumber || 'New'})
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">CNIC / B-Form Number *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.cnic}
                    onChange={(e) => setEditingStudent({ ...editingStudent, cnic: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={editingStudent.rollNumber}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingStudent.department}
                    onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Program</label>
                  <input
                    type="text"
                    value={editingStudent.program}
                    onChange={(e) => setEditingStudent({ ...editingStudent, program: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingStudent.semester}
                    onChange={(e) => setEditingStudent({ ...editingStudent, semester: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={4}
                    value={editingStudent.gpa}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gpa: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT SUBJECT */}
      {/* ========================================================================= */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white relative">
            <button onClick={() => setEditingSubject(null)} className="absolute top-5 right-5 p-1 text-slate-400 hover:bg-slate-800 rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white">
              {editingSubject.id ? 'Edit Subject' : 'Add New Subject'}
            </h3>

            <form onSubmit={handleSaveSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  value={editingSubject.subject || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subject: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.code || ''}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Classroom Room</label>
                  <input
                    type="text"
                    value={editingSubject.room || ''}
                    onChange={(e) => setEditingSubject({ ...editingSubject, room: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Instructor Name</label>
                <input
                  type="text"
                  value={editingSubject.instructor || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, instructor: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Day of Week</label>
                  <select
                    value={editingSubject.day || 'Monday'}
                    onChange={(e) => setEditingSubject({ ...editingSubject, day: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Timing</label>
                  <input
                    type="text"
                    value={editingSubject.time || '09:00 AM - 10:30 AM'}
                    onChange={(e) => setEditingSubject({ ...editingSubject, time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingSubject(null)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT TEACHER */}
      {/* ========================================================================= */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white relative">
            <button onClick={() => setEditingTeacher(null)} className="absolute top-5 right-5 p-1 text-slate-400 hover:bg-slate-800 rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white">
              {editingTeacher.id ? 'Edit Faculty Teacher' : 'Add New Teacher'}
            </h3>

            <form onSubmit={handleSaveTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={editingTeacher.title || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingTeacher.subject || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={editingTeacher.code || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingTeacher.email || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Office Room</label>
                  <input
                    type="text"
                    value={editingTeacher.office || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, office: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Consultation Hours</label>
                  <input
                    type="text"
                    value={editingTeacher.consultationHours || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, consultationHours: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTeacher(null)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT FEE STRUCTURE */}
      {/* ========================================================================= */}
      {editingFeeStructure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white relative">
            <button onClick={() => setEditingFeeStructure(null)} className="absolute top-5 right-5 p-1 text-slate-400 hover:bg-slate-800 rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white">
              Update Fee Rates for {editingFeeStructure.className}
            </h3>

            <form onSubmit={handleSaveFeeStructure} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Admission Fee (PKR) *</label>
                <input
                  type="number"
                  required
                  value={editingFeeStructure.admissionFee}
                  onChange={(e) => {
                    const adm = parseInt(e.target.value) || 0;
                    setEditingFeeStructure({
                      ...editingFeeStructure,
                      admissionFee: adm,
                      totalFee: adm + editingFeeStructure.monthlyFee,
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Monthly Fee (PKR) *</label>
                <input
                  type="number"
                  required
                  value={editingFeeStructure.monthlyFee}
                  onChange={(e) => {
                    const mth = parseInt(e.target.value) || 0;
                    setEditingFeeStructure({
                      ...editingFeeStructure,
                      monthlyFee: mth,
                      totalFee: editingFeeStructure.admissionFee + mth,
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between font-bold text-emerald-400">
                <span>Calculated Total Fee:</span>
                <span>Rs. {editingFeeStructure.totalFee.toLocaleString()}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingFeeStructure(null)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold">
                  Save Fee Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Send,
  Building,
  GraduationCap,
  ShieldCheck,
  Search,
  Users,
  Database,
  FileCheck,
  Trash2,
  Phone,
  MapPin,
  IdCard,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ClassStudent } from '../types';

interface RegistrationViewProps {
  onSubmitRegistration?: (data: any) => void;
  userRegistrationStatus?: string;
}

const CLASS_OPTIONS = [
  { id: 'Class_1', label: 'Class 1' },
  { id: 'Class_2', label: 'Class 2' },
  { id: 'Class_3', label: 'Class 3' },
  { id: 'Class_4', label: 'Class 4' },
  { id: 'Class_5', label: 'Class 5' },
  { id: 'Class_6', label: 'Class 6' },
  { id: 'Class_7', label: 'Class 7' },
  { id: 'Class_8', label: 'Class 8' },
  { id: 'Class_9', label: 'Class 9' },
  { id: 'Class_10', label: 'Class 10' },
] as const;

const GROUPS = ['Science', 'Computer Science', 'Humanities', 'Bio Science'] as const;

// Initial sample data for Firestore collections
const INITIAL_COLLECTIONS: Record<string, ClassStudent[]> = {
  Class_1: [
    {
      id: 'STU-C1-101',
      studentName: 'Ali Ahmed',
      studentCnic: '42101-1111111-1',
      fatherName: 'Ahmed Raza',
      fatherCnic: '42101-2222222-2',
      mobile: '+92 300 1234567',
      address: 'House #12, Block 4, PECHS, Karachi',
      selectedClass: 'Class_1',
      createdAt: '2026-07-20',
      status: 'Verified',
    }
  ],
  Class_9: [
    {
      id: 'STU-C9-204',
      studentName: 'Fatima Bilal',
      studentCnic: '42101-3333333-3',
      fatherName: 'Bilal Khan',
      fatherCnic: '42101-4444444-4',
      mobile: '+92 321 9876543',
      address: 'Street 5, Sector F-8, Islamabad',
      selectedClass: 'Class_9',
      group: 'Computer Science',
      createdAt: '2026-07-22',
      status: 'Verified',
    }
  ],
  Class_10: [
    {
      id: 'STU-C10-309',
      studentName: 'Muhammad Hamza',
      studentCnic: '42101-5555555-5',
      fatherName: 'Tariq Mehmood',
      fatherCnic: '42101-6666666-6',
      mobile: '+92 333 4567890',
      address: 'Flat 402, Royal Gardens, Lahore',
      selectedClass: 'Class_10',
      group: 'Science',
      createdAt: '2026-07-24',
      status: 'Verified',
    }
  ]
};

export const RegistrationView: React.FC<RegistrationViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'register' | 'database'>('register');

  // Firestore Collection Storage Engine State
  const [collections, setCollections] = useState<Record<string, ClassStudent[]>>(() => {
    const saved = localStorage.getItem('campus_connect_firestore_collections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse collections:", e);
      }
    }
    return INITIAL_COLLECTIONS;
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('campus_connect_firestore_collections', JSON.stringify(collections));
  }, [collections]);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentCnic, setStudentCnic] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherCnic, setFatherCnic] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [selectedClass, setSelectedClass] = useState<typeof CLASS_OPTIONS[number]['id']>('Class_1');
  const [group, setGroup] = useState<typeof GROUPS[number]>('Science');

  // Form Feedback & Animation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState<ClassStudent | null>(null);

  // Firestore DB Explorer State
  const [viewClassCollection, setViewClassCollection] = useState<string>('Class_1');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-format CNIC input (12345-1234567-1)
  const formatCnic = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const isClass9or10 = selectedClass === 'Class_9' || selectedClass === 'Class_10';

  // Validation function
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!studentName.trim()) {
      errs.studentName = 'Student Name is required.';
    }

    const cleanStudentCnic = studentCnic.replace(/\D/g, '');
    if (!studentCnic.trim()) {
      errs.studentCnic = 'Student CNIC/B-Form is required.';
    } else if (cleanStudentCnic.length !== 13) {
      errs.studentCnic = 'CNIC/B-Form must contain exactly 13 digits (XXXXX-XXXXXXX-X).';
    } else {
      // Check for DUPLICATE CNIC across ALL Firestore collections (Class_1 to Class_10)
      let foundDuplicateClass = '';
      (Object.entries(collections) as [string, ClassStudent[]][]).forEach(([className, list]) => {
        const dup = list.find(s => s.studentCnic.replace(/\D/g, '') === cleanStudentCnic);
        if (dup) {
          foundDuplicateClass = className;
        }
      });

      if (foundDuplicateClass) {
        errs.studentCnic = `Duplicate CNIC Alert: This CNIC/B-Form (${studentCnic}) is already registered in collection "${foundDuplicateClass}".`;
      }
    }

    if (!fatherName.trim()) {
      errs.fatherName = 'Father Name is required.';
    }

    const cleanFatherCnic = fatherCnic.replace(/\D/g, '');
    if (!fatherCnic.trim()) {
      errs.fatherCnic = 'Father CNIC is required.';
    } else if (cleanFatherCnic.length !== 13) {
      errs.fatherCnic = 'Father CNIC must contain exactly 13 digits.';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!mobile.trim()) {
      errs.mobile = 'Mobile Phone Number is required.';
    } else if (cleanMobile.length < 10) {
      errs.mobile = 'Enter a valid mobile phone number.';
    }

    if (!address.trim()) {
      errs.address = 'Residential Address is required.';
    }

    if (isClass9or10 && !group) {
      errs.group = 'Please select an academic Group for Class 9/10.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newStudent: ClassStudent = {
        id: `REG-${selectedClass.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: studentName.trim(),
        studentCnic: studentCnic.trim(),
        fatherName: fatherName.trim(),
        fatherCnic: fatherCnic.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        selectedClass,
        group: isClass9or10 ? group : undefined,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Registered',
      };

      // Save into specific Firestore Collection (Class_1 ... Class_10)
      setCollections(prev => ({
        ...prev,
        [selectedClass]: [newStudent, ...(prev[selectedClass] || [])],
      }));

      setRegisteredRecord(newStudent);
      setIsSuccess(true);
    }, 800);
  };

  const resetForm = () => {
    setStudentName('');
    setStudentCnic('');
    setFatherName('');
    setFatherCnic('');
    setMobile('');
    setAddress('');
    setSelectedClass('Class_1');
    setGroup('Science');
    setErrors({});
    setIsSuccess(false);
    setRegisteredRecord(null);
  };

  const handleDeleteRecord = (targetClass: string, id: string) => {
    setCollections(prev => ({
      ...prev,
      [targetClass]: (prev[targetClass] || []).filter(s => s.id !== id),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" /> Firestore Database Backend
            </span>
            <span className="text-xs text-slate-400">Class 1 to Class 10 Admissions</span>
          </div>
          <h2 className="text-xl font-bold text-white">School Student Registration Module</h2>
          <p className="text-xs text-slate-400 mt-1">
            Register students into Firestore collections (<code className="text-emerald-400 font-mono">Class_1</code> ... <code className="text-emerald-400 font-mono">Class_10</code>) with automatic duplicate CNIC verification.
          </p>
        </div>

        {/* View Switcher: Registration Form vs Firestore Collections Database */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('register')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Registration Form</span>
          </button>
          <button
            onClick={() => setActiveSubTab('database')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'database'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firestore Records</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'register' ? (
        /* REGISTRATION FORM SECTION */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          
          {/* CELEBRATORY SUCCESS ANIMATION OVERLAY */}
          {isSuccess && registeredRecord ? (
            <div className="p-8 bg-slate-950 border-2 border-emerald-500/80 rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
              
              {/* Confetti particles effect background */}
              <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-around">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100 mt-4" />
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping delay-200 mt-12" />
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-300 mt-8" />
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping delay-500 mt-2" />
              </div>

              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 shadow-lg shadow-emerald-500/30 animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800">
                  Firestore Storage Confirmed
                </span>
                <h3 className="text-2xl font-black text-white pt-2">Student Registered Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Data saved securely in collection <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{registeredRecord.selectedClass}</code>
                </p>
              </div>

              {/* Saved Record Token Summary */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-lg mx-auto text-left text-xs space-y-2.5 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-400">Registration ID:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">{registeredRecord.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Student Name</span>
                    <span className="font-bold text-white text-sm">{registeredRecord.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">CNIC / B-Form</span>
                    <span className="font-mono text-emerald-300 font-semibold">{registeredRecord.studentCnic}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Father Name</span>
                    <span className="font-medium text-white">{registeredRecord.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Father CNIC</span>
                    <span className="font-mono text-slate-200">{registeredRecord.fatherCnic}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Class Collection</span>
                    <span className="font-bold text-white">{registeredRecord.selectedClass.replace('_', ' ')}</span>
                  </div>
                  {registeredRecord.group && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Group</span>
                      <span className="font-bold text-teal-300">{registeredRecord.group}</span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Mobile Contact</span>
                    <span className="font-semibold text-white">{registeredRecord.mobile}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Residential Address</span>
                    <span className="text-slate-300">{registeredRecord.address}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="py-2.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Register Another Student</span>
                </button>
                <button
                  onClick={() => {
                    setViewClassCollection(registeredRecord.selectedClass);
                    setActiveSubTab('database');
                  }}
                  className="py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>View in Collection ({registeredRecord.selectedClass})</span>
                </button>
              </div>

            </div>
          ) : (
            /* FORM INPUT FIELDS */
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-emerald-400" />
                    Student Admission Form
                  </h3>
                  <p className="text-xs text-slate-400">Fill in all student credentials. System checks for duplicate CNIC/B-Form automatically.</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
                  Required Fields (*)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Student Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Student Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ali Ahmed"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      if (errors.studentName) setErrors(prev => ({ ...prev, studentName: '' }));
                    }}
                    className={`w-full bg-slate-800 border rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.studentName ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.studentName && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.studentName}</p>}
                </div>

                {/* 2. Student CNIC/B-Form */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Student CNIC / B-Form <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="42101-1234567-1"
                    value={studentCnic}
                    onChange={(e) => {
                      setStudentCnic(formatCnic(e.target.value));
                      if (errors.studentCnic) setErrors(prev => ({ ...prev, studentCnic: '' }));
                    }}
                    maxLength={15}
                    className={`w-full bg-slate-800 border font-mono rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.studentCnic ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.studentCnic ? (
                    <p className="text-[10px] text-rose-400 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.studentCnic}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">13-digit CNIC or B-Form format (e.g., 42101-1234567-1)</p>
                  )}
                </div>

                {/* 3. Father Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Father Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmed Raza"
                    value={fatherName}
                    onChange={(e) => {
                      setFatherName(e.target.value);
                      if (errors.fatherName) setErrors(prev => ({ ...prev, fatherName: '' }));
                    }}
                    className={`w-full bg-slate-800 border rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.fatherName ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.fatherName && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.fatherName}</p>}
                </div>

                {/* 4. Father CNIC */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Father CNIC <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="42101-9876543-2"
                    value={fatherCnic}
                    onChange={(e) => {
                      setFatherCnic(formatCnic(e.target.value));
                      if (errors.fatherCnic) setErrors(prev => ({ ...prev, fatherCnic: '' }));
                    }}
                    maxLength={15}
                    className={`w-full bg-slate-800 border font-mono rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.fatherCnic ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.fatherCnic && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.fatherCnic}</p>}
                </div>

                {/* 5. Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                    }}
                    className={`w-full bg-slate-800 border rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.mobile ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.mobile && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.mobile}</p>}
                </div>

                {/* 6. Selected Class Collection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Selected Class <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value as any);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} (Collection: {c.id})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 block mt-1">Data will be stored in Firestore collection: <span className="text-emerald-400 font-mono font-semibold">{selectedClass}</span></span>
                </div>

                {/* 7. Group Selection (ONLY for Class 9 & Class 10) */}
                {isClass9or10 && (
                  <div className="sm:col-span-2 p-4 bg-slate-950/80 border border-teal-800/60 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-teal-300">
                        Academic Group Selection (Required for {selectedClass.replace('_', ' ')}) <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded-full border border-teal-800">
                        Class 9/10 Stream
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {GROUPS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setGroup(g);
                            if (errors.group) setErrors(prev => ({ ...prev, group: '' }));
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            group === g
                              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    {errors.group && <p className="text-[10px] text-rose-400 font-medium">{errors.group}</p>}
                  </div>
                )}

                {/* 8. Residential Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Complete Residential Address <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. House #12, Block 4, PECHS, Karachi"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                    }}
                    className={`w-full bg-slate-800 border rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none ${
                      errors.address ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-400 mt-1 font-medium">{errors.address}</p>}
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Target Collection: <code className="text-emerald-400 font-mono font-bold">{selectedClass}</code>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Firestore Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Save Student Registration</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      ) : (
        /* FIRESTORE COLLECTIONS EXPLORER TABS (Class_1 ... Class_10) */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Firestore Class Collections Inspector
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect live saved student documents grouped by Firestore collections (<code className="text-emerald-400 font-mono">Class_1</code> to <code className="text-emerald-400 font-mono">Class_10</code>).
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student name or CNIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Collection Tabs (Class_1 through Class_10) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
            {CLASS_OPTIONS.map((c) => {
              const count = (collections[c.id] || []).length;
              const isActive = viewClassCollection === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setViewClassCollection(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Records List inside Selected Collection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Collection: <code className="text-emerald-400 font-mono font-bold">{viewClassCollection}</code></span>
              <span>{(collections[viewClassCollection] || []).length} registered student(s)</span>
            </div>

            {(collections[viewClassCollection] || []).filter(s => 
              s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.studentCnic.includes(searchQuery) ||
              s.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(collections[viewClassCollection] || [])
                  .filter(s => 
                    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.studentCnic.includes(searchQuery) ||
                    s.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => (
                    <div
                      key={student.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative hover:border-slate-700 transition-colors shadow-md"
                    >
                      <div className="flex items-start justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {student.id}
                          </span>
                          <h4 className="font-bold text-sm text-white mt-1">{student.studentName}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteRecord(viewClassCollection, student.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Student CNIC</span>
                          <span className="font-mono text-emerald-300 font-semibold">{student.studentCnic}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Father Name</span>
                          <span className="font-medium">{student.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Father CNIC</span>
                          <span className="font-mono text-slate-300">{student.fatherCnic}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Mobile</span>
                          <span className="font-medium text-slate-200">{student.mobile}</span>
                        </div>
                        {student.group && (
                          <div className="col-span-2">
                            <span className="text-[10px] text-slate-400 block">Academic Group</span>
                            <span className="font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800 inline-block text-[11px]">
                              {student.group}
                            </span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-[10px] text-slate-400 block">Address</span>
                          <span className="text-slate-300">{student.address}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Status: <span className="text-emerald-400 font-bold">{student.status}</span></span>
                        <span>Registered: {student.createdAt}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">No students registered under <code className="text-emerald-400 font-mono font-bold">{viewClassCollection}</code> yet.</p>
                <button
                  onClick={() => {
                    setSelectedClass(viewClassCollection as any);
                    setActiveSubTab('register');
                  }}
                  className="mt-2 text-xs text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Register a student into {viewClassCollection}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

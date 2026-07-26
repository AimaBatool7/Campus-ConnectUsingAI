import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText, 
  DollarSign, 
  Clock, 
  Building2, 
  ShieldCheck, 
  X,
  Sparkles,
  BookOpen,
  ArrowRight,
  Send,
  Layers,
  Search,
  Check,
  Receipt
} from 'lucide-react';
import { FeeItem, StudentProfile, ClassFeeChallan } from '../types';
import { ReceiptModal } from './ReceiptModal';

interface FeeManagementViewProps {
  fees: FeeItem[];
  profile: StudentProfile;
  onPayFeeSuccess: (feeId: string, method: string, txId: string) => void;
}

export interface ClassFeeStructure {
  className: 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8';
  admissionFee: number;
  monthlyFee: number;
  totalFee: number;
}

export const CLASS_FEE_STRUCTURES: ClassFeeStructure[] = [
  { className: 'Class 1', admissionFee: 12000, monthlyFee: 4500, totalFee: 16500 },
  { className: 'Class 2', admissionFee: 12000, monthlyFee: 4500, totalFee: 16500 },
  { className: 'Class 3', admissionFee: 14000, monthlyFee: 5000, totalFee: 19000 },
  { className: 'Class 4', admissionFee: 14000, monthlyFee: 5000, totalFee: 19000 },
  { className: 'Class 5', admissionFee: 16000, monthlyFee: 5500, totalFee: 21500 },
  { className: 'Class 6', admissionFee: 18000, monthlyFee: 6000, totalFee: 24000 },
  { className: 'Class 7', admissionFee: 18000, monthlyFee: 6000, totalFee: 24000 },
  { className: 'Class 8', admissionFee: 20000, monthlyFee: 6500, totalFee: 26500 },
];

export const INITIAL_CLASS_CHALLANS: ClassFeeChallan[] = [
  {
    id: 'CHL-C1-8801',
    studentName: 'Ali Ahmed',
    studentCnic: '42101-1111111-1',
    selectedClass: 'Class 1',
    admissionFee: 12000,
    monthlyFee: 4500,
    totalFee: 16500,
    challanNumber: 'HBL-9928174',
    status: 'Pending',
    submittedAt: '2026-07-25 10:15 AM',
  },
  {
    id: 'CHL-C5-4402',
    studentName: 'Aisha Malik',
    studentCnic: '42101-2222222-2',
    selectedClass: 'Class 5',
    admissionFee: 16000,
    monthlyFee: 5500,
    totalFee: 21500,
    challanNumber: 'UBL-1092837',
    status: 'Approved',
    submittedAt: '2026-07-24 02:30 PM',
    verifiedAt: '2026-07-24 04:00 PM',
  },
  {
    id: 'CHL-C8-3309',
    studentName: 'Usman Farooq',
    studentCnic: '42101-3333333-3',
    selectedClass: 'Class 8',
    admissionFee: 20000,
    monthlyFee: 6500,
    totalFee: 26500,
    challanNumber: 'MBL-7762514',
    status: 'Rejected',
    submittedAt: '2026-07-23 11:00 AM',
    notes: 'Incorrect challan number provided. Deposit not verified in bank statement.',
  }
];

export const FeeManagementView: React.FC<FeeManagementViewProps> = ({
  fees,
  profile,
  onPayFeeSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'class_1_8' | 'all_fees'>('class_1_8');

  // Shared Class Fee Challans Engine in LocalStorage
  const [challans, setChallans] = useState<ClassFeeChallan[]>(() => {
    const saved = localStorage.getItem('campus_connect_class_challans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved challans:', e);
      }
    }
    return INITIAL_CLASS_CHALLANS;
  });

  useEffect(() => {
    localStorage.setItem('campus_connect_class_challans', JSON.stringify(challans));
  }, [challans]);

  // Modal State for Class 1-8 Pay Fee
  const [selectedPayClass, setSelectedPayClass] = useState<ClassFeeStructure | null>(null);
  const [studentNameInput, setStudentNameInput] = useState(profile.name || '');
  const [studentCnicInput, setStudentCnicInput] = useState('42101-1234567-1');
  const [challanNumberInput, setChallanNumberInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isSubmittingChallan, setIsSubmittingChallan] = useState(false);
  const [successSubmission, setSuccessSubmission] = useState<ClassFeeChallan | null>(null);

  // Status Filter for Submitted Challans
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const filteredChallans = challans.filter(c => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  const handleOpenPayModal = (classFee: ClassFeeStructure) => {
    setSelectedPayClass(classFee);
    setChallanNumberInput('');
    setInputError(null);
    setSuccessSubmission(null);
  };

  const handleSaveChallan = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    if (!studentNameInput.trim()) {
      setInputError('Please enter Student Name.');
      return;
    }

    if (!challanNumberInput.trim()) {
      setInputError('Please enter the Challan Number.');
      return;
    }

    if (challanNumberInput.trim().length < 4) {
      setInputError('Challan Number must be at least 4 characters long.');
      return;
    }

    if (!selectedPayClass) return;

    setIsSubmittingChallan(true);

    setTimeout(() => {
      setIsSubmittingChallan(false);

      const newChallan: ClassFeeChallan = {
        id: `CHL-${selectedPayClass.className.replace(' ', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: studentNameInput.trim(),
        studentCnic: studentCnicInput.trim() || '42101-1234567-1',
        selectedClass: selectedPayClass.className,
        admissionFee: selectedPayClass.admissionFee,
        monthlyFee: selectedPayClass.monthlyFee,
        totalFee: selectedPayClass.totalFee,
        challanNumber: challanNumberInput.trim(),
        status: 'Pending', // ALWAYS Pending until manual Admin approval!
        submittedAt: new Date().toLocaleString(),
      };

      setChallans(prev => [newChallan, ...prev]);
      setSuccessSubmission(newChallan);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Top Banner & Module Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
              Fee Management Portal
            </span>
            <span className="text-xs text-slate-400">Class 1 – 8 Admissions & Monthly Fees</span>
          </div>
          <h2 className="text-xl font-bold text-white">Class Fee Schedules & Challan Payment</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pay admission & monthly fees for Class 1–8. Save bank challan numbers for manual Admin review.
          </p>
        </div>

        {/* View Switcher: Class 1-8 Fees vs Semester Fees */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('class_1_8')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'class_1_8'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Class 1 – 8 Fees</span>
          </button>
          <button
            onClick={() => setActiveTab('all_fees')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'all_fees'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Semester / Other Fees</span>
          </button>
        </div>
      </div>

      {activeTab === 'class_1_8' ? (
        <div className="space-y-8">
          
          {/* SECTION 1: Class 1–8 Fee Breakdown Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Class 1 – Class 8 Fee Structure
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Admission Fee, Monthly Fee, and Total Fee breakdown for each grade level.
                </p>
              </div>
              <div className="text-[10px] bg-slate-950 text-emerald-400 border border-slate-800 px-3 py-1 rounded-full font-mono font-semibold">
                Currency: PKR / USD
              </div>
            </div>

            {/* Fee Structure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CLASS_FEE_STRUCTURES.map((item) => (
                <div
                  key={item.className}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                        {item.className}
                      </span>
                      <span className="text-[10px] text-slate-400">Standard Plan</span>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Admission Fee:</span>
                        <span className="font-semibold text-white">Rs. {item.admissionFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">Monthly Fee:</span>
                        <span className="font-semibold text-white">Rs. {item.monthlyFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
                        <span className="text-emerald-400">Total Fee:</span>
                        <span className="text-sm font-extrabold text-emerald-300">Rs. {item.totalFee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPayModal(item)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 group-hover:scale-[1.02]"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Fee ({item.className})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Submitted Challan Records & Status (Pending, Approved, Rejected) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Submitted Challan Statuses (Class 1 – 8)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track saved challan numbers. Note: Admin approves payment manually (No automatic verification).
                </p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Admin Notice Banner */}
            <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-300">Manual Verification Policy:</span>
                <span>
                  After submitting your bank deposit Challan Number, your payment status will remain <span className="font-bold underline text-amber-300">Pending</span> until the Bursar/Admin verifies the bank statement and manually updates it to <span className="font-bold text-emerald-300">Approved</span> or <span className="font-bold text-rose-300">Rejected</span>.
                </span>
              </div>
            </div>

            {/* Challans List */}
            {filteredChallans.length > 0 ? (
              <div className="space-y-3">
                {filteredChallans.map((challan) => (
                  <div
                    key={challan.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {challan.id}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {challan.selectedClass}
                        </span>

                        {/* Status Badge */}
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

                      <h4 className="font-bold text-sm text-white">{challan.studentName} <span className="text-xs text-slate-400 font-mono font-normal">({challan.studentCnic})</span></h4>

                      <div className="flex items-center gap-4 text-xs text-slate-300">
                        <span>Challan #: <code className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{challan.challanNumber || 'N/A'}</code></span>
                        <span>Submitted: <span className="text-slate-400">{challan.submittedAt}</span></span>
                      </div>

                      {challan.notes && (
                        <p className="text-[11px] text-rose-300 bg-rose-950/30 p-2 rounded-xl border border-rose-900/40 mt-1">
                          Reason: {challan.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 shrink-0">
                      <span className="text-[10px] text-slate-400 block">Total Fee Paid</span>
                      <span className="text-xl font-extrabold text-emerald-400">Rs. {challan.totalFee.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Admission (Rs. {challan.admissionFee.toLocaleString()}) + Monthly (Rs. {challan.monthlyFee.toLocaleString()})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">No submitted challans found for status filter "{statusFilter}".</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* HIGHER EDUCATION / SEMESTER FEES TAB */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block mb-1">Total Semester Fee</span>
              <span className="text-2xl font-bold text-white">$2,450</span>
              <span className="text-[10px] text-slate-400 block mt-1">5 Itemized Charges</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block mb-1">Amount Paid</span>
              <span className="text-2xl font-bold text-emerald-400">$1,800</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Verified Receipts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400 block mb-1">Remaining Outstanding</span>
              <span className="text-2xl font-bold text-amber-400">$650</span>
              <span className="text-[10px] text-slate-400 block mt-1">Due Aug 15, 2026</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md divide-y divide-slate-800">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      fee.status === 'Paid'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {fee.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{fee.invoiceNumber}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{fee.title}</h4>
                  <p className="text-xs text-slate-400">
                    Semester: {fee.semester} • Due Date: {fee.dueDate}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-lg font-extrabold text-white block">${fee.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAY FEE MODAL: Enter Challan Number & Save */}
      {selectedPayClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
            
            <button
              onClick={() => setSelectedPayClass(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800">
                Fee Payment for {selectedPayClass.className}
              </span>
              <h3 className="text-xl font-extrabold text-white pt-1">Bank Challan Deposit Entry</h3>
              <p className="text-xs text-slate-400">
                Deposit fee in bank and enter your Challan Number below.
              </p>
            </div>

            {/* Fee Breakdown Display */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Admission Fee:</span>
                <span className="font-bold text-white">Rs. {selectedPayClass.admissionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Monthly Fee:</span>
                <span className="font-bold text-white">Rs. {selectedPayClass.monthlyFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-extrabold">
                <span className="text-emerald-400">Total Fee:</span>
                <span className="text-emerald-300 font-mono text-base">Rs. {selectedPayClass.totalFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Success Feedback View */}
            {successSubmission ? (
              <div className="p-5 bg-emerald-950/80 border border-emerald-800 rounded-2xl space-y-4 text-center animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Challan Number Saved!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Challan Number <code className="text-emerald-300 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">{successSubmission.challanNumber}</code> has been submitted successfully.
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-xs text-amber-300 border border-amber-800/60 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Status: <strong>Pending</strong> (Admin will manually approve after bank verification).</span>
                </div>
                <button
                  onClick={() => setSelectedPayClass(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Close & View Submitted Status
                </button>
              </div>
            ) : (
              /* FORM TO ENTER & SAVE CHALLAN NUMBER */
              <form onSubmit={handleSaveChallan} className="space-y-4">
                
                {inputError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{inputError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentNameInput}
                    onChange={(e) => setStudentNameInput(e.target.value)}
                    placeholder="Student Name"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student CNIC / B-Form <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentCnicInput}
                    onChange={(e) => setStudentCnicInput(e.target.value)}
                    placeholder="42101-1234567-1"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enter Challan Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={challanNumberInput}
                    onChange={(e) => setChallanNumberInput(e.target.value)}
                    placeholder="e.g. HBL-9928174 or Deposit Slip #10928"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Enter the bank deposit receipt number or online transaction reference.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingChallan}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmittingChallan ? (
                      <span>Saving Challan Number...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Save Challan Number</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

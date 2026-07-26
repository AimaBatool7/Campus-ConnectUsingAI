import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  QrCode, 
  Building2, 
  Calendar, 
  User, 
  FileText,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { StudentProfile } from '../types';

interface RegistrationSlipModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationSlipModal: React.FC<RegistrationSlipModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Triggers native print to save as PDF
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Registration Slip - ${profile.name}`,
      text: `Official Student Registration & Course Enrollment Slip for ${profile.name} (${profile.rollNumber}) - ${profile.program}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\nRef Link: ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white relative my-8 print:m-0 print:p-6 print:bg-white print:text-slate-900 print:shadow-none print:border-none">
        
        {/* Header Actions - Hidden on Print */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-white">Official Student Registration Slip</h3>
              <p className="text-xs text-slate-400">Verified Academic Record & Course Enrollment Certificate</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SLIP CONTENT */}
        <div id="registration-slip-pdf" className="space-y-6 bg-slate-950 print:bg-white p-6 sm:p-8 rounded-2xl border border-slate-800 print:border-2 print:border-slate-900 print:text-slate-900">
          
          {/* Slip Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-emerald-500 pb-5 print:border-emerald-600">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
                CC
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-slate-900">
                  CAMPUSCONNECT UNIVERSITY
                </h1>
                <p className="text-xs text-emerald-400 print:text-emerald-700 font-semibold uppercase tracking-wider">
                  Office of the Registrar & Controller of Examinations
                </p>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Official Student Registration & Course Enrollment Slip • Session 2026
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-center sm:items-end">
              <div className="w-20 h-20 bg-white p-1 rounded-xl shadow-inner border border-slate-300 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-600 mt-1">
                REF: {profile.id}
              </span>
            </div>
          </div>

          {/* Student Profile Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start bg-slate-900/80 print:bg-slate-50 p-5 rounded-2xl border border-slate-800 print:border-slate-300">
            
            {/* Student Photo */}
            <div className="flex flex-col items-center text-center space-y-2">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-28 h-32 rounded-xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 print:bg-emerald-100 print:text-emerald-800">
                VERIFIED STUDENT
              </span>
            </div>

            {/* Main Info */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Student Full Name</span>
                  <span className="font-bold text-sm text-white print:text-slate-900">{profile.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Roll Number / Registration #</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-400 print:text-emerald-700">{profile.rollNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Guardian / Father Name</span>
                  <span className="font-semibold text-white print:text-slate-900">{profile.guardianName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">CNIC / B-Form Number</span>
                  <span className="font-mono font-semibold text-white print:text-slate-900">42101-9928174-2</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Program & Faculty</span>
                  <span className="font-semibold text-white print:text-slate-900">{profile.program}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Department / Major</span>
                  <span className="font-semibold text-white print:text-slate-900">{profile.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Academic Semester</span>
                  <span className="font-semibold text-white print:text-slate-900">Semester {profile.semester} (Spring 2026)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 print:text-slate-500 font-medium block">Registration Date</span>
                  <span className="font-semibold text-white print:text-slate-900">{profile.registrationDate}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Enrolled Courses Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 print:text-emerald-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Enrolled Courses & Credit Hours (Semester {profile.semester})</span>
            </h4>

            <div className="overflow-hidden rounded-xl border border-slate-800 print:border-slate-300 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 print:bg-slate-200 text-slate-300 print:text-slate-800 font-bold border-b border-slate-800 print:border-slate-300">
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Subject / Course Title</th>
                    <th className="p-2.5">Course Type</th>
                    <th className="p-2.5">Credits</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                  <tr className="hover:bg-slate-900/40 print:hover:bg-transparent">
                    <td className="p-2.5 font-mono font-bold text-emerald-400 print:text-emerald-800">CS-401</td>
                    <td className="p-2.5 font-semibold text-white print:text-slate-900">Machine Learning & Neural Networks</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">Core / Lecture</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">3.0 Cr</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400 print:text-emerald-700">Registered</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 print:hover:bg-transparent">
                    <td className="p-2.5 font-mono font-bold text-emerald-400 print:text-emerald-800">CS-308</td>
                    <td className="p-2.5 font-semibold text-white print:text-slate-900">Database Systems Architecture</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">Core / Lab</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">4.0 Cr</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400 print:text-emerald-700">Registered</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 print:hover:bg-transparent">
                    <td className="p-2.5 font-mono font-bold text-emerald-400 print:text-emerald-800">CS-420</td>
                    <td className="p-2.5 font-semibold text-white print:text-slate-900">Cloud Infrastructure & DevOps</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">Elective / Lab</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">3.0 Cr</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400 print:text-emerald-700">Registered</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40 print:hover:bg-transparent">
                    <td className="p-2.5 font-mono font-bold text-emerald-400 print:text-emerald-800">CS-312</td>
                    <td className="p-2.5 font-semibold text-white print:text-slate-900">Software Engineering Principles</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">Core / Lecture</td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">3.0 Cr</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400 print:text-emerald-700">Registered</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification & Official Seal */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-800 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-white print:text-slate-900 block">AUTHENTICITY VERIFIED</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600 block">
                  Digitally certified by CampusConnect Registrar Portal.
                </span>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="flex items-center gap-8 text-center text-xs">
              <div className="border-t border-slate-700 print:border-slate-900 pt-1.5 px-4">
                <span className="font-serif italic font-bold text-slate-300 print:text-slate-800 block text-sm">Tariq Hassan</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600 font-semibold">Assistant Registrar</span>
              </div>
              <div className="border-t border-slate-700 print:border-slate-900 pt-1.5 px-4">
                <span className="font-serif italic font-bold text-slate-300 print:text-slate-800 block text-sm">Dr. Sarah Jenkins</span>
                <span className="text-[10px] text-slate-400 print:text-slate-600 font-semibold">Controller of Exams</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

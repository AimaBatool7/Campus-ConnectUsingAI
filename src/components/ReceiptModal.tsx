import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, GraduationCap, Share2, Check } from 'lucide-react';
import { FeeItem, StudentProfile } from '../types';

interface ReceiptModalProps {
  fee: FeeItem;
  profile: StudentProfile;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  fee,
  profile,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Fee Payment Receipt - ${fee.title}`,
      text: `Official Fee Payment Receipt for ${profile.name} (${profile.rollNumber}) - Amount: $${fee.amount} - Invoice: ${fee.invoiceNumber}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Official Fee Payment Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Card Body */}
        <div id="printable-receipt" className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 text-slate-100 font-sans">
          
          {/* Receipt Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-white">CampusConnect University</h2>
                <p className="text-[10px] text-slate-400">Office of Student Accounts & Bursar</p>
                <p className="text-[10px] text-slate-400">Tax Registration ID: CCU-99201-US</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                PAID RECEIPT
              </span>
              <span className="text-xs font-mono font-bold text-slate-200">{fee.invoiceNumber}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Date: {fee.paidDate || new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Student Name</span>
              <span className="font-bold text-white">{profile.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Roll Number</span>
              <span className="font-mono font-bold text-emerald-400">{profile.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Program & Dept</span>
              <span className="text-slate-200">{profile.program}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Semester</span>
              <span className="text-slate-200">{fee.semester}</span>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="p-3">Fee Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-3 font-medium">{fee.title}</td>
                  <td className="p-3 text-slate-400">{fee.category}</td>
                  <td className="p-3 text-right font-bold text-white">${fee.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Payment Method */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 space-y-1">
              <p><span className="text-slate-300">Payment Channel:</span> <span className="font-semibold text-white">{fee.paymentMethod || 'Online Gateway'}</span></p>
              <p><span className="text-slate-300">Transaction Ref:</span> <span className="font-mono text-emerald-400">{fee.transactionId || 'TXN-99812034'}</span></p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block">Total Amount Paid</span>
              <span className="text-xl font-extrabold text-emerald-400">${fee.amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Digital Signature & Verification */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Digitally Authenticated by CampusConnect AI Bursar Engine</span>
            </div>
            <p className="font-mono">Valid Official Document</p>
          </div>

        </div>

      </div>
    </div>
  );
};

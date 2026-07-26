import React, { useState } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  GraduationCap, 
  RotateCw, 
  Printer, 
  Download, 
  CheckCircle2, 
  Sparkles,
  Barcode
} from 'lucide-react';
import { StudentProfile } from '../types';

interface DigitalIdCardProps {
  profile: StudentProfile;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-2 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Material 3 Digital Student Pass
        </div>
        <h2 className="text-xl font-bold text-white">CampusConnect Digital ID Card</h2>
        <p className="text-xs text-slate-400">
          Official digital identity pass for campus entry, library borrowing, and examination authentication.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Flip ID Card</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Pass</span>
          </button>
        </div>
      </div>

      {/* ID Card Wrapper */}
      <div className="perspective-1000">
        <div className={`relative transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT SIDE */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-5 relative overflow-hidden">
            {/* Background seal watermarks */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* University Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-white">CampusConnect University</h3>
                  <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold block">Official Student Pass</span>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                2026-2027
              </span>
            </div>

            {/* Main Details */}
            <div className="flex items-center gap-4">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-24 h-28 rounded-2xl object-cover ring-2 ring-emerald-500/80 shadow-md border border-slate-700"
              />

              <div className="space-y-1.5 text-xs flex-1">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">Student Name</span>
                  <span className="font-extrabold text-sm text-white">{profile.name}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">Roll / ID Number</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-xs">{profile.rollNumber}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">Program</span>
                  <span className="text-slate-200 font-medium text-[11px]">{profile.program}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400 block">Semester</span>
                    <span className="font-bold text-white">Semester {profile.semester}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Valid Thru</span>
                    <span className="font-bold text-white">08/2027</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode & Security Stamp */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-36 h-8 bg-white p-1 rounded flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-xs flex items-center justify-center font-mono text-[9px] text-white tracking-widest">
                    ||||| | ||||| ||| |||
                  </div>
                </div>
                <span className="text-[8px] text-slate-400 font-mono block text-center">{profile.id}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NFC Verified</span>
              </div>
            </div>

          </div>

          {/* BACK SIDE (Simplified) */}
          {isFlipped && (
            <div className="mt-4 bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-4 text-xs">
              <h4 className="font-bold text-sm text-emerald-400 border-b border-slate-800 pb-2">Emergency & Guardian Info</h4>
              <div className="space-y-2 text-slate-300">
                <p><span className="text-slate-400">Guardian Name:</span> {profile.guardianName}</p>
                <p><span className="text-slate-400">Guardian Phone:</span> {profile.guardianPhone}</p>
                <p><span className="text-slate-400">Address:</span> {profile.address}</p>
                <p><span className="text-slate-400">Blood Group:</span> O positive</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                <QrCode className="w-12 h-12 text-emerald-400 shrink-0" />
                <div className="text-[10px] text-slate-400">
                  Scan QR code for instant digital verification at campus security gates.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

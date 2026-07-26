import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { ScheduleItem } from '../types';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const daySchedule = schedule.filter(s => s.day === selectedDay);

  // Overall attendance calculation
  const totalClassesSum = schedule.reduce((acc, s) => acc + s.totalClasses, 0);
  const attendedClassesSum = schedule.reduce((acc, s) => acc + s.attendedClasses, 0);
  const overallAttendancePct = Math.round((attendedClassesSum / totalClassesSum) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
              Academic Timetable
            </span>
            <span className="text-xs text-slate-400">Spring 2026 Semester</span>
          </div>
          <h2 className="text-xl font-bold text-white">Class Schedule & Attendance Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track weekly lectures, lab sessions, classroom locations, and maintain course attendance thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Overall Attendance</span>
            <span className="text-lg font-bold text-emerald-400">{overallAttendancePct}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => {
          const count = schedule.filter(s => s.day === day).length;
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Cards List */}
      <div className="space-y-4">
        {daySchedule.length > 0 ? (
          daySchedule.map((item, idx) => {
            const isLowAttendance = item.attendanceRate < 75;
            const isLiveNow = idx === 0 && selectedDay === 'Monday'; // Demo live flag for first course

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {item.code}
                      </span>
                      <span className="text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded-md">
                        {item.type}
                      </span>
                      {isLiveNow && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Live Now
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{item.subject}</h3>
                    <p className="text-xs text-slate-300">{item.instructor}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-semibold block text-white">{item.time}</span>
                        <span className="text-[10px] text-slate-400">{item.duration}</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <div>
                        <span className="font-semibold block text-white">{item.room}</span>
                        <span className="text-[10px] text-slate-400">Main Campus</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Bar */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Attendance Record ({item.attendedClasses}/{item.totalClasses} classes)
                    </span>
                    <span className={`font-bold ${isLowAttendance ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.attendanceRate}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowAttendance ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.attendanceRate}%` }}
                    />
                  </div>

                  {isLowAttendance && (
                    <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Attendance warning: Falling below 75% requirement. Contact professor for clearance.
                    </p>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">No classes scheduled for {selectedDay}. Enjoy your study break!</p>
          </div>
        )}
      </div>

    </div>
  );
};

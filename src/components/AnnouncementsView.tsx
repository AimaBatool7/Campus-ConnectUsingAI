import React, { useState } from 'react';
import { 
  Megaphone, 
  Search, 
  Pin, 
  AlertCircle, 
  Calendar, 
  User, 
  Plus, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Announcement, AppRole } from '../types';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  role: AppRole;
  onAddAnnouncement: (notice: Omit<Announcement, 'id'>) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  role,
  onAddAnnouncement,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);

  // New Notice Modal State (for Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic' | 'Fee Alert' | 'Exam' | 'Event' | 'General'>('Academic');
  const [newContent, setNewContent] = useState('');
  const [newIsUrgent, setNewIsUrgent] = useState(false);

  const categories = ['All', 'Academic', 'Fee Alert', 'Exam', 'Event', 'General'];

  const filtered = announcements.filter(a => {
    const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    onAddAnnouncement({
      title: newTitle,
      category: newCategory,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      author: 'Registrar Office',
      isUrgent: newIsUrgent,
      pinned: newIsUrgent,
    });

    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
              Notice Board
            </span>
            <span className="text-xs text-slate-400">Campus Alerts & Updates</span>
          </div>
          <h2 className="text-xl font-bold text-white">University Announcements</h2>
          <p className="text-xs text-slate-400 mt-1">
            Official circulars, examination alerts, fee deadlines, and event updates.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Circular</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search announcements by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedNotice(item)}
            className={`p-5 rounded-3xl border cursor-pointer transition-all hover:scale-[1.01] shadow-md flex flex-col justify-between space-y-3 ${
              item.isUrgent
                ? 'bg-slate-900/90 border-rose-900/60 hover:border-rose-700'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.isUrgent ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.category}
                  </span>
                  {item.pinned && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-semibold">
                      <Pin className="w-3 h-3 fill-amber-400" /> Pinned
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>

              <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{item.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>By {item.author}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                Read Full Notice <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedNotice.isUrgent ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {selectedNotice.category}
                </span>
                <h3 className="text-base font-bold text-white">{selectedNotice.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p>{selectedNotice.content}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Published by {selectedNotice.author}</span>
              <span>Date: {selectedNotice.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD NOTICE MODAL (ADMIN) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Post New Campus Announcement</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination Guidelines"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Fee Alert">Fee Alert</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notice Details</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter complete circular content..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={newIsUrgent}
                  onChange={(e) => setNewIsUrgent(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="urgent" className="text-xs text-slate-300">Mark as High Priority / Urgent Alert</label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/20"
              >
                Publish Notice Immediately
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

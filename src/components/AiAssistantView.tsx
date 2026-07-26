import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  GraduationCap, 
  DollarSign, 
  Award, 
  HelpCircle,
  Loader2,
  User,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { ChatMessage, StudentProfile } from '../types';

interface AiAssistantViewProps {
  profile: StudentProfile;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ profile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'scholarship'>('chat');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${profile.name}! 👋 I am CampusConnect AI, powered by Google Gemini 2.5 Flash. I am your 24/7 School AI Assistant trained strictly to answer school-related questions.

I can help you with:
• **Admission Process** (Eligibility, application steps, merit list)
• **Fee Structure** (Class 1–8 fees, university tuition, payment methods)
• **Required Documents** (CNIC/Form-B, transcripts, photos)
• **School Timings** (Daily schedule, Friday hours, break times)
• **Class Information** (Class 1–8 details, subjects, teachers, labs)
• **Registration Help** (Form submission, document OCR, challan generation)

How can I assist you with your school queries today?`,
      timestamp: 'Just now',
      options: [
        'Admission process details',
        'Class 1-8 Fee Structure',
        'Required documents list',
        'School timings & hours',
        'Class & subject details',
        'Registration help',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scholarship Estimator State
  const [gpaInput, setGpaInput] = useState(profile.gpa.toString());
  const [incomeInput, setIncomeInput] = useState('45000');
  const [departmentInput, setDepartmentInput] = useState(profile.department);
  const [extracurriculars, setExtracurriculars] = useState('Hackathon 1st place, AI Club President');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scholarshipResult, setScholarshipResult] = useState<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'I am ready to help you with CampusConnect AI!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: data.options || [
          'View my fee statement',
          'Download Student ID Pass',
          'Check attendance warning',
        ],
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'I can assist you directly with registration rules, fee deadlines, or class schedules!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/scholarship-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpa: gpaInput,
          income: incomeInput,
          department: departmentInput,
          extracurriculars,
        }),
      });

      const data = await res.json();
      setScholarshipResult(data);
    } catch (err) {
      console.error("Scholarship eval error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Powered by Gemini 2.5 Flash
            </span>
            <span className="text-xs text-slate-400">24/7 AI Campus Bot</span>
          </div>
          <h2 className="text-xl font-bold text-white">CampusConnect AI Assistant</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ask questions about admissions, fees, class schedules, or evaluate your scholarship waiver.
          </p>
        </div>

        {/* Subtab navigation */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'chat'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Chatbot
          </button>
          <button
            onClick={() => setActiveSubTab('scholarship')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'scholarship'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scholarship Estimator
          </button>
        </div>
      </div>

      {activeSubTab === 'chat' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[520px]">
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-800 text-teal-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-[10px] opacity-80">
                      {msg.sender === 'user' ? 'You' : 'CampusConnect AI'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] opacity-60">{msg.timestamp}</span>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => speakText(msg.text)}
                          title="Read text aloud"
                          className="hover:text-emerald-400 text-slate-400"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Pre-suggested option chips */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-700/60">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(opt)}
                          className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-950 text-teal-300 border border-teal-800/60 text-[10px] font-medium transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1 border border-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>CampusConnect AI is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about registration, fee payment, class schedule, scholarships..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* SCHOLARSHIP ESTIMATOR TAB */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              AI Scholarship & Tuition Fee Waiver Calculator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your academic GPA and financial profile to evaluate your eligible scholarship discount tier.
            </p>
          </div>

          <form onSubmit={handleEvaluateScholarship} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Academic GPA (4.0 Scale)</label>
              <input
                type="text"
                value={gpaInput}
                onChange={(e) => setGpaInput(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Annual Family Income ($)</label>
              <input
                type="text"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={departmentInput}
                onChange={(e) => setDepartmentInput(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Extracurricular Achievements</label>
              <input
                type="text"
                value={extracurriculars}
                onChange={(e) => setExtracurriculars(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Scholarship Tiers with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Eligible Scholarship Discount</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {scholarshipResult && (
            <div className="p-5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Award Tier</span>
                  <h4 className="text-lg font-extrabold text-white">{scholarshipResult.eligibleTier}</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{scholarshipResult.discountPct}%</span>
                  <span className="text-[10px] text-slate-300 block">Tuition Fee Discount</span>
                </div>
              </div>

              <p className="text-xs text-slate-200">{scholarshipResult.reasoning}</p>

              {scholarshipResult.requirements && (
                <div className="pt-2 border-t border-emerald-900/60 space-y-1 text-xs">
                  <span className="font-semibold text-emerald-300 block">Compliance Requirements:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {scholarshipResult.requirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

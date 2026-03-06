import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const PATIENT = { name: "Sophia Hartwell", id: "MRN-20419-HW", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=b6e3f4" };

const UPCOMING_CONSULTS = [
  { id: "VC-2026-0041", doctor: "Dr. Elaine Morrow", specialty: "General Practice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elaine&backgroundColor=ffd5dc", date: "Today", time: "11:00 AM", duration: 30, status: "starting-soon", sessionId: "sess_elaine_001" },
  { id: "VC-2026-0038", doctor: "Dr. Kevin Patel", specialty: "Endocrinology", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede", date: "Mar 10, 2026", time: "2:00 PM", duration: 20, status: "scheduled", sessionId: "sess_kevin_002" },
  { id: "VC-2026-0033", doctor: "Dr. Sandra Wu", specialty: "Cardiology", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandra&backgroundColor=d1d4f9", date: "Mar 18, 2026", time: "10:30 AM", duration: 45, status: "scheduled", sessionId: "sess_sandra_003" },
];

const PAST_CONSULTS = [
  { id: "VC-2026-0021", doctor: "Dr. Kevin Patel", specialty: "Endocrinology", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede", date: "Feb 14, 2026", time: "3:00 PM", duration: 22, status: "completed" },
  { id: "VC-2025-0198", doctor: "Dr. Elaine Morrow", specialty: "General Practice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elaine&backgroundColor=ffd5dc", date: "Dec 20, 2025", time: "11:00 AM", duration: 18, status: "completed" },
];

const CONSULTATION_SUMMARY = {
  id: "VC-2026-0021",
  doctor: "Dr. Kevin Patel",
  specialty: "Endocrinology",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede",
  date: "Feb 14, 2026",
  time: "3:00 PM",
  duration: 22,
  chiefComplaint: "Elevated HbA1c levels and fatigue",
  subjective: "Patient reports persistent fatigue for the past 3 weeks. HbA1c recently measured at 7.1%. Adherent to Metformin 1000mg twice daily. Diet generally controlled but admits to occasional high-carb meals on weekends.",
  objective: { bp: "128/82 mmHg", hr: "76 bpm", weight: "62 kg", bmi: "23.1", glucose: "138 mg/dL" },
  assessment: "Type 2 Diabetes Mellitus — suboptimally controlled. Fatigue likely secondary to glycemic fluctuations. No signs of end-organ damage. Thyroid function within normal limits.",
  plan: [
    "Increase Metformin to 1000mg twice daily (already on this dose — reinforce adherence)",
    "Add Empagliflozin 10mg once daily for better glycemic control",
    "Dietary referral to clinical nutritionist — low glycemic diet counseling",
    "Repeat HbA1c in 8 weeks",
    "Monitor fasting glucose daily and log results",
  ],
  prescriptions: [{ name: "Empagliflozin 10mg", dose: "Once daily", notes: "Take in the morning with or without food" }],
  followUp: "8 weeks — Mar 18, 2026 at 10:30 AM",
  notes: "Patient expressed concern about fatigue impacting daily work. Counseled on the relationship between glucose control and energy levels. Motivated and willing to make dietary adjustments.",
};

const INITIAL_CHAT = [
  { id: 1, from: "doctor", text: "Good afternoon, Sophia! How are you feeling today?", time: "3:02 PM", read: true },
  { id: 2, from: "patient", text: "Hi Dr. Patel! I've been feeling quite tired lately, even after a full night of sleep.", time: "3:03 PM", read: true },
  { id: 3, from: "doctor", text: "I understand. Fatigue is a common symptom when blood sugar levels are not well-controlled. I saw your recent HbA1c was 7.1%. Have you been taking your Metformin consistently?", time: "3:04 PM", read: true },
  { id: 4, from: "patient", text: "Yes, mostly — but I sometimes forget the evening dose.", time: "3:05 PM", read: true },
  { id: 5, from: "doctor", text: "That would explain some of the variation. I'm going to recommend adding a second medication today. I'll also share a diet plan in a moment.", time: "3:06 PM", read: true },
  { id: 6, from: "doctor", text: "📎 Diet_Plan_Diabetic_Feb2026.pdf", time: "3:07 PM", read: true, isFile: true, fileType: "pdf", fileSize: "1.2 MB" },
];

const QUICK_REPLIES = ["Thank you, Doctor", "Can you explain that again?", "I understand", "What are the side effects?", "When should I take it?"];

/* ══════════════════════════════════════════════════════════════════
   VIDEO CALL SCREEN
══════════════════════════════════════════════════════════════════ */
interface VideoCallProps {
  consult: Consult;
  onEnd: () => void;
  onOpenChat: () => void;
  onOpenFiles: () => void;
}

function VideoCall({ consult, onEnd, onOpenChat, onOpenFiles }: VideoCallProps) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [connecting, setConnecting] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [recordingOn, setRecordingOn] = useState(false);
  const [networkQuality, setNetworkQuality] = useState(4); // bars 1-4
  const [pip, setPip] = useState(false);
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);
  const particleCanvas = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setConnecting(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (connecting) return;
    const iv = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [connecting]);

  useEffect(() => {
    const iv = setInterval(() => setNetworkQuality(Math.floor(Math.random() * 2) + 3), 8000);
    return () => clearInterval(iv);
  }, []);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimer.current !== null) {
      clearTimeout(controlsTimer.current);
    }
    controlsTimer.current = setTimeout(() => setShowControls(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col" onMouseMove={resetControlsTimer}>

      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">

        {/* Doctor "video" — simulated with gradient */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "radial-gradient(ellipse at 50% 40%, #1e293b 0%, #0f172a 70%, #020617 100%)" }}>
          {/* Animated background dots */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {connecting ? (
            <div className="text-center z-10">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-white/10 animate-pulse">
                <img src={consult.avatar} alt={consult.doctor} className="w-full h-full object-cover" />
              </div>
              <p className="text-white font-bold text-lg mb-1">{consult.doctor}</p>
              <div className="flex items-center gap-2 justify-center text-slate-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Connecting…</span>
              </div>
            </div>
          ) : (
            <div className="text-center z-10">
              <div className="relative inline-block">
                <img src={consult.avatar} alt={consult.doctor} className="w-40 h-40 rounded-full object-cover opacity-90" style={{ filter: "drop-shadow(0 0 40px rgba(56,189,248,0.3))" }} />
                {/* Speaking indicator */}
                {!micOn ? null : (
                  <div className="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping opacity-30" />
                )}
              </div>
              <p className="text-white font-bold mt-4 text-lg">{consult.doctor}</p>
              <p className="text-slate-400 text-sm">{consult.specialty}</p>
            </div>
          )}
        </div>

        {/* Patient PiP (self-view) */}
        <div
          className={`absolute bottom-24 right-4 transition-all duration-300 cursor-pointer z-20 ${pip ? "w-16 h-16 rounded-full" : "w-28 h-36 sm:w-36 sm:h-48 rounded-2xl"} overflow-hidden border-2 border-white/20 shadow-2xl`}
          onClick={() => setPip(!pip)}
          style={{ background: camOn ? "linear-gradient(135deg,#164e63,#0c4a6e)" : "#1e293b" }}
        >
          {camOn ? (
            <div className="w-full h-full flex items-center justify-center">
              <img src={PATIENT.avatar} alt="You" className="w-full h-full object-cover opacity-80" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
          )}
          {!pip && (
            <div className="absolute bottom-1 left-0 right-0 text-center">
              <span className="text-white text-xs font-semibold bg-black/40 px-2 py-0.5 rounded-full">You</span>
            </div>
          )}
        </div>

        {/* Top HUD */}
        <div className={`absolute top-0 left-0 right-0 z-20 transition-all duration-500 ${showControls || connecting ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-start justify-between p-4">
            <div className="flex items-center gap-2">
              {/* Network quality */}
              <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <div className="flex items-end gap-0.5 h-4">
                  {[1,2,3,4].map(b => (
                    <div key={b} className={`w-1.5 rounded-sm transition-all ${b <= networkQuality ? "bg-emerald-400" : "bg-white/20"}`} style={{ height: `${b * 25}%` }} />
                  ))}
                </div>
                <span className="text-white text-xs font-semibold">HD</span>
              </div>

              {recordingOn && (
                <div className="bg-red-500/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-white text-xs font-bold">REC</span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-1.5 text-center">
              <p className="text-white font-black text-lg leading-tight font-mono">{fmtTime(callTime)}</p>
              <p className="text-slate-300 text-xs">{consult.doctor.split(" ")[1]}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={onOpenChat} className="bg-black/40 backdrop-blur-sm rounded-xl p-2.5 text-white hover:bg-white/10 transition-colors" title="Chat">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </button>
              <button onClick={onOpenFiles} className="bg-black/40 backdrop-blur-sm rounded-xl p-2.5 text-white hover:bg-white/10 transition-colors" title="Share Files">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom hand-raise */}
        {handRaised && (
          <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-amber-500 text-white rounded-2xl px-4 py-2 text-sm font-bold shadow-lg animate-bounce z-20">
            ✋ Hand Raised
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className={`bg-slate-900/95 backdrop-blur-sm border-t border-white/5 px-4 py-4 z-20 transition-all duration-500 ${showControls || connecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`}>
        <div className="max-w-sm mx-auto flex items-center justify-between gap-3">

          {/* Mic */}
          <button onClick={() => setMicOn(m => !m)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${micOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"}`}>
            <span className="text-xl">{micOn ? "🎙️" : "🔇"}</span>
            <span className="text-xs font-semibold">{micOn ? "Mute" : "Unmute"}</span>
          </button>

          {/* Camera */}
          <button onClick={() => setCamOn(c => !c)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${camOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"}`}>
            <span className="text-xl">{camOn ? "📹" : "📷"}</span>
            <span className="text-xs font-semibold">{camOn ? "Stop Cam" : "Start Cam"}</span>
          </button>

          {/* End call */}
          <button onClick={onEnd}
            className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-900/50">
            <span className="text-xl">📵</span>
            <span className="text-xs font-bold">End Call</span>
          </button>

          {/* Speaker */}
          <button onClick={() => setSpeakerOn(s => !s)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${speakerOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-amber-500 text-white"}`}>
            <span className="text-xl">{speakerOn ? "🔊" : "🔕"}</span>
            <span className="text-xs font-semibold">Speaker</span>
          </button>

          {/* Raise hand */}
          <button onClick={() => setHandRaised(h => !h)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${handRaised ? "bg-amber-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>
            <span className="text-xl">✋</span>
            <span className="text-xs font-semibold">Hand</span>
          </button>
        </div>

        {/* Secondary row */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button onClick={() => setRecordingOn(r => !r)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${recordingOn ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-slate-400 hover:text-white"}`}>
            <span className={`w-2 h-2 rounded-full ${recordingOn ? "bg-red-400 animate-pulse" : "bg-slate-600"}`} />
            {recordingOn ? "Stop Recording" : "Record"}
          </button>
          <button onClick={onOpenFiles} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5">
            📎 Share File
          </button>
          <button onClick={onOpenChat} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5">
            💬 Chat
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════════════════════ */
interface ChatPanelProps {
  consult: Consult;
  inCall?: boolean;
  onClose?: () => void;
}

function ChatPanel({ consult, inCall = false, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const EMOJIS = ["👍","🙏","😊","❤️","👌","😮","🤔","👋","✅","⚠️"];

  const DR_REPLIES = [
    "I understand your concern. Let me explain further.",
    "That's a great question. The medication works by improving insulin sensitivity.",
    "Please make sure to take it with a meal to avoid nausea.",
    "I'll note that in your chart. We'll monitor closely.",
    "Your progress is looking good overall. Keep it up!",
    "Don't hesitate to reach out if you have any other questions.",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    const msg = { id: Date.now(), from: "patient", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false };
    setMessages(prev => [...prev, msg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: "doctor",
        text: DR_REPLIES[Math.floor(Math.random() * DR_REPLIES.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true
      }]);
    }, 1800 + Math.random() * 1000);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploadingFile(true);
    setTimeout(() => {
      setUploadingFile(false);
      setMessages(prev => [...prev, {
        id: Date.now(), from: "patient",
        text: `📎 ${files[0].name}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false, isFile: true, fileType: files[0].name.split(".").pop() || "file", fileSize: (files[0].size / 1024 / 1024).toFixed(1) + " MB"
      }]);
    }, 1500);
  };

  const wrapClass = inCall
    ? "fixed right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-white/10 flex flex-col z-50"
    : "flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden";

  return (
    <div className={wrapClass} style={{ animation: inCall ? "slideFromRight 0.25s ease" : "none" }}>
      <style>{`@keyframes slideFromRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b flex-shrink-0 ${inCall ? "border-white/10 bg-slate-800" : "border-slate-100"}`}>
        <div className="relative">
          <img src={consult.avatar} alt={consult.doctor} className="w-10 h-10 rounded-full" />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${inCall ? "text-white" : "text-slate-900"}`}>{consult.doctor}</p>
          <p className={`text-xs ${inCall ? "text-emerald-400" : "text-emerald-500"}`}>● Online · {consult.specialty}</p>
        </div>
        {inCall && onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm">✕</button>
        )}
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${inCall ? "scrollbar-thin" : ""}`} style={{ background: inCall ? "#0f172a" : "#f8fafc" }}>
        {/* Date divider */}
        <div className="text-center"><span className={`text-xs px-3 py-1 rounded-full font-semibold ${inCall ? "bg-white/10 text-slate-400" : "bg-slate-200 text-slate-500"}`}>Today</span></div>

        {messages.map(msg => {
          const isMe = msg.from === "patient";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
              {!isMe && <img src={consult.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 mb-0.5" />}
              <div className={`max-w-[75%] ${isMe ? "order-1" : "order-2"}`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "rounded-br-md text-white" + (inCall ? " bg-sky-600" : " bg-violet-600")
                    : "rounded-bl-md " + (inCall ? "bg-slate-700 text-white" : "bg-white text-slate-800 shadow-sm border border-slate-100")
                }`}>
                  {msg.isFile ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${inCall ? "bg-white/10" : "bg-slate-100"}`}>
                        <span className="text-base">📄</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-sm">{msg.text.replace("📎 ", "")}</p>
                        {msg.fileSize && <p className={`text-xs ${inCall ? "text-slate-400" : "text-slate-400"}`}>{msg.fileSize}</p>}
                      </div>
                      <span className="text-xs opacity-60">↓</span>
                    </div>
                  ) : msg.text}
                </div>
                <p className={`text-xs mt-1 ${isMe ? "text-right" : ""} ${inCall ? "text-slate-500" : "text-slate-400"}`}>
                  {msg.time}{isMe && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
                </p>
              </div>
              {isMe && <img src={PATIENT.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 mb-0.5 order-2" />}
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-end gap-2">
            <img src={consult.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
            <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${inCall ? "bg-slate-700" : "bg-white border border-slate-100"}`}>
              <div className="flex gap-1 items-center">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        {uploadingFile && (
          <div className="flex justify-end">
            <div className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${inCall ? "bg-sky-600/50 text-white" : "bg-violet-100 text-violet-700"}`}>
              <span className="animate-spin">⟳</span> Uploading file…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className={`px-4 py-2 border-t flex gap-2 overflow-x-auto scrollbar-none ${inCall ? "border-white/10 bg-slate-800/50" : "border-slate-100"}`} style={{ scrollbarWidth: "none" }}>
        {QUICK_REPLIES.map(r => (
          <button key={r} onClick={() => sendMessage(r)}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border flex-shrink-0 transition-all ${inCall ? "border-white/10 text-slate-300 hover:bg-white/10" : "border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 bg-white"}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className={`px-4 py-3 border-t flex-shrink-0 ${inCall ? "border-white/10 bg-slate-800" : "border-slate-100 bg-white"}`}>
        {showEmoji && (
          <div className={`mb-2 p-2 rounded-xl flex gap-2 flex-wrap ${inCall ? "bg-slate-700" : "bg-slate-50 border border-slate-100"}`}>
            {EMOJIS.map(e => <button key={e} onClick={() => { setInput(i => i + e); setShowEmoji(false); }} className="text-xl hover:scale-125 transition-transform">{e}</button>)}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <button onClick={() => setShowEmoji(s => !s)} className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors ${inCall ? "text-slate-400 hover:bg-white/10" : "text-slate-400 hover:bg-slate-100"}`}>😊</button>
          <div className="flex-1 relative">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type a message…"
              className={`w-full px-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all pr-10 ${inCall ? "bg-slate-700 text-white placeholder-slate-500 focus:ring-1 focus:ring-sky-500" : "bg-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-violet-400"}`} />
          </div>
          <input type="file" ref={fileRef} className="hidden" onChange={e => handleFileUpload(e.target.files)} />
          <button onClick={() => fileRef.current?.click()} className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors ${inCall ? "text-slate-400 hover:bg-white/10" : "text-slate-400 hover:bg-slate-100"}`}>📎</button>
          <button onClick={() => sendMessage()}
            disabled={!input.trim()}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${inCall ? "bg-sky-600 hover:bg-sky-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
            <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FILE UPLOAD PANEL (during call)
══════════════════════════════════════════════════════════════════ */
interface FileUploadPanelProps {
  onClose?: () => void;
  inCall?: boolean;
}

interface FileItem {
  id: number;
  name: string;
  size: string;
  type: string | undefined;
  status: string;
  sharedAt?: string;
  progress?: number;
}

function FileUploadPanel({ onClose, inCall = false }: FileUploadPanelProps) {
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Blood_Report_Feb2026.pdf", size: "1.2 MB", type: "pdf", status: "shared", sharedAt: "3:07 PM" },
    { id: 2, name: "BP_Log_January.jpg", size: "0.4 MB", type: "img", status: "shared", sharedAt: "3:09 PM" },
  ]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFile = (f: File) => {
    const newFile: FileItem = { id: Date.now(), name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + " MB", type: f.name.split(".").pop(), status: "uploading", progress: 0 };
    setFiles(prev => [...prev, newFile]);
    setUploading(newFile.id);
    let p = 0;
    const iv = setInterval(() => {
      p += 12;
      setFiles(prev => prev.map(x => x.id === newFile.id ? { ...x, progress: Math.min(p, 100) } : x));
      if (p >= 100) {
        clearInterval(iv);
        setUploading(null);
        setFiles(prev => prev.map(x => x.id === newFile.id ? { ...x, status: "shared", sharedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } : x));
      }
    }, 120);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) addFile(e.dataTransfer.files[0]); };
  const typeIcon: Record<string, string> = { pdf: "📄", jpg: "🖼️", jpeg: "🖼️", png: "🖼️", docx: "📝", xlsx: "📊" };

  const wrap = inCall
    ? "fixed left-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-r border-white/10 flex flex-col z-50"
    : "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden";

  return (
    <div className={wrap} style={{ animation: inCall ? "slideFromLeft 0.25s ease" : "none" }}>
      <style>{`@keyframes slideFromLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

      <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0 ${inCall ? "border-white/10 bg-slate-800" : "border-slate-100"}`}>
        <div>
          <p className={`font-black text-sm ${inCall ? "text-white" : "text-slate-900"}`}>Share Files</p>
          <p className={`text-xs ${inCall ? "text-slate-400" : "text-slate-400"}`}>Documents shared in this consultation</p>
        </div>
        {inCall && onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm">✕</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ background: inCall ? "#0f172a" : undefined }}>
        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer mb-4 transition-all ${dragging ? "border-sky-400 bg-sky-50/10" : inCall ? "border-white/10 hover:border-white/20 hover:bg-white/5" : "border-slate-200 hover:border-violet-300 hover:bg-violet-50/50"}`}>
          <input type="file" ref={fileRef} className="hidden" onChange={e => e.target.files?.[0] && addFile(e.target.files[0])} />
          <p className="text-3xl mb-2">📁</p>
          <p className={`font-bold text-sm mb-1 ${inCall ? "text-white" : "text-slate-700"}`}>Drop file or tap to browse</p>
          <p className={`text-xs ${inCall ? "text-slate-500" : "text-slate-400"}`}>PDF, JPG, PNG, DOCX · Max 20MB</p>
        </div>

        {/* File list */}
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${inCall ? "text-slate-400" : "text-slate-400"}`}>Shared in This Session</p>
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${inCall ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${inCall ? "bg-white/10" : "bg-white border border-slate-200"}`}>
                {typeIcon[f.type || ""] || "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${inCall ? "text-white" : "text-slate-800"}`}>{f.name}</p>
                {f.status === "uploading" ? (
                  <div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1 mb-0.5">
                      <div className="h-full rounded-full bg-sky-400 transition-all duration-200" style={{ width: `${f.progress}%` }} />
                    </div>
                    <p className="text-xs text-sky-400">Uploading {f.progress}%</p>
                  </div>
                ) : (
                  <p className={`text-xs ${inCall ? "text-slate-500" : "text-slate-400"}`}>{f.size} · Shared {f.sharedAt}</p>
                )}
              </div>
              {f.status === "shared" && (
                <div className="flex gap-1.5 flex-shrink-0">
                  <button className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${inCall ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-400 hover:bg-slate-200"}`}>↓</button>
                  <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${inCall ? "text-slate-600 hover:bg-red-500/20 hover:text-red-400" : "text-slate-300 hover:bg-red-50 hover:text-red-400"}`}>✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CONSULTATION SUMMARY
══════════════════════════════════════════════════════════════════ */
interface ConsultationSummaryProps {
  onClose: () => void;
}

function ConsultationSummary({ onClose }: ConsultationSummaryProps) {
  const s = CONSULTATION_SUMMARY;
  const [tab, setTab] = useState("soap");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 flex-shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={s.avatar} alt={s.doctor} className="w-11 h-11 rounded-2xl bg-slate-700" />
              <div>
                <p className="text-white font-black">{s.doctor}</p>
                <p className="text-slate-400 text-xs">{s.specialty}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm">✕</button>
          </div>
          <div className="flex gap-3 text-xs text-slate-400">
            <span>📅 {s.date}</span><span>🕐 {s.time}</span><span>⏱ {s.duration} min</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5 bg-white flex-shrink-0">
          {[{ id:"soap",label:"SOAP Notes" },{ id:"vitals",label:"Vitals" },{ id:"plan",label:"Plan & Rx" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-all ${tab===t.id?"border-violet-600 text-violet-700":"border-transparent text-slate-400 hover:text-slate-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {tab === "soap" && (
            <>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1.5">Chief Complaint</p>
                <p className="text-sm text-slate-800 font-semibold">{s.chiefComplaint}</p>
              </div>
              {[
                { label:"S — Subjective", text: s.subjective, color:"blue" },
                { label:"A — Assessment", text: s.assessment, color:"violet" },
              ].map(sec => (
                <div key={sec.label} className={`bg-${sec.color}-50 rounded-2xl p-4 border border-${sec.color}-100`}>
                  <p className={`text-xs font-black text-${sec.color}-600 uppercase tracking-wider mb-1.5`}>{sec.label}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{sec.text}</p>
                </div>
              ))}
              {s.notes && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Doctor's Notes</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.notes}</p>
                </div>
              )}
            </>
          )}

          {tab === "vitals" && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(s.objective).map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-400 capitalize font-semibold mb-1">{k.replace(/([A-Z])/g," $1")}</p>
                  <p className="font-black text-slate-900 text-lg leading-tight">{v}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "plan" && (
            <>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">O — Objective Plan</p>
                <div className="space-y-2">
                  {s.plan.map((p, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                      <p className="text-sm text-slate-700 leading-snug">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
              {s.prescriptions.length > 0 && (
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">New Prescriptions</p>
                  {s.prescriptions.map((rx, i) => (
                    <div key={i} className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                      <p className="font-black text-violet-800">{rx.name}</p>
                      <p className="text-xs text-violet-600 mt-1">💊 {rx.dose} · {rx.notes}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
                <p className="text-xs font-black text-sky-600 uppercase tracking-wider mb-1">Follow-Up</p>
                <p className="font-bold text-slate-800 text-sm">📅 {s.followUp}</p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button className="flex-1 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">↓ Download PDF</button>
          <button className="flex-1 py-2.5 rounded-2xl bg-violet-600 text-white font-black text-sm hover:bg-violet-700 transition-colors shadow-md shadow-violet-200">Share with Doctor</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME / LOBBY
══════════════════════════════════════════════════════════════════ */
interface TelemedicineLobbyProps {
  onJoin: (c: Consult) => void;
  onOpenChat: (c: Consult) => void;
  onViewSummary: () => void;
}

function TelemedicineLobby({ onJoin, onOpenChat, onViewSummary }: TelemedicineLobbyProps) {
  const [tab, setTab] = useState("upcoming");

  return (
    <div>
      {/* Hero CTA — if starting-soon session */}
      {UPCOMING_CONSULTS.filter(c => c.status === "starting-soon").map(c => (
        <div key={c.id} className="relative overflow-hidden rounded-3xl mb-6 shadow-xl" style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #1e3a5f 50%, #1e1b4b 100%)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%)" }} />
          <div className="relative p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Starting Soon
                </span>
                <h3 className="text-white text-xl font-black">{c.doctor}</h3>
                <p className="text-sky-300 text-sm">{c.specialty}</p>
              </div>
              <img src={c.avatar} alt={c.doctor} className="w-16 h-16 rounded-2xl border-2 border-white/20" />
            </div>
            <div className="flex gap-3 text-xs text-sky-300 mb-5">
              <span>📅 {c.date}</span><span>🕐 {c.time}</span><span>⏱ {c.duration} min</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onJoin(c)}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm transition-all shadow-lg shadow-emerald-900/50 active:scale-[0.98] flex items-center justify-center gap-2">
                <span>📹</span> Join Video Call
              </button>
              <button onClick={() => onOpenChat(c)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center gap-2">
                <span>💬</span> Chat
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["upcoming","past"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize border transition-all ${tab===t?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>{t}</button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {(tab === "upcoming" ? UPCOMING_CONSULTS.filter(c=>c.status==="scheduled") : PAST_CONSULTS).map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <img src={c.avatar} alt={c.doctor} className="w-12 h-12 rounded-2xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900">{c.doctor}</p>
                <p className="text-xs text-slate-400">{c.specialty}</p>
                <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                  <span>📅 {c.date}</span><span>🕐 {c.time}</span><span>⏱ {c.duration} min</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {tab === "upcoming" ? (
                <>
                  <button onClick={() => onJoin(c)} className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors flex items-center justify-center gap-1">📹 Join Call</button>
                  <button onClick={() => onOpenChat(c)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">💬 Chat</button>
                </>
              ) : (
                <>
                  <button onClick={onViewSummary} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1">📋 Summary</button>
                  <button onClick={() => onOpenChat(c)} className="flex-1 py-2 rounded-xl border border-violet-200 text-violet-600 text-xs font-bold hover:bg-violet-50 transition-colors flex items-center justify-center gap-1">💬 Chat History</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
interface Consult {
  id: string;
  doctor: string;
  specialty: string;
  avatar: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  sessionId?: string;
}

export default function Telemedicine() {
  const [view, setView] = useState("lobby"); // lobby | call | chat
  const [activeConsult, setActiveConsult] = useState<Consult | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [callChat, setCallChat] = useState(false);
  const [callFiles, setCallFiles] = useState(false);

  const joinCall = (c: Consult) => { setActiveConsult(c); setView("call"); };
  const endCall = () => { setView("lobby"); setActiveConsult(null); setCallChat(false); setCallFiles(false); };
  const openChat = (c: Consult) => { setActiveConsult(c); setView("chat"); };

  if (view === "call" && activeConsult) return (
    <>
      <VideoCall
        consult={activeConsult}
        onEnd={endCall}
        onOpenChat={() => { setCallChat(c => !c); setCallFiles(false); }}
        onOpenFiles={() => { setCallFiles(f => !f); setCallChat(false); }}
      />
      {callChat && <ChatPanel consult={activeConsult} inCall onClose={() => setCallChat(false)} />}
      {callFiles && <FileUploadPanel inCall onClose={() => setCallFiles(false)} />}
    </>
  );

  return (
    <div className="min-h-screen" style={{ fontFamily:"'Cabinet Grotesk','Segoe UI',sans-serif", background:"linear-gradient(160deg,#f0f4ff 0%,#f8fafc 60%,#faf0ff 100%)" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');
        *{box-sizing:border-box;}
        .tab-scroll::-webkit-scrollbar{display:none;}
        .tab-scroll{scrollbar-width:none;}
      `}</style>

      {/* Nav */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-md" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>📹</div>
            <div>
              <h1 className="font-black text-slate-900 text-base leading-tight">Telemedicine</h1>
              <p className="text-xs text-slate-400">{PATIENT.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {view === "chat" && (
              <button onClick={() => setView("lobby")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all">← Back</button>
            )}
            <button onClick={() => setShowSummary(true)} className="flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-xl hover:bg-violet-100 transition-all">📋 Summary</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
        {view === "lobby" && (
          <TelemedicineLobby onJoin={joinCall} onOpenChat={openChat} onViewSummary={() => setShowSummary(true)} />
        )}

        {view === "chat" && activeConsult && (
          <div className="h-[calc(100vh-140px)]">
            <ChatPanel consult={activeConsult} onClose={() => setView("lobby")} />
          </div>
        )}
      </div>

      {showSummary && <ConsultationSummary onClose={() => setShowSummary(false)} />}
    </div>
  );
}
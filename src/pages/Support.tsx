import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const PATIENT = { name: "Sophia Hartwell", id: "MRN-20419-HW", email: "sophia.hartwell@email.com" };

const TICKET_CATEGORIES = [
  { id: "appointment", label: "Appointment Issue", icon: "📅", color: "#2563eb" },
  { id: "billing",     label: "Billing & Payments", icon: "💳", color: "#d97706" },
  { id: "medical",     label: "Medical Records",    icon: "📋", color: "#059669" },
  { id: "prescription",label: "Prescription",       icon: "💊", color: "#7c3aed" },
  { id: "technical",   label: "Technical Issue",    icon: "🔧", color: "#dc2626" },
  { id: "telemedicine",label: "Telemedicine",       icon: "📹", color: "#0891b2" },
  { id: "insurance",   label: "Insurance & Claims", icon: "🛡️", color: "#be123c" },
  { id: "other",       label: "Other",              icon: "💬", color: "#64748b" },
];

const PRIORITY_OPTS = [
  { id: "low",    label: "Low",    color: "text-slate-500 bg-slate-100 border-slate-200",    dot: "bg-slate-400" },
  { id: "medium", label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200",     dot: "bg-amber-500" },
  { id: "high",   label: "High",   color: "text-red-700 bg-red-50 border-red-200",           dot: "bg-red-500" },
];

const MY_TICKETS = [
  { id: "TKT-2026-0041", cat: "billing",      subject: "Overcharged for Cardiology visit", priority: "high",   status: "open",        created: "Feb 28, 2026", updated: "Mar 2, 2026",  replies: 2 },
  { id: "TKT-2026-0038", cat: "appointment",  subject: "Cannot reschedule Dr. Wu appointment", priority: "medium", status: "in-progress", created: "Feb 20, 2026", updated: "Mar 1, 2026",  replies: 3 },
  { id: "TKT-2026-0021", cat: "technical",    subject: "Video call not connecting on mobile", priority: "high",   status: "resolved",    created: "Jan 15, 2026", updated: "Jan 18, 2026", replies: 5 },
  { id: "TKT-2025-0198", cat: "prescription", subject: "Refill request not going through",   priority: "low",    status: "closed",      created: "Dec 10, 2025", updated: "Dec 12, 2025", replies: 2 },
];

const TICKET_STATUS = {
  "open":        { label: "Open",        color: "bg-blue-100 text-blue-700 border-blue-200",     dot: "bg-blue-500" },
  "in-progress": { label: "In Progress", color: "bg-amber-100 text-amber-700 border-amber-200",  dot: "bg-amber-500 animate-pulse" },
  "resolved":    { label: "Resolved",    color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  "closed":      { label: "Closed",      color: "bg-slate-100 text-slate-500 border-slate-200",  dot: "bg-slate-400" },
};

const FAQ_DATA = [
  {
    cat: "Appointments",
    icon: "📅",
    items: [
      { q: "How do I reschedule or cancel my appointment?", a: "Go to Appointments → select your appointment → tap 'Reschedule' or 'Cancel'. Rescheduling is free up to 2 hours before your appointment. Cancellations within 1 hour may incur a $25 fee." },
      { q: "Can I book same-day appointments?", a: "Yes, same-day slots are available for General Practice and some specialists. Use the Book Appointment flow and filter by 'Today'. Availability is on a first-come, first-served basis." },
      { q: "What should I do if my doctor is late for the video call?", a: "Please wait up to 10 minutes. If the doctor hasn't joined, you'll receive an automatic alert and option to reschedule at no charge or receive a full refund." },
    ],
  },
  {
    cat: "Billing",
    icon: "💳",
    items: [
      { q: "Why is my bill higher than expected?", a: "Bills can vary due to additional tests ordered, specialist fees, or applicable deductibles. View itemized charges on any invoice by tapping 'Invoice' in Billing & Payments. Contact us if you believe there's an error." },
      { q: "How long does insurance reimbursement take?", a: "Insurance claims are typically processed within 7–21 business days after submission. You can track your claim status in real time under Billing → Claims." },
      { q: "Can I pay in installments?", a: "Yes. For bills over $200, you may apply for a payment plan. Contact our billing team to set up monthly installments interest-free for up to 6 months." },
    ],
  },
  {
    cat: "Medical Records",
    icon: "📋",
    items: [
      { q: "How do I access my lab reports?", a: "Navigate to Lab & Reports → Report History. Completed reports are available for download as PDF. Reports are usually posted within 24 hours of being resulted." },
      { q: "Can I share my records with another doctor?", a: "Yes. In Medical Records, tap any report → 'Share'. You can share via email or generate a secure one-time link. The link expires after 48 hours." },
      { q: "How long are my records retained?", a: "All medical records are retained for a minimum of 10 years per healthcare regulations. You can request a complete export of your records at any time from Profile Settings." },
    ],
  },
  {
    cat: "Telemedicine",
    icon: "📹",
    items: [
      { q: "What devices support video consultations?", a: "Video calls work on Chrome, Safari, Edge, and Firefox on desktop. On mobile, use our iOS or Android app. Ensure camera and microphone permissions are granted." },
      { q: "Is my video consultation private?", a: "All consultations are encrypted end-to-end using WebRTC. Recordings (if enabled by you) are stored in your account and are never shared without consent." },
      { q: "What happens if my internet drops during a call?", a: "The call will automatically attempt to reconnect for 60 seconds. If unsuccessful, a notification is sent to your doctor to reschedule at no charge to you." },
    ],
  },
  {
    cat: "Account & Privacy",
    icon: "🔒",
    items: [
      { q: "How do I change my password or email?", a: "Go to Profile → Settings → Account Security. You can update your email, password, and enable two-factor authentication (2FA) for added security." },
      { q: "How is my health data protected?", a: "Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are fully HIPAA compliant and do not sell your data to third parties. Review our Privacy Policy for details." },
      { q: "Can I delete my account?", a: "You can request account deletion under Profile → Settings → Delete Account. Note: medical records are retained for the legally required 10-year period even after account deletion." },
    ],
  },
];

const BOT_REPLIES = {
  appointment: ["I can help you with your appointment. Would you like to reschedule, cancel, or get details about an upcoming visit?", "For appointment issues, you can also go to Appointments → select the booking → Reschedule/Cancel."],
  billing:     ["I see you have a billing question. Can you share the invoice number? I'll pull up the details right away.", "For disputed charges, I can raise a billing review ticket on your behalf. Would you like me to do that?"],
  prescription:["For prescription refills, have you tried the Refill button on the Prescriptions page? It's the fastest way.", "I can check the status of your refill request. Please share the prescription name and I'll look into it."],
  default:     ["I'm looking into that for you. Give me a moment…", "Thanks for reaching out! Let me connect you with the right team.", "I understand your concern. A support agent will follow up within 2 hours.", "Could you provide a bit more detail so I can assist you better?"],
};

const CHAT_QUICK = ["Track my ticket", "Billing question", "Reschedule appointment", "Prescription issue", "Technical help"];

/* ══════════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const s = TICKET_STATUS[status as keyof typeof TICKET_STATUS] || TICKET_STATUS.open;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SectionHeading({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="font-black text-slate-900 text-xl leading-tight">{title}</h2>
          {sub && <p className="text-sm text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RAISE TICKET
══════════════════════════════════════════════════════════════════ */
interface Attachment {
  name: string;
  size: string;
  type?: string;
}

function RaiseTicket({ onSubmit }: { onSubmit?: (id: string) => void }) {
  const [form, setForm] = useState({ cat: null, priority: "medium", subject: "", desc: "", attachments: [] as Attachment[] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cat)     e.cat = "Please select a category";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (form.subject.length > 120) e.subject = "Keep it under 120 characters";
    if (!form.desc.trim() || form.desc.length < 20) e.desc = "Please describe the issue (min 20 chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const id = "TKT-" + Date.now().toString().slice(-7);
    setTicketId(id);
    setSubmitted(true);
    onSubmit && onSubmit(id);
  };

  const handleFile = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 3 - form.attachments.length).map(f => ({
      name: f.name, size: (f.size / 1024).toFixed(0) + " KB", type: f.name.split(".").pop()
    }));
    set("attachments", [...form.attachments, ...newFiles]);
  };

  if (submitted) return (
    <div className="text-center py-8 px-4">
      <div className="relative inline-block mb-5">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-base shadow-md">🎫</div>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">Ticket Submitted!</h3>
      <p className="text-slate-400 text-sm mb-1">Your support request has been received</p>
      <p className="font-black text-teal-600 text-lg mb-5 font-mono">{ticketId}</p>

      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 text-left mb-6 space-y-3 max-w-sm mx-auto">
        <div className="flex justify-between text-sm"><span className="text-slate-400">Category</span><span className="font-bold text-slate-700">{TICKET_CATEGORIES.find(c=>c.id===form.cat)?.label}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">Priority</span><span className="font-bold text-slate-700 capitalize">{form.priority}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-400">Response time</span><span className="font-bold text-slate-700">{form.priority === "high" ? "< 2 hours" : form.priority === "medium" ? "< 12 hours" : "< 48 hours"}</span></div>
        <div className="pt-1 border-t border-teal-200">
          <p className="text-xs text-slate-400">Subject</p>
          <p className="font-semibold text-slate-800 text-sm">{form.subject}</p>
        </div>
      </div>

      <div className="flex gap-3 max-w-sm mx-auto">
        <button onClick={() => { setSubmitted(false); setForm({ cat:null, priority:"medium", subject:"", desc:"", attachments:[] }); }}
          className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
          New Ticket
        </button>
        <button className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-sm shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all">
          View Tickets
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeading icon="🎫" title="Raise a Support Ticket" sub="Our team typically responds within 2–24 hours" />

      {/* Category */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Issue Category *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TICKET_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { set("cat", cat.id); setErrors(e => ({ ...e, cat: "" })); }}
              className={`p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${form.cat === cat.id ? "shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"}`}
              style={form.cat === cat.id ? { borderColor: cat.color, backgroundColor: cat.color + "12" } : {}}>
              <span className="text-xl block mb-1">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-700 leading-tight block">{cat.label}</span>
            </button>
          ))}
        </div>
        {errors.cat && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.cat}</p>}
      </div>

      {/* Priority */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Priority</label>
        <div className="flex gap-2">
          {PRIORITY_OPTS.map(p => (
            <button key={p.id} onClick={() => set("priority", p.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${form.priority === p.id ? p.color + " shadow-md" : "border-slate-100 text-slate-400 hover:border-slate-300 bg-white"}`}>
              <span className={`w-2 h-2 rounded-full ${form.priority === p.id ? p.dot : "bg-slate-300"}`} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div className="mb-4">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Subject *</label>
        <input value={form.subject} onChange={e => { set("subject", e.target.value); setErrors(er => { const { subject, ...rest } = er; return rest; }); }}
          placeholder="Brief summary of your issue…"
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-800 placeholder-slate-300 ${errors.subject ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`} />
        <div className="flex justify-between mt-1">
          {errors.subject ? <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{errors.subject}</p> : <span />}
          <span className="text-xs text-slate-300">{form.subject.length}/120</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Description *</label>
        <textarea value={form.desc} onChange={e => { set("desc", e.target.value); setErrors(er => { const { desc, ...rest } = er; return rest; }); }}
          rows={5} placeholder="Please describe the issue in detail — include any relevant dates, amounts, or error messages…"
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none text-slate-800 placeholder-slate-300 leading-relaxed ${errors.desc ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`} />
        {errors.desc && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{errors.desc}</p>}
      </div>

      {/* Attachments */}
      <div className="mb-6">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Attachments (optional · max 3)</label>
        <div onClick={() => form.attachments.length < 3 && fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${form.attachments.length < 3 ? "cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 border-slate-200" : "border-slate-100 bg-slate-50 cursor-not-allowed"}`}>
          <input type="file" ref={fileRef} className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.docx"
            onChange={e => e.target.files && handleFile(e.target.files)} />
          <p className="text-2xl mb-1">📎</p>
          <p className="text-sm font-bold text-slate-500">{form.attachments.length < 3 ? "Click to attach files" : "Maximum files reached"}</p>
          <p className="text-xs text-slate-300">PDF, JPG, PNG, DOCX · Max 10MB each</p>
        </div>
        {form.attachments.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {form.attachments.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2">
                <span className="text-base">📄</span>
                <span className="text-xs font-semibold text-slate-700 flex-1 truncate">{f.name}</span>
                <span className="text-xs text-slate-300">{f.size}</span>
                <button onClick={() => set("attachments", form.attachments.filter((_, j) => j !== i))}
                  className="text-slate-300 hover:text-red-400 transition-colors text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSubmit}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-base shadow-xl shadow-teal-200 hover:shadow-teal-300 hover:scale-[1.01] transition-all active:scale-[0.99]">
        Submit Support Ticket →
      </button>

      {/* Existing Tickets */}
      {MY_TICKETS.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Your Recent Tickets</p>
          <div className="space-y-2">
            {MY_TICKETS.map(t => {
              const cat = TICKET_CATEGORIES.find(c => c.id === t.cat);
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: (cat?.color || "#64748b") + "18" }}>
                    {cat?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{t.subject}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{t.id} · Updated {t.updated}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHAT SUPPORT
══════════════════════════════════════════════════════════════════ */
interface ChatMessage {
  id: number;
  from: string;
  text: string;
  time: string;
  isAgentOffer?: boolean;
}

function ChatSupport() {
  const initMessages: ChatMessage[] = [
    { id: 1, from: "bot", text: "👋 Hi Sophia! I'm MedBot, your 24/7 health support assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    { id: 2, from: "bot", text: "You can ask me about appointments, billing, prescriptions, lab results, technical issues, or anything else related to your care.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [agentMode, setAgentMode] = useState(false);
  const [satisfaction, setSatisfaction] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getReply = useCallback((text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("appointment") || lower.includes("reschedule")) return BOT_REPLIES.appointment[Math.floor(Math.random() * BOT_REPLIES.appointment.length)];
    if (lower.includes("bill") || lower.includes("payment") || lower.includes("invoice") || lower.includes("charge")) return BOT_REPLIES.billing[Math.floor(Math.random() * BOT_REPLIES.billing.length)];
    if (lower.includes("prescription") || lower.includes("refill") || lower.includes("medicine")) return BOT_REPLIES.prescription[Math.floor(Math.random() * BOT_REPLIES.prescription.length)];
    return BOT_REPLIES.default[Math.floor(Math.random() * BOT_REPLIES.default.length)];
  }, []);

  const sendMessage = useCallback((text = input) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), from: "patient", text, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const reply = getReply(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: "bot", text: reply, time: now }]);

      // Offer agent after 3 user messages
      setMessages(prev => {
        const userCount = prev.filter(m => m.from === "patient").length;
        if (userCount === 3 && !agentMode) {
          return [...prev, {
            id: Date.now() + 2, from: "system",
            text: "Would you like me to connect you with a live support agent?",
            time: now, isAgentOffer: true
          }];
        }
        return prev;
      });
    }, 1400 + Math.random() * 600);
  }, [input, agentMode, getReply]);

  const connectAgent = () => {
    setAgentMode(true);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev,
      { id: Date.now(), from: "system", text: "Connecting you to a live agent…", time: now },
      { id: Date.now() + 1, from: "agent", text: "Hi Sophia, I'm Alex from MedPortal Support. I've reviewed your conversation and I'm ready to help. What's your main concern today?", time: now }
    ]);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🤖</div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-teal-600" />
        </div>
        <div className="flex-1">
          <p className="font-black text-white">{agentMode ? "Alex · Live Agent" : "MedBot"}</p>
          <p className="text-teal-200 text-xs">{agentMode ? "Support Team · Hyderabad" : "AI Support · Available 24/7"}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          <span className="text-teal-100 text-xs font-semibold">{agentMode ? "Live" : "Online"}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        {messages.map(msg => {
          if (msg.from === "system") return (
            <div key={msg.id} className="flex justify-center">
              <div className={`text-center max-w-xs ${msg.isAgentOffer ? "bg-teal-50 border border-teal-200 rounded-2xl p-3" : "text-xs text-slate-400"}`}>
                {msg.isAgentOffer ? (
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-2">{msg.text}</p>
                    <div className="flex gap-2">
                      <button onClick={connectAgent} className="flex-1 py-1.5 rounded-xl bg-teal-500 text-white text-xs font-black hover:bg-teal-600 transition-colors">Yes, connect me</button>
                      <button onClick={() => setMessages(prev => prev.filter(m => !m.isAgentOffer))} className="flex-1 py-1.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors">Continue with bot</button>
                    </div>
                  </div>
                ) : <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs inline-block">{msg.text}</span>}
              </div>
            </div>
          );

          const isUser = msg.from === "patient";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mb-0.5" style={{ background: agentMode && msg.from === "agent" ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "linear-gradient(135deg,#0d9488,#059669)" }}>
                  {agentMode && msg.from === "agent" ? "👤" : "🤖"}
                </div>
              )}
              <div className={`max-w-[75%]`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                  ? "rounded-br-md bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm"
                  : "rounded-bl-md bg-white text-slate-800 shadow-sm border border-slate-100"}`}>
                  {msg.text}
                </div>
                <p className={`text-xs mt-1 text-slate-300 ${isUser ? "text-right" : ""}`}>{msg.time}</p>
              </div>
              {isUser && <div className="w-8 h-8 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 mb-0.5"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=sophia`} alt="" className="w-full h-full" /></div>}
            </div>
          );
        })}

        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-base">🤖</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2 border-t border-slate-50 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {CHAT_QUICK.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 bg-white flex-shrink-0 transition-all">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 items-end flex-shrink-0">
        <div className="flex-1 relative">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type your message…"
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all placeholder-slate-300 text-slate-800" />
        </div>
        <button onClick={() => sendMessage()} disabled={!input.trim()}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md transition-all disabled:opacity-40 hover:shadow-teal-300 active:scale-95">
          <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>

      {/* Satisfaction */}
      {messages.length > 4 && !satisfaction && (
        <div className="px-4 py-2 border-t border-slate-50 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-semibold">Was this helpful?</p>
          <div className="flex gap-2">
            {["👍", "👎"].map(e => (
              <button key={e} onClick={() => setSatisfaction(e)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all text-base">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
      {satisfaction && (
        <div className="px-4 py-2 border-t border-slate-50 bg-teal-50 text-center">
          <p className="text-xs text-teal-700 font-bold">{satisfaction === "👍" ? "Thanks for the feedback! 🎉" : "We'll work on improving. Thank you for letting us know."}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════════════ */
function FAQ() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState("All");

  const cats = ["All", ...FAQ_DATA.map(c => c.cat)];

  const filtered = FAQ_DATA
    .filter(sec => activeCat === "All" || sec.cat === activeCat)
    .map(sec => ({
      ...sec,
      items: sec.items.filter(item =>
        !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(sec => sec.items.length > 0);

  const total = FAQ_DATA.reduce((s, c) => s + c.items.length, 0);

  return (
    <div>
      <SectionHeading icon="❓" title="Frequently Asked Questions" sub={`${total} answers across ${FAQ_DATA.length} categories`} />

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm placeholder-slate-300 text-slate-700" />
        {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-sm">✕</button>}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {cats.map(c => {
          const sec = FAQ_DATA.find(s => s.cat === c);
          return (
            <button key={c} onClick={() => setActiveCat(c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${activeCat === c ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200" : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}>
              {sec?.icon} {c}
            </button>
          );
        })}
      </div>

      {/* FAQ items */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(sec => (
            <div key={sec.cat}>
              <div className="flex items-center gap-2 mb-2">
                <span>{sec.icon}</span>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{sec.cat}</p>
              </div>
              <div className="space-y-1.5">
                {sec.items.map((item, i) => {
                  const id = `${sec.cat}-${i}`;
                  const open = openId === id;
                  return (
                    <div key={i} className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${open ? "border-teal-200 shadow-md" : "border-slate-100 hover:border-slate-200 shadow-sm"}`}>
                      <button className="w-full flex items-start justify-between gap-3 p-4 text-left" onClick={() => setOpenId(open ? null : id)}>
                        <p className={`text-sm font-bold leading-snug ${open ? "text-teal-700" : "text-slate-800"}`}>{item.q}</p>
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-sm transition-all ${open ? "bg-teal-100 text-teal-600 rotate-45" : "bg-slate-100 text-slate-400"}`}>
                          ＋
                        </div>
                      </button>
                      {open && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="h-px bg-teal-50 mb-3" />
                          <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <p className="text-xs text-slate-300">Was this helpful?</p>
                            <button className="text-xs text-teal-600 font-semibold hover:underline">👍 Yes</button>
                            <button className="text-xs text-slate-400 font-semibold hover:underline">👎 No</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold text-slate-400">No results for "{search}"</p>
          <p className="text-sm text-slate-300 mt-1">Try a different search term or browse categories</p>
        </div>
      )}

      {/* Still need help? */}
      <div className="mt-8 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-5 text-center">
        <p className="text-2xl mb-2">🤔</p>
        <p className="font-black text-slate-800 mb-1">Didn't find what you need?</p>
        <p className="text-sm text-slate-400 mb-4">Our support team is available 24/7 to help you</p>
        <div className="flex gap-3 justify-center">
          <button className="px-5 py-2.5 rounded-2xl bg-teal-600 text-white font-black text-sm shadow-md shadow-teal-200 hover:bg-teal-700 transition-colors">💬 Live Chat</button>
          <button className="px-5 py-2.5 rounded-2xl border-2 border-teal-200 text-teal-700 font-bold text-sm hover:bg-teal-50 transition-colors">🎫 Raise Ticket</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FEEDBACK FORM
══════════════════════════════════════════════════════════════════ */
function FeedbackForm() {
  const [form, setForm] = useState({ type: "general", rating: 0, hover: 0, subject: "", message: "", recommend: null as null | boolean, tags: [] as string[], email: PATIENT.email });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const FEEDBACK_TYPES = [
    { id: "general",      label: "General Feedback", icon: "💬" },
    { id: "appointment",  label: "Appointment Experience", icon: "📅" },
    { id: "doctor",       label: "Doctor / Care Quality", icon: "👨‍⚕️" },
    { id: "app",          label: "App & Portal", icon: "📱" },
    { id: "billing",      label: "Billing Experience", icon: "💳" },
    { id: "suggestion",   label: "Feature Request", icon: "💡" },
  ];

  const EXPERIENCE_TAGS = ["Fast response", "Easy to use", "Helpful doctor", "Clear billing", "Great UI", "Needs improvement", "Slow loading", "Confusing navigation", "Excellent care", "Friendly staff"];

  const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const RATING_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

  const toggleTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));

  const handleSubmit = async () => {
    if (!form.rating || !form.message.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1600));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="text-center py-10 px-4">
      <div className="text-6xl mb-4" style={{ animation: "bounce 0.6s ease" }}>🌟</div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">Thank You, Sophia!</h3>
      <p className="text-slate-400 text-sm mb-2">Your feedback means a lot to us</p>
      <div className="flex justify-center gap-1 mb-6">
        {[1,2,3,4,5].map(i => (
          <span key={i} className="text-2xl" style={{ color: i <= form.rating ? RATING_COLORS[form.rating] : "#e2e8f0" }}>★</span>
        ))}
      </div>
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-5 max-w-sm mx-auto mb-6">
        <p className="text-sm text-teal-700 font-semibold leading-relaxed">"{form.message.slice(0, 120)}{form.message.length > 120 ? "…" : ""}"</p>
        <p className="text-xs text-teal-400 mt-2">— {PATIENT.name}</p>
      </div>
      <p className="text-xs text-slate-300">Reference: FDB-{Date.now().toString().slice(-8)}</p>
      <button onClick={() => { setSubmitted(false); setForm({ type:"general", rating:0, hover:0, subject:"", message:"", recommend:null, tags:[], email:PATIENT.email }); }}
        className="mt-5 px-6 py-2.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
        Submit Another
      </button>
    </div>
  );

  return (
    <div>
      <SectionHeading icon="⭐" title="Share Your Feedback" sub="Help us improve your healthcare experience" />

      {/* Type */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Feedback Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FEEDBACK_TYPES.map(t => (
            <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
              className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left text-sm transition-all ${form.type === t.id ? "border-teal-500 bg-teal-50 shadow-md" : "border-slate-100 bg-white hover:border-slate-200"}`}>
              <span className="text-xl flex-shrink-0">{t.icon}</span>
              <span className={`font-semibold text-xs leading-tight ${form.type === t.id ? "text-teal-700" : "text-slate-600"}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Star rating */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Overall Experience *</label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <button key={i}
                onMouseEnter={() => setForm(f => ({ ...f, hover: i }))}
                onMouseLeave={() => setForm(f => ({ ...f, hover: 0 }))}
                onClick={() => setForm(f => ({ ...f, rating: i }))}
                className="text-4xl transition-all duration-100 hover:scale-110 active:scale-95">
                <span style={{ color: i <= (form.hover || form.rating) ? RATING_COLORS[form.hover || form.rating] : "#e2e8f0", transition: "color 0.1s" }}>★</span>
              </button>
            ))}
          </div>
          {(form.hover || form.rating) > 0 && (
            <span className="text-sm font-black ml-2" style={{ color: RATING_COLORS[form.hover || form.rating] }}>
              {RATING_LABELS[form.hover || form.rating]}
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">What stood out? (optional)</label>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${form.tags.includes(tag) ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"}`}>
              {form.tags.includes(tag) ? "✓ " : ""}{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Your Feedback *</label>
        <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          rows={5} placeholder="Share your experience — what went well, what could be better, or any specific suggestions…"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none placeholder-slate-300 text-slate-800 leading-relaxed" />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-300">{form.message.length} characters</span>
          {form.message.length < 10 && form.message.length > 0 && <span className="text-xs text-amber-500">Add more detail for better insights</span>}
        </div>
      </div>

      {/* Recommend */}
      <div className="mb-5">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Would you recommend MedPortal?</label>
        <div className="flex gap-3">
          {[{ v: true, label: "Yes, definitely!", icon: "👍" }, { v: false, label: "Not really", icon: "👎" }].map(opt => (
            <button key={String(opt.v)} onClick={() => setForm(f => ({ ...f, recommend: opt.v }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${form.recommend === opt.v ? opt.v ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md" : "border-red-300 bg-red-50 text-red-600 shadow-md" : "border-slate-100 text-slate-500 hover:border-slate-300 bg-white"}`}>
              <span className="text-xl">{opt.icon}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Email (for follow-up, optional)</label>
        <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          type="email" placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-700" />
      </div>

      <button onClick={handleSubmit} disabled={!form.rating || !form.message.trim() || submitting}
        className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #0d9488, #059669)", boxShadow: "0 12px 32px #0d948840" }}>
        {submitting ? <><span className="animate-spin">⟳</span> Submitting…</> : <><span>⭐</span> Submit Feedback</>}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "ticket",   label: "Raise Ticket",  icon: "🎫" },
  { id: "chat",     label: "Chat Support",  icon: "💬" },
  { id: "faq",      label: "FAQ",           icon: "❓" },
  { id: "feedback", label: "Feedback",      icon: "⭐" },
];

export default function SupportModule() {
  const [tab, setTab] = useState("ticket");

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Instrument Sans', 'Segoe UI', sans-serif", background: "linear-gradient(155deg, #f0fdfa 0%, #f8fafc 45%, #ecfdf5 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-scroll { scrollbar-width: none; }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
      `}</style>

      {/* ── HEADER ── */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md" style={{ background: "linear-gradient(135deg, #0d9488, #059669)" }}>🎧</div>
              <div>
                <h1 className="font-black text-slate-900 text-lg leading-tight">Support Center</h1>
                <p className="text-xs text-slate-400">{PATIENT.name} · {PATIENT.id}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-700 font-bold">Support Online</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-scroll flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap border-b-2 transition-all ${tab === t.id ? "border-teal-600 text-teal-700 bg-teal-50/60" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Contact strip */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: "📞", label: "Call Us", sub: "+1 800 MED-HELP", color: "text-teal-600" },
            { icon: "📧", label: "Email", sub: "support@medportal.io", color: "text-blue-600" },
            { icon: "⏰", label: "Hours", sub: "24/7 Available", color: "text-emerald-600" },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-xl mb-1">{c.icon}</p>
              <p className={`text-xs font-black ${c.color}`}>{c.label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{c.sub}</p>
            </div>
          ))}
        </div>

        {tab === "ticket"   && <RaiseTicket onSubmit={(id: string) => console.log("Ticket submitted:", id)} />}
        {tab === "chat"     && <ChatSupport />}
        {tab === "faq"      && <FAQ />}
        {tab === "feedback" && <FeedbackForm />}
      </div>
    </div>
  );
}
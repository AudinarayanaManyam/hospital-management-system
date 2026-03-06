import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
══════════════════════════════════════════════════════════════════ */
const NOTIF_TYPES = {
  appointment: {
    label: "Appointment",
    icon: "📅",
    gradient: "from-blue-500 to-indigo-600",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
    ring: "ring-blue-200",
  },
  lab: {
    label: "Lab Report",
    icon: "🧪",
    gradient: "from-emerald-500 to-teal-600",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  payment: {
    label: "Payment",
    icon: "💳",
    gradient: "from-amber-500 to-orange-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
  },
  message: {
    label: "Doctor Message",
    icon: "💬",
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
  },
  system: {
    label: "System",
    icon: "🔔",
    gradient: "from-slate-500 to-slate-700",
    light: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
    ring: "ring-slate-200",
  },
};

const PRIORITY = { urgent: { label: "Urgent", color: "bg-red-500 text-white" }, normal: { label: "Normal", color: "bg-slate-200 text-slate-600" }, low: { label: "Low", color: "bg-slate-100 text-slate-400" } };

/* ══════════════════════════════════════════════════════════════════
   INITIAL DATA
══════════════════════════════════════════════════════════════════ */
const SEED_NOTIFICATIONS = [
  {
    id: "n001", type: "appointment", priority: "urgent", read: false,
    title: "Appointment in 1 hour",
    body: "Your video consultation with Dr. Kevin Patel (Endocrinology) starts at 2:00 PM today. Join on time to avoid rescheduling.",
    meta: { doctor: "Dr. Kevin Patel", time: "2:00 PM Today", action: "Join Call" },
    time: "1h ago", ts: Date.now() - 3600000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede",
  },
  {
    id: "n002", type: "lab", priority: "normal", read: false,
    title: "Lab Report Ready — CBC",
    body: "Your Complete Blood Count (CBC) report from LifeLab Diagnostics is now available. All values are within normal range.",
    meta: { lab: "LifeLab Diagnostics", result: "Normal", action: "View Report" },
    time: "3h ago", ts: Date.now() - 10800000, avatar: null,
  },
  {
    id: "n003", type: "payment", priority: "urgent", read: false,
    title: "Payment Due in 3 Days",
    body: "Invoice INV-2026-0041 for Cardiology Consultation ($75.00) is due on Mar 15, 2026. Pay now to avoid late fees.",
    meta: { amount: "$75.00", due: "Mar 15, 2026", invoice: "INV-2026-0041", action: "Pay Now" },
    time: "5h ago", ts: Date.now() - 18000000, avatar: null,
  },
  {
    id: "n004", type: "message", priority: "normal", read: false,
    title: "Dr. Elaine Morrow sent a message",
    body: "Hi Sophia, I reviewed your recent blood pressure readings. Please continue the low-sodium diet and schedule a follow-up next week.",
    meta: { doctor: "Dr. Elaine Morrow", specialty: "General Practice", action: "Reply" },
    time: "Yesterday", ts: Date.now() - 86400000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elaine&backgroundColor=ffd5dc",
  },
  {
    id: "n005", type: "appointment", priority: "normal", read: true,
    title: "Appointment Confirmed",
    body: "Your appointment with Dr. Sandra Wu (Cardiology) on Mar 18, 2026 at 10:30 AM has been confirmed.",
    meta: { doctor: "Dr. Sandra Wu", time: "Mar 18 · 10:30 AM", action: "View Details" },
    time: "2 days ago", ts: Date.now() - 172800000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandra&backgroundColor=d1d4f9",
  },
  {
    id: "n006", type: "lab", priority: "urgent", read: true,
    title: "Abnormal Result — HbA1c",
    body: "Your HbA1c result (7.1%) from PathCare Labs is above the normal range (<6.5%). Dr. Kevin Patel has been notified and will contact you.",
    meta: { lab: "PathCare Labs", result: "Abnormal", action: "View Report" },
    time: "3 days ago", ts: Date.now() - 259200000, avatar: null,
  },
  {
    id: "n007", type: "payment", priority: "low", read: true,
    title: "Payment Received",
    body: "Your payment of $150.00 for Annual Physical Examination (INV-2025-0198) has been processed successfully via Visa •••• 4291.",
    meta: { amount: "$150.00", method: "Visa •••• 4291", action: "View Receipt" },
    time: "5 days ago", ts: Date.now() - 432000000, avatar: null,
  },
  {
    id: "n008", type: "message", priority: "normal", read: true,
    title: "Dr. Kevin Patel sent a message",
    body: "Your new prescription for Empagliflozin 10mg has been sent to MedCare Pharmacy. Please collect it within 48 hours.",
    meta: { doctor: "Dr. Kevin Patel", specialty: "Endocrinology", action: "View Prescription" },
    time: "1 week ago", ts: Date.now() - 604800000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede",
  },
  {
    id: "n009", type: "system", priority: "low", read: true,
    title: "Profile Update Successful",
    body: "Your health profile has been updated with new emergency contact details. If this was not you, please contact support immediately.",
    meta: { action: "Review Profile" },
    time: "1 week ago", ts: Date.now() - 691200000, avatar: null,
  },
];

const PUSH_QUEUE = [
  { id: "p1", type: "appointment", title: "Reminder: Appointment in 30 min", body: "Dr. Kevin Patel – Video Consultation at 2:00 PM", icon: "📅", delay: 4000 },
  { id: "p2", type: "message", title: "New message from Dr. Sandra Wu", body: "Your ECG results look good. Keep up the good work!", icon: "💬", delay: 12000 },
  { id: "p3", type: "lab", title: "Lab Report Ready", body: "HbA1c & Glucose Panel results are now available", icon: "🧪", delay: 22000 },
  { id: "p4", type: "payment", title: "Payment Due Tomorrow", body: "INV-2026-0041 — $75.00 due Mar 15, 2026", icon: "💳", delay: 35000 },
];

/* ══════════════════════════════════════════════════════════════════
   PUSH NOTIFICATION TOAST
══════════════════════════════════════════════════════════════════ */
function PushToast({ notif, onDismiss, onAction }: { notif: typeof PUSH_QUEUE[0] & { icon?: string; uid: number }; onDismiss: (uid: number) => void; onAction: (notif: typeof PUSH_QUEUE[0] & { uid: number }) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = NOTIF_TYPES[notif.type as keyof typeof NOTIF_TYPES];
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    timer.current = setTimeout(() => dismiss(), 6000);
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(notif.uid), 380);
  };

  return (
    <div
      className="pointer-events-auto"
      style={{
        transform: visible && !leaving ? "translateX(0) scale(1)" : "translateX(110%) scale(0.95)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className={`w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden`}>
        {/* Accent top bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br ${cfg.gradient} shadow-md`}>
              {notif.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-slate-900 text-sm leading-tight">{notif.title}</p>
                <button onClick={dismiss} className="text-slate-300 hover:text-slate-500 flex-shrink-0 transition-colors mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button onClick={() => { onAction(notif); dismiss(); }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${cfg.gradient} hover:opacity-90 transition-opacity shadow-sm`}>
                  View
                </button>
                <button onClick={dismiss}
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100">
          <div className={`h-full bg-gradient-to-r ${cfg.gradient} opacity-50`}
            style={{ animation: "shrink 6s linear forwards" }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NOTIFICATION CARD
══════════════════════════════════════════════════════════════════ */
function NotifCard({ notif, onRead, onDelete, onAction, isNew }: { notif: typeof SEED_NOTIFICATIONS[0]; onRead: (id: string) => void; onDelete: (id: string) => void; onAction: (notif: typeof SEED_NOTIFICATIONS[0]) => void; isNew: boolean }) {
  const cfg = NOTIF_TYPES[notif.type as keyof typeof NOTIF_TYPES];
  const pri = PRIORITY[notif.priority as keyof typeof PRIORITY];
  const [swiped, setSwiped] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const touchStart = useRef(null);

  const handleDelete = () => {
    setLeaving(true);
    setTimeout(() => onDelete(notif.id), 350);
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        transform: leaving ? "translateX(110%) scaleY(0.7)" : isNew ? "translateX(0)" : "translateX(0)",
        opacity: leaving ? 0 : 1,
        maxHeight: leaving ? 0 : 300,
        marginBottom: leaving ? 0 : undefined,
        transition: leaving ? "all 0.35s cubic-bezier(0.4,0,0.6,1)" : "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        animation: isNew ? "slideDown 0.4s cubic-bezier(0.16,1,0.3,1)" : "none",
      }}
    >
      <div
        onClick={() => !notif.read && onRead(notif.id)}
        className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
          ${!notif.read
            ? `bg-white border-l-4 shadow-sm hover:shadow-md ${cfg.border}`
            : "bg-white/60 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-sm"
          }`}
        style={!notif.read ? { borderLeftColor: cfg.dot.replace("bg-", "") } : {}}
      >
        {/* Unread dot */}
        {!notif.read && (
          <span className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${cfg.dot} ring-2 ring-white`} />
        )}

        {/* Avatar / Icon */}
        <div className="flex-shrink-0 relative">
          {notif.avatar ? (
            <div className="relative">
              <img src={notif.avatar} alt="" className="w-11 h-11 rounded-2xl" />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center text-xs bg-gradient-to-br ${cfg.gradient} shadow-sm border-2 border-white`}>
                {cfg.icon}
              </div>
            </div>
          ) : (
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${cfg.gradient} shadow-md`}>
              {cfg.icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-5">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.light} ${cfg.text} ${cfg.border}`}>
              {cfg.label}
            </span>
            {notif.priority === "urgent" && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                Urgent
              </span>
            )}
          </div>

          <p className={`text-sm font-bold leading-snug mt-1 ${notif.read ? "text-slate-600" : "text-slate-900"}`}>
            {notif.title}
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{notif.body}</p>

          {/* Meta chips */}
          {notif.meta && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {notif.meta.doctor && (
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">👨‍⚕️ {notif.meta.doctor}</span>
              )}
              {notif.meta.amount && (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">💵 {notif.meta.amount}</span>
              )}
              {notif.meta.result && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${notif.meta.result === "Normal" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {notif.meta.result === "Normal" ? "✅" : "⚠️"} {notif.meta.result}
                </span>
              )}
              {notif.meta.time && (
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">🕐 {notif.meta.time}</span>
              )}
              {notif.meta.due && (
                <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">⏰ Due {notif.meta.due}</span>
              )}
            </div>
          )}

          {/* Time + Action */}
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-xs text-slate-300">{notif.time}</span>
            <div className="flex gap-1.5">
              {notif.meta?.action && (
                <button
                  onClick={e => { e.stopPropagation(); onRead(notif.id); onAction(notif); }}
                  className={`text-xs font-bold px-3 py-1 rounded-full text-white bg-gradient-to-r ${cfg.gradient} hover:opacity-90 transition-all shadow-sm hover:shadow-md active:scale-95`}
                >
                  {notif.meta.action} →
                </button>
              )}
              <button
                onClick={e => { e.stopPropagation(); handleDelete(); }}
                className="text-xs font-semibold text-slate-300 hover:text-red-400 px-2 py-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FCM / PUSH SETTINGS PANEL
══════════════════════════════════════════════════════════════════ */
function PushSettingsPanel() {
  const [permStatus, setPermStatus] = useState("default"); // default | granted | denied
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [prefs, setPrefs] = useState({
    appointment: true,
    lab: true,
    payment: true,
    message: true,
    system: false,
    emailDigest: true,
    smsAlerts: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    quietHoursEnabled: true,
    sound: true,
    vibration: true,
    badge: true,
    previewContent: true,
  });

  const fakeToken = "fMj9kLpQ-AbC3dEfGhIjKlMnOpQrStUvWxYz1234567890_FCMTokenSimulated";

  const requestPermission = async () => {
    setRequesting(true);
    await new Promise(r => setTimeout(r, 1200));
    setPermStatus("granted");
    setFcmToken(fakeToken);
    setRequesting(false);
  };

  const copyToken = () => {
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button onClick={onChange} disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${checked ? "bg-rose-500" : "bg-slate-200"}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? "left-5" : "left-0.5"}`} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
        {children}
      </div>
    </div>
  );

  const Row = ({ icon, label, sub, checked, onChange, disabled }: { icon: string; label: string; sub?: string; checked: boolean; onChange: () => void; disabled: boolean }) => (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );

  return (
    <div className="pb-6">
      {/* FCM Permission Block */}
      <div className={`rounded-2xl p-5 mb-6 border ${
        permStatus === "granted" ? "bg-emerald-50 border-emerald-200" :
        permStatus === "denied" ? "bg-red-50 border-red-200" :
        "bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200"
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
            permStatus === "granted" ? "bg-emerald-100" : "bg-rose-100"
          }`}>
            {permStatus === "granted" ? "🔔" : "🔕"}
          </div>
          <div className="flex-1">
            <p className="font-black text-slate-900 text-base">
              {permStatus === "granted" ? "Push Notifications Active" :
               permStatus === "denied" ? "Notifications Blocked" :
               "Enable Push Notifications"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {permStatus === "granted" ? "FCM token registered. You'll receive real-time alerts." :
               permStatus === "denied" ? "Allow notifications in browser settings to re-enable." :
               "Get instant alerts for appointments, lab results, and messages."}
            </p>
          </div>
        </div>

        {permStatus === "default" && (
          <button onClick={requestPermission} disabled={requesting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-sm shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {requesting ? <><span className="animate-spin">⟳</span> Registering with FCM…</> : <><span>🔔</span> Enable Push Notifications</>}
          </button>
        )}

        {permStatus === "granted" && (
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">FCM Device Token</p>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-200 px-3 py-2.5">
              <p className="text-xs text-slate-500 font-mono flex-1 truncate">{fakeToken.slice(0, 36)}…</p>
              <button onClick={copyToken}
                className={`text-xs font-bold flex-shrink-0 px-2 py-1 rounded-lg transition-all ${tokenCopied ? "text-emerald-600 bg-emerald-100" : "text-slate-500 hover:bg-slate-100"}`}>
                {tokenCopied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Connected to FCM — token refreshes every 7 days
            </p>
          </div>
        )}
      </div>

      {/* Notification Type Prefs */}
      <Section title="Notification Types">
        {Object.entries(NOTIF_TYPES).filter(([k]) => k !== "system" || true).map(([key, cfg]) => (
          <Row key={key} icon={cfg.icon} label={cfg.label}
            sub={key === "appointment" ? "Reminders 24h, 1h, and 15min before" :
                 key === "lab" ? "Results ready, abnormal flags" :
                 key === "payment" ? "Due dates, confirmations, receipts" :
                 key === "message" ? "New messages from your care team" :
                 "System updates and account alerts"}
            checked={prefs[key as keyof typeof prefs] as boolean} onChange={() => toggle(key as keyof typeof prefs)}
            disabled={permStatus !== "granted"} />
        ))}
      </Section>

      {/* Delivery channels */}
      <Section title="Delivery Channels">
        <Row icon="📱" label="Push Notifications" sub="Instant alerts on this device" checked={permStatus === "granted"} onChange={() => {}} disabled />
        <Row icon="📧" label="Email Digest" sub="Daily summary to sophia@email.com" checked={prefs.emailDigest} onChange={() => toggle("emailDigest")} disabled={false} />
        <Row icon="📲" label="SMS Alerts" sub="Critical alerts to +1 (555) 219-4087" checked={prefs.smsAlerts} onChange={() => toggle("smsAlerts")} disabled={false} />
      </Section>

      {/* Delivery behavior */}
      <Section title="Alert Behavior">
        <Row icon="🔊" label="Sound" sub="Play alert tone with notifications" checked={prefs.sound} onChange={() => toggle("sound")} disabled={permStatus !== "granted"} />
        <Row icon="📳" label="Vibration" sub="Vibrate on notification arrival" checked={prefs.vibration} onChange={() => toggle("vibration")} disabled={permStatus !== "granted"} />
        <Row icon="🔴" label="Badge Count" sub="Show unread count on app icon" checked={prefs.badge} onChange={() => toggle("badge")} disabled={permStatus !== "granted"} />
        <Row icon="👁️" label="Preview Content" sub="Show message preview in alerts" checked={prefs.previewContent} onChange={() => toggle("previewContent")} disabled={permStatus !== "granted"} />
      </Section>

      {/* Quiet hours */}
      <Section title="Quiet Hours">
        <Row icon="🌙" label="Enable Quiet Hours" sub="Mute non-urgent notifications overnight" checked={prefs.quietHoursEnabled} onChange={() => toggle("quietHoursEnabled")} disabled={false} />
        {prefs.quietHoursEnabled && (
          <div className="px-4 py-3.5 flex items-center gap-4">
            <span className="text-lg">🕙</span>
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">From</p>
                <input type="time" value={prefs.quietHoursStart}
                  onChange={e => setPrefs(p => ({ ...p, quietHoursStart: e.target.value }))}
                  className="w-full text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <span className="text-slate-300 font-bold mt-4">→</span>
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Until</p>
                <input type="time" value={prefs.quietHoursEnd}
                  onChange={e => setPrefs(p => ({ ...p, quietHoursEnd: e.target.value }))}
                  className="w-full text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* FCM info */}
      <div className="bg-slate-900 rounded-2xl p-4 text-xs text-slate-400 space-y-1">
        <p className="text-slate-200 font-bold text-sm mb-2">🔧 FCM Integration Details</p>
        <p><span className="text-slate-500">SDK:</span> Firebase Cloud Messaging (FCM) Web</p>
        <p><span className="text-slate-500">Protocol:</span> HTTP v1 API · Service Worker</p>
        <p><span className="text-slate-500">Token:</span> {permStatus === "granted" ? "Registered ✓" : "Not registered"}</p>
        <p><span className="text-slate-500">Delivery:</span> Real-time push via VAPID keys</p>
        <p className="pt-1 text-slate-500">In production, integrate with firebase/app + firebase/messaging. Register a service worker (firebase-messaging-sw.js) to handle background messages.</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "all", label: "All" },
  { id: "appointment", label: "Appointments" },
  { id: "lab", label: "Lab" },
  { id: "payment", label: "Payments" },
  { id: "message", label: "Messages" },
  { id: "settings", label: "Push Settings" },
];

export default function NotificationsModule() {
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [tab, setTab] = useState("all");
  const [pushToasts, setPushToasts] = useState<Array<typeof PUSH_QUEUE[0] & { uid: number }>>([]);
  const [newIds, setNewIds] = useState(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const [simulatingPush, setSimulatingPush] = useState(false);
  const toastQueue = useRef([...PUSH_QUEUE]);
  const pushTimer = useRef(null);

  // Auto-schedule push toasts
  useEffect(() => {
    const timers = PUSH_QUEUE.map(p =>
      setTimeout(() => {
        setPushToasts(prev => [...prev, { ...p, uid: Date.now() + parseInt(p.id.replace(/\D/g, ''), 10) || 0 }]);
      }, p.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const dismissToast = useCallback((uid: number) => {
    setPushToasts(prev => prev.filter(t => t.uid !== uid));
  }, []);

  const handleToastAction = useCallback((toast: typeof PUSH_QUEUE[0] & { uid: number }) => {
    // Add to notifications list
    const newNotif = {
      id: "push-" + toast.uid,
      type: toast.type,
      priority: "normal",
      read: false,
      title: toast.title,
      body: toast.body,
      meta: { action: "View" },
      time: "Just now",
      ts: Date.now(),
      avatar: null,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setNewIds(prev => new Set([...prev, newNotif.id]));
    setTimeout(() => setNewIds(prev => { const s = new Set(prev); s.delete(newNotif.id); return s; }), 3000);
  }, []);

  const simulatePush = useCallback(() => {
    setSimulatingPush(true);
    const sample = PUSH_QUEUE[Math.floor(Math.random() * PUSH_QUEUE.length)];
    const uid = Date.now();
    setPushToasts(prev => [...prev, { ...sample, uid }]);
    setTimeout(() => setSimulatingPush(false), 1000);
  }, []);

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => { setNotifications([]); setShowClearConfirm(false); };

  const filtered = notifications.filter(n => {
    const matchTab = tab === "all" || tab === "settings" || n.type === tab;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => !n.read && n.priority === "urgent").length;

  // Group by day
  const grouped = filtered.reduce((acc, n) => {
    const day = n.time.includes("ago") || n.time === "Just now" ? "Today" : n.time.startsWith("Yesterday") ? "Yesterday" : "Earlier";
    if (!acc[day]) acc[day] = [];
    acc[day].push(n);
    return acc;
  }, {} as Record<string, typeof filtered>);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Bricolage Grotesque', 'Segoe UI', sans-serif", background: "linear-gradient(160deg, #fdf2f8 0%, #faf5ff 40%, #f0f9ff 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-scroll { scrollbar-width: none; }
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        @keyframes slideDown {
          from { transform: translateY(-20px) scale(0.96); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .notif-enter { animation: fadeSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Push Toasts — fixed top-right */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {pushToasts.map(t => (
          <PushToast key={t.uid} notif={t} onDismiss={dismissToast} onAction={handleToastAction} />
        ))}
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md" style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)" }}>
                  🔔
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center px-1 ring-2 ring-white animate-bounce">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-black text-slate-900 text-lg leading-tight">Notifications</h1>
                <p className="text-xs text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread${urgentCount > 0 ? ` · ${urgentCount} urgent` : ""}` : "All caught up ✓"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={simulatePush} disabled={simulatingPush}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all disabled:opacity-50 flex items-center gap-1">
                {simulatingPush ? <span className="animate-spin">⟳</span> : "⚡"}
                <span className="hidden sm:inline">Simulate Push</span>
              </button>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs font-bold px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Urgent banner */}
          {urgentCount > 0 && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-red-500 animate-pulse">⚠</span>
              <p className="text-xs text-red-700 font-bold">{urgentCount} urgent notification{urgentCount > 1 ? "s" : ""} require{urgentCount === 1 ? "s" : ""} your attention</p>
              <button onClick={() => setTab("all")} className="ml-auto text-xs font-black text-red-600 hover:underline">View →</button>
            </div>
          )}

          {/* Tabs */}
          <div className="tab-scroll flex gap-1 overflow-x-auto pb-0">
            {TABS.map(t => {
              const count = t.id === "all" ? unreadCount : t.id === "settings" ? 0 : notifications.filter(n => !n.read && n.type === t.id).length;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap border-b-2 transition-all ${tab === t.id ? "border-rose-500 text-rose-600 bg-rose-50/50" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                  {t.id !== "all" && t.id !== "settings" && t.id in NOTIF_TYPES && (
                    <span>{NOTIF_TYPES[t.id as keyof typeof NOTIF_TYPES].icon}</span>
                  )}
                  {t.label}
                  {count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center leading-none">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">

        {tab === "settings" ? (
          <PushSettingsPanel />
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search notifications…"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-sm placeholder-slate-300 text-slate-700" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">✕</button>}
            </div>

            {/* Type filter pills */}
            {tab === "all" && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {Object.entries(NOTIF_TYPES).map(([key, cfg]) => {
                  const c = notifications.filter(n => n.type === key).length;
                  return c > 0 ? (
                    <button key={key} onClick={() => setTab(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${cfg.light} ${cfg.text} ${cfg.border} hover:opacity-80`}>
                      {cfg.icon} {cfg.label} <span className="opacity-60">({c})</span>
                    </button>
                  ) : null;
                })}
              </div>
            )}

            {/* Notification list */}
            {Object.keys(grouped).length > 0 ? (
              Object.entries(grouped).map(([day, items]) => (
                <div key={day} className="mb-5 notif-enter">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{day}</span>
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-xs text-slate-300">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(n => (
                      <NotifCard key={n.id} notif={n} isNew={newIds.has(n.id)}
                        onRead={markRead} onDelete={deleteNotif}
                        onAction={(notif: typeof n) => console.log("Action:", notif.meta?.action, notif.id)} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4 opacity-30">🔔</div>
                <p className="font-bold text-slate-400">
                  {search ? "No notifications match your search" : "No notifications here"}
                </p>
                <p className="text-sm text-slate-300 mt-1">You're all caught up!</p>
              </div>
            )}

            {/* Clear all */}
            {notifications.length > 0 && (
              <div className="mt-6 text-center">
                {showClearConfirm ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm inline-flex flex-col items-center gap-3">
                    <p className="text-sm font-bold text-slate-700">Clear all {notifications.length} notifications?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                      <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-colors">Clear All</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowClearConfirm(true)} className="text-xs text-slate-300 hover:text-red-400 font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-red-50">
                    Clear all notifications
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
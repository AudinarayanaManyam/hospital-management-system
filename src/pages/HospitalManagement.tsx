import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════ */
type HospitalStatus = "active" | "inactive" | "trial" | "suspended";
type SubscriptionTier = "starter" | "professional" | "enterprise";
type DBType = "shared" | "dedicated";
type DBConnStatus = "connected" | "disconnected" | "provisioning" | "error";
type ActiveView =
  | "list"
  | "create"
  | "detail"
  | "edit"
  | "subscription"
  | "metrics"
  | "admin-assign"
  | "settings"
  | "database";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  phone: string;
  role: string;
  assignedAt: string;
}

interface DBConfig {
  type: DBType;
  host: string;
  port: number;
  dbName: string;
  schema: string;
  maxConnections: number;
  connStatus: DBConnStatus;
  lastPing: string;
  ssl: boolean;
  backup: boolean;
  backupFreq: "none" | "daily" | "weekly" | "hourly";
  storageUsedGB: number;
  storageLimitGB: number;
}

interface Metrics {
  doctors: { used: number; limit: number };
  patients: { used: number; limit: number };
  apiToday: number;
  apiMonth: number;
  apiLimit: number;
  appointmentsMonth: number;
  revMonth: number;
  revLast: number;
  uptime: number;
  lastBackup: string;
}

interface Hospital {
  id: string;
  name: string;
  code: string;
  emoji: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  website: string;
  status: HospitalStatus;
  tier: SubscriptionTier;
  subStart: string;
  subEnd: string;
  trialEnd?: string;
  admin?: AdminUser;
  db: DBConfig;
  metrics: Metrics;
  createdAt: string;
  tags: string[];
}

/* ══════════════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════════════ */
const HOSPITALS_SEED: Hospital[] = [
  {
    id: "h001", name: "City General Hospital", code: "CGH", emoji: "🏥",
    email: "admin@cityhospital.com", phone: "+91 40 6789 1234",
    address: "12 Medical Colony, Banjara Hills", city: "Hyderabad", state: "Telangana",
    country: "India", zip: "500034", website: "https://cityhospital.com",
    status: "active", tier: "enterprise", subStart: "2024-01-15", subEnd: "2027-01-14",
    admin: { id: "u02", name: "Dr. Priya Sharma", email: "priya@cityhospital.com", initials: "PS", phone: "+91 98765 43210", role: "Hospital Administrator", assignedAt: "2024-01-15" },
    db: { type: "dedicated", host: "db-cgh.internal.medportal.io", port: 5432, dbName: "medportal_cgh", schema: "public", maxConnections: 100, connStatus: "connected", lastPing: "2s ago", ssl: true, backup: true, backupFreq: "daily", storageUsedGB: 18.4, storageLimitGB: 100 },
    metrics: { doctors: { used: 84, limit: 999 }, patients: { used: 4821, limit: 999999 }, apiToday: 14820, apiMonth: 284310, apiLimit: 1000000, appointmentsMonth: 2841, revMonth: 12400, revLast: 11200, uptime: 99.98, lastBackup: "Today 03:00 AM" },
    createdAt: "2024-01-15", tags: ["multi-specialty", "teaching", "tier-1"],
  },
  {
    id: "h002", name: "Apollo Diagnostics", code: "APD", emoji: "🔬",
    email: "admin@apollodiag.com", phone: "+91 22 4567 8901",
    address: "45 BKC, Bandra East", city: "Mumbai", state: "Maharashtra",
    country: "India", zip: "400051", website: "https://apollodiag.com",
    status: "active", tier: "professional", subStart: "2024-03-08", subEnd: "2025-03-07",
    admin: { id: "u10", name: "Dr. Ram Krishnan", email: "ram@apollodiag.com", initials: "RK", phone: "+91 87654 32109", role: "Clinical Administrator", assignedAt: "2024-03-08" },
    db: { type: "shared", host: "shared-db-01.internal.medportal.io", port: 5432, dbName: "medportal_shared", schema: "tenant_apd", maxConnections: 20, connStatus: "connected", lastPing: "5s ago", ssl: true, backup: true, backupFreq: "weekly", storageUsedGB: 8.2, storageLimitGB: 50 },
    metrics: { doctors: { used: 41, limit: 50 }, patients: { used: 2341, limit: 5000 }, apiToday: 6210, apiMonth: 62100, apiLimit: 100000, appointmentsMonth: 1241, revMonth: 6200, revLast: 5800, uptime: 99.91, lastBackup: "Yesterday 03:00 AM" },
    createdAt: "2024-03-08", tags: ["diagnostics", "lab-focus"],
  },
  {
    id: "h003", name: "PathCare Labs", code: "PCL", emoji: "🧪",
    email: "admin@pathcare.in", phone: "+91 11 2345 6789",
    address: "7 Connaught Place", city: "New Delhi", state: "Delhi",
    country: "India", zip: "110001", website: "https://pathcare.in",
    status: "trial", tier: "starter", subStart: "2026-02-20", subEnd: "2026-03-20", trialEnd: "2026-03-20",
    admin: undefined,
    db: { type: "shared", host: "shared-db-01.internal.medportal.io", port: 5432, dbName: "medportal_shared", schema: "tenant_pcl", maxConnections: 10, connStatus: "connected", lastPing: "12s ago", ssl: true, backup: false, backupFreq: "none", storageUsedGB: 1.1, storageLimitGB: 10 },
    metrics: { doctors: { used: 4, limit: 5 }, patients: { used: 312, limit: 500 }, apiToday: 820, apiMonth: 4100, apiLimit: 10000, appointmentsMonth: 241, revMonth: 0, revLast: 0, uptime: 99.82, lastBackup: "Never" },
    createdAt: "2026-02-20", tags: ["lab-only", "trial"],
  },
  {
    id: "h004", name: "MedCity Hospital", code: "MCH", emoji: "🏨",
    email: "admin@medcity.io", phone: "+91 80 9876 5432",
    address: "100 Whitefield Main Road", city: "Bangalore", state: "Karnataka",
    country: "India", zip: "560066", website: "https://medcity.io",
    status: "active", tier: "enterprise", subStart: "2023-11-10", subEnd: "2026-11-09",
    admin: { id: "u15", name: "Dr. Kavitha Reddy", email: "kavitha@medcity.io", initials: "KR", phone: "+91 76543 21098", role: "Hospital Administrator", assignedAt: "2023-11-10" },
    db: { type: "dedicated", host: "db-mch.internal.medportal.io", port: 5432, dbName: "medportal_mch", schema: "public", maxConnections: 150, connStatus: "connected", lastPing: "1s ago", ssl: true, backup: true, backupFreq: "hourly", storageUsedGB: 44.8, storageLimitGB: 100 },
    metrics: { doctors: { used: 102, limit: 999 }, patients: { used: 5214, limit: 999999 }, apiToday: 21400, apiMonth: 482000, apiLimit: 1000000, appointmentsMonth: 4821, revMonth: 14800, revLast: 13200, uptime: 99.99, lastBackup: "Today 02:00 AM" },
    createdAt: "2023-11-10", tags: ["multi-specialty", "icu", "pharmacy", "tier-1"],
  },
  {
    id: "h005", name: "LifeCare Clinic", code: "LCC", emoji: "💚",
    email: "admin@lifecare.clinic", phone: "+91 44 3456 7890",
    address: "22 Anna Nagar West", city: "Chennai", state: "Tamil Nadu",
    country: "India", zip: "600040", website: "https://lifecare.clinic",
    status: "inactive", tier: "professional", subStart: "2024-05-01", subEnd: "2025-05-01",
    admin: { id: "u18", name: "Dr. Vikram Nair", email: "vikram@lifecare.clinic", initials: "VN", phone: "+91 65432 10987", role: "Clinical Director", assignedAt: "2024-05-01" },
    db: { type: "shared", host: "shared-db-01.internal.medportal.io", port: 5432, dbName: "medportal_shared", schema: "tenant_lcc", maxConnections: 20, connStatus: "disconnected", lastPing: "18h ago", ssl: true, backup: true, backupFreq: "weekly", storageUsedGB: 12.6, storageLimitGB: 50 },
    metrics: { doctors: { used: 28, limit: 50 }, patients: { used: 1654, limit: 5000 }, apiToday: 0, apiMonth: 8200, apiLimit: 100000, appointmentsMonth: 0, revMonth: 4100, revLast: 3900, uptime: 97.4, lastBackup: "3 days ago" },
    createdAt: "2024-05-01", tags: ["clinic", "outpatient"],
  },
];

const PLANS = {
  starter: { name: "Starter", price: 99, color: "#64748b", accent: "#334155", bg: "#f8fafc", border: "#e2e8f0", ring: "#cbd5e1", maxDoctors: 5, maxPatients: 500, maxStorageGB: 10, maxApiMonth: 10000, features: ["5 Doctors", "500 Patients", "10 GB Storage", "OPD Module", "Basic Reports", "Email Support"] },
  professional: { name: "Professional", price: 299, color: "#1d4ed8", accent: "#1e40af", bg: "#eff6ff", border: "#bfdbfe", ring: "#93c5fd", maxDoctors: 50, maxPatients: 5000, maxStorageGB: 50, maxApiMonth: 100000, features: ["50 Doctors", "5,000 Patients", "50 GB Storage", "Lab Module", "Pharmacy", "Telemedicine", "Advanced Reports", "Priority Support"] },
  enterprise: { name: "Enterprise", price: 799, color: "#6d28d9", accent: "#5b21b6", bg: "#f5f3ff", border: "#ddd6fe", ring: "#c4b5fd", maxDoctors: -1, maxPatients: -1, maxStorageGB: 100, maxApiMonth: 1000000, features: ["Unlimited Doctors", "Unlimited Patients", "100 GB Storage", "All Modules", "Dedicated DB", "24/7 Support", "Custom Branding", "API Webhooks", "SLA 99.9%", "Analytics Suite"] },
};

const AVAILABLE_ADMINS = [
  { id: "a1", name: "Dr. Anjali Mehta", email: "anjali@medportal.io", initials: "AM", specialty: "Hospital Administration" },
  { id: "a2", name: "Mr. Suresh Rajan", email: "suresh@medportal.io", initials: "SR", specialty: "Operations Management" },
  { id: "a3", name: "Dr. Pooja Verma", email: "pooja@medportal.io", initials: "PV", specialty: "Clinical Administration" },
  { id: "a4", name: "Mr. Arjun Kapoor", email: "arjun@medportal.io", initials: "AK", specialty: "Healthcare IT" },
];

/* ══════════════════════════════════════════════════════════════════
   TINY UTILITIES
══════════════════════════════════════════════════════════════════ */
function cx(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}
function fmt(n: number) { return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }
function pct(used: number, limit: number) { return limit <= 0 ? 0 : Math.min(100, (used / limit) * 100); }

/* ══════════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════════ */
const STATUS_META: Record<HospitalStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  active:    { label: "Active",    dot: "#22c55e", text: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  inactive:  { label: "Inactive",  dot: "#94a3b8", text: "#475569", bg: "#f8fafc", border: "#e2e8f0" },
  trial:     { label: "Trial",     dot: "#f59e0b", text: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  suspended: { label: "Suspended", dot: "#ef4444", text: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
};

function StatusBadge({ status }: { status: HospitalStatus }) {
  const m = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border" style={{ color: m.text, background: m.bg, borderColor: m.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: SubscriptionTier }) {
  const p = PLANS[tier];
  return <span className="px-2 py-0.5 rounded text-xs font-black tracking-wide" style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}>{p.name.toUpperCase()}</span>;
}

function ConnDot({ status }: { status: DBConnStatus }) {
  const map: Record<DBConnStatus, [string, string]> = { connected: ["#22c55e", "Connected"], disconnected: ["#ef4444", "Disconnected"], provisioning: ["#f59e0b", "Provisioning"], error: ["#ef4444", "Error"] };
  const [col, lbl] = map[status];
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: col, boxShadow: status === "connected" ? `0 0 0 3px ${col}33` : "none" }} />
      <span className="text-xs font-semibold" style={{ color: col }}>{lbl}</span>
    </span>
  );
}

function Bar({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  const p = pct(value, max);
  const color = p >= 90 ? "#ef4444" : p >= 75 ? "#f59e0b" : "#3b82f6";
  return (
    <div className={cx("h-1.5 rounded-full bg-slate-100 overflow-hidden", className)}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, background: color }} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, bg }: { icon: string; label: string; value: string; sub?: string; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-3 hover:shadow-md transition-all group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: bg }}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{label}</p>
        <p className="text-xl font-black mt-0.5 group-hover:scale-105 transition-transform origin-left" style={{ color }}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Input({ label, required, hint, type = "text", value, onChange, placeholder, disabled, mono, maxLength }: {
  label: string; required?: boolean; hint?: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean; mono?: boolean; maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled} maxLength={maxLength}
        className={cx(
          "w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white placeholder-slate-300 outline-none transition-all",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-400",
          disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "text-slate-900 border-slate-200 hover:border-slate-300",
          mono && "font-mono"
        )}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-slate-300 transition-all">
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, className }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg"; disabled?: boolean; className?: string;
}) {
  const styles = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-blue-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    success: "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-sm",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  return (
    <button onClick={onClick} disabled={disabled}
      className={cx("rounded-xl font-semibold transition-all active:scale-[.97] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 whitespace-nowrap", styles[variant], sizes[size], "shadow-sm", className)}>
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, subtitle, size = "xl", children, footer }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  size?: "md" | "lg" | "xl" | "2xl"; children: React.ReactNode; footer?: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  const w = { md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cx("relative bg-white w-full sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]", w)} style={{ animation: "modalUp .25s cubic-bezier(.34,1.56,.64,1)" }}>
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors ml-4 flex-shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 flex-wrap">{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white max-w-xs"
      style={{ background: ok ? "linear-gradient(135deg,#059669,#047857)" : "linear-gradient(135deg,#dc2626,#b91c1c)", animation: "slideUp .3s ease-out" }}>
      <span className="text-lg">{ok ? "✓" : "✕"}</span>{msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NAV TABS (detail page)
══════════════════════════════════════════════════════════════════ */
type DetailTab = "overview" | "subscription" | "metrics" | "admin" | "settings" | "database";
const DETAIL_TABS: { key: DetailTab; icon: string; label: string }[] = [
  { key: "overview", icon: "◉", label: "Overview" },
  { key: "subscription", icon: "◈", label: "Subscription" },
  { key: "metrics", icon: "◎", label: "Metrics" },
  { key: "admin", icon: "◐", label: "Admin" },
  { key: "settings", icon: "◑", label: "Settings" },
  { key: "database", icon: "◫", label: "Database" },
];

/* ══════════════════════════════════════════════════════════════════
   1. HOSPITAL LIST
══════════════════════════════════════════════════════════════════ */
function HospitalList({ hospitals, onSelect, onCreate, onToggle }: {
  hospitals: Hospital[]; onSelect: (h: Hospital) => void;
  onCreate: () => void; onToggle: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | HospitalStatus>("all");
  const [filterTier, setFilterTier] = useState<"all" | SubscriptionTier>("all");

  const filtered = hospitals.filter(h =>
    (!q || [h.name, h.code, h.city, h.email].some(s => s.toLowerCase().includes(q.toLowerCase()))) &&
    (filterStatus === "all" || h.status === filterStatus) &&
    (filterTier === "all" || h.tier === filterTier)
  );

  const counts = {
    total: hospitals.length,
    active: hospitals.filter(h => h.status === "active").length,
    trial: hospitals.filter(h => h.status === "trial").length,
    inactive: hospitals.filter(h => h.status === "inactive").length,
    suspended: hospitals.filter(h => h.status === "suspended").length,
  };

  return (
    <div className="space-y-6 animate-in">
      {/* ─ Header ─ */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Hospital Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage all tenant hospitals, plans and configurations</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="md">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export
          </Btn>
          <Btn variant="primary" onClick={onCreate} size="md">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14" /></svg>
            Create Hospital
          </Btn>
        </div>
      </div>

      {/* ─ Summary tiles ─ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.total, icon: "🏥", color: "#2563eb", bg: "#eff6ff" },
          { label: "Active", value: counts.active, icon: "✅", color: "#16a34a", bg: "#f0fdf4" },
          { label: "On Trial", value: counts.trial, icon: "⏱️", color: "#d97706", bg: "#fffbeb" },
          { label: "Inactive", value: counts.inactive + counts.suspended, icon: "⏸", color: "#64748b", bg: "#f8fafc" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 hover:shadow-sm transition-all">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─ Filters ─ */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search hospitals…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <select value={filterTier} onChange={e => setFilterTier(e.target.value as typeof filterTier)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Plans</option>
          <option value="starter">Starter</option>
          <option value="professional">Professional</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <p className="text-xs text-slate-400 font-medium ml-auto">{filtered.length} of {hospitals.length}</p>
      </div>

      {/* ─ Table ─ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Hospital", "Plan", "Status", "Doctors", "Patients", "Storage", "DB", "Admin", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((h, i) => {
                const storePct = pct(h.db.storageUsedGB, h.db.storageLimitGB);
                return (
                  <tr key={h.id} onClick={() => onSelect(h)} className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">{h.emoji}</div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">{h.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{h.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><TierBadge tier={h.tier} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={h.status} /></td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800 text-sm">{h.metrics.doctors.used}<span className="text-slate-300 font-normal text-xs"> /{h.metrics.doctors.limit >= 999 ? "∞" : h.metrics.doctors.limit}</span></p>
                      <Bar value={h.metrics.doctors.used} max={h.metrics.doctors.limit >= 999 ? Math.max(h.metrics.doctors.used * 2, 100) : h.metrics.doctors.limit} className="w-16 mt-1" />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800 text-sm">{h.metrics.patients.used.toLocaleString()}</p>
                      <Bar value={h.metrics.patients.used} max={h.metrics.patients.limit >= 999999 ? Math.max(h.metrics.patients.used * 2, 1000) : h.metrics.patients.limit} className="w-20 mt-1" />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800 text-sm">{h.db.storageUsedGB}<span className="text-slate-400 font-normal text-xs"> GB</span></p>
                      <Bar value={h.db.storageUsedGB} max={h.db.storageLimitGB} className="w-16 mt-1" />
                    </td>
                    <td className="px-4 py-3.5">
                      <ConnDot status={h.db.connStatus} />
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">{h.db.type}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      {h.admin
                        ? <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">{h.admin.initials}</div>
                            <span className="text-xs text-slate-600 max-w-[72px] truncate">{h.admin.name.split(" ").at(-1)}</span>
                          </div>
                        : <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Btn variant="secondary" size="sm" onClick={() => onSelect(h)}>View</Btn>
                        <Btn variant={h.status === "active" ? "danger" : "success"} size="sm" onClick={() => onToggle(h.id)}>
                          {h.status === "active" ? "Disable" : "Enable"}
                        </Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="py-20 text-center">
              <p className="text-5xl mb-4">🏥</p>
              <p className="text-slate-500 font-semibold">No hospitals found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2 & 3. CREATE / EDIT MODAL (stepped)
══════════════════════════════════════════════════════════════════ */
interface HospitalForm {
  name: string; code: string; email: string; phone: string;
  address: string; city: string; state: string; country: string; zip: string; website: string;
  tier: SubscriptionTier; trialDays: string;
  dbType: DBType; adminEmail: string;
}

const emptyForm = (): HospitalForm => ({ name: "", code: "", email: "", phone: "", address: "", city: "", state: "", country: "India", zip: "", website: "", tier: "professional", trialDays: "14", dbType: "shared", adminEmail: "" });

function HospitalFormModal({ open, onClose, hospital, onSave }: { open: boolean; onClose: () => void; hospital?: Hospital; onSave: (f: HospitalForm) => void }) {
  const isEdit = !!hospital;
  const [step, setStep] = useState(1);
  const [f, setF] = useState<HospitalForm>(isEdit ? {
    name: hospital!.name, code: hospital!.code, email: hospital!.email,
    phone: hospital!.phone, address: hospital!.address, city: hospital!.city,
    state: hospital!.state, country: hospital!.country, zip: hospital!.zip,
    website: hospital!.website, tier: hospital!.tier, trialDays: "0",
    dbType: hospital!.db.type, adminEmail: hospital!.admin?.email ?? "",
  } : emptyForm());
  const up = (k: keyof HospitalForm) => (v: string) => setF(prev => ({ ...prev, [k]: k === "code" ? v.toUpperCase().slice(0, 5) : v }));

  useEffect(() => { if (open) setStep(1); }, [open]);

  const STEPS = ["Basic Info", "Subscription", "Database", "Review"];
  const plan = PLANS[f.tier];

  return (
    <Modal open={open} onClose={onClose}
      title={isEdit ? `Edit — ${hospital!.name}` : "Create New Hospital"}
      subtitle={`Step ${step} of ${STEPS.length}: ${STEPS[step - 1]}`}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-1.5 items-center">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => i < step && setStep(i + 1)}
                className={cx("rounded-full transition-all", i + 1 === step ? "w-8 h-2 bg-blue-600" : i + 1 < step ? "w-4 h-2 bg-blue-300 cursor-pointer hover:bg-blue-400" : "w-4 h-2 bg-slate-200")} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 1 && <Btn variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>← Back</Btn>}
            <Btn variant="secondary" size="sm" onClick={onClose}>Cancel</Btn>
            {step < 4
              ? <Btn variant="primary" size="sm" onClick={() => setStep(s => s + 1)}>Continue →</Btn>
              : <Btn variant="success" size="sm" onClick={() => { onSave(f); onClose(); }}>✓ {isEdit ? "Save Changes" : "Create Hospital"}</Btn>}
          </div>
        </div>
      }>

      {/* Step 1 — Basic Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Hospital Name" required value={f.name} onChange={up("name")} placeholder="City General Hospital" />
            <Input label="Hospital Code" required value={f.code} onChange={up("code")} placeholder="CGH" hint="3–5 chars, auto-uppercase" mono maxLength={5} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" required type="email" value={f.email} onChange={up("email")} placeholder="admin@hospital.com" />
            <Input label="Phone" value={f.phone} onChange={up("phone")} placeholder="+91 40 1234 5678" />
          </div>
          <Input label="Street Address" value={f.address} onChange={up("address")} placeholder="Street, Area" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" value={f.city} onChange={up("city")} placeholder="Hyderabad" />
            <Input label="State" value={f.state} onChange={up("state")} placeholder="Telangana" />
            <Input label="ZIP Code" value={f.zip} onChange={up("zip")} placeholder="500034" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Country" value={f.country} onChange={up("country")} options={["India", "USA", "UK", "UAE", "Australia", "Canada", "Singapore"].map(c => ({ v: c, l: c }))} />
            <Input label="Website" value={f.website} onChange={up("website")} placeholder="https://hospital.com" />
          </div>
        </div>
      )}

      {/* Step 2 — Subscription */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-700 mb-1">Select Subscription Plan</p>
          {(Object.entries(PLANS) as [SubscriptionTier, typeof PLANS.starter][]).map(([key, p]) => (
            <button key={key} onClick={() => up("tier")(key)}
              className={cx("w-full text-left p-4 rounded-2xl border-2 transition-all", f.tier === key ? "shadow-md" : "border-slate-100 hover:border-slate-200")}
              style={{ borderColor: f.tier === key ? p.color : undefined, background: f.tier === key ? p.bg : "white" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cx("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all")}
                    style={{ borderColor: f.tier === key ? p.color : "#cbd5e1" }}>
                    {f.tier === key && <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />}
                  </div>
                  <div>
                    <p className="font-black text-base" style={{ color: p.color }}>{p.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.features.slice(0, 3).join(" · ")}</p>
                  </div>
                </div>
                <p className="text-xl font-black text-slate-900">${p.price}<span className="text-sm font-normal text-slate-400">/mo</span></p>
              </div>
              {f.tier === key && (
                <div className="mt-3 pl-8 flex flex-wrap gap-1.5">
                  {p.features.map(feat => (
                    <span key={feat} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ color: p.color, background: "white", border: `1px solid ${p.border}` }}>✓ {feat}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
          {!isEdit && (
            <div className="pt-2">
              <Select label="Trial Period" value={f.trialDays} onChange={up("trialDays")}
                options={[{ v: "0", l: "No trial — start billing immediately" }, { v: "7", l: "7-day trial" }, { v: "14", l: "14-day trial (recommended)" }, { v: "30", l: "30-day trial" }]} />
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Database */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Database Architecture</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "shared" as DBType, icon: "🗄️", label: "Shared Database", sub: "Schema-per-tenant isolation. Cost-effective for Starter & Pro.", ok: true },
                { v: "dedicated" as DBType, icon: "💾", label: "Dedicated Database", sub: "Full DB isolation. Best performance. Required for Enterprise.", ok: f.tier === "enterprise" },
              ].map(opt => (
                <button key={opt.v} onClick={() => up("dbType")(opt.v)} disabled={!opt.ok}
                  className={cx("text-left p-4 rounded-2xl border-2 transition-all relative", f.dbType === opt.v ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300", !opt.ok && "opacity-50 cursor-not-allowed")}>
                  <p className="text-3xl mb-2">{opt.icon}</p>
                  <p className="font-black text-slate-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.sub}</p>
                  {!opt.ok && <p className="text-xs text-amber-600 font-bold mt-1">⚠ Enterprise only</p>}
                  {f.dbType === opt.v && <span className="absolute top-3 right-3 text-blue-600 font-black">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Auto-generated Config Preview</p>
            </div>
            <div className="p-4 space-y-2">
              {(f.dbType === "dedicated" ? [
                ["Type", "Dedicated Instance"],
                ["Host", `db-${(f.code || "xxx").toLowerCase()}.internal.medportal.io`],
                ["Port", "5432"],
                ["Database", `medportal_${(f.code || "xxx").toLowerCase()}`],
                ["Schema", "public"],
                ["Max Connections", "100"],
              ] : [
                ["Type", "Shared (Schema Isolation)"],
                ["Host", "shared-db-01.internal.medportal.io"],
                ["Port", "5432"],
                ["Database", "medportal_shared"],
                ["Schema", `tenant_${(f.code || "xxx").toLowerCase()}`],
                ["Max Connections", "20"],
              ]).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-sm border-b border-slate-50 last:border-0 py-1">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{ l: "SSL / TLS Encryption", icon: "🔐", on: true }, { l: "Automated Backups", icon: "💾", on: f.tier !== "starter" }].map(opt => (
              <div key={opt.l} className={cx("flex items-center gap-3 p-3 rounded-xl", opt.on ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-200")}>
                <span className="text-xl">{opt.icon}</span>
                <div className="flex-1"><p className="text-sm font-semibold text-slate-700">{opt.l}</p></div>
                <span className={cx("w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white", opt.on ? "bg-emerald-500" : "bg-slate-300")}>{opt.on ? "✓" : "—"}</span>
              </div>
            ))}
          </div>

          <Input label="Admin Email (invite)" value={f.adminEmail} onChange={up("adminEmail")} type="email" placeholder="admin@hospital.com" hint="An invite email will be sent to set up the hospital admin account" />
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl" style={{ background: "linear-gradient(135deg,#f0f9ff,#f5f3ff)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">🏥</div>
              <div>
                <p className="font-black text-slate-900 text-lg">{f.name || "—"}</p>
                <p className="text-xs font-mono text-slate-400">{f.code || "—"} · {f.city || "—"}, {f.state || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { k: "Email", v: f.email },
                { k: "Phone", v: f.phone },
                { k: "Plan", v: plan.name },
                { k: "Price", v: `$${plan.price}/mo` },
                { k: "Database", v: f.dbType === "dedicated" ? "Dedicated" : "Shared Schema" },
                { k: "Trial", v: isEdit ? "N/A" : f.trialDays === "0" ? "None" : `${f.trialDays} days` },
                { k: "Max Doctors", v: plan.maxDoctors < 0 ? "Unlimited" : String(plan.maxDoctors) },
                { k: "Max Patients", v: plan.maxPatients < 0 ? "Unlimited" : plan.maxPatients.toLocaleString() },
              ].map(r => (
                <div key={r.k} className="bg-white/80 rounded-xl p-3">
                  <p className="text-xs text-slate-400">{r.k}</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 truncate">{r.v || "—"}</p>
                </div>
              ))}
            </div>
          </div>
          {!isEdit && (
            <div className="flex gap-2.5 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
              <span className="text-lg flex-shrink-0">📧</span>
              <p>A setup email will be sent to <strong>{f.adminEmail || f.email || "the provided address"}</strong> with login credentials and onboarding steps.</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. HOSPITAL DETAIL (tabs: overview / subscription / metrics / admin / settings / database)
══════════════════════════════════════════════════════════════════ */
function HospitalDetail({ hospital: init, onBack, onEdit, onToggle, onUpdateAdmin }: {
  hospital: Hospital; onBack: () => void; onEdit: () => void;
  onToggle: () => void; onUpdateAdmin: (adminId: string | null) => void;
}) {
  const [h, setH] = useState(init);
  useEffect(() => setH(init), [init]);

  const [tab, setTab] = useState<DetailTab>("overview");
  const [assignOpen, setAssignOpen] = useState(false);
  const [removeAdminOpen, setRemoveAdminOpen] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [dbTesting, setDbTesting] = useState(false);
  const [dbResult, setDbResult] = useState<null | "ok" | "fail">(null);
  const [settingsForm, setSettingsForm] = useState({ name: h.name, email: h.email, phone: h.phone, website: h.website, address: h.address });

  const plan = PLANS[h.tier];

  const testConn = async () => {
    setDbTesting(true); setDbResult(null);
    await new Promise(r => setTimeout(r, 1800));
    setDbResult(h.db.connStatus === "connected" ? "ok" : "fail");
    setDbTesting(false);
  };

  return (
    <div className="space-y-5 animate-in">
      {/* ─ Breadcrumb ─ */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Hospitals
        </button>
        <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-sm font-black text-slate-900">{h.name}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <StatusBadge status={h.status} />
          <TierBadge tier={h.tier} />
          <ConnDot status={h.db.connStatus} />
          <Btn variant="secondary" size="sm" onClick={onEdit}>✏️ Edit</Btn>
          <Btn variant={h.status === "active" ? "danger" : "success"} size="sm" onClick={() => setConfirmToggle(true)}>
            {h.status === "active" ? "🔒 Deactivate" : "▶ Activate"}
          </Btn>
        </div>
      </div>

      {/* ─ Hero ─ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl flex-shrink-0">{h.emoji}</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{h.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{h.address}, {h.city}, {h.state} {h.zip}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-sm">
              <a href={`mailto:${h.email}`} className="text-blue-600 hover:underline flex items-center gap-1 text-xs">✉ {h.email}</a>
              <span className="text-xs text-slate-500">📞 {h.phone}</span>
              <a href={h.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">🌐 {h.website}</a>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {h.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">{t}</span>)}
            </div>
          </div>
          <div className="text-right text-xs flex-shrink-0 space-y-1">
            <p className="text-slate-400">Hospital ID</p>
            <p className="font-mono font-black text-slate-700">{h.id.toUpperCase()}</p>
            <p className="text-slate-400 mt-2">Created</p>
            <p className="font-semibold text-slate-700">{new Date(h.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      {/* ─ Tabs ─ */}
      <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 overflow-x-auto">
        {DETAIL_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cx("flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center",
              tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800")}>
            <span className="text-base leading-none">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════ TAB: OVERVIEW ═══════════ */}
      {tab === "overview" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "👨‍⚕️", label: "Doctors", value: String(h.metrics.doctors.used), sub: `of ${h.metrics.doctors.limit >= 999 ? "∞" : h.metrics.doctors.limit}`, color: "#0891b2", bg: "#ecfeff" },
            { icon: "🙋", label: "Patients", value: h.metrics.patients.used.toLocaleString(), sub: "registered", color: "#7c3aed", bg: "#f5f3ff" },
            { icon: "📅", label: "Appointments", value: fmt(h.metrics.appointmentsMonth), sub: "this month", color: "#d97706", bg: "#fffbeb" },
            { icon: "💰", label: "Revenue", value: `$${h.metrics.revMonth.toLocaleString()}`, sub: `+$${(h.metrics.revMonth - h.metrics.revLast).toLocaleString()} vs last mo`, color: "#16a34a", bg: "#f0fdf4" },
            { icon: "⚡", label: "API Calls (Mo.)", value: fmt(h.metrics.apiMonth), sub: `of ${fmt(h.metrics.apiLimit)} limit`, color: "#db2777", bg: "#fdf2f8" },
            { icon: "💾", label: "Storage", value: `${h.db.storageUsedGB} GB`, sub: `of ${h.db.storageLimitGB} GB`, color: "#2563eb", bg: "#eff6ff" },
            { icon: "🖥️", label: "Uptime", value: `${h.metrics.uptime}%`, sub: "last 30 days", color: "#059669", bg: "#ecfdf5" },
            { icon: "🔒", label: "Last Backup", value: h.metrics.lastBackup, sub: h.db.backupFreq, color: "#7c3aed", bg: "#f5f3ff" },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* ═══════════ TAB: SUBSCRIPTION ═══════════ */}
      {tab === "subscription" && (
        <div className="space-y-5">
          {/* Current plan */}
          <div className="bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: plan.border }}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
                <h3 className="text-3xl font-black" style={{ color: plan.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-1">${plan.price} / month · Tenant: <code className="bg-slate-100 px-1 rounded text-xs">{h.code}</code></p>
              </div>
              <div className="text-right">
                <StatusBadge status={h.status} />
                {h.status === "trial" && h.trialEnd && (
                  <p className="text-xs text-amber-700 mt-2 font-semibold">
                    ⏳ Trial ends {new Date(h.trialEnd).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2">Subscription End</p>
                <p className="font-bold text-slate-800 text-sm">{new Date(h.subEnd).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
            </div>

            {/* Trial warning */}
            {h.status === "trial" && (
              <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex gap-2.5 items-start">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-bold text-amber-900 text-sm">Trial Period Active</p>
                  <p className="text-xs text-amber-700 mt-0.5">Add a payment method to continue after the trial ends. Features will be restricted after expiry.</p>
                </div>
                <Btn variant="secondary" size="sm" className="ml-auto flex-shrink-0">Add Card</Btn>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <span className="font-black" style={{ color: plan.color }}>✓</span>
                  <span className="text-slate-600">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Change plan */}
          <div>
            <p className="text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">Change Plan</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.entries(PLANS) as [SubscriptionTier, typeof PLANS.starter][]).map(([key, p]) => (
                <div key={key} className={cx("rounded-2xl border-2 p-4 transition-all", key === h.tier ? "shadow-md" : "border-slate-100 hover:border-slate-200 cursor-pointer hover:shadow-sm")}
                  style={{ borderColor: key === h.tier ? p.color : undefined, background: key === h.tier ? p.bg : "white" }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-black" style={{ color: p.color }}>{p.name}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">${p.price}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                    </div>
                    {key === h.tier && <span className="text-xs bg-white font-black px-2 py-0.5 rounded-full" style={{ color: p.color, border: `1px solid ${p.border}` }}>Current</span>}
                  </div>
                  {key !== h.tier && (
                    <Btn variant="secondary" size="sm" className="w-full justify-center mt-1">
                      {p.price > plan.price ? "⬆ Upgrade" : "⬇ Downgrade"}
                    </Btn>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Usage vs limits */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="font-black text-slate-900 mb-5 text-sm uppercase tracking-wider">Plan Usage</p>
            <div className="space-y-5">
              {[
                { label: "Doctors", used: h.metrics.doctors.used, limit: plan.maxDoctors < 0 ? h.metrics.doctors.used * 3 : plan.maxDoctors, suffix: "", inf: plan.maxDoctors < 0 },
                { label: "Patients", used: h.metrics.patients.used, limit: plan.maxPatients < 0 ? h.metrics.patients.used * 3 : plan.maxPatients, suffix: "", inf: plan.maxPatients < 0 },
                { label: "Storage", used: h.db.storageUsedGB, limit: plan.maxStorageGB, suffix: " GB", inf: false },
                { label: "API Calls (Month)", used: h.metrics.apiMonth, limit: plan.maxApiMonth, suffix: "", inf: false },
              ].map(u => {
                const p = u.inf ? 0 : pct(u.used, u.limit);
                const col = p >= 90 ? "#ef4444" : p >= 75 ? "#f59e0b" : "#22c55e";
                return (
                  <div key={u.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-700">{u.label}</span>
                      <span className="font-black" style={{ color: col }}>
                        {u.used.toLocaleString()}{u.suffix} / {u.inf ? "∞" : `${u.limit.toLocaleString()}${u.suffix}`}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${u.inf ? 20 : p}%`, background: col }} />
                    </div>
                    {!u.inf && <p className="text-xs mt-1" style={{ color: col }}>{p.toFixed(0)}% used</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB: METRICS ═══════════ */}
      {tab === "metrics" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon="⚡" label="API Today" value={h.metrics.apiToday.toLocaleString()} sub={`${fmt(h.metrics.apiMonth)} this month`} color="#7c3aed" bg="#f5f3ff" />
            <StatCard icon="🖥️" label="Uptime (30d)" value={`${h.metrics.uptime}%`} sub="SLA target: 99.9%" color={h.metrics.uptime >= 99.9 ? "#16a34a" : "#d97706"} bg={h.metrics.uptime >= 99.9 ? "#f0fdf4" : "#fffbeb"} />
            <StatCard icon="💰" label="Revenue (Month)" value={`$${h.metrics.revMonth.toLocaleString()}`} sub={`↑ $${(h.metrics.revMonth - h.metrics.revLast).toLocaleString()} vs last mo`} color="#16a34a" bg="#f0fdf4" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="font-black text-slate-900 mb-5 text-sm uppercase tracking-wider">Resource Utilization</p>
            <div className="space-y-5">
              {[
                { icon: "👨‍⚕️", label: "Doctors", used: h.metrics.doctors.used, limit: h.metrics.doctors.limit >= 999 ? h.metrics.doctors.used * 3 : h.metrics.doctors.limit, inf: h.metrics.doctors.limit >= 999, suffix: "" },
                { icon: "🙋", label: "Patients", used: h.metrics.patients.used, limit: h.metrics.patients.limit >= 999999 ? h.metrics.patients.used * 3 : h.metrics.patients.limit, inf: h.metrics.patients.limit >= 999999, suffix: "" },
                { icon: "💾", label: "Storage", used: h.db.storageUsedGB, limit: h.db.storageLimitGB, inf: false, suffix: " GB" },
                { icon: "⚡", label: "API (Month)", used: h.metrics.apiMonth, limit: h.metrics.apiLimit, inf: false, suffix: "" },
              ].map(u => {
                const p = u.inf ? 0 : pct(u.used, u.limit);
                const col = p >= 90 ? "#ef4444" : p >= 75 ? "#f59e0b" : "#3b82f6";
                return (
                  <div key={u.label} className="flex items-center gap-4">
                    <span className="text-lg w-8 text-center flex-shrink-0">{u.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-slate-700">{u.label}</span>
                        <span className="font-black text-slate-800">{u.used.toLocaleString()}{u.suffix} / {u.inf ? "∞" : `${u.limit.toLocaleString()}${u.suffix}`}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${u.inf ? 25 : p}%`, background: col }} />
                      </div>
                    </div>
                    <span className="text-xs font-black w-10 text-right flex-shrink-0" style={{ color: col }}>{u.inf ? "∞" : `${p.toFixed(0)}%`}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Appointments (Mo.)", value: h.metrics.appointmentsMonth.toLocaleString(), icon: "📅" },
              { label: "Active Doctors", value: h.metrics.doctors.used, icon: "👨‍⚕️" },
              { label: "Last Backup", value: h.metrics.lastBackup, icon: "🔒" },
              { label: "DB Connections Max", value: h.db.maxConnections, icon: "🔗" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
                <p className="text-xl mb-2">{s.icon}</p>
                <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                <p className="font-black text-slate-900 text-lg mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ TAB: ADMIN ASSIGNMENT ═══════════ */}
      {tab === "admin" && (
        <div className="space-y-5">
          {h.admin ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-wrap items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 text-xl font-black flex items-center justify-center flex-shrink-0">{h.admin.initials}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-slate-900">{h.admin.name}</h3>
                  <p className="text-slate-500 text-sm">{h.admin.role}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <a href={`mailto:${h.admin.email}`} className="text-blue-600 hover:underline text-xs">✉ {h.admin.email}</a>
                    <span className="text-slate-500 text-xs">📞 {h.admin.phone}</span>
                    <span className="text-slate-400 text-xs">
                      Assigned {new Date(h.admin.assignedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn variant="secondary" size="sm" onClick={() => setAssignOpen(true)}>🔄 Reassign</Btn>
                  <Btn variant="danger" size="sm" onClick={() => setRemoveAdminOpen(true)}>Remove</Btn>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                {[{ label: "Login Sessions (30d)", value: "12" }, { label: "Last Active", value: "2h ago" }, { label: "Support Tickets", value: "3" }].map(s => (
                  <div key={s.label}>
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className="font-black text-slate-800 mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
              <p className="text-5xl mb-3">⚠️</p>
              <p className="text-xl font-black text-amber-900">No Admin Assigned</p>
              <p className="text-amber-700 text-sm mt-2 mb-5 max-w-sm mx-auto">This hospital has no administrator. Staff cannot log in until an admin is assigned.</p>
              <Btn variant="primary" onClick={() => setAssignOpen(true)}>+ Assign Hospital Admin</Btn>
            </div>
          )}

          {/* Admin history */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="font-black text-slate-900 text-sm uppercase tracking-wider mb-4">Admin History</p>
            {h.admin ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">{h.admin.initials}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{h.admin.name}</p>
                    <p className="text-xs text-slate-400">Current admin since {new Date(h.admin.assignedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No admin assignment history found.</p>
            )}
          </div>

          {/* Assign Admin Modal */}
          <Modal open={assignOpen} onClose={() => { setAssignOpen(false); setSelectedAdmin(""); }}
            title="Assign Hospital Admin" subtitle="Select an existing platform user or invite by email"
            size="md"
            footer={
              <>
                <Btn variant="secondary" onClick={() => { setAssignOpen(false); setSelectedAdmin(""); }}>Cancel</Btn>
                <Btn variant="primary" disabled={!selectedAdmin} onClick={() => { onUpdateAdmin(selectedAdmin); setAssignOpen(false); setSelectedAdmin(""); }}>Confirm Assignment</Btn>
              </>
            }>
            <div className="space-y-3">
              {AVAILABLE_ADMINS.map(a => (
                <label key={a.id} className={cx("flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all", selectedAdmin === a.id ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200")}>
                  <input type="radio" name="admin-pick" value={a.id} checked={selectedAdmin === a.id} onChange={() => setSelectedAdmin(a.id)} className="sr-only" />
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center flex-shrink-0">{a.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{a.name}</p>
                    <p className="text-xs text-slate-400 truncate">{a.email}</p>
                    <p className="text-xs text-blue-600 font-medium">{a.specialty}</p>
                  </div>
                  {selectedAdmin === a.id && <span className="text-blue-600 font-black text-lg flex-shrink-0">✓</span>}
                </label>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2 font-semibold">Or invite new admin by email</p>
                <input className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="new-admin@hospital.com" />
              </div>
            </div>
          </Modal>

          {/* Remove Admin Confirm */}
          <Modal open={removeAdminOpen} onClose={() => setRemoveAdminOpen(false)} title="Remove Hospital Admin?" size="md"
            footer={<><Btn variant="secondary" onClick={() => setRemoveAdminOpen(false)}>Cancel</Btn><Btn variant="danger" onClick={() => { onUpdateAdmin(null); setRemoveAdminOpen(false); }}>Yes, Remove Admin</Btn></>}>
            <p className="text-slate-600 text-sm">Removing <strong>{h.admin?.name}</strong> will revoke their administrator access. Hospital staff will be unable to log in until a new admin is assigned.</p>
          </Modal>
        </div>
      )}

      {/* ═══════════ TAB: SETTINGS ═══════════ */}
      {tab === "settings" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <p className="font-black text-slate-900 text-sm uppercase tracking-wider">Hospital Profile</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Hospital Name" value={settingsForm.name} onChange={v => setSettingsForm(s => ({ ...s, name: v }))} />
              <Input label="Email" type="email" value={settingsForm.email} onChange={v => setSettingsForm(s => ({ ...s, email: v }))} />
              <Input label="Phone" value={settingsForm.phone} onChange={v => setSettingsForm(s => ({ ...s, phone: v }))} />
              <Input label="Website" value={settingsForm.website} onChange={v => setSettingsForm(s => ({ ...s, website: v }))} />
              <div className="col-span-2">
                <Input label="Address" value={settingsForm.address} onChange={v => setSettingsForm(s => ({ ...s, address: v }))} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Btn variant="primary">Save Changes</Btn>
              <Btn variant="secondary" onClick={() => setSettingsForm({ name: h.name, email: h.email, phone: h.phone, website: h.website, address: h.address })}>Discard</Btn>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="font-black text-slate-900 text-sm uppercase tracking-wider mb-4">Feature Toggles</p>
            <div className="space-y-1">
              {[
                { label: "Email Notifications", sub: "System alerts to admin email", on: true },
                { label: "SMS Alerts", sub: "Critical alerts via SMS gateway", on: false },
                { label: "API Webhooks", sub: "Send events to external endpoints", on: h.tier === "enterprise" },
                { label: "Telemedicine Module", sub: "Video consultation features", on: h.tier !== "starter" },
                { label: "Custom Branding", sub: "Hospital logo & color theme", on: h.tier === "enterprise" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-400">{s.sub}</p>
                  </div>
                  <button className={cx("relative w-11 h-6 rounded-full transition-all flex-shrink-0", s.on ? "bg-blue-600" : "bg-slate-200")}>
                    <span className={cx("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", s.on ? "left-5" : "left-0.5")} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border-2 border-red-100 p-5 shadow-sm">
            <p className="font-black text-red-700 text-sm uppercase tracking-wider mb-4">⚠ Danger Zone</p>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-red-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-red-800">Suspend Hospital</p>
                  <p className="text-xs text-red-500">Temporarily block all access. Data is preserved.</p>
                </div>
                <Btn variant="secondary" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50">Suspend</Btn>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-red-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-red-800">Delete Hospital</p>
                  <p className="text-xs text-red-500">Permanently delete all data. This cannot be undone.</p>
                </div>
                <Btn variant="danger" size="sm">Delete</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB: DATABASE ═══════════ */}
      {tab === "database" && (
        <div className="space-y-5">
          {/* Connection status banner */}
          <div className={cx("rounded-2xl border-2 p-5 flex flex-wrap items-start gap-4",
            h.db.connStatus === "connected" ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
            <span className="text-3xl flex-shrink-0">{h.db.connStatus === "connected" ? "✅" : "❌"}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="font-black text-slate-900">{h.db.connStatus === "connected" ? "Database Online" : "Connection Error"}</p>
                <ConnDot status={h.db.connStatus} />
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Last ping: <strong>{h.db.lastPing}</strong> · <span className="capitalize">{h.db.type}</span> instance · Schema: <code className="bg-white/60 px-1 rounded text-xs">{h.db.schema}</code>
              </p>
            </div>
            <button onClick={testConn} disabled={dbTesting}
              className={cx("px-4 py-2 rounded-xl text-sm font-bold border bg-white transition-all flex items-center gap-2 flex-shrink-0", dbTesting && "opacity-60")}>
              {dbTesting
                ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>Testing…</>
                : dbResult === "ok" ? "✅ Connected!" : dbResult === "fail" ? "❌ Failed" : "🔌 Test Connection"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Connection config */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="font-black text-slate-900 text-sm uppercase tracking-wider">Connection Details</p>
                <span className={cx("px-2.5 py-1 rounded-full text-xs font-black", h.db.type === "dedicated" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
                  {h.db.type === "dedicated" ? "🔒 Dedicated" : "🔗 Shared"}
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Host", value: h.db.host, mono: true },
                  { label: "Port", value: String(h.db.port), mono: true },
                  { label: "Database", value: h.db.dbName, mono: true },
                  { label: "Schema", value: h.db.schema, mono: true },
                  { label: "Max Connections", value: String(h.db.maxConnections) },
                  { label: "Status", value: h.db.connStatus },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-400 font-semibold">{r.label}</span>
                    <span className={cx("text-xs font-bold", r.mono ? "font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700" : "text-slate-800 capitalize")}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & backup */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <p className="font-black text-slate-900 text-sm uppercase tracking-wider">Security & Backup</p>
              {[
                { label: "SSL / TLS Encryption", value: h.db.ssl, type: "bool" },
                { label: "Automated Backups", value: h.db.backup, type: "bool" },
                { label: "Backup Frequency", value: h.db.backupFreq, type: "text" },
                { label: "Last Backup", value: h.metrics.lastBackup, type: "text" },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-400 font-semibold">{r.label}</span>
                  {r.type === "bool"
                    ? <span className={cx("text-xs font-black px-2 py-0.5 rounded-full", r.value ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600")}>{r.value ? "✓ Enabled" : "✕ Disabled"}</span>
                    : <span className="text-xs font-bold text-slate-800 capitalize">{String(r.value)}</span>}
                </div>
              ))}

              {/* Storage bar */}
              <div className="pt-1">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400 font-semibold">Storage Usage</span>
                  <span className="font-black text-slate-700">{h.db.storageUsedGB} / {h.db.storageLimitGB} GB</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct(h.db.storageUsedGB, h.db.storageLimitGB)}%`, background: pct(h.db.storageUsedGB, h.db.storageLimitGB) > 80 ? "#ef4444" : "#3b82f6" }} />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{pct(h.db.storageUsedGB, h.db.storageLimitGB).toFixed(1)}% · {(h.db.storageLimitGB - h.db.storageUsedGB).toFixed(1)} GB free</p>
              </div>
            </div>
          </div>

          {/* DB Actions */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "📥 Backup Now", variant: "secondary" as const },
              { label: "📤 Export Schema", variant: "secondary" as const },
              { label: "🔄 Rotate Credentials", variant: "secondary" as const },
              { label: "📋 Migration Logs", variant: "secondary" as const },
            ].map(a => <Btn key={a.label} variant={a.variant}>{a.label}</Btn>)}
            {h.tier === "enterprise" && h.db.type === "shared" && (
              <Btn variant="secondary" className="border-purple-300 text-purple-700 hover:bg-purple-50">⬆ Migrate to Dedicated DB</Btn>
            )}
          </div>
        </div>
      )}

      {/* ─ Confirm Toggle Modal ─ */}
      <Modal open={confirmToggle} onClose={() => setConfirmToggle(false)}
        title={h.status === "active" ? "Deactivate Hospital?" : "Activate Hospital?"} size="md"
        footer={
          <>
            <Btn variant="secondary" onClick={() => setConfirmToggle(false)}>Cancel</Btn>
            <Btn variant={h.status === "active" ? "danger" : "success"} onClick={() => { onToggle(); setConfirmToggle(false); }}>
              {h.status === "active" ? "Yes, Deactivate" : "Yes, Activate"}
            </Btn>
          </>
        }>
        <p className="text-slate-600 text-sm mb-4">
          {h.status === "active"
            ? `Deactivating ${h.name} will block all user logins. Data is preserved and can be reactivated anytime.`
            : `Activating ${h.name} will restore login access for all registered users immediately.`}
        </p>
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
          <span className="text-3xl">{h.emoji}</span>
          <div>
            <p className="font-black text-slate-900">{h.name}</p>
            <p className="text-xs text-slate-400">{h.code} · {h.city}, {h.state}</p>
          </div>
          <div className="ml-auto"><StatusBadge status={h.status} /></div>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState<Hospital[]>(HOSPITALS_SEED);
  const [selected, setSelected] = useState<Hospital | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = (id: string) => {
    setHospitals(hs => hs.map(h => {
      if (h.id !== id) return h;
      const next = h.status === "active" ? "inactive" : "active";
      showToast(`${h.name} ${next === "active" ? "activated" : "deactivated"} successfully`, true);
      return { ...h, status: next };
    }));
    if (selected?.id === id) {
      setSelected(s => s ? { ...s, status: s.status === "active" ? "inactive" : "active" } : null);
    }
  };

  const updateAdmin = (adminId: string | null) => {
    if (!selected) return;
    const admin = adminId ? AVAILABLE_ADMINS.find(a => a.id === adminId) : null;
    const newAdmin: AdminUser | undefined = admin ? {
      id: admin.id, name: admin.name, email: admin.email, initials: admin.initials,
      phone: "+91 00000 00000", role: admin.specialty, assignedAt: new Date().toISOString().slice(0, 10),
    } : undefined;
    setHospitals(hs => hs.map(h => h.id === selected.id ? { ...h, admin: newAdmin } : h));
    setSelected(s => s ? { ...s, admin: newAdmin } : null);
    showToast(adminId ? "Admin assigned successfully" : "Admin removed", !!adminId);
  };

  const saveHospital = (f: HospitalForm) => {
    const isEdit = !!selected;
    if (isEdit) {
      setHospitals(hs => hs.map(h => h.id === selected!.id ? { ...h, name: f.name, code: f.code, email: f.email, phone: f.phone, address: f.address, city: f.city, state: f.state, country: f.country, zip: f.zip, website: f.website, tier: f.tier, db: { ...h.db, type: f.dbType } } : h));
      setSelected(s => s ? { ...s, name: f.name, code: f.code, email: f.email, phone: f.phone, tier: f.tier } : null);
      showToast(`${f.name} updated successfully`);
    } else {
      const newH: Hospital = {
        id: `h${Date.now()}`, name: f.name, code: f.code, emoji: "🏥",
        email: f.email, phone: f.phone, address: f.address, city: f.city,
        state: f.state, country: f.country, zip: f.zip, website: f.website,
        status: Number(f.trialDays) > 0 ? "trial" : "active",
        tier: f.tier, subStart: new Date().toISOString().slice(0, 10),
        subEnd: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
        trialEnd: Number(f.trialDays) > 0 ? new Date(Date.now() + Number(f.trialDays) * 86400000).toISOString().slice(0, 10) : undefined,
        admin: undefined,
        db: { type: f.dbType, host: f.dbType === "dedicated" ? `db-${f.code.toLowerCase()}.internal.medportal.io` : "shared-db-01.internal.medportal.io", port: 5432, dbName: f.dbType === "dedicated" ? `medportal_${f.code.toLowerCase()}` : "medportal_shared", schema: f.dbType === "dedicated" ? "public" : `tenant_${f.code.toLowerCase()}`, maxConnections: f.dbType === "dedicated" ? 100 : 20, connStatus: "provisioning", lastPing: "—", ssl: true, backup: f.tier !== "starter", backupFreq: f.tier === "enterprise" ? "daily" : f.tier === "professional" ? "weekly" : "none", storageUsedGB: 0, storageLimitGB: PLANS[f.tier].maxStorageGB },
        metrics: { doctors: { used: 0, limit: PLANS[f.tier].maxDoctors < 0 ? 999999 : PLANS[f.tier].maxDoctors }, patients: { used: 0, limit: PLANS[f.tier].maxPatients < 0 ? 999999 : PLANS[f.tier].maxPatients }, apiToday: 0, apiMonth: 0, apiLimit: PLANS[f.tier].maxApiMonth, appointmentsMonth: 0, revMonth: 0, revLast: 0, uptime: 100, lastBackup: "Never" },
        createdAt: new Date().toISOString().slice(0, 10), tags: [],
      };
      setHospitals(hs => [newH, ...hs]);
      showToast(`${f.name} created successfully! Invitation sent to ${f.adminEmail || f.email}`);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Sora:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Sora', system-ui, sans-serif; }
        @keyframes modalUp { from { opacity:0; transform:translateY(16px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .animate-in { animation: slideUp .3s ease-out; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {selected ? (
            <HospitalDetail
              hospital={selected}
              onBack={() => setSelected(null)}
              onEdit={() => setEditOpen(true)}
              onToggle={() => toggleStatus(selected.id)}
              onUpdateAdmin={updateAdmin}
            />
          ) : (
            <HospitalList
              hospitals={hospitals}
              onSelect={h => setSelected(h)}
              onCreate={() => setCreateOpen(true)}
              onToggle={toggleStatus}
            />
          )}
        </div>
      </div>

      <HospitalFormModal open={createOpen} onClose={() => setCreateOpen(false)} onSave={saveHospital} />
      {selected && <HospitalFormModal open={editOpen} onClose={() => setEditOpen(false)} hospital={selected} onSave={saveHospital} />}
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </>
  );
}
import { useState, useEffect, useMemo } from "react";

/* ══════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════ */
type UserStatus = "active" | "inactive" | "suspended" | "pending";
type RoleType = "system" | "custom";

interface Permission {
  id: string;
  key: string;
  label: string;
  description: string;
  module: string;
  risk: "low" | "medium" | "high" | "critical";
}

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  bg: string;
  icon: string;
  type: RoleType;
  permissions: string[];
  userCount: number;
  createdAt: string;
  isSystem?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  hospital: string;
  department: string;
  status: UserStatus;
  avatar: string;
  employeeId: string;
  createdAt: string;
  lastLogin: string | null;
  loginCount: number;
  mfaEnabled: boolean;
  passwordLastChanged: string;
}

interface LoginLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  ip: string;
  device: string;
  browser: string;
  location: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  reason?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   SEED DATA
══════════════════════════════════════════════════════════════════════ */
const ALL_PERMISSIONS: Permission[] = [
  // Hospital
  { id: "p01", key: "hospital:view",   label: "View Hospitals",    description: "View hospital list and details",       module: "Hospital",    risk: "low"      },
  { id: "p02", key: "hospital:create", label: "Create Hospital",   description: "Register new hospital tenant",         module: "Hospital",    risk: "critical" },
  { id: "p03", key: "hospital:edit",   label: "Edit Hospital",     description: "Modify hospital settings",             module: "Hospital",    risk: "high"     },
  { id: "p04", key: "hospital:delete", label: "Delete Hospital",   description: "Permanently remove a hospital",        module: "Hospital",    risk: "critical" },
  { id: "p05", key: "hospital:toggle", label: "Toggle Hospital",   description: "Activate or deactivate hospital",      module: "Hospital",    risk: "high"     },
  // Users
  { id: "p06", key: "user:view",       label: "View Users",        description: "View user list and profiles",          module: "Users",       risk: "low"      },
  { id: "p07", key: "user:create",     label: "Create User",       description: "Register new user account",            module: "Users",       risk: "medium"   },
  { id: "p08", key: "user:edit",       label: "Edit User",         description: "Modify user details and roles",        module: "Users",       risk: "medium"   },
  { id: "p09", key: "user:delete",     label: "Delete User",       description: "Permanently remove a user",            module: "Users",       risk: "high"     },
  { id: "p10", key: "user:reset_pwd",  label: "Reset Password",    description: "Force-reset any user password",        module: "Users",       risk: "high"     },
  { id: "p11", key: "user:deactivate", label: "Deactivate User",   description: "Block user login access",              module: "Users",       risk: "medium"   },
  { id: "p12", key: "user:view_logs",  label: "View Login Logs",   description: "Access security & login audit logs",   module: "Users",       risk: "medium"   },
  // Roles
  { id: "p13", key: "role:view",       label: "View Roles",        description: "View role list and permissions",       module: "Roles",       risk: "low"      },
  { id: "p14", key: "role:create",     label: "Create Role",       description: "Create new custom roles",              module: "Roles",       risk: "high"     },
  { id: "p15", key: "role:edit",       label: "Edit Role",         description: "Modify role permissions",              module: "Roles",       risk: "high"     },
  { id: "p16", key: "role:delete",     label: "Delete Role",       description: "Remove custom roles",                  module: "Roles",       risk: "high"     },
  { id: "p17", key: "role:assign",     label: "Assign Role",       description: "Assign roles to users",                module: "Roles",       risk: "medium"   },
  // Patients
  { id: "p18", key: "patient:view",    label: "View Patients",     description: "View patient records",                 module: "Patients",    risk: "low"      },
  { id: "p19", key: "patient:create",  label: "Register Patient",  description: "Register new patient",                 module: "Patients",    risk: "medium"   },
  { id: "p20", key: "patient:edit",    label: "Edit Patient",      description: "Modify patient records",               module: "Patients",    risk: "medium"   },
  { id: "p21", key: "patient:delete",  label: "Delete Patient",    description: "Remove patient records",               module: "Patients",    risk: "high"     },
  // Billing
  { id: "p22", key: "billing:view",    label: "View Billing",      description: "View invoices and payments",           module: "Billing",     risk: "low"      },
  { id: "p23", key: "billing:create",  label: "Create Invoice",    description: "Generate new invoices",                module: "Billing",     risk: "medium"   },
  { id: "p24", key: "billing:edit",    label: "Edit Invoice",      description: "Modify billing records",               module: "Billing",     risk: "medium"   },
  { id: "p25", key: "billing:delete",  label: "Void Invoice",      description: "Void or cancel invoices",              module: "Billing",     risk: "high"     },
  { id: "p26", key: "billing:refund",  label: "Process Refund",    description: "Issue refunds to patients",            module: "Billing",     risk: "high"     },
  // Lab
  { id: "p27", key: "lab:view",        label: "View Lab Tests",    description: "View lab orders and reports",          module: "Lab",         risk: "low"      },
  { id: "p28", key: "lab:create",      label: "Order Lab Test",    description: "Request new lab tests",                module: "Lab",         risk: "medium"   },
  { id: "p29", key: "lab:upload",      label: "Upload Results",    description: "Upload test result files",             module: "Lab",         risk: "medium"   },
  { id: "p30", key: "lab:approve",     label: "Approve Results",   description: "Approve & release reports",            module: "Lab",         risk: "high"     },
  // Pharmacy
  { id: "p31", key: "pharmacy:view",   label: "View Pharmacy",     description: "View medicines and stock",             module: "Pharmacy",    risk: "low"      },
  { id: "p32", key: "pharmacy:dispense",label: "Dispense Meds",   description: "Dispense medicines to patients",       module: "Pharmacy",    risk: "medium"   },
  { id: "p33", key: "pharmacy:stock",  label: "Manage Stock",      description: "Update inventory levels",              module: "Pharmacy",    risk: "medium"   },
  // System
  { id: "p34", key: "system:config",   label: "System Config",     description: "Modify system-wide settings",          module: "System",      risk: "critical" },
  { id: "p35", key: "system:logs",     label: "View System Logs",  description: "Access server and audit logs",         module: "System",      risk: "high"     },
  { id: "p36", key: "system:backup",   label: "Manage Backups",    description: "Trigger and manage DB backups",        module: "System",      risk: "critical" },
  // Reports
  { id: "p37", key: "report:view",     label: "View Reports",      description: "Access analytics dashboards",          module: "Reports",     risk: "low"      },
  { id: "p38", key: "report:export",   label: "Export Reports",    description: "Export data to CSV/PDF",               module: "Reports",     risk: "medium"   },
  { id: "p39", key: "report:financial",label: "Financial Reports", description: "Access revenue and billing reports",   module: "Reports",     risk: "high"     },
  // Appointments
  { id: "p40", key: "appt:view",       label: "View Appointments", description: "View appointment schedule",            module: "Appointments",risk: "low"      },
  { id: "p41", key: "appt:create",     label: "Book Appointment",  description: "Create new appointments",              module: "Appointments",risk: "low"      },
  { id: "p42", key: "appt:cancel",     label: "Cancel Appointment",description: "Cancel scheduled appointments",        module: "Appointments",risk: "medium"   },
];

const MODULES = [...new Set(ALL_PERMISSIONS.map(p => p.module))];

const ROLES_SEED: Role[] = [
  {
    id: "r01", name: "Super Admin", slug: "superadmin", description: "Full platform access. Manages all hospitals and global settings.", color: "#6d28d9", bg: "#f5f3ff", icon: "👑",
    type: "system", isSystem: true, userCount: 2, createdAt: "2023-01-01",
    permissions: ALL_PERMISSIONS.map(p => p.id),
  },
  {
    id: "r02", name: "Hospital Admin", slug: "hospital_admin", description: "Manages a single hospital tenant — staff, billing, settings.", color: "#2563eb", bg: "#eff6ff", icon: "🏥",
    type: "system", isSystem: true, userCount: 8, createdAt: "2023-01-01",
    permissions: ["p01","p06","p07","p08","p11","p12","p13","p17","p18","p19","p20","p22","p23","p24","p27","p28","p29","p30","p31","p32","p33","p37","p38","p40","p41","p42"],
  },
  {
    id: "r03", name: "Doctor", slug: "doctor", description: "Clinical staff — views patients, writes prescriptions, orders lab tests.", color: "#0891b2", bg: "#ecfeff", icon: "👨‍⚕️",
    type: "system", isSystem: true, userCount: 84, createdAt: "2023-01-01",
    permissions: ["p06","p13","p18","p19","p20","p27","p28","p30","p37","p40","p41","p42"],
  },
  {
    id: "r04", name: "Nurse", slug: "nurse", description: "Patient care — ward management, vitals, medication scheduling.", color: "#059669", bg: "#ecfdf5", icon: "👩‍⚕️",
    type: "system", isSystem: true, userCount: 62, createdAt: "2023-01-01",
    permissions: ["p18","p19","p20","p27","p31","p32","p37","p40","p41"],
  },
  {
    id: "r05", name: "Receptionist", slug: "receptionist", description: "Front desk — patient registration, appointments, walk-ins.", color: "#db2777", bg: "#fdf2f8", icon: "💁",
    type: "system", isSystem: true, userCount: 24, createdAt: "2023-01-01",
    permissions: ["p18","p19","p22","p23","p37","p40","p41","p42"],
  },
  {
    id: "r06", name: "Pharmacist", slug: "pharmacist", description: "Pharmacy module — dispense medicines, manage stock, billing.", color: "#d97706", bg: "#fffbeb", icon: "💊",
    type: "system", isSystem: true, userCount: 18, createdAt: "2023-01-01",
    permissions: ["p18","p22","p23","p27","p31","p32","p33","p37","p40"],
  },
  {
    id: "r07", name: "Lab Technician", slug: "lab_tech", description: "Lab module — process orders, upload results, manage samples.", color: "#0e7490", bg: "#ecfeff", icon: "🧪",
    type: "system", isSystem: true, userCount: 15, createdAt: "2023-01-01",
    permissions: ["p18","p27","p28","p29","p30","p37","p40"],
  },
  {
    id: "r08", name: "Accountant", slug: "accountant", description: "Finance — invoicing, payments, insurance, payroll view.", color: "#b45309", bg: "#fffbeb", icon: "📊",
    type: "system", isSystem: true, userCount: 10, createdAt: "2023-01-01",
    permissions: ["p18","p22","p23","p24","p25","p26","p37","p38","p39"],
  },
  {
    id: "r09", name: "Billing Auditor", slug: "billing_auditor", description: "Custom role — read-only billing and financial reports access.", color: "#64748b", bg: "#f8fafc", icon: "🔍",
    type: "custom", userCount: 3, createdAt: "2024-06-01",
    permissions: ["p22","p37","p38","p39"],
  },
  {
    id: "r10", name: "Data Analyst", slug: "data_analyst", description: "Custom role — analytics, export, and reporting access only.", color: "#7c3aed", bg: "#f5f3ff", icon: "📈",
    type: "custom", userCount: 2, createdAt: "2024-09-15",
    permissions: ["p37","p38","p39"],
  },
];

const USERS_SEED: User[] = [
  { id: "u01", name: "Alex Thompson",    email: "alex@medportal.io",        phone: "+1 555-0101", roleId: "r01", hospital: "Platform (Global)",    department: "IT Operations",  status: "active",    avatar: "AT", employeeId: "EMP-001", createdAt: "2023-01-15", lastLogin: "2026-03-05T08:14:00Z", loginCount: 412, mfaEnabled: true,  passwordLastChanged: "2026-01-01" },
  { id: "u02", name: "Dr. Priya Sharma", email: "priya@cityhospital.com",   phone: "+91 98765 43210", roleId: "r02", hospital: "City General Hospital", department: "Administration", status: "active",    avatar: "PS", employeeId: "EMP-002", createdAt: "2024-01-15", lastLogin: "2026-03-05T09:22:00Z", loginCount: 280, mfaEnabled: true,  passwordLastChanged: "2026-02-01" },
  { id: "u03", name: "Dr. Kevin Patel",  email: "kevin@cityhospital.com",   phone: "+91 87654 32109", roleId: "r03", hospital: "City General Hospital", department: "Endocrinology",  status: "active",    avatar: "KP", employeeId: "EMP-003", createdAt: "2024-02-01", lastLogin: "2026-03-04T17:45:00Z", loginCount: 195, mfaEnabled: false, passwordLastChanged: "2025-11-15" },
  { id: "u04", name: "Anika Patel",      email: "anika@cityhospital.com",   phone: "+91 76543 21098", roleId: "r04", hospital: "City General Hospital", department: "ICU Ward 3",     status: "active",    avatar: "AP", employeeId: "EMP-004", createdAt: "2024-07-01", lastLogin: "2026-03-05T07:00:00Z", loginCount: 98,  mfaEnabled: false, passwordLastChanged: "2025-12-01" },
  { id: "u05", name: "Elena Rodriguez",  email: "elena@cityhospital.com",   phone: "+91 65432 10987", roleId: "r05", hospital: "City General Hospital", department: "Front Desk",     status: "active",    avatar: "ER", employeeId: "EMP-005", createdAt: "2024-06-01", lastLogin: "2026-03-05T08:30:00Z", loginCount: 142, mfaEnabled: false, passwordLastChanged: "2026-01-15" },
  { id: "u06", name: "Marcus Chen",      email: "marcus@cityhospital.com",  phone: "+91 54321 09876", roleId: "r06", hospital: "City General Hospital", department: "Pharmacy",       status: "active",    avatar: "MC", employeeId: "EMP-006", createdAt: "2024-05-01", lastLogin: "2026-03-04T14:10:00Z", loginCount: 110, mfaEnabled: false, passwordLastChanged: "2025-10-20" },
  { id: "u07", name: "James Wilson",     email: "james@cityhospital.com",   phone: "+91 43210 98765", roleId: "r07", hospital: "City General Hospital", department: "Pathology",      status: "active",    avatar: "JW", employeeId: "EMP-007", createdAt: "2024-08-01", lastLogin: "2026-03-05T06:45:00Z", loginCount: 76,  mfaEnabled: false, passwordLastChanged: "2025-12-20" },
  { id: "u08", name: "Sarah Kim",        email: "sarah@cityhospital.com",   phone: "+91 32109 87654", roleId: "r08", hospital: "City General Hospital", department: "Finance",        status: "active",    avatar: "SK", employeeId: "EMP-008", createdAt: "2024-09-01", lastLogin: "2026-03-03T16:00:00Z", loginCount: 54,  mfaEnabled: false, passwordLastChanged: "2026-02-10" },
  { id: "u09", name: "Dr. Ram Krishnan", email: "ram@apollodiag.com",       phone: "+91 21098 76543", roleId: "r02", hospital: "Apollo Diagnostics",   department: "Administration", status: "inactive",  avatar: "RK", employeeId: "EMP-009", createdAt: "2024-03-08", lastLogin: "2026-02-10T11:00:00Z", loginCount: 88,  mfaEnabled: true,  passwordLastChanged: "2025-09-01" },
  { id: "u10", name: "Riya Nair",        email: "riya@pathcare.in",         phone: "+91 10987 65432", roleId: "r05", hospital: "PathCare Labs",         department: "Front Desk",     status: "pending",   avatar: "RN", employeeId: "EMP-010", createdAt: "2026-02-20", lastLogin: null,                   loginCount: 0,   mfaEnabled: false, passwordLastChanged: "2026-02-20" },
  { id: "u11", name: "Vikas Mehta",      email: "vikas@medcity.io",         phone: "+91 09876 54321", roleId: "r09", hospital: "MedCity Hospital",      department: "Finance",        status: "suspended", avatar: "VM", employeeId: "EMP-011", createdAt: "2024-11-10", lastLogin: "2026-01-20T09:30:00Z", loginCount: 31,  mfaEnabled: false, passwordLastChanged: "2024-11-10" },
  { id: "u12", name: "Tanvi Singh",      email: "tanvi@medcity.io",         phone: "+91 98760 43211", roleId: "r10", hospital: "MedCity Hospital",      department: "Analytics",      status: "active",    avatar: "TS", employeeId: "EMP-012", createdAt: "2024-09-15", lastLogin: "2026-03-04T10:00:00Z", loginCount: 62,  mfaEnabled: false, passwordLastChanged: "2025-11-01" },
];

const LOGIN_LOGS_SEED: LoginLog[] = [
  { id: "l01", userId: "u01", userName: "Alex Thompson",    userRole: "Super Admin",     ip: "103.21.48.12",  device: "Desktop",  browser: "Chrome 122",  location: "Hyderabad, IN", timestamp: "2026-03-05T08:14:22Z", status: "success" },
  { id: "l02", userId: "u02", userName: "Dr. Priya Sharma", userRole: "Hospital Admin",  ip: "103.21.48.45",  device: "Desktop",  browser: "Firefox 123", location: "Hyderabad, IN", timestamp: "2026-03-05T09:22:11Z", status: "success" },
  { id: "l03", userId: "u04", userName: "Anika Patel",      userRole: "Nurse",           ip: "192.168.1.22",  device: "Mobile",   browser: "Safari 17",   location: "Hyderabad, IN", timestamp: "2026-03-05T07:00:55Z", status: "success" },
  { id: "l04", userId: "u03", userName: "Dr. Kevin Patel",  userRole: "Doctor",          ip: "103.21.49.11",  device: "Desktop",  browser: "Chrome 122",  location: "Hyderabad, IN", timestamp: "2026-03-04T17:45:03Z", status: "success" },
  { id: "l05", userId: "u09", userName: "Dr. Ram Krishnan", userRole: "Hospital Admin",  ip: "122.56.78.90",  device: "Desktop",  browser: "Edge 121",    location: "Mumbai, IN",    timestamp: "2026-03-04T11:30:00Z", status: "failed",  reason: "Invalid password" },
  { id: "l06", userId: "u09", userName: "Dr. Ram Krishnan", userRole: "Hospital Admin",  ip: "122.56.78.90",  device: "Desktop",  browser: "Edge 121",    location: "Mumbai, IN",    timestamp: "2026-03-04T11:30:42Z", status: "failed",  reason: "Invalid password" },
  { id: "l07", userId: "u09", userName: "Dr. Ram Krishnan", userRole: "Hospital Admin",  ip: "122.56.78.90",  device: "Desktop",  browser: "Edge 121",    location: "Mumbai, IN",    timestamp: "2026-03-04T11:31:05Z", status: "blocked", reason: "Too many failed attempts" },
  { id: "l08", userId: "u11", userName: "Vikas Mehta",      userRole: "Billing Auditor", ip: "59.180.22.14",  device: "Mobile",   browser: "Chrome 122",  location: "Bangalore, IN", timestamp: "2026-03-04T08:15:00Z", status: "blocked", reason: "Account suspended" },
  { id: "l09", userId: "u05", userName: "Elena Rodriguez",  userRole: "Receptionist",    ip: "192.168.1.31",  device: "Tablet",   browser: "Chrome 122",  location: "Hyderabad, IN", timestamp: "2026-03-05T08:30:18Z", status: "success" },
  { id: "l10", userId: "u08", userName: "Sarah Kim",        userRole: "Accountant",      ip: "103.21.48.77",  device: "Desktop",  browser: "Chrome 120",  location: "Hyderabad, IN", timestamp: "2026-03-03T16:00:01Z", status: "success" },
  { id: "l11", userId: "u12", userName: "Tanvi Singh",      userRole: "Data Analyst",    ip: "103.22.50.11",  device: "Desktop",  browser: "Chrome 122",  location: "Bangalore, IN", timestamp: "2026-03-04T10:00:44Z", status: "success" },
  { id: "l12", userId: "u01", userName: "Alex Thompson",    userRole: "Super Admin",     ip: "185.220.101.5", device: "Unknown",  browser: "Unknown",     location: "Frankfurt, DE", timestamp: "2026-03-03T02:11:00Z", status: "blocked", reason: "Suspicious location — IP not whitelisted" },
];

/* ══════════════════════════════════════════════════════════════════════
   UTILITY HELPERS
══════════════════════════════════════════════════════════════════════ */
function cx(...c: (string | false | undefined | null)[]) { return c.filter(Boolean).join(" "); }

function relTime(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
}

/* ══════════════════════════════════════════════════════════════════════
   ATOMS / PRIMITIVES
══════════════════════════════════════════════════════════════════════ */
const STATUS_MAP: Record<UserStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  active:    { label: "Active",    dot: "#22c55e", text: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  inactive:  { label: "Inactive",  dot: "#94a3b8", text: "#475569", bg: "#f8fafc", border: "#e2e8f0" },
  suspended: { label: "Suspended", dot: "#ef4444", text: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  pending:   { label: "Pending",   dot: "#f59e0b", text: "#92400e", bg: "#fffbeb", border: "#fde68a" },
};

function StatusBadge({ status }: { status: UserStatus }) {
  const m = STATUS_MAP[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border"
      style={{ color: m.text, background: m.bg, borderColor: m.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

const LOG_STATUS_MAP: Record<LoginLog["status"], { icon: string; text: string; bg: string; border: string }> = {
  success: { icon: "✓", text: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  failed:  { icon: "✕", text: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  blocked: { icon: "⊘", text: "#92400e", bg: "#fffbeb", border: "#fde68a" },
};

function LogBadge({ status }: { status: LoginLog["status"] }) {
  const m = LOG_STATUS_MAP[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize"
      style={{ color: m.text, background: m.bg, borderColor: m.border }}>
      {m.icon} {status}
    </span>
  );
}

const RISK_META: Record<Permission["risk"], { label: string; color: string; bg: string }> = {
  low:      { label: "Low",      color: "#16a34a", bg: "#f0fdf4" },
  medium:   { label: "Medium",   color: "#d97706", bg: "#fffbeb" },
  high:     { label: "High",     color: "#dc2626", bg: "#fef2f2" },
  critical: { label: "Critical", color: "#7c2d12", bg: "#fff7ed" },
};

function RiskPill({ risk }: { risk: Permission["risk"] }) {
  const m = RISK_META[risk];
  return <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: m.color, background: m.bg }}>{m.label}</span>;
}

function Avatar({ initials, color, bg, size = "md" }: { initials: string; color: string; bg: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-14 h-14 text-xl" : size === "md" ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs";
  return (
    <div className={cx(sz, "rounded-xl flex items-center justify-center font-black flex-shrink-0")} style={{ color, background: bg }}>
      {initials}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, full, className }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";
  size?: "xs" | "sm" | "md" | "lg"; disabled?: boolean; full?: boolean; className?: string;
}) {
  const styles = {
    primary:   "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-blue-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    danger:    "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
    ghost:     "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    success:   "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
    warning:   "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100",
  };
  const sz = { xs: "px-2 py-1 text-xs", sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-sm" }[size];
  return (
    <button onClick={onClick} disabled={disabled}
      className={cx("rounded-xl font-semibold transition-all active:scale-[.97] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 whitespace-nowrap", styles[variant], sz, full && "w-full justify-center", className)}>
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, subtitle, size = "xl", children, footer }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"; children: React.ReactNode; footer?: React.ReactNode;
}) {
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  if (!open) return null;
  const w = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl", "3xl": "max-w-3xl", full: "max-w-6xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cx("relative bg-white w-full sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]", w)}
        style={{ animation: "modalUp .22s cubic-bezier(.34,1.56,.64,1)" }}>
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 ml-4 flex-shrink-0 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 flex-wrap">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

const inp = "w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all hover:border-slate-300";

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white"
      style={{ background: ok ? "linear-gradient(135deg,#059669,#047857)" : "linear-gradient(135deg,#dc2626,#b91c1c)", animation: "slideUp .3s ease-out", maxWidth: "320px" }}>
      <span className="text-xl flex-shrink-0">{ok ? "✓" : "✕"}</span>{msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN TABS
══════════════════════════════════════════════════════════════════════ */
type MainTab = "users" | "roles" | "matrix" | "logs";
const MAIN_TABS: { key: MainTab; icon: string; label: string }[] = [
  { key: "users",  icon: "◉", label: "Users"             },
  { key: "roles",  icon: "◈", label: "Roles"             },
  { key: "matrix", icon: "◫", label: "Permission Matrix" },
  { key: "logs",   icon: "◎", label: "Login Logs"        },
];

/* ══════════════════════════════════════════════════════════════════════
   SECTION A — USERS TABLE
══════════════════════════════════════════════════════════════════════ */
function UsersTab({ users, roles, onCreateUser, onEditUser, onDeactivate, onResetPwd, onViewLogs }: {
  users: User[]; roles: Role[];
  onCreateUser: () => void;
  onEditUser: (u: User) => void;
  onDeactivate: (u: User) => void;
  onResetPwd: (u: User) => void;
  onViewLogs: (u: User) => void;
}) {
  const [q, setQ] = useState("");
  const [fRole, setFRole] = useState("all");
  const [fStatus, setFStatus] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "lastLogin" | "loginCount">("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const filtered = useMemo(() => {
    return users
      .filter(u =>
        (!q || [u.name, u.email, u.employeeId, u.department].some(s => s.toLowerCase().includes(q.toLowerCase()))) &&
        (fRole === "all" || u.roleId === fRole) &&
        (fStatus === "all" || u.status === fStatus)
      )
      .sort((a, b) => {
        if (sortKey === "name") return sortDir * a.name.localeCompare(b.name);
        if (sortKey === "loginCount") return sortDir * (a.loginCount - b.loginCount);
        const av = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bv = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return sortDir * (av - bv);
      });
  }, [users, q, fRole, fStatus, sortKey, sortDir]);

  const toggleSort = (k: typeof sortKey) => { setSortKey(k); setSortDir(d => k === sortKey ? -d as 1 | -1 : 1); };

  const counts = { total: users.length, active: users.filter(u => u.status === "active").length, inactive: users.filter(u => u.status !== "active").length, mfa: users.filter(u => u.mfaEnabled).length };

  return (
    <div className="space-y-5 animate-in">
      {/* Stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users",    value: counts.total,    icon: "👥", color: "#2563eb", bg: "#eff6ff" },
          { label: "Active",         value: counts.active,   icon: "✅", color: "#16a34a", bg: "#f0fdf4" },
          { label: "Inactive/Susp.", value: counts.inactive, icon: "⏸",  color: "#64748b", bg: "#f8fafc" },
          { label: "MFA Enabled",    value: counts.mfa,      icon: "🔐", color: "#7c3aed", bg: "#f5f3ff" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: s.bg }}>{s.icon}</div>
            <div><p className="text-xs text-slate-400 font-semibold">{s.label}</p><p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, email, ID…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400" />
        </div>
        <select value={fRole} onChange={e => setFRole(e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
          <option value="all">All Roles</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={fStatus} onChange={e => setFStatus(e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white font-medium outline-none focus:ring-2 focus:ring-blue-500 text-slate-700">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
        <p className="text-xs text-slate-400 font-medium">{filtered.length} of {users.length}</p>
        <Btn variant="primary" onClick={onCreateUser}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          Add User
        </Btn>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  { k: "name" as const, l: "User" },
                  { k: null, l: "Role" },
                  { k: null, l: "Hospital" },
                  { k: null, l: "Status" },
                  { k: "lastLogin" as const, l: "Last Login" },
                  { k: "loginCount" as const, l: "Logins" },
                  { k: null, l: "MFA" },
                  { k: null, l: "" },
                ].map(col => (
                  <th key={col.l} onClick={() => col.k && toggleSort(col.k)}
                    className={cx("px-4 py-3.5 text-left text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap", col.k && "cursor-pointer hover:text-blue-600 transition-colors select-none")}>
                    {col.l}
                    {col.k && sortKey === col.k && <span className="ml-1 text-blue-500">{sortDir > 0 ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => {
                const role = roles.find(r => r.id === u.roleId);
                return (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={u.avatar} color={role?.color ?? "#64748b"} bg={role?.bg ?? "#f8fafc"} />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                          <p className="text-xs text-slate-300 font-mono">{u.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {role && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold"
                          style={{ color: role.color, background: role.bg }}>
                          {role.icon} {role.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700 text-xs font-medium max-w-[120px] leading-tight">{u.hospital}</p>
                      <p className="text-slate-400 text-xs">{u.department}</p>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{relTime(u.lastLogin)}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-700">{u.loginCount}</td>
                    <td className="px-4 py-3.5">
                      <span className={cx("text-xs font-bold px-2 py-0.5 rounded-full", u.mfaEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {u.mfaEnabled ? "✓ On" : "Off"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Btn variant="ghost" size="xs" onClick={() => onEditUser(u)}>Edit</Btn>
                        <Btn variant="warning" size="xs" onClick={() => onResetPwd(u)}>🔑</Btn>
                        <Btn variant={u.status === "active" ? "danger" : "success"} size="xs" onClick={() => onDeactivate(u)}>
                          {u.status === "active" ? "⊘" : "▶"}
                        </Btn>
                        <Btn variant="ghost" size="xs" onClick={() => onViewLogs(u)}>📋</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="py-20 text-center"><p className="text-5xl mb-3">👥</p><p className="text-slate-500 font-semibold">No users found</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION B — ROLES GRID
══════════════════════════════════════════════════════════════════════ */
function RolesTab({ roles, onCreateRole, onEditRole, onDeleteRole }: {
  roles: Role[]; onCreateRole: () => void; onEditRole: (r: Role) => void; onDeleteRole: (r: Role) => void;
}) {
  const [filter, setFilter] = useState<"all" | "system" | "custom">("all");
  const filtered = roles.filter(r => filter === "all" || r.type === filter);

  return (
    <div className="space-y-5 animate-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {[{ k: "all", l: "All" }, { k: "system", l: "System" }, { k: "custom", l: "Custom" }].map(t => (
            <button key={t.k} onClick={() => setFilter(t.k as typeof filter)}
              className={cx("px-4 py-2 rounded-lg text-sm font-bold transition-all", filter === t.k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-slate-400 font-medium self-center">{filtered.length} role{filtered.length !== 1 ? "s" : ""}</span>
          <Btn variant="primary" onClick={onCreateRole}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>
            Create Role
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(role => (
          <div key={role.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${role.color}, ${role.color}88)` }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: role.bg }}>{role.icon}</div>
                  <div>
                    <p className="font-black text-slate-900 leading-tight">{role.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-mono text-slate-400">{role.slug}</span>
                      {role.isSystem && <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">SYSTEM</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black" style={{ color: role.color }}>{role.userCount}</p>
                  <p className="text-xs text-slate-400">users</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">{role.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap gap-1">
                  {["low","medium","high","critical"].map(risk => {
                    const m = RISK_META[risk as Permission["risk"]];
                    const count = role.permissions.filter(pid => ALL_PERMISSIONS.find(p => p.id === pid)?.risk === risk).length;
                    if (!count) return null;
                    return <span key={risk} className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: m.color, background: m.bg }}>{count} {risk}</span>;
                  })}
                </div>
                <span className="text-xs font-semibold text-slate-400">{role.permissions.length} perms</span>
              </div>

              {/* Permission preview tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {role.permissions.slice(0, 5).map(pid => {
                  const p = ALL_PERMISSIONS.find(x => x.id === pid);
                  return p ? <span key={pid} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{p.module}</span> : null;
                }).filter((v, i, a) => a.findIndex(x => x?.key === (v as any)?.key) === i).slice(0, 4)}
                {role.permissions.length > 5 && <span className="text-xs text-slate-400 px-1.5 py-0.5">+more</span>}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-50">
                <Btn variant="secondary" size="sm" onClick={() => onEditRole(role)} full={role.isSystem} className="flex-1">
                  {role.isSystem ? "👁 View Permissions" : "✏️ Edit Role"}
                </Btn>
                {!role.isSystem && (
                  <Btn variant="danger" size="sm" onClick={() => onDeleteRole(role)}>🗑</Btn>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION C — PERMISSION MATRIX
══════════════════════════════════════════════════════════════════════ */
function MatrixTab({ roles }: { roles: Role[] }) {
  const [activeModule, setActiveModule] = useState("all");
  const [highlightRole, setHighlightRole] = useState<string | null>(null);
  const [highlightPerm, setHighlightPerm] = useState<string | null>(null);

  const perms = activeModule === "all" ? ALL_PERMISSIONS : ALL_PERMISSIONS.filter(p => p.module === activeModule);
  const displayRoles = roles.slice(0, 8);

  const has = (roleId: string, permId: string) => roles.find(r => r.id === roleId)?.permissions.includes(permId) ?? false;

  return (
    <div className="space-y-5 animate-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setActiveModule("all")}
            className={cx("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", activeModule === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-800")}>
            All Modules
          </button>
          {MODULES.map(m => (
            <button key={m} onClick={() => setActiveModule(m)}
              className={cx("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", activeModule === m ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:text-slate-800")}>
              {m}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 ml-auto">{perms.length} permissions · {displayRoles.length} roles</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white text-xs font-black">✓</span> Has permission</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-300 text-xs">—</span> No access</span>
        <span className="flex items-center gap-1.5 ml-2 font-semibold text-slate-700">Hover rows/cols to highlight · Click cell to inspect</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
          <table className="text-xs" style={{ minWidth: `${300 + displayRoles.length * 90}px` }}>
            <thead className="sticky top-0 z-20">
              <tr className="bg-white border-b-2 border-slate-100">
                <th className="px-4 py-4 text-left font-black text-slate-500 uppercase tracking-widest bg-white sticky left-0 z-30 border-r border-slate-100 w-52 min-w-[200px]">Permission</th>
                <th className="px-3 py-4 font-black text-slate-400 uppercase tracking-widest bg-white text-center w-24">Module</th>
                <th className="px-3 py-4 font-black text-slate-400 uppercase tracking-widest bg-white text-center w-20">Risk</th>
                {displayRoles.map(role => (
                  <th key={role.id} className={cx("px-3 py-3 text-center w-24 cursor-pointer transition-all", highlightRole === role.id ? "bg-blue-50" : "bg-white hover:bg-slate-50")}
                    onMouseEnter={() => setHighlightRole(role.id)} onMouseLeave={() => setHighlightRole(null)}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">{role.icon}</span>
                      <span className="font-black leading-tight text-slate-700 text-center" style={{ fontSize: "10px" }}>{role.name}</span>
                      <span className="text-slate-400 font-normal" style={{ fontSize: "9px" }}>{role.userCount}u</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perms.map((perm, pi) => (
                <tr key={perm.id}
                  className={cx("border-b border-slate-50 last:border-0 cursor-pointer transition-colors", highlightPerm === perm.id ? "bg-blue-50/50" : pi % 2 === 0 ? "bg-white" : "bg-slate-50/30", "hover:bg-blue-50/40")}
                  onMouseEnter={() => setHighlightPerm(perm.id)} onMouseLeave={() => setHighlightPerm(null)}>
                  <td className="px-4 py-3 sticky left-0 z-10 border-r border-slate-100" style={{ background: highlightPerm === perm.id ? "#eff6ff" : pi % 2 === 0 ? "white" : "#fafafa" }}>
                    <p className="font-bold text-slate-800 leading-tight">{perm.label}</p>
                    <p className="text-slate-400 font-mono leading-tight mt-0.5" style={{ fontSize: "10px" }}>{perm.key}</p>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-slate-500 font-medium">{perm.module}</span>
                  </td>
                  <td className="px-3 py-3 text-center"><RiskPill risk={perm.risk} /></td>
                  {displayRoles.map(role => {
                    const granted = has(role.id, perm.id);
                    return (
                      <td key={role.id} className={cx("px-3 py-3 text-center transition-all", highlightRole === role.id ? "bg-blue-50/60" : "")}>
                        <div className={cx("w-7 h-7 rounded-lg mx-auto flex items-center justify-center font-black text-sm transition-all", granted ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200" : "bg-slate-100 text-slate-300")}>
                          {granted ? "✓" : "—"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SECTION D — LOGIN LOGS
══════════════════════════════════════════════════════════════════════ */
function LogsTab({ logs, filterUserId, onClear }: { logs: LoginLog[]; filterUserId?: string; onClear?: () => void }) {
  const [fStatus, setFStatus] = useState<"all" | LoginLog["status"]>("all");
  const [q, setQ] = useState("");

  const filtered = logs.filter(l =>
    (fStatus === "all" || l.status === fStatus) &&
    (!q || [l.userName, l.ip, l.location, l.browser].some(s => s.toLowerCase().includes(q.toLowerCase()))) &&
    (!filterUserId || l.userId === filterUserId)
  );

  const counts = { total: logs.length, success: logs.filter(l => l.status === "success").length, failed: logs.filter(l => l.status === "failed").length, blocked: logs.filter(l => l.status === "blocked").length };

  return (
    <div className="space-y-5 animate-in">
      {filterUserId && (
        <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-800">🔍 Showing logs for: <strong>{logs.find(l => l.userId === filterUserId)?.userName ?? filterUserId}</strong></p>
          <Btn variant="ghost" size="xs" onClick={onClear}>✕ Show all</Btn>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: counts.total,   icon: "📋", color: "#2563eb", bg: "#eff6ff" },
          { label: "Success",      value: counts.success, icon: "✅", color: "#16a34a", bg: "#f0fdf4" },
          { label: "Failed",       value: counts.failed,  icon: "✕",  color: "#dc2626", bg: "#fef2f2" },
          { label: "Blocked",      value: counts.blocked, icon: "⊘",  color: "#92400e", bg: "#fffbeb" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: s.bg }}>{s.icon}</div>
            <div><p className="text-xs text-slate-400 font-semibold">{s.label}</p><p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by user, IP, location…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400" />
        </div>
        <div className="flex gap-1.5">
          {(["all","success","failed","blocked"] as const).map(s => (
            <button key={s} onClick={() => setFStatus(s)}
              className={cx("px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize",
                fStatus === s ? s === "success" ? "bg-emerald-500 text-white" : s === "failed" ? "bg-red-500 text-white" : s === "blocked" ? "bg-amber-500 text-white" : "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>
              {s}
            </button>
          ))}
        </div>
        <Btn variant="secondary" size="sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Export
        </Btn>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["User", "Role", "Status", "IP Address", "Device / Browser", "Location", "Time", "Reason"].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(log => (
                <tr key={log.id} className={cx("transition-colors", log.status === "blocked" ? "bg-amber-50/40 hover:bg-amber-50/80" : log.status === "failed" ? "bg-red-50/30 hover:bg-red-50/60" : "hover:bg-slate-50")}>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">{log.userName}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{log.userRole}</td>
                  <td className="px-4 py-3.5"><LogBadge status={log.status} /></td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{log.ip}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{log.device} · {log.browser}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{log.location}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">{fmtDate(log.timestamp)}</td>
                  <td className="px-4 py-3.5 text-xs text-red-500">{log.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="py-20 text-center"><p className="text-5xl mb-3">📋</p><p className="text-slate-500 font-semibold">No logs found</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: CREATE / EDIT USER
══════════════════════════════════════════════════════════════════════ */
interface UserForm { name: string; email: string; phone: string; roleId: string; hospital: string; department: string; employeeId: string; password: string; confirmPwd: string; }
const emptyUserForm = (roles: Role[]): UserForm => ({ name: "", email: "", phone: "", roleId: roles[2]?.id ?? "", hospital: "", department: "", employeeId: "", password: "", confirmPwd: "" });

function UserFormModal({ open, onClose, roles, user, onSave }: { open: boolean; onClose: () => void; roles: Role[]; user?: User; onSave: (f: UserForm) => void }) {
  const isEdit = !!user;
  const [f, setF] = useState<UserForm>(user ? { name: user.name, email: user.email, phone: user.phone, roleId: user.roleId, hospital: user.hospital, department: user.department, employeeId: user.employeeId, password: "", confirmPwd: "" } : emptyUserForm(roles));
  const [showPwd, setShowPwd] = useState(false);
  const up = (k: keyof UserForm) => (v: string) => setF(p => ({ ...p, [k]: v }));

  useEffect(() => { if (open) setF(user ? { name: user.name, email: user.email, phone: user.phone, roleId: user.roleId, hospital: user.hospital, department: user.department, employeeId: user.employeeId, password: "", confirmPwd: "" } : emptyUserForm(roles)); }, [open]);

  const selectedRole = roles.find(r => r.id === f.roleId);
  const HOSPITALS = ["Platform (Global)", "City General Hospital", "Apollo Diagnostics", "PathCare Labs", "MedCity Hospital", "LifeCare Clinic"];

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `Edit — ${user!.name}` : "Create New User"} subtitle={isEdit ? "Update user details and role assignment" : "Fill in details to create a new account"} size="2xl"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant={isEdit ? "primary" : "success"} onClick={() => { onSave(f); onClose(); }}>
            {isEdit ? "✓ Save Changes" : "✓ Create User & Send Invite"}
          </Btn>
        </>
      }>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — Role Picker */}
        <div className="md:col-span-1">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Assign Role</p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {roles.map(role => (
              <label key={role.id} className={cx("flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all", f.roleId === role.id ? "border-blue-500 shadow-sm" : "border-slate-100 hover:border-slate-200")}
                style={{ background: f.roleId === role.id ? role.bg : "white" }}>
                <input type="radio" name="role" value={role.id} checked={f.roleId === role.id} onChange={() => up("roleId")(role.id)} className="sr-only" />
                <span className="text-xl flex-shrink-0">{role.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-tight truncate">{role.name}</p>
                  <p className="text-xs text-slate-400">{role.permissions.length} perms</p>
                </div>
                {f.roleId === role.id && <span className="font-black flex-shrink-0" style={{ color: role.color }}>✓</span>}
              </label>
            ))}
          </div>
          {selectedRole && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: selectedRole.bg, border: `1px solid ${selectedRole.color}33` }}>
              <p className="text-xs font-bold mb-1" style={{ color: selectedRole.color }}>Selected: {selectedRole.name}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedRole.description}</p>
            </div>
          )}
        </div>

        {/* Right — User Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required><input className={inp} value={f.name} onChange={e => up("name")(e.target.value)} placeholder="Dr. John Smith" /></Field>
            <Field label="Employee ID"><input className={inp} value={f.employeeId} onChange={e => up("employeeId")(e.target.value)} placeholder="EMP-XXX" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" required><input type="email" className={inp} value={f.email} onChange={e => up("email")(e.target.value)} placeholder="user@hospital.com" /></Field>
            <Field label="Phone"><input className={inp} value={f.phone} onChange={e => up("phone")(e.target.value)} placeholder="+91 98765 43210" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Hospital / Org" required>
              <select className={inp} value={f.hospital} onChange={e => up("hospital")(e.target.value)}>
                <option value="">Select hospital…</option>
                {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </Field>
            <Field label="Department"><input className={inp} value={f.department} onChange={e => up("department")(e.target.value)} placeholder="e.g., Cardiology" /></Field>
          </div>
          {!isEdit && (
            <>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Initial Password</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Temporary Password" required hint="Must be 8+ characters">
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} className={inp} value={f.password} onChange={e => up("password")(e.target.value)} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">{showPwd ? "🙈" : "👁️"}</button>
                  </div>
                </Field>
                <Field label="Confirm Password" required>
                  <input type={showPwd ? "text" : "password"} className={cx(inp, f.confirmPwd && f.password !== f.confirmPwd && "border-red-400 focus:ring-red-500")} value={f.confirmPwd} onChange={e => up("confirmPwd")(e.target.value)} placeholder="••••••••" />
                  {f.confirmPwd && f.password !== f.confirmPwd && <p className="text-xs text-red-500 mt-1 font-semibold">Passwords do not match</p>}
                </Field>
              </div>
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex gap-2">
                <span>📧</span>
                <p>An invitation email with login credentials will be sent to <strong>{f.email || "the provided email"}</strong>. User must change password on first login.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: CREATE / EDIT ROLE
══════════════════════════════════════════════════════════════════════ */
interface RoleForm { name: string; slug: string; description: string; color: string; icon: string; permissions: string[]; }

const ROLE_COLORS = [
  { color: "#2563eb", bg: "#eff6ff", label: "Blue" },
  { color: "#6d28d9", bg: "#f5f3ff", label: "Violet" },
  { color: "#0891b2", bg: "#ecfeff", label: "Cyan" },
  { color: "#059669", bg: "#ecfdf5", label: "Green" },
  { color: "#d97706", bg: "#fffbeb", label: "Amber" },
  { color: "#db2777", bg: "#fdf2f8", label: "Pink" },
  { color: "#dc2626", bg: "#fef2f2", label: "Red" },
  { color: "#64748b", bg: "#f8fafc", label: "Slate" },
];

const ROLE_ICONS = ["👑","🏥","👨‍⚕️","👩‍⚕️","💁","💊","🧪","📊","🔍","📈","🔧","🛡️","⚙️","📋","🔐","🎯"];

function RoleFormModal({ open, onClose, role, onSave }: { open: boolean; onClose: () => void; role?: Role; onSave: (f: RoleForm) => void }) {
  const isEdit = !!role;
  const [f, setF] = useState<RoleForm>(role ? { name: role.name, slug: role.slug, description: role.description, color: role.color, icon: role.icon, permissions: [...role.permissions] }
    : { name: "", slug: "", description: "", color: "#2563eb", icon: "🔧", permissions: [] });
  const [activeModule, setActiveModule] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) setF(role ? { name: role.name, slug: role.slug, description: role.description, color: role.color, icon: role.icon, permissions: [...role.permissions] }
      : { name: "", slug: "", description: "", color: "#2563eb", icon: "🔧", permissions: [] });
    setActiveModule("all"); setSearch("");
  }, [open]);

  const up = (k: keyof RoleForm) => (v: string) => setF(p => ({ ...p, [k]: v, ...(k === "name" && !isEdit ? { slug: v.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") } : {}) }));

  const togglePerm = (pid: string) => setF(p => ({ ...p, permissions: p.permissions.includes(pid) ? p.permissions.filter(x => x !== pid) : [...p.permissions, pid] }));

  const toggleModule = (module: string) => {
    const modulePerms = ALL_PERMISSIONS.filter(p => p.module === module).map(p => p.id);
    const allSelected = modulePerms.every(pid => f.permissions.includes(pid));
    setF(p => ({ ...p, permissions: allSelected ? p.permissions.filter(pid => !modulePerms.includes(pid)) : [...new Set([...p.permissions, ...modulePerms])] }));
  };

  const visiblePerms = ALL_PERMISSIONS.filter(p =>
    (activeModule === "all" || p.module === activeModule) &&
    (!search || p.label.toLowerCase().includes(search.toLowerCase()) || p.key.toLowerCase().includes(search.toLowerCase()))
  );

  const viewOnly = role?.isSystem;

  return (
    <Modal open={open} onClose={onClose}
      title={viewOnly ? `${role!.name} — Permissions` : isEdit ? `Edit Role — ${role!.name}` : "Create New Role"}
      subtitle={viewOnly ? "System roles are read-only. Clone to customize." : "Configure role details and assign granular permissions"}
      size="3xl"
      footer={
        <>
          {viewOnly && <Btn variant="secondary" onClick={onClose}>Close</Btn>}
          {!viewOnly && <><Btn variant="secondary" onClick={onClose}>Cancel</Btn><Btn variant={isEdit ? "primary" : "success"} onClick={() => { onSave(f); onClose(); }}>✓ {isEdit ? "Save Role" : "Create Role"}</Btn></>}
        </>
      }>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Role meta */}
        <div className="lg:col-span-2 space-y-4">
          <Field label="Role Name" required>
            <input className={inp} value={f.name} onChange={e => up("name")(e.target.value)} placeholder="e.g., Senior Doctor" disabled={viewOnly} />
          </Field>
          <Field label="Slug" hint="Auto-generated. Used in API.">
            <input className={cx(inp, "font-mono")} value={f.slug} onChange={e => up("slug")(e.target.value)} placeholder="senior_doctor" disabled={viewOnly} />
          </Field>
          <Field label="Description">
            <textarea className={cx(inp, "h-20 resize-none")} value={f.description} onChange={e => up("description")(e.target.value)} placeholder="What does this role do?" disabled={viewOnly} />
          </Field>

          {!viewOnly && (
            <>
              <Field label="Role Icon">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ROLE_ICONS.map(ic => (
                    <button key={ic} onClick={() => up("icon")(ic)}
                      className={cx("w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all", f.icon === ic ? "ring-2 ring-blue-500 shadow-md scale-110" : "bg-slate-100 hover:bg-slate-200")}>
                      {ic}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Role Color">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ROLE_COLORS.map(c => (
                    <button key={c.color} onClick={() => setF(p => ({ ...p, color: c.color }))}
                      className={cx("w-8 h-8 rounded-lg transition-all", f.color === c.color ? "ring-2 ring-offset-2 ring-slate-600 scale-110 shadow-md" : "hover:scale-105")}
                      style={{ background: c.color }} title={c.label} />
                  ))}
                </div>
              </Field>
            </>
          )}

          {/* Preview card */}
          <div className="rounded-2xl border-2 p-4 transition-all" style={{ borderColor: f.color + "44", background: ROLE_COLORS.find(c => c.color === f.color)?.bg ?? "#f8fafc" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "white" }}>{f.icon}</div>
              <div>
                <p className="font-black text-slate-900 text-sm">{f.name || "Role Name"}</p>
                <p className="text-xs font-mono text-slate-400">{f.slug || "role_slug"}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">{f.description || "Role description…"}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: f.color }}>{f.permissions.length} permissions</span>
            </div>
          </div>
        </div>

        {/* Right — Permission picker */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Permissions <span className="text-blue-600 font-black">({f.permissions.length} selected)</span></p>
            {!viewOnly && <Btn variant="ghost" size="xs" onClick={() => setF(p => ({ ...p, permissions: f.permissions.length === ALL_PERMISSIONS.length ? [] : ALL_PERMISSIONS.map(p => p.id) }))}>
              {f.permissions.length === ALL_PERMISSIONS.length ? "Deselect All" : "Select All"}
            </Btn>}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search permissions…"
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400" />
          </div>

          {/* Module tabs */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            <button onClick={() => setActiveModule("all")} className={cx("px-2.5 py-1 rounded-lg text-xs font-bold transition-all", activeModule === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>All</button>
            {MODULES.map(m => {
              const total = ALL_PERMISSIONS.filter(p => p.module === m).length;
              const selected = ALL_PERMISSIONS.filter(p => p.module === m && f.permissions.includes(p.id)).length;
              return (
                <button key={m} onClick={() => setActiveModule(m)}
                  className={cx("px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1", activeModule === m ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>
                  {m}
                  {selected > 0 && <span className={cx("w-4 h-4 rounded-full text-xs flex items-center justify-center font-black", activeModule === m ? "bg-white text-blue-600" : "bg-blue-600 text-white")}>{selected}</span>}
                </button>
              );
            })}
          </div>

          {/* Permission list */}
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
            {MODULES.filter(m => activeModule === "all" || activeModule === m).map(module => {
              const modPerms = visiblePerms.filter(p => p.module === module);
              if (!modPerms.length) return null;
              const allSelected = modPerms.every(p => f.permissions.includes(p.id));
              return (
                <div key={module}>
                  <div className="flex items-center justify-between py-1.5 px-2 mb-1">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider">{module}</p>
                    {!viewOnly && (
                      <button onClick={() => toggleModule(module)} className="text-xs text-blue-600 hover:underline font-semibold">
                        {allSelected ? "Deselect all" : "Select all"}
                      </button>
                    )}
                  </div>
                  {modPerms.map(perm => {
                    const checked = f.permissions.includes(perm.id);
                    return (
                      <label key={perm.id} className={cx("flex items-center gap-3 p-2.5 rounded-xl transition-all mb-1", viewOnly ? "cursor-default" : "cursor-pointer", checked ? "bg-blue-50 border border-blue-200" : "bg-white border border-transparent hover:bg-slate-50 hover:border-slate-200")}>
                        <div className={cx("w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0", checked ? "border-blue-500 bg-blue-500" : "border-slate-300")}>
                          {checked && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6L9 17l-5-5"/></svg>}
                        </div>
                        {!viewOnly && <input type="checkbox" checked={checked} onChange={() => togglePerm(perm.id)} className="sr-only" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-800 leading-tight">{perm.label}</p>
                            <RiskPill risk={perm.risk} />
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-tight">{perm.description}</p>
                          <p className="text-xs font-mono text-slate-300 mt-0.5" style={{ fontSize: "10px" }}>{perm.key}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: RESET PASSWORD
══════════════════════════════════════════════════════════════════════ */
function ResetPasswordModal({ open, onClose, user, onReset }: { open: boolean; onClose: () => void; user: User | null; onReset: () => void }) {
  const [mode, setMode] = useState<"generate" | "manual">("generate");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [sent, setSent] = useState(false);

  const generate = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    setPwd(Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };

  useEffect(() => { if (open) { setSent(false); setPwd(""); } }, [open]);

  if (!user) return null;
  return (
    <Modal open={open} onClose={onClose} title="Reset Password" subtitle={`Force-reset password for ${user.name}`} size="md"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{sent ? "Close" : "Cancel"}</Btn>
          {!sent && <Btn variant="warning" onClick={() => { onReset(); setSent(true); }}>🔑 Reset Password</Btn>}
        </>
      }>
      {sent ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl mx-auto mb-4">✅</div>
          <p className="font-black text-slate-900 text-lg">Password Reset!</p>
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">A password reset link has been sent to <strong>{user.email}</strong>. The user must change their password on next login.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center">{user.avatar}</div>
            <div>
              <p className="font-black text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">Last changed: {user.passwordLastChanged}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode("generate")} className={cx("flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all", mode === "generate" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
              🎲 Auto-generate
            </button>
            <button onClick={() => setMode("manual")} className={cx("flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all", mode === "manual" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
              ✏️ Set manually
            </button>
          </div>

          {mode === "generate" ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input value={pwd} readOnly className={cx(inp, "font-mono flex-1")} placeholder="Click generate…" />
                <Btn variant="secondary" size="md" onClick={generate}>Generate</Btn>
              </div>
              {pwd && <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg"><span>✓</span> Password generated. Will be sent to user's email.</div>}
            </div>
          ) : (
            <Field label="New Password" required hint="Minimum 8 characters with mixed case and numbers">
              <div className="relative">
                <input type={showPwd ? "text" : "password"} className={inp} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPwd ? "🙈" : "👁️"}</button>
              </div>
            </Field>
          )}

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex gap-2">
            <span className="flex-shrink-0">⚠️</span>
            <p>The user will be logged out of all active sessions. They must change this temporary password on next login.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: DEACTIVATE / SUSPEND
══════════════════════════════════════════════════════════════════════ */
function DeactivateModal({ open, onClose, user, onConfirm }: { open: boolean; onClose: () => void; user: User | null; onConfirm: (action: "deactivate" | "suspend" | "activate") => void }) {
  const [reason, setReason] = useState("");
  if (!user) return null;
  const isActive = user.status === "active";
  return (
    <Modal open={open} onClose={onClose} title={isActive ? "Deactivate / Suspend User" : "Activate User"} subtitle={isActive ? "Block login access for this user" : "Restore login access"} size="md"
      footer={<><Btn variant="secondary" onClick={onClose}>Cancel</Btn>{isActive ? (<><Btn variant="warning" onClick={() => { onConfirm("suspend"); onClose(); }}>⊘ Suspend</Btn><Btn variant="danger" onClick={() => { onConfirm("deactivate"); onClose(); }}>🚫 Deactivate</Btn></>) : (<Btn variant="success" onClick={() => { onConfirm("activate"); onClose(); }}>▶ Activate</Btn>)}</>}>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center">{user.avatar}</div>
          <div>
            <p className="font-black text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
            <StatusBadge status={user.status} />
          </div>
        </div>
        {isActive && (
          <>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-black text-amber-800">⊘ Suspend</p>
                <p className="text-amber-700 text-xs mt-1">Temporarily blocks access. Can be reversed. Account data preserved.</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="font-black text-red-800">🚫 Deactivate</p>
                <p className="text-red-700 text-xs mt-1">Marks inactive. Requires admin to reactivate manually.</p>
              </div>
            </div>
            <Field label="Reason (optional)">
              <textarea className={cx(inp, "h-20 resize-none")} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Staff on leave, compliance hold…" />
            </Field>
            <p className="text-xs text-slate-400">⚠ User will be immediately logged out of all active sessions.</p>
          </>
        )}
        {!isActive && <p className="text-sm text-slate-600">Activating <strong>{user.name}</strong> will restore their login access immediately. All previous role and permission assignments will be retained.</p>}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL: DELETE ROLE CONFIRM
══════════════════════════════════════════════════════════════════════ */
function DeleteRoleModal({ open, onClose, role, onConfirm }: { open: boolean; onClose: () => void; role: Role | null; onConfirm: () => void }) {
  const [typed, setTyped] = useState("");
  useEffect(() => { if (open) setTyped(""); }, [open]);
  if (!role) return null;
  return (
    <Modal open={open} onClose={onClose} title="Delete Role?" subtitle="This action cannot be undone" size="md"
      footer={<><Btn variant="secondary" onClick={onClose}>Cancel</Btn><Btn variant="danger" disabled={typed !== role.name} onClick={() => { onConfirm(); onClose(); }}>🗑 Delete Role</Btn></>}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: role.bg }}>
          <span className="text-2xl">{role.icon}</span>
          <div>
            <p className="font-black text-slate-900">{role.name}</p>
            <p className="text-xs text-slate-500">{role.userCount} users assigned · {role.permissions.length} permissions</p>
          </div>
        </div>
        {role.userCount > 0 && <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex gap-2"><span>⚠️</span><p><strong>{role.userCount} users</strong> are assigned to this role. They must be reassigned before deletion.</p></div>}
        <Field label={`Type "${role.name}" to confirm`} required>
          <input className={inp} value={typed} onChange={e => setTyped(e.target.value)} placeholder={role.name} />
        </Field>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════════════════ */
export default function UserRoleManagement() {
  const [tab, setTab] = useState<MainTab>("users");
  const [users, setUsers] = useState<User[]>(USERS_SEED);
  const [roles, setRoles] = useState<Role[]>(ROLES_SEED);
  const [logs]  = useState<LoginLog[]>(LOGIN_LOGS_SEED);

  // Modal states
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | undefined>();
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | undefined>();
  const [resetPwdUser, setResetPwdUser] = useState<User | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<User | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [logFilterUser, setLogFilterUser] = useState<string | undefined>();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };

  const handleSaveUser = (f: any) => {
    if (editUser) {
      setUsers(us => us.map(u => u.id === editUser.id ? { ...u, name: f.name, email: f.email, phone: f.phone, roleId: f.roleId, hospital: f.hospital, department: f.department, employeeId: f.employeeId } : u));
      showToast(`${f.name} updated successfully`);
    } else {
      const newUser: User = { id: `u${Date.now()}`, name: f.name, email: f.email, phone: f.phone, roleId: f.roleId, hospital: f.hospital, department: f.department, status: "pending", avatar: f.name.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase(), employeeId: f.employeeId || `EMP-${Date.now().toString().slice(-4)}`, createdAt: new Date().toISOString().slice(0,10), lastLogin: null, loginCount: 0, mfaEnabled: false, passwordLastChanged: new Date().toISOString().slice(0,10) };
      setUsers(us => [newUser, ...us]);
      showToast(`${f.name} created! Invitation sent to ${f.email}`);
    }
    setEditUser(undefined);
  };

  const handleSaveRole = (f: any) => {
    if (editRole && !editRole.isSystem) {
      setRoles(rs => rs.map(r => r.id === editRole.id ? { ...r, ...f } : r));
      showToast(`Role "${f.name}" updated`);
    } else if (!editRole) {
      const newRole: Role = { id: `r${Date.now()}`, ...f, type: "custom", userCount: 0, createdAt: new Date().toISOString().slice(0,10) };
      setRoles(rs => [...rs, newRole]);
      showToast(`Role "${f.name}" created`);
    }
    setEditRole(undefined);
  };

  const handleDeactivate = (action: "deactivate" | "suspend" | "activate") => {
    if (!deactivateUser) return;
    const next: UserStatus = action === "activate" ? "active" : action === "suspend" ? "suspended" : "inactive";
    setUsers(us => us.map(u => u.id === deactivateUser.id ? { ...u, status: next } : u));
    showToast(`${deactivateUser.name} ${action === "activate" ? "activated" : action + "d"} successfully`, action === "activate");
    setDeactivateUser(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes modalUp { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .animate-in { animation: slideUp .28s ease-out; }
      `}</style>

      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div className="max-w-screen-2xl mx-auto px-4 py-8 space-y-6">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic" }}>
                User &amp; Role Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">Manage platform users, roles, permissions, and access audit logs</p>
            </div>
            <div className="flex gap-2">
              {tab === "users" && <Btn variant="primary" onClick={() => { setEditUser(undefined); setUserFormOpen(true); }}>+ Add User</Btn>}
              {tab === "roles" && <Btn variant="primary" onClick={() => { setEditRole(undefined); setRoleFormOpen(true); }}>+ Create Role</Btn>}
            </div>
          </div>

          {/* Main tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-2xl p-1.5 w-fit">
            {MAIN_TABS.map(t => (
              <button key={t.key} onClick={() => { setTab(t.key); setLogFilterUser(undefined); }}
                className={cx("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800")}>
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "users" && (
            <UsersTab
              users={users} roles={roles}
              onCreateUser={() => { setEditUser(undefined); setUserFormOpen(true); }}
              onEditUser={u => { setEditUser(u); setUserFormOpen(true); }}
              onDeactivate={u => setDeactivateUser(u)}
              onResetPwd={u => setResetPwdUser(u)}
              onViewLogs={u => { setLogFilterUser(u.id); setTab("logs"); }}
            />
          )}
          {tab === "roles" && (
            <RolesTab
              roles={roles}
              onCreateRole={() => { setEditRole(undefined); setRoleFormOpen(true); }}
              onEditRole={r => { setEditRole(r); setRoleFormOpen(true); }}
              onDeleteRole={r => setDeleteRole(r)}
            />
          )}
          {tab === "matrix" && <MatrixTab roles={roles} />}
          {tab === "logs"   && <LogsTab logs={logs} filterUserId={logFilterUser} onClear={() => setLogFilterUser(undefined)} />}
        </div>
      </div>

      {/* Modals */}
      <UserFormModal open={userFormOpen} onClose={() => { setUserFormOpen(false); setEditUser(undefined); }} roles={roles} user={editUser} onSave={handleSaveUser} />
      <RoleFormModal open={roleFormOpen} onClose={() => { setRoleFormOpen(false); setEditRole(undefined); }} role={editRole} onSave={handleSaveRole} />
      <ResetPasswordModal open={!!resetPwdUser} onClose={() => setResetPwdUser(null)} user={resetPwdUser} onReset={() => showToast(`Password reset for ${resetPwdUser?.name}`)} />
      <DeactivateModal open={!!deactivateUser} onClose={() => setDeactivateUser(null)} user={deactivateUser} onConfirm={handleDeactivate} />
      <DeleteRoleModal open={!!deleteRole} onClose={() => setDeleteRole(null)} role={deleteRole}
        onConfirm={() => { setRoles(rs => rs.filter(r => r.id !== deleteRole!.id)); showToast(`Role "${deleteRole!.name}" deleted`, false); setDeleteRole(null); }} />

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </>
  );
}
import { useState } from "react";

const patientData = {
  name: "Sophia Hartwell",
  age: 34,
  bloodType: "A+",
  patientId: "MRN-20419-HW",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=b6e3f4",
  allergies: ["Penicillin", "Latex", "Shellfish"],
  conditions: ["Type 2 Diabetes", "Hypertension"],
  lastVisit: "Feb 14, 2026",
  primaryDoctor: "Dr. Elaine Morrow",
};

type AppointmentStatus = "confirmed" | "pending" | "cancelled";

const appointments: Array<{ id: number; doctor: string; specialty: string; date: string; time: string; status: AppointmentStatus; avatar: string }> = [
  { id: 1, doctor: "Dr. Elaine Morrow", specialty: "General Practice", date: "Mar 10, 2026", time: "10:30 AM", status: "confirmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elaine" },
  { id: 2, doctor: "Dr. Kevin Patel", specialty: "Endocrinology", date: "Mar 18, 2026", time: "2:00 PM", status: "pending", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin" },
  { id: 3, doctor: "Dr. Sandra Wu", specialty: "Cardiology", date: "Apr 2, 2026", time: "9:00 AM", status: "confirmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandra" },
];

const prescriptions = [
  { id: 1, name: "Metformin 500mg", doctor: "Dr. Elaine Morrow", date: "Feb 14, 2026", refills: 3, color: "#0d9488" },
  { id: 2, name: "Lisinopril 10mg", doctor: "Dr. Sandra Wu", date: "Jan 30, 2026", refills: 5, color: "#7c3aed" },
  { id: 3, name: "Atorvastatin 20mg", doctor: "Dr. Kevin Patel", date: "Jan 10, 2026", refills: 2, color: "#0369a1" },
];

const bills = [
  { id: 1, service: "Cardiology Consultation", date: "Jan 30, 2026", due: "Mar 15, 2026", amount: 240.0, urgent: true },
  { id: 2, service: "Lab Work — Comprehensive Panel", date: "Feb 14, 2026", due: "Mar 28, 2026", amount: 87.5, urgent: false },
  { id: 3, service: "ECG Stress Test", date: "Feb 5, 2026", due: "Apr 5, 2026", amount: 315.0, urgent: false },
];

const notifications = [
  { id: 1, type: "appointment", icon: "📅", message: "Appointment with Dr. Morrow confirmed for Mar 10", time: "2h ago", unread: true },
  { id: 2, type: "lab", icon: "🧪", message: "Lab results for HbA1c are ready to view", time: "Yesterday", unread: true },
  { id: 3, type: "payment", icon: "💳", message: "Payment of $240 due in 11 days for Cardiology", time: "2 days ago", unread: false },
  { id: 4, type: "message", icon: "💬", message: "Dr. Patel sent you a message about your insulin levels", time: "3 days ago", unread: false },
  { id: 5, type: "appointment", icon: "📅", message: "Reminder: Annual physical due this quarter", time: "1 week ago", unread: false },
];

const statusStyles: Record<AppointmentStatus, string> = {
  confirmed: "bg-teal-50 text-teal-700 border border-teal-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

function WelcomeCard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="relative overflow-hidden rounded-2xl bg-blue-500 p-6 text-white shadow-xl col-span-full">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
      <div className="relative flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg bg-teal-500 flex-shrink-0">
          <img src={patientData.photo} alt={patientData.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-teal-200 text-sm font-medium tracking-wide uppercase">{greeting}</p>
          <h1 className="text-2xl font-bold text-white mt-0.5 truncate">{patientData.name}</h1>
          <p className="text-teal-200/80 text-sm mt-1">{patientData.patientId} · Primary: {patientData.primaryDoctor}</p>
        </div>
        <div className="hidden sm:flex gap-4 text-center">
          <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
            <p className="text-xs text-teal-200">Age</p>
            <p className="text-xl font-bold">{patientData.age}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
            <p className="text-xs text-teal-200">Blood</p>
            <p className="text-xl font-bold">{patientData.bloodType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentsCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 text-base">Upcoming Appointments</h2>
        <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">View all →</button>
      </div>
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <img src={apt.avatar} alt={apt.doctor} className="w-10 h-10 rounded-xl bg-teal-100 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm truncate">{apt.doctor}</p>
              <p className="text-xs text-slate-500 truncate">{apt.specialty}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-medium text-slate-700">{apt.date}</p>
              <p className="text-xs text-slate-500">{apt.time}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ml-1 ${statusStyles[apt.status]}`}>{apt.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrescriptionsCard() {
  const [downloaded, setDownloaded] = useState<number | null>(null);
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 text-base">Recent Prescriptions</h2>
        <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">View all →</button>
      </div>
      <div className="space-y-3">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
            <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: rx.color }} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm">{rx.name}</p>
              <p className="text-xs text-slate-500">{rx.doctor} · {rx.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">{rx.refills} refills</span>
              <button
                onClick={() => { setDownloaded(rx.id); setTimeout(() => setDownloaded(null), 2000); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                title="Download"
              >
                {downloaded === rx.id ? (
                  <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillsCard() {
  const total = bills.reduce((s, b) => s + b.amount, 0);
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-slate-800 text-base">Outstanding Bills</h2>
        <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-0.5 font-medium">${total.toFixed(2)} due</span>
      </div>
      <p className="text-xs text-slate-400 mb-4">{bills.length} unpaid invoices</p>
      <div className="space-y-3">
        {bills.map((bill) => (
          <div key={bill.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${bill.urgent ? "bg-red-400" : "bg-amber-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm">{bill.service}</p>
              <p className="text-xs text-slate-500">Due {bill.due}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-slate-800 text-sm">${bill.amount.toFixed(2)}</p>
              <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">Pay now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsCard() {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter(n => n.unread).length;
  const markAllRead = () => setItems(items.map(n => ({ ...n, unread: false })));
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-800 text-base">Notifications</h2>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-teal-600 hover:text-teal-700 font-medium">Mark all read</button>}
      </div>
      <div className="space-y-2">
        {items.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${n.unread ? "bg-teal-50/60" : "bg-slate-50"}`}>
            <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.unread ? "text-slate-800 font-medium" : "text-slate-600"}`}>{n.message}</p>
              <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthSummaryCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 text-base">Health Summary</h2>
        <span className="text-xs text-slate-400">Updated Feb 14, 2026</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-3">
          <p className="text-xs text-teal-600 font-medium uppercase tracking-wide mb-1">Last Visit</p>
          <p className="font-semibold text-slate-800 text-sm">{patientData.lastVisit}</p>
          <p className="text-xs text-slate-500">Dr. Elaine Morrow</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 p-3">
          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Primary Doctor</p>
          <p className="font-semibold text-slate-800 text-sm">Dr. Morrow</p>
          <p className="text-xs text-slate-500">General Practice</p>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Chronic Conditions</p>
        <div className="flex flex-wrap gap-2">
          {patientData.conditions.map((c) => (
            <span key={c} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 font-medium">{c}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Known Allergies</p>
        <div className="flex flex-wrap gap-2">
          {patientData.allergies.map((a) => (
            <span key={a} className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 font-medium flex items-center gap-1">
              <span>⚠</span> {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

   

      {/* Dashboard Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
        <WelcomeCard />
        <AppointmentsCard />
        <PrescriptionsCard />
        <HealthSummaryCard />
        <BillsCard />
        <NotificationsCard />
      </main>
    </div>
  );
}



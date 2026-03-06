import { useState, useEffect } from "react";

/* ─── DATA ─────────────────────────────────────────────── */
const DEPARTMENTS = [
  { id: "cardio",   label: "Cardiology",       icon: "🫀", color: "#e11d48", bg: "#fff1f2" },
  { id: "neuro",    label: "Neurology",         icon: "🧠", color: "#7c3aed", bg: "#f5f3ff" },
  { id: "ortho",    label: "Orthopedics",       icon: "🦴", color: "#0369a1", bg: "#f0f9ff" },
  { id: "dermato",  label: "Dermatology",       icon: "✨", color: "#b45309", bg: "#fffbeb" },
  { id: "endo",     label: "Endocrinology",     icon: "🔬", color: "#0d9488", bg: "#f0fdfa" },
  { id: "general",  label: "General Practice",  icon: "🩺", color: "#15803d", bg: "#f0fdf4" },
  { id: "pulmo",    label: "Pulmonology",       icon: "🫁", color: "#1d4ed8", bg: "#eff6ff" },
  { id: "gastro",   label: "Gastroenterology",  icon: "💊", color: "#9333ea", bg: "#fdf4ff" },
];

const DOCTORS = [
  { id: 1, name: "Dr. Elaine Morrow",   dept: "general",  exp: 14, rating: 4.9, reviews: 312, fee: 150, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elaine&backgroundColor=b6e3f4",   next: "Today" },
  { id: 2, name: "Dr. Kevin Patel",     dept: "endo",     exp: 10, rating: 4.8, reviews: 198, fee: 200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede",   next: "Tomorrow" },
  { id: 3, name: "Dr. Sandra Wu",       dept: "cardio",   exp: 18, rating: 4.9, reviews: 427, fee: 250, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandra&backgroundColor=d1d4f9",  next: "Mar 8" },
  { id: 4, name: "Dr. James Okafor",   dept: "neuro",    exp: 12, rating: 4.7, reviews: 241, fee: 220, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=ffd5dc",   next: "Mar 10" },
  { id: 5, name: "Dr. Priya Sharma",   dept: "ortho",    exp: 9,  rating: 4.8, reviews: 176, fee: 180, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=c1f4c5",   next: "Mar 9" },
  { id: 6, name: "Dr. Luca Romano",    dept: "dermato",  exp: 7,  rating: 4.6, reviews: 154, fee: 160, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luca&backgroundColor=ffe4bc",    next: "Today" },
  { id: 7, name: "Dr. Fatima Al-Amin", dept: "pulmo",    exp: 11, rating: 4.9, reviews: 288, fee: 190, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima&backgroundColor=ffd5dc",  next: "Mar 11" },
  { id: 8, name: "Dr. Chen Wei",        dept: "gastro",  exp: 15, rating: 4.8, reviews: 319, fee: 230, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen&backgroundColor=b6e3f4",    next: "Tomorrow" },
];

const TIME_SLOTS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM",
];
const UNAVAILABLE = ["9:30 AM","11:00 AM","2:30 PM","4:00 PM"];

const VISIT_TYPES = [
  { id: "in-person", label: "In-Person", icon: "🏥" },
  { id: "video",     label: "Video Call", icon: "📹" },
  { id: "phone",     label: "Phone Call", icon: "📞" },
];

const INITIAL_HISTORY = [
  { id: "A001", doctor: "Dr. Sandra Wu",     dept: "Cardiology",      date: "Feb 14, 2026", time: "10:30 AM", status: "completed", fee: 250, type: "in-person", visitType: "in-person" },
  { id: "A002", doctor: "Dr. Elaine Morrow", dept: "General Practice", date: "Jan 30, 2026", time: "9:00 AM",  status: "completed", fee: 150, type: "in-person", visitType: "video" },
  { id: "A003", doctor: "Dr. Kevin Patel",   dept: "Endocrinology",    date: "Jan 10, 2026", time: "3:00 PM",  status: "cancelled", fee: 200, type: "in-person", visitType: "in-person" },
  { id: "A004", doctor: "Dr. James Okafor",  dept: "Neurology",        date: "Dec 20, 2025", time: "11:30 AM", status: "completed", fee: 220, type: "in-person", visitType: "in-person" },
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ─── ICONS ─────────────────────────────────────────────── */
const ICONS = {
  back:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
  check:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />,
  calendar: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></>,
  clock:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  close:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
  reschedule: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  history:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  star:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  plus:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
  filter:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />,
} as const;

const Icon = ({ name, cls = "w-5 h-5" }: { name: keyof typeof ICONS; cls?: string }) => {
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {ICONS[name]}
    </svg>
  );
};

/* ─── STEP INDICATOR ────────────────────────────────────── */
const STEPS = ["Department","Doctor","Date & Time","Confirm"];
function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < step ? "bg-indigo-600 text-white" : i === step ? "bg-indigo-600 text-white ring-4 ring-indigo-100" : "bg-slate-100 text-slate-400"
            }`}>
              {i < step ? <Icon name="check" cls="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium hidden sm:block whitespace-nowrap ${i <= step ? "text-indigo-600" : "text-slate-400"}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 sm:mb-5 transition-all duration-500 ${i < step ? "bg-indigo-500" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── STEP 1: SELECT DEPARTMENT ─────────────────────────── */
function StepDepartment({ selected, onSelect }: { selected: typeof DEPARTMENTS[0] | null; onSelect: (department: typeof DEPARTMENTS[0]) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Select Department</h2>
      <p className="text-slate-500 text-sm mb-6">Choose the medical specialty you need</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DEPARTMENTS.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              selected?.id === d.id
                ? "border-indigo-500 shadow-lg shadow-indigo-100"
                : "border-slate-100 hover:border-slate-200 bg-white"
            }`}
            style={selected?.id === d.id ? { backgroundColor: d.bg, borderColor: d.color } : {}}
          >
            <span className="text-2xl block mb-2">{d.icon}</span>
            <span className="text-sm font-semibold text-slate-700 leading-tight block">{d.label}</span>
            <span className="text-xs text-slate-400 mt-1 block">
              {DOCTORS.filter(doc => doc.dept === d.id).length} doctors
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── STEP 2: SELECT DOCTOR ─────────────────────────────── */
function StepDoctor({ department, selected, onSelect }: { department: typeof DEPARTMENTS[0] | null; selected: typeof DOCTORS[0] | null; onSelect: (doctor: typeof DOCTORS[0]) => void }) {
  const [search, setSearch] = useState("");
  const doctors = DOCTORS.filter(d => d.dept === department?.id);
  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Choose Your Doctor</h2>
      <p className="text-slate-500 text-sm mb-4">{department?.label} · {doctors.length} doctors available</p>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search doctor by name…"
        className="w-full mb-4 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      />
      <div className="space-y-3">
        {filtered.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex gap-4 items-center ${
              selected?.id === doc.id ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50"
            }`}
          >
            <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-800">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.exp} yrs experience</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-indigo-600">${doc.fee}</p>
                  <p className="text-xs text-slate-400">per visit</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  ★ {doc.rating} <span className="text-slate-400 font-normal">({doc.reviews})</span>
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">
                  Next: {doc.next}
                </span>
              </div>
            </div>
            {selected?.id === doc.id && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Icon name="check" cls="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">No doctors match your search.</div>
        )}
      </div>
    </div>
  );
}

/* ─── STEP 3: DATE & TIME ───────────────────────────────── */
function StepDateTime({ selectedDate, selectedTime, selectedVisit, onDateChange, onTimeChange, onVisitChange }: { selectedDate: Date | null; selectedTime: string; selectedVisit: string; onDateChange: (date: Date) => void; onTimeChange: (time: string) => void; onVisitChange: (visitType: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isPast = (d: number) => new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isSelected = (d: number) => selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Pick a Date & Time</h2>
      <p className="text-slate-500 text-sm mb-5">Select your preferred appointment slot</p>

      {/* Visit Type */}
      <div className="flex gap-2 mb-6">
        {VISIT_TYPES.map(vt => (
          <button
            key={vt.id}
            onClick={() => onVisitChange(vt.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
              selectedVisit === vt.id ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-100 text-slate-500 hover:border-indigo-200"
            }`}
          >
            <span className="mr-1">{vt.icon}</span> {vt.label}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">‹</button>
          <span className="font-bold text-slate-800">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">›</button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => (
            <button
              key={i}
              disabled={!d || isPast(d)}
              onClick={() => d && !isPast(d) && onDateChange(new Date(viewYear, viewMonth, d))}
              className={`aspect-square rounded-xl text-sm font-medium transition-all duration-150 ${
                !d ? "invisible" :
                isPast(d) ? "text-slate-300 cursor-not-allowed" :
                isSelected(d) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" :
                isToday(d) ? "border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50" :
                "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-3">Available slots for {formatDate(selectedDate)}</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {TIME_SLOTS.map(slot => {
              const unavail = UNAVAILABLE.includes(slot);
              return (
                <button
                  key={slot}
                  disabled={unavail}
                  onClick={() => !unavail && onTimeChange(slot)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border-2 transition-all ${
                    unavail ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through" :
                    selectedTime === slot ? "bg-indigo-600 text-white border-indigo-600 shadow-md" :
                    "bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── STEP 4: CONFIRM ───────────────────────────────────── */
function StepConfirm({ booking, onConfirm }: { booking: { department: typeof DEPARTMENTS[0] | null; doctor: typeof DOCTORS[0] | null; date: Date | null; time: string; visitType: string; notes: string; setNotes: (notes: string) => void }; onConfirm: () => void }) {
  const { department, doctor, date, time, visitType, notes, setNotes } = booking;
  const dept = DEPARTMENTS.find(d => d.id === department?.id);
  const vt = VISIT_TYPES.find(v => v.id === visitType);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Confirm Appointment</h2>
      <p className="text-slate-500 text-sm mb-5">Review your booking details before confirming</p>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 mb-4">
        <div className="flex gap-4 items-center mb-4">
          <img src={doctor?.avatar} alt={doctor?.name} className="w-16 h-16 rounded-2xl bg-indigo-100" />
          <div>
            <p className="font-bold text-slate-800 text-lg">{doctor?.name}</p>
            <p className="text-sm text-slate-500">{dept?.label}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-white text-slate-600 border border-slate-200 rounded-full px-2 py-0.5">{vt?.icon} {vt?.label}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Date", value: date ? formatDate(date) : "—", icon: "📅" },
            { label: "Time", value: time, icon: "🕐" },
            { label: "Consultation Fee", value: `$${doctor?.fee}`, icon: "💳" },
            { label: "Department", value: dept?.label, icon: dept?.icon },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
              <p className="font-semibold text-slate-800 text-sm">{item.icon} {item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="text-sm font-semibold text-slate-600 block mb-2">Reason for Visit (optional)</label>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Describe your symptoms or reason for the visit…"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
        />
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
      >
        Confirm Appointment
      </button>
    </div>
  );
}

/* ─── SUCCESS SCREEN ────────────────────────────────────── */
function SuccessScreen({ booking, onDone }: { booking: { department: typeof DEPARTMENTS[0] | null; doctor: typeof DOCTORS[0] | null; date: Date | null; time: string; visitType: string }; onDone: () => void }) {
  const { department, doctor, date, time, visitType } = booking;
  const dept = DEPARTMENTS.find(d => d.id === department?.id);
  const vt = VISIT_TYPES.find(v => v.id === visitType);
  const id = "A" + Math.floor(Math.random() * 9000 + 1000);

  return (
    <div className="text-center py-4">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
        <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Appointment Booked!</h2>
      <p className="text-slate-500 text-sm mb-6">Your appointment has been confirmed successfully.</p>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 mb-6 text-left">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs text-slate-400 font-medium">BOOKING ID</p>
          <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">#{id}</span>
        </div>
        <div className="flex gap-3 items-center mb-4">
          <img src={doctor?.avatar} alt={doctor?.name} className="w-12 h-12 rounded-xl bg-teal-100" />
          <div>
            <p className="font-bold text-slate-800">{doctor?.name}</p>
            <p className="text-xs text-slate-500">{dept?.label}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-400">Date</span><p className="font-semibold text-slate-800">📅 {date ? formatDate(date) : "—"}</p></div>
          <div><span className="text-slate-400">Time</span><p className="font-semibold text-slate-800">🕐 {time}</p></div>
          <div><span className="text-slate-400">Type</span><p className="font-semibold text-slate-800">{vt?.icon} {vt?.label}</p></div>
          <div><span className="text-slate-400">Fee</span><p className="font-semibold text-slate-800">💳 ${doctor?.fee}</p></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onDone} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm">
          View History
        </button>
        <button onClick={onDone} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm">
          Done
        </button>
      </div>
    </div>
  );
}

/* ─── APPOINTMENT HISTORY ───────────────────────────────── */
function HistoryView({ history, onReschedule, onCancel }: { history: typeof INITIAL_HISTORY; onReschedule: (a: typeof INITIAL_HISTORY[0]) => void; onCancel: (id: string) => void }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all","completed","upcoming","cancelled"];
  const filtered = history.filter(a => filter === "all" || a.status === filter || (filter === "upcoming" && a.status === "confirmed"));

  const statusStyle: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled:  "bg-red-50 text-red-600 border-red-200",
    confirmed:  "bg-indigo-50 text-indigo-700 border-indigo-200",
    pending:    "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Appointment History</h2>
      <p className="text-slate-500 text-sm mb-4">{history.length} total appointments</p>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap border transition-all ${
              filter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"
            }`}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-slate-800">{a.doctor}</p>
                <p className="text-xs text-slate-500">{a.dept}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyle[a.status]}`}>{a.status}</span>
            </div>
            <div className="flex gap-4 text-sm text-slate-600 mb-3">
              <span>📅 {a.date}</span>
              <span>🕐 {a.time}</span>
              <span>💳 ${a.fee}</span>
            </div>
            {(a.status === "confirmed" || a.status === "pending") && (
              <div className="flex gap-2">
                <button onClick={() => onReschedule(a)}
                  className="flex-1 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1">
                  <Icon name="reschedule" cls="w-3.5 h-3.5" /> Reschedule
                </button>
                <button onClick={() => onCancel(a.id)}
                  className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                  <Icon name="close" cls="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No {filter} appointments found.</div>
        )}
      </div>
    </div>
  );
}

/* ─── CANCEL MODAL ──────────────────────────────────────── */
function CancelModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center mb-1">Cancel Appointment?</h3>
        <p className="text-slate-500 text-sm text-center mb-5">This action cannot be undone. A cancellation notice will be sent to you.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">Keep It</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">Yes, Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── RESCHEDULE VIEW ───────────────────────────────────── */
function RescheduleView({ appointment, onDone }: { appointment: typeof INITIAL_HISTORY[0]; onDone: () => void }) {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);

  if (done) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
        <Icon name="check" cls="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Rescheduled!</h3>
      <p className="text-slate-500 text-sm mb-6">Your appointment has been updated to {date ? formatDate(date) : "—"} at {time}.</p>
      <button onClick={onDone} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">Back to History</button>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Reschedule Appointment</h2>
      <p className="text-slate-500 text-sm mb-4">Rescheduling: <strong>{appointment.doctor}</strong></p>
      <StepDateTime selectedDate={date} selectedTime={time} selectedVisit="in-person"
        onDateChange={setDate} onTimeChange={setTime} onVisitChange={() => {}} />
      <button
        disabled={!date || !time}
        onClick={() => setDone(true)}
        className="w-full mt-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
      >
        Confirm New Time
      </button>
    </div>
  );
}

/* ─── BOOKING FLOW ──────────────────────────────────────── */
function BookingFlow({ onSuccess, onCancel: onCancelFlow }: { onSuccess: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const [department, setDepartment] = useState<typeof DEPARTMENTS[0] | null>(null);
  const [doctor, setDoctor] = useState<typeof DOCTORS[0] | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [visitType, setVisitType] = useState("in-person");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canNext = [
    !!department,
    !!doctor,
    !!date && !!time,
    true,
  ];

  if (confirmed) return <SuccessScreen booking={{ department, doctor, date, time, visitType }} onDone={onSuccess} />;

  return (
    <div>
      <StepBar step={step} />
      {step === 0 && <StepDepartment selected={department} onSelect={(d: typeof DEPARTMENTS[0]) => { setDepartment(d); setDoctor(null); }} />}
      {step === 1 && <StepDoctor department={department} selected={doctor} onSelect={setDoctor} />}
      {step === 2 && <StepDateTime selectedDate={date} selectedTime={time} selectedVisit={visitType} onDateChange={setDate} onTimeChange={setTime} onVisitChange={setVisitType} />}
      {step === 3 && department && doctor && date && <StepConfirm booking={{ department, doctor, date, time, visitType, notes, setNotes }} onConfirm={() => setConfirmed(true)} />}

      {step < 3 && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => step === 0 ? onCancelFlow() : setStep(s => s - 1)}
            className="flex items-center gap-1 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            <Icon name="back" cls="w-4 h-4" /> {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            disabled={!canNext[step]}
            onClick={() => setStep(s => s + 1)}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────── */
export default function AppointmentModule() {
  const [view, setView] = useState("home"); // home | book | history | reschedule
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [rescheduling, setRescheduling] = useState<typeof INITIAL_HISTORY[0] | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const handleBookingSuccess = () => {
    setHistory(prev => [{
      id: "A" + Math.floor(Math.random() * 9000 + 1000),
      doctor: "New Doctor", dept: "Department", date: "Mar 10, 2026",
      time: "10:00 AM", status: "confirmed", fee: 200, type: "in-person", visitType: "in-person"
    }, ...prev]);
    setView("history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight">Appointments</span>
        </div>
        <div className="flex items-center gap-2">
          {view !== "history" && (
            <button onClick={() => setView("history")}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 font-semibold px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-all">
              <Icon name="history" cls="w-4 h-4" /> History
            </button>
          )}
          {view !== "book" && (
            <button onClick={() => setView("book")}
              className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
              <Icon name="plus" cls="w-4 h-4" /> Book
            </button>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* HOME */}
        {view === "home" && (
          <div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
              <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-2xl font-bold mb-2">Sophia Hartwell</h1>
              <p className="text-indigo-200 text-sm">Manage all your appointments in one place.</p>
              <button onClick={() => setView("book")}
                className="mt-4 bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all shadow-md">
                + Book New Appointment
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Total Visits", value: history.length, icon: "🏥", color: "indigo" },
                { label: "Upcoming", value: history.filter(a => a.status === "confirmed").length, icon: "📅", color: "emerald" },
                { label: "Completed", value: history.filter(a => a.status === "completed").length, icon: "✅", color: "teal" },
                { label: "Cancelled", value: history.filter(a => a.status === "cancelled").length, icon: "❌", color: "red" },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <p className="text-2xl mb-1">{stat.icon}</p>
                  <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">Recent Appointments</h3>
                <button onClick={() => setView("history")} className="text-xs text-indigo-600 font-semibold hover:underline">View all →</button>
              </div>
              <div className="space-y-2">
                {history.slice(0, 3).map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{a.doctor}</p>
                      <p className="text-xs text-slate-400">{a.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                      { completed: "bg-emerald-50 text-emerald-700 border-emerald-200", cancelled: "bg-red-50 text-red-600 border-red-200", confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200" }[a.status]
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOK */}
        {view === "book" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <BookingFlow onSuccess={handleBookingSuccess} onCancel={() => setView("home")} />
          </div>
        )}

        {/* HISTORY */}
        {view === "history" && !rescheduling && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <HistoryView
              history={history}
              onReschedule={a => setRescheduling(a)}
              onCancel={id => setCancelId(id)}
            />
          </div>
        )}

        {/* RESCHEDULE */}
        {view === "history" && rescheduling && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <button onClick={() => setRescheduling(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 font-medium">
              <Icon name="back" cls="w-4 h-4" /> Back to History
            </button>
            <RescheduleView appointment={rescheduling} onDone={() => { setRescheduling(null); }} />
          </div>
        )}
      </main>

      {/* CANCEL MODAL */}
      {cancelId && (
        <CancelModal
          onClose={() => setCancelId(null)}
          onConfirm={() => {
            setHistory(prev => prev.map(a => a.id === cancelId ? { ...a, status: "cancelled" } : a));
            setCancelId(null);
          }}
        />
      )}
    </div>
  );
}
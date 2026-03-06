import { useState, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const PATIENT = { name: "Sophia Hartwell", id: "MRN-20419-HW", dob: "Apr 12, 1991", bloodType: "A+" };

const LAB_CATEGORIES = [
  { id: "blood", label: "Blood Tests", icon: "🩸", color: "#dc2626", bg: "#fff1f2" },
  { id: "urine", label: "Urine Tests", icon: "💛", color: "#d97706", bg: "#fffbeb" },
  { id: "imaging", label: "Imaging", icon: "🩻", color: "#2563eb", bg: "#eff6ff" },
  { id: "cardiac", label: "Cardiac", icon: "🫀", color: "#be123c", bg: "#fff1f2" },
  { id: "hormone", label: "Hormones", icon: "🧬", color: "#7c3aed", bg: "#f5f3ff" },
  { id: "micro", label: "Microbiology", icon: "🔬", color: "#0d9488", bg: "#f0fdfa" },
  { id: "genetic", label: "Genetics", icon: "🧪", color: "#0369a1", bg: "#f0f9ff" },
  { id: "allergy", label: "Allergy", icon: "🌿", color: "#65a30d", bg: "#f7fee7" },
];

const TEST_CATALOG = [
  { id: "cbc", name: "Complete Blood Count (CBC)", cat: "blood", price: 450, duration: "Same day", fasting: false, desc: "Measures red cells, white cells, and platelets." },
  { id: "hba1c", name: "HbA1c (Glycated Hemoglobin)", cat: "blood", price: 600, duration: "Same day", fasting: false, desc: "3-month average blood sugar control." },
  { id: "lipid", name: "Lipid Profile", cat: "blood", price: 550, duration: "Same day", fasting: true, desc: "Total cholesterol, HDL, LDL, triglycerides." },
  { id: "lft", name: "Liver Function Test (LFT)", cat: "blood", price: 700, duration: "Same day", fasting: true, desc: "Liver enzyme and protein levels." },
  { id: "kft", name: "Kidney Function Test (KFT)", cat: "blood", price: 650, duration: "Same day", fasting: false, desc: "Creatinine, urea, and electrolytes." },
  { id: "thyroid", name: "Thyroid Panel (TSH, T3, T4)", cat: "hormone", price: 900, duration: "Same day", fasting: false, desc: "Complete thyroid function assessment." },
  { id: "urine_r", name: "Urine Routine & Microscopy", cat: "urine", price: 200, duration: "4 hours", fasting: false, desc: "Color, clarity, pH, protein, glucose, cells." },
  { id: "ecg", name: "12-Lead ECG", cat: "cardiac", price: 300, duration: "Immediate", fasting: false, desc: "Heart rhythm and electrical activity." },
  { id: "echo", name: "Echocardiogram", cat: "cardiac", price: 2500, duration: "2–3 hours", fasting: false, desc: "Ultrasound of heart structure and function." },
  { id: "xray", name: "Chest X-Ray", cat: "imaging", price: 400, duration: "1 hour", fasting: false, desc: "Lungs, heart, and chest wall imaging." },
  { id: "blood_culture", name: "Blood Culture & Sensitivity", cat: "micro", price: 800, duration: "5–7 days", fasting: false, desc: "Identifies bacterial or fungal infection." },
  { id: "vitamin_d", name: "Vitamin D (25-OH)", cat: "hormone", price: 1100, duration: "Same day", fasting: false, desc: "Vitamin D deficiency screening." },
  { id: "allergy_panel", name: "Comprehensive Allergy Panel", cat: "allergy", price: 3200, duration: "2 days", fasting: false, desc: "IgE levels for common environmental & food allergens." },
  { id: "genetic_brca", name: "BRCA Gene Test", cat: "genetic", price: 12000, duration: "10–14 days", fasting: false, desc: "Hereditary breast and ovarian cancer risk." },
  { id: "insulin_fasting", name: "Fasting Insulin", cat: "hormone", price: 750, duration: "Same day", fasting: true, desc: "Insulin resistance and pancreatic function." },
];

const COLLECTION_CENTERS = [
  { id: "cc1", name: "LifeLab Diagnostics — Banjara Hills", dist: "1.2 km", slots: 14, rating: 4.8 },
  { id: "cc2", name: "Apollo Diagnostics — Jubilee Hills", dist: "2.8 km", slots: 9, rating: 4.9 },
  { id: "cc3", name: "PathCare Labs — Kondapur", dist: "4.1 km", slots: 21, rating: 4.6 },
  { id: "cc4", name: "Home Collection", dist: "At your doorstep", slots: 8, rating: 4.7 },
];

const TIME_SLOTS = ["7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"];
const BOOKED_SLOTS = ["8:00 AM","10:00 AM","4:00 PM"];

const ACTIVE_TESTS = [
  { id: "LR-2026-0071", name: "Complete Blood Count (CBC)", ordered: "Mar 3, 2026", lab: "LifeLab Diagnostics", doctor: "Dr. Elaine Morrow", status: "ready", collectedAt: "Mar 3, 2026 · 8:30 AM", resultedAt: "Mar 3, 2026 · 3:00 PM", cat: "blood", priority: "routine", size: "0.9 MB" },
  { id: "LR-2026-0068", name: "HbA1c & Glucose Panel", ordered: "Feb 28, 2026", lab: "PathCare Labs", doctor: "Dr. Kevin Patel", status: "processing", collectedAt: "Mar 1, 2026 · 7:45 AM", resultedAt: null, cat: "blood", priority: "urgent", size: null },
  { id: "LR-2026-0055", name: "Echocardiogram Report", ordered: "Feb 20, 2026", lab: "Apollo Diagnostics", doctor: "Dr. Sandra Wu", status: "scheduled", collectedAt: null, resultedAt: null, cat: "cardiac", priority: "routine", scheduledFor: "Mar 10, 2026 · 10:00 AM", size: null },
  { id: "LR-2026-0049", name: "Thyroid Panel (TSH, T3, T4)", ordered: "Feb 18, 2026", lab: "LifeLab Diagnostics", doctor: "Dr. Elaine Morrow", status: "collected", collectedAt: "Feb 19, 2026 · 9:15 AM", resultedAt: null, cat: "hormone", priority: "routine", size: null },
];

const REPORT_HISTORY = [
  { id: "LR-2026-0041", name: "Lipid Profile", date: "Feb 14, 2026", lab: "LifeLab Diagnostics", doctor: "Dr. Elaine Morrow", status: "normal", cat: "blood", size: "0.7 MB", results: [{ test:"Total Cholesterol",value:"182",unit:"mg/dL",range:"<200",flag:"" },{ test:"LDL",value:"105",unit:"mg/dL",range:"<130",flag:"" },{ test:"HDL",value:"58",unit:"mg/dL",range:">50",flag:"" },{ test:"Triglycerides",value:"148",unit:"mg/dL",range:"<150",flag:"" }] },
  { id: "LR-2026-0038", name: "HbA1c & Glucose Panel", date: "Nov 20, 2025", lab: "PathCare Labs", doctor: "Dr. Kevin Patel", status: "abnormal", cat: "blood", size: "0.9 MB", results: [{ test:"HbA1c",value:"7.1",unit:"%",range:"<6.5",flag:"H" },{ test:"Fasting Glucose",value:"138",unit:"mg/dL",range:"70–99",flag:"H" }] },
  { id: "LR-2025-0301", name: "Thyroid Function Test", date: "Aug 10, 2025", lab: "Apollo Diagnostics", doctor: "Dr. Elaine Morrow", status: "normal", cat: "hormone", size: "0.8 MB", results: [{ test:"TSH",value:"2.4",unit:"mIU/L",range:"0.4–4.0",flag:"" },{ test:"Free T4",value:"1.2",unit:"ng/dL",range:"0.8–1.8",flag:"" }] },
  { id: "LR-2025-0255", name: "Complete Blood Count", date: "Jun 5, 2025", lab: "LifeLab Diagnostics", doctor: "Dr. Elaine Morrow", status: "normal", cat: "blood", size: "1.1 MB", results: [{ test:"WBC",value:"7.2",unit:"×10³/µL",range:"4.5–11.0",flag:"" },{ test:"Hemoglobin",value:"12.8",unit:"g/dL",range:"12.0–16.0",flag:"" },{ test:"Platelets",value:"285",unit:"×10³/µL",range:"150–400",flag:"" }] },
  { id: "LR-2025-0198", name: "Kidney Function Test", date: "Mar 3, 2025", lab: "PathCare Labs", doctor: "Dr. Kevin Patel", status: "normal", cat: "blood", size: "0.6 MB", results: [{ test:"Creatinine",value:"0.9",unit:"mg/dL",range:"0.5–1.1",flag:"" },{ test:"Urea",value:"28",unit:"mg/dL",range:"10–45",flag:"" }] },
  { id: "LR-2024-0441", name: "Allergy Panel — Foods", date: "Dec 10, 2024", lab: "Apollo Diagnostics", doctor: "Dr. Luca Romano", status: "abnormal", cat: "allergy", size: "2.1 MB", results: [{ test:"Shellfish IgE",value:"8.4",unit:"kU/L",range:"<0.35",flag:"H" },{ test:"Peanut IgE",value:"0.12",unit:"kU/L",range:"<0.35",flag:"" }] },
];

/* ══════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════ */
const STATUS_CONFIG = {
  scheduled:  { label: "Scheduled",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "📅" },
  collected:  { label: "Collected",  color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "🧪" },
  processing: { label: "Processing", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: "⚙️" },
  ready:      { label: "Ready",      color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", icon: "✅" },
  normal:     { label: "Normal",     color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", icon: "✅" },
  abnormal:   { label: "Abnormal",   color: "#dc2626", bg: "#fff1f2", border: "#fecaca", icon: "⚠️" },
};

const STATUS_STEPS = ["scheduled","collected","processing","ready"];

function StatusPill({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.scheduled;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border" style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function DownloadBtn({ size, label = "Download PDF" }: { size?: string; label?: string }) {
  const [st, setSt] = useState("idle");
  const go = () => { setSt("loading"); setTimeout(() => { setSt("done"); setTimeout(() => setSt("idle"), 2000); }, 1400); };
  return (
    <button onClick={go} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${st === "done" ? "bg-emerald-100 text-emerald-700" : st === "loading" ? "bg-slate-100 text-slate-400" : "bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100"}`}>
      <span>{st === "loading" ? "⟳" : st === "done" ? "✓" : "↓"}</span>
      <span className={st === "loading" ? "animate-pulse" : ""}>{st === "loading" ? "Generating…" : st === "done" ? "Downloaded!" : label}</span>
      {size && st === "idle" && <span className="opacity-50 font-normal">· {size}</span>}
    </button>
  );
}

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  return [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
}
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ══════════════════════════════════════════════════════════════════
   BOOK LAB TEST — 4-STEP WIZARD
══════════════════════════════════════════════════════════════════ */
function BookLabTest({ onBooked }: { onBooked: (data: { tests: typeof TEST_CATALOG[number][]; center: typeof COLLECTION_CENTERS[number] | null; date: Date | null; slot: string }) => void }) {
  const [step, setStep] = useState(0); // 0:category 1:tests 2:datetime+center 3:confirm
  const [selCat, setSelCat] = useState<typeof LAB_CATEGORIES[number] | null>(null);
  const [cart, setCart] = useState<typeof TEST_CATALOG[number][]>([]);
  const [center, setCenter] = useState<typeof COLLECTION_CENTERS[number] | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState("");
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [done, setDone] = useState(false);
  const today = new Date();

  const catTests = TEST_CATALOG.filter(t => t.cat === selCat?.id);
  const total = cart.reduce((s, t) => s + t.price, 0);
  const fasting = cart.some(t => t.fasting);
  const cells = getCalendarDays(viewYear, viewMonth);

  const toggleCart = (test: typeof TEST_CATALOG[number]) => setCart(prev => prev.find(t => t.id === test.id) ? prev.filter(t => t.id !== test.id) : [...prev, test]);

  const confirmBook = () => {
    setDone(true);
    setTimeout(() => {
      onBooked({ tests: cart, center, date, slot });
    }, 100);
  };

  if (done) return (
    <div className="text-center py-8 px-4">
      <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">🎉</div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
      <p className="text-slate-400 text-sm mb-6">Your lab test has been scheduled successfully.</p>
      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 text-left mb-6 space-y-3">
        <div><p className="text-xs text-slate-400">Booking ID</p><p className="font-black text-cyan-700 font-mono">LB-{Date.now().toString().slice(-7)}</p></div>
        <div><p className="text-xs text-slate-400">Tests</p>{cart.map(t => <p key={t.id} className="font-semibold text-slate-800 text-sm">• {t.name}</p>)}</div>
        <div><p className="text-xs text-slate-400">Collection Point</p><p className="font-semibold text-slate-800 text-sm">{center?.name}</p></div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xs text-slate-400">Date</p><p className="font-semibold text-slate-800 text-sm">{date && date.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p></div>
          <div><p className="text-xs text-slate-400">Time</p><p className="font-semibold text-slate-800 text-sm">{slot}</p></div>
        </div>
        <div><p className="text-xs text-slate-400">Total Paid</p><p className="font-black text-slate-900">₹{total.toLocaleString()}</p></div>
        {fasting && <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3"><span>⚠️</span><p className="text-xs text-amber-800 font-semibold">Fasting required for {cart.filter(t=>t.fasting).map(t=>t.name).join(", ")}. Fast 10–12 hours before your appointment.</p></div>}
      </div>
      <button onClick={() => { setStep(0); setCart([]); setCenter(null); setDate(null); setSlot(""); setDone(false); setSelCat(null); }}
        className="px-8 py-3 bg-cyan-600 text-white font-black rounded-2xl hover:bg-cyan-700 transition-colors">
        Book Another Test
      </button>
    </div>
  );

  const STEPS = ["Category","Tests","Schedule","Confirm"];
  return (
    <div>
      {/* Step bar */}
      <div className="flex items-center gap-0 mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? "bg-cyan-600 text-white" : i === step ? "bg-cyan-600 text-white ring-4 ring-cyan-100" : "bg-slate-100 text-slate-400"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-1 font-semibold hidden sm:block whitespace-nowrap ${i <= step ? "text-cyan-600" : "text-slate-300"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 sm:mb-5 transition-all ${i < step ? "bg-cyan-500" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {/* STEP 0: Category */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-1">Select Test Category</h2>
          <p className="text-sm text-slate-400 mb-5">Choose the type of diagnostic test</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LAB_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setSelCat(cat); setStep(1); }}
                className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${selCat?.id === cat.id ? "shadow-lg" : "border-slate-100 bg-white hover:border-slate-200"}`}
                style={selCat?.id === cat.id ? { borderColor: cat.color, backgroundColor: cat.bg } : {}}>
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <span className="text-sm font-bold text-slate-700 block leading-tight">{cat.label}</span>
                <span className="text-xs text-slate-400">{TEST_CATALOG.filter(t => t.cat === cat.id).length} tests</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Test selection */}
      {step === 1 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{selCat?.icon}</span>
            <h2 className="text-lg font-black text-slate-900">{selCat?.label}</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">Select one or more tests · {cart.length} selected</p>
          <div className="space-y-2 mb-5">
            {catTests.map(test => {
              const inCart = cart.find(t => t.id === test.id);
              return (
                <button key={test.id} onClick={() => toggleCart(test)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${inCart ? "shadow-md" : "border-slate-100 bg-white hover:border-slate-200"}`}
                  style={inCart ? { borderColor: selCat?.color, backgroundColor: selCat?.bg } : {}}>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${inCart ? "text-white" : "border-slate-300"}`}
                    style={inCart ? { backgroundColor: selCat?.color, borderColor: selCat?.color } : {}}>
                    {inCart && <span className="text-xs">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm">{test.name}</p>
                    <p className="text-xs text-slate-400">{test.desc}</p>
                    <div className="flex gap-3 mt-1 text-xs text-slate-400">
                      <span>⏱ {test.duration}</span>
                      {test.fasting && <span className="text-amber-600 font-semibold">⚠ Fasting required</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-slate-900">₹{test.price}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {cart.length > 0 && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-cyan-800">{cart.length} test{cart.length>1?"s":""} selected</p>
                <p className="text-xs text-cyan-600">Total: ₹{total.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Schedule */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-1">Schedule Your Test</h2>
          <p className="text-sm text-slate-400 mb-5">Pick a collection center, date and time</p>

          {/* Center */}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Collection Center</p>
          <div className="space-y-2 mb-5">
            {COLLECTION_CENTERS.map(cc => (
              <button key={cc.id} onClick={() => setCenter(cc)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${center?.id === cc.id ? "border-cyan-500 bg-cyan-50 shadow-md" : "border-slate-100 bg-white hover:border-cyan-200"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${cc.id === "cc4" ? "bg-emerald-50" : "bg-blue-50"}`}>
                  {cc.id === "cc4" ? "🏠" : "🏥"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm">{cc.name}</p>
                  <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                    <span>📍 {cc.dist}</span>
                    <span>🕐 {cc.slots} slots available</span>
                    <span>⭐ {cc.rating}</span>
                  </div>
                </div>
                {center?.id === cc.id && <span className="text-cyan-600 font-black">✓</span>}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Date</p>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => { if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); }} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">‹</button>
              <span className="font-black text-slate-800">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={() => { if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); }} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">{DAYS.map(d=><div key={d} className="text-center text-xs font-bold text-slate-300 py-1">{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                const isPast = d && new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const isSel = date && date.getDate()===d && date.getMonth()===viewMonth && date.getFullYear()===viewYear;
                const isToday = d===today.getDate()&&viewMonth===today.getMonth()&&viewYear===today.getFullYear();
                return (
                  <button key={i} disabled={!d||isPast} onClick={() => d&&!isPast&&setDate(new Date(viewYear,viewMonth,d))}
                    className={`aspect-square rounded-xl text-sm font-semibold transition-all ${!d?"invisible":isPast?"text-slate-200 cursor-not-allowed":isSel?"text-white shadow-lg":isToday?"border-2 border-cyan-400 text-cyan-700 hover:bg-cyan-50":"text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"}`}
                    style={isSel ? { backgroundColor: "#0891b2" } : {}}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          {date && (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Time Slot</p>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map(s => {
                  const unavail = BOOKED_SLOTS.includes(s);
                  const isSel = slot === s;
                  return (
                    <button key={s} disabled={unavail} onClick={() => setSlot(s)}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${unavail?"bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through":isSel?"text-white border-cyan-600 shadow-md":"bg-white text-slate-600 border-slate-200 hover:border-cyan-400 hover:text-cyan-700"}`}
                      style={isSel ? { backgroundColor: "#0891b2", borderColor: "#0891b2" } : {}}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 3: Confirm */}
      {step === 3 && (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-1">Confirm Booking</h2>
          <p className="text-sm text-slate-400 mb-5">Review your lab test booking before confirming</p>
          <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-100 rounded-2xl p-5 mb-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">Tests Booked</p>
              {cart.map(t => (
                <div key={t.id} className="flex justify-between items-center py-1.5 border-b border-cyan-100 last:border-0">
                  <div><p className="font-bold text-slate-800 text-sm">{t.name}</p>{t.fasting&&<p className="text-xs text-amber-600 font-semibold">⚠ Fasting required</p>}</div>
                  <p className="font-black text-slate-900">₹{t.price}</p>
                </div>
              ))}
              <div className="flex justify-between pt-2"><span className="font-bold text-slate-600">Total</span><span className="font-black text-cyan-700 text-lg">₹{total.toLocaleString()}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label:"Collection Center", value: center?.name },
                { label:"Date", value: date?.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) },
                { label:"Time Slot", value: slot },
                { label:"Doctor Ref.", value: "Self-Booked" },
              ].map(r => (
                <div key={r.label} className="bg-white/70 rounded-xl px-3 py-2">
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className="font-bold text-slate-800 text-xs leading-snug">{r.value}</p>
                </div>
              ))}
            </div>
            {fasting && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                <span>⚠️</span>
                <p className="text-xs text-amber-800 font-semibold">One or more tests require fasting 10–12 hours prior. Do not eat or drink anything except water.</p>
              </div>
            )}
          </div>
          <button onClick={confirmBook} className="w-full py-3.5 rounded-2xl text-white font-black text-base shadow-lg transition-all hover:scale-[1.01]" style={{ background: "linear-gradient(135deg,#0891b2,#0e7490)" }}>
            Confirm & Pay ₹{total.toLocaleString()}
          </button>
        </div>
      )}

      {/* Nav buttons */}
      {!done && (
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
              ← Back
            </button>
          )}
          {step < 3 && step > 0 && (
            <button
              disabled={(step===1&&cart.length===0)||(step===2&&(!center||!date||!slot))}
              onClick={() => setStep(s => s + 1)}
              className="flex-1 py-3 rounded-xl text-white font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
              style={{ backgroundColor: "#0891b2" }}>
              Continue →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   VIEW TEST STATUS
══════════════════════════════════════════════════════════════════ */
function TestStatusSection({ tests }: { tests: typeof ACTIVE_TESTS }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-black text-slate-900">Test Status Tracker</h2>
          <p className="text-sm text-slate-400">{tests.length} active orders</p>
        </div>
        <div className="flex gap-2">
          {["scheduled","collected","processing","ready"].map(s => {
              const cfg = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG];
              const count = tests.filter(t=>t.status===s).length;
            return count > 0 ? (
              <div key={s} className="text-center px-2.5 py-1 rounded-xl border text-xs font-bold" style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}>
                {count}
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="space-y-3">
        {tests.map(test => {
          const stepIdx = STATUS_STEPS.indexOf(test.status);
          const cat = LAB_CATEGORIES.find(c => c.id === test.cat);
          return (
            <div key={test.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <button className="w-full text-left p-4" onClick={() => setExpanded(expanded===test.id?null:test.id)}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: cat?.bg || "#f1f5f9" }}>
                      {cat?.icon || "🧪"}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{test.name}</p>
                      <p className="text-xs text-slate-400">{test.lab} · {test.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {test.priority === "urgent" && <span className="text-xs font-black bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">URGENT</span>}
                    <StatusPill status={test.status as keyof typeof STATUS_CONFIG} />
                    <span className={`text-slate-300 text-sm transition-transform ${expanded===test.id?"rotate-180":""}`}>▾</span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="flex items-center">
                  {STATUS_STEPS.map((s, i) => {
                    const cfg = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG];
                    const done = i <= stepIdx;
                    const current = i === stepIdx;
                    return (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${done?"text-white shadow-sm":"bg-slate-100 text-slate-300"} ${current?"ring-4":""}`}
                            style={done ? { backgroundColor: cfg.color, ...(current ? { boxShadow: `0 0 0 4px ${cfg.bg}` } : {}) } : {}}>
                            {done ? (current ? cfg.icon : "✓") : i + 1}
                          </div>
                          <span className={`text-xs mt-1 font-semibold hidden sm:block whitespace-nowrap ${done ? "text-slate-600" : "text-slate-300"}`}>{cfg.label}</span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1.5 mb-4 sm:mb-5 transition-all ${i < stepIdx ? "bg-cyan-400" : "bg-slate-100"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </button>

              {expanded === test.id && (
                <div className="border-t border-slate-50 px-4 pb-4 pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { label: "Ordered", value: test.ordered },
                      { label: "Order ID", value: test.id, mono: true },
                      test.collectedAt && { label: "Collected", value: test.collectedAt },
                      test.scheduledFor && { label: "Scheduled For", value: test.scheduledFor },
                      test.resultedAt && { label: "Results Ready", value: test.resultedAt },
                    ].filter((r): r is { label: string; value: string; mono?: boolean } => !!r).map(r => (
                      <div key={r.label} className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-xs text-slate-400">{r.label}</p>
                        <p className={`font-semibold text-slate-800 text-xs leading-snug ${r.mono ? "font-mono" : ""}`}>{r.value}</p>
                      </div>
                    ))}
                  </div>
                  {test.status === "ready" && (
                    <div className="flex gap-2">
                      <DownloadBtn size={test.size || undefined} label="Download Report" />
                    </div>
                  )}
                  {test.status !== "ready" && (
                    <p className="text-xs text-slate-400 italic">Report will be available once processing is complete.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REPORT HISTORY
══════════════════════════════════════════════════════════════════ */
function ReportHistorySection() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = REPORT_HISTORY.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.doctor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchCat = filterCat === "all" || r.cat === filterCat;
    return matchSearch && matchStatus && matchCat;
  });

  const usedCats = [...new Set(REPORT_HISTORY.map(r => r.cat))];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-900 mb-1">Report History</h2>
        <p className="text-sm text-slate-400">{REPORT_HISTORY.length} completed reports</p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports or doctors…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-300" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all","normal","abnormal"].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filterStatus===f?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-400 border-slate-200 hover:border-slate-400"}`}>
            {f}
          </button>
        ))}
        <div className="w-px bg-slate-200 mx-1 self-stretch" />
        {["all",...usedCats].map(c => {
          const cat = LAB_CATEGORIES.find(l=>l.id===c);
          return (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filterCat===c?"text-white border-transparent":"bg-white text-slate-400 border-slate-200 hover:border-slate-400"}`}
              style={filterCat===c ? { backgroundColor: cat?.color || "#1e293b", borderColor: cat?.color || "#1e293b" } : {}}>
              {c === "all" ? "All Types" : `${cat?.icon} ${cat?.label}`}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map(r => {
          const cat = LAB_CATEGORIES.find(c => c.id === r.cat);
          const hasAbnormal = r.results.some(res => res.flag);
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <button className="w-full text-left p-4 flex items-center gap-3" onClick={() => setExpanded(expanded===r.id?null:r.id)}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: cat?.bg || "#f1f5f9" }}>
                  {cat?.icon || "🧪"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-sm">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.date} · {r.lab}</p>
                  <p className="text-xs text-slate-400">{r.doctor}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusPill status={r.status as keyof typeof STATUS_CONFIG} />
                  <span className={`text-slate-300 text-sm transition-transform ${expanded===r.id?"rotate-180":""}`}>▾</span>
                </div>
              </button>

              {expanded === r.id && (
                <div className="border-t border-slate-50 p-4">
                  {/* Results table */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left border-b border-slate-100">
                          <th className="pb-2 text-slate-400 font-bold pr-4">Test</th>
                          <th className="pb-2 text-slate-400 font-bold pr-4">Result</th>
                          <th className="pb-2 text-slate-400 font-bold pr-4">Unit</th>
                          <th className="pb-2 text-slate-400 font-bold">Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {r.results.map(res => (
                          <tr key={res.test} className={res.flag ? "bg-red-50/50" : ""}>
                            <td className="py-2 pr-4 font-semibold text-slate-700">{res.test}</td>
                            <td className={`py-2 pr-4 font-black ${res.flag ? "text-red-600" : "text-emerald-600"}`}>
                              {res.value} {res.flag && <span className="ml-1 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-md font-black">{res.flag}</span>}
                            </td>
                            <td className="py-2 pr-4 text-slate-400">{res.unit}</td>
                            <td className="py-2 text-slate-400">{res.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {hasAbnormal && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex gap-2">
                      <span className="text-red-500">⚠</span>
                      <p className="text-xs text-red-700 font-semibold">One or more results fall outside reference range. Please consult your doctor.</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-300 font-mono">{r.id}</p>
                    <DownloadBtn size={r.size} />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-300">
            <p className="text-4xl mb-3">🔬</p>
            <p className="font-bold">No reports match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "book",    label: "Book Test",    icon: "➕" },
  { id: "status",  label: "Test Status",  icon: "📡" },
  { id: "history", label: "Report History",icon: "📂" },
];

export default function LabReports() {
  const [tab, setTab] = useState("book");
  const [activeTests, setActiveTests] = useState(ACTIVE_TESTS);

  const handleBooked = useCallback(({ tests, center, date, slot }: { tests: typeof TEST_CATALOG; center: typeof COLLECTION_CENTERS[number]; date: Date | null; slot: string }) => {
    const newTest = {
      id: "LR-2026-" + Math.floor(Math.random()*9000+1000),
      name: tests.map(t => t.name).join(" + "),
      ordered: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      lab: center.name, doctor: "Self-Booked", status: "scheduled",
      collectedAt: null, resultedAt: null, cat: tests[0]?.cat, priority: "routine",
      scheduledFor: date?.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) + " · " + slot,
      size: null
    };
    setActiveTests(prev => [newTest, ...prev]);
    setTab("status");
  }, []);

  const totalReady = activeTests.filter(t => t.status === "ready").length;
  const totalActive = activeTests.filter(t => t.status !== "ready").length;

  return (
    <div className="min-h-screen" style={{ fontFamily:"'Lexend', 'Segoe UI', sans-serif", background:"linear-gradient(145deg, #f0f9ff 0%, #f8fafc 50%, #f0fdfa 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        .tab-scroll::-webkit-scrollbar{display:none;}
        .tab-scroll{scrollbar-width:none;}
      `}</style>

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-md" style={{ background: "linear-gradient(135deg,#0891b2,#0e7490)" }}>
                🔬
              </div>
              <div>
                <h1 className="font-black text-slate-900 text-base leading-tight">Lab & Reports</h1>
                <p className="text-xs text-slate-400">{PATIENT.name} · {PATIENT.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {totalReady > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-1.5 text-center">
                  <p className="text-sm font-black text-emerald-700 leading-tight">{totalReady}</p>
                  <p className="text-xs text-emerald-400">ready</p>
                </div>
              )}
              {totalActive > 0 && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-2xl px-3 py-1.5 text-center">
                  <p className="text-sm font-black text-cyan-700 leading-tight">{totalActive}</p>
                  <p className="text-xs text-cyan-400">active</p>
                </div>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div className="tab-scroll flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap border-b-2 transition-all ${tab===t.id?"border-cyan-600 text-cyan-700 bg-cyan-50":"border-transparent text-slate-400 hover:text-slate-600"}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ready results notification */}
      {totalReady > 0 && tab !== "status" && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4">
          <button onClick={() => setTab("status")} className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-emerald-100 transition-colors text-left">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <p className="font-black text-emerald-800 text-sm">{totalReady} report{totalReady>1?"s":""} ready to download</p>
              <p className="text-xs text-emerald-600">Tap to view test status and download your results</p>
            </div>
            <span className="text-emerald-400">→</span>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
        {tab === "book"    && <BookLabTest onBooked={handleBooked} />}
        {tab === "status"  && <TestStatusSection tests={activeTests} />}
        {tab === "history" && <ReportHistorySection />}
      </div>
    </div>
  );
}
import { useState } from "react";

/* ══════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════ */
const PATIENT = {
  name: "Sophia Hartwell",
  id: "MRN-20419-HW",
  dob: "Apr 12, 1991",
  bloodType: "A+",
};

const PRESCRIPTIONS = [
  {
    id: "RX-2026-0041",
    name: "Metformin",
    brandName: "Glucophage",
    dose: "1000mg",
    form: "Tablet",
    color: "#059669",
    colorLight: "#ecfdf5",
    colorMid: "#d1fae5",
    category: "Antidiabetic",
    frequency: "Twice daily",
    timing: "With meals",
    route: "Oral",
    duration: "Ongoing",
    startDate: "Nov 20, 2025",
    nextRefill: "Mar 20, 2026",
    refillsRemaining: 4,
    totalRefills: 5,
    doctor: "Dr. Kevin Patel",
    doctorSpec: "Endocrinology",
    doctorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede",
    pharmacy: "MedCare Pharmacy, Hyderabad",
    indication: "Type 2 Diabetes Mellitus",
    status: "active",
    daysSupply: 30,
    daysLeft: 16,
    instructions: [
      { icon: "🍽️", title: "Take with food", body: "Always take Metformin with meals or just after eating to reduce stomach upset and nausea." },
      { icon: "💧", title: "Stay hydrated", body: "Drink at least 8 glasses of water daily. Good hydration supports kidney function during therapy." },
      { icon: "🚫", title: "Avoid alcohol", body: "Limit or avoid alcohol. Combining alcohol with Metformin increases the risk of lactic acidosis." },
      { icon: "⏰", title: "Consistent timing", body: "Take at the same times each day — morning and evening — to maintain steady blood sugar control." },
      { icon: "🩺", title: "Monitor blood sugar", body: "Check fasting blood glucose regularly. Report readings below 70 mg/dL to your doctor immediately." },
      { icon: "⚠️", title: "Side effects to watch", body: "Common: mild nausea, diarrhea. Rare but serious: unusual muscle pain, difficulty breathing — seek care immediately." },
    ],
    interactions: ["Alcohol", "IV Contrast dye — pause 48h before/after"],
    storage: "Store at room temperature (15–30°C). Keep away from moisture.",
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
  },
  {
    id: "RX-2026-0038",
    name: "Lisinopril",
    brandName: "Zestril",
    dose: "10mg",
    form: "Tablet",
    color: "#7c3aed",
    colorLight: "#f5f3ff",
    colorMid: "#ede9fe",
    category: "ACE Inhibitor",
    frequency: "Once daily",
    timing: "Morning, with or without food",
    route: "Oral",
    duration: "Ongoing",
    startDate: "Feb 14, 2026",
    nextRefill: "Mar 30, 2026",
    refillsRemaining: 3,
    totalRefills: 5,
    doctor: "Dr. Sandra Wu",
    doctorSpec: "Cardiology",
    doctorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandra&backgroundColor=d1d4f9",
    pharmacy: "MedCare Pharmacy, Hyderabad",
    indication: "Essential Hypertension",
    status: "active",
    daysSupply: 30,
    daysLeft: 26,
    instructions: [
      { icon: "🌅", title: "Take in the morning", body: "Take Lisinopril every morning. Taking at the same time daily keeps your blood pressure stable throughout the day." },
      { icon: "🧂", title: "Low-sodium diet", body: "Reduce salt intake. A low-sodium diet significantly enhances the blood pressure-lowering effect of this medication." },
      { icon: "🦺", title: "Watch for dizziness", body: "You may feel dizzy when standing up quickly, especially in the first weeks. Rise slowly from sitting or lying positions." },
      { icon: "🚫", title: "Avoid NSAIDs", body: "Avoid ibuprofen, naproxen, and other NSAIDs — they can reduce the effectiveness of Lisinopril and harm your kidneys." },
      { icon: "🤧", title: "Dry cough is common", body: "A persistent dry cough is a known side effect. Do not stop the medication — contact your doctor to discuss alternatives." },
      { icon: "🍌", title: "Potassium caution", body: "Avoid potassium supplements or high-potassium foods (e.g., bananas, oranges) unless directed — ACE inhibitors raise potassium." },
    ],
    interactions: ["NSAIDs", "Potassium supplements", "Potassium-sparing diuretics"],
    storage: "Store below 25°C, away from light and moisture.",
    sideEffects: ["Dry cough", "Dizziness", "Headache", "Elevated potassium"],
  },
  {
    id: "RX-2025-0172",
    name: "Atorvastatin",
    brandName: "Lipitor",
    dose: "20mg",
    form: "Tablet",
    color: "#0369a1",
    colorLight: "#f0f9ff",
    colorMid: "#e0f2fe",
    category: "Statin",
    frequency: "Once daily",
    timing: "Evening (any time)",
    route: "Oral",
    duration: "Ongoing",
    startDate: "Aug 10, 2025",
    nextRefill: "Apr 10, 2026",
    refillsRemaining: 2,
    totalRefills: 3,
    doctor: "Dr. Kevin Patel",
    doctorSpec: "Endocrinology",
    doctorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin&backgroundColor=c0aede",
    pharmacy: "Apollo Pharmacy, Hyderabad",
    indication: "Dyslipidemia",
    status: "active",
    daysSupply: 30,
    daysLeft: 37,
    instructions: [
      { icon: "🌙", title: "Take in the evening", body: "The liver produces most cholesterol at night. Taking Atorvastatin in the evening maximizes its cholesterol-lowering effect." },
      { icon: "🍇", title: "Avoid grapefruit", body: "Grapefruit and grapefruit juice interfere with how Atorvastatin is broken down. Avoid entirely during treatment." },
      { icon: "💪", title: "Report muscle pain", body: "Mild muscle aches can occur. Report any unexplained severe muscle pain, weakness, or dark-colored urine immediately — rare but serious." },
      { icon: "🧪", title: "Regular liver tests", body: "Your doctor will monitor liver function periodically. Attend all scheduled lab appointments even if you feel well." },
      { icon: "🥗", title: "Dietary changes help", body: "Continue a heart-healthy diet low in saturated fats and cholesterol. Medication and diet work together for best results." },
      { icon: "🍺", title: "Limit alcohol", body: "Excessive alcohol combined with statins increases the risk of liver problems. Keep consumption minimal." },
    ],
    interactions: ["Grapefruit juice", "Certain antibiotics (clarithromycin)", "Fibrates"],
    storage: "Store at room temperature, away from moisture and heat.",
    sideEffects: ["Muscle aches", "Headache", "Nausea", "Elevated liver enzymes (rare)"],
  },
  {
    id: "RX-2026-0055",
    name: "Aspirin",
    brandName: "Ecosprin",
    dose: "75mg",
    form: "Enteric-coated Tablet",
    color: "#dc2626",
    colorLight: "#fff1f2",
    colorMid: "#ffe4e6",
    category: "Antiplatelet",
    frequency: "Once daily",
    timing: "After breakfast",
    route: "Oral",
    duration: "Ongoing",
    startDate: "Feb 14, 2026",
    nextRefill: "Mar 25, 2026",
    refillsRemaining: 1,
    totalRefills: 5,
    doctor: "Dr. Sandra Wu",
    doctorSpec: "Cardiology",
    doctorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sandra&backgroundColor=d1d4f9",
    pharmacy: "MedCare Pharmacy, Hyderabad",
    indication: "Cardiovascular risk reduction",
    status: "active",
    daysSupply: 30,
    daysLeft: 21,
    instructions: [
      { icon: "🍳", title: "After breakfast", body: "Take low-dose aspirin after your morning meal to protect your stomach lining and reduce gastrointestinal irritation." },
      { icon: "🩹", title: "Bleeding precaution", body: "Aspirin reduces clotting. Inform any healthcare provider (including dentists) that you are on daily aspirin before procedures." },
      { icon: "🚫", title: "Don't crush or chew", body: "This is an enteric-coated tablet — swallow whole. Crushing destroys the protective coating designed to prevent stomach upset." },
      { icon: "💊", title: "Avoid other NSAIDs", body: "Do not take ibuprofen or naproxen regularly while on aspirin — they can block aspirin's heart-protective effects." },
      { icon: "🤒", title: "Notify before surgery", body: "Always tell your surgeon you take aspirin. It may need to be paused 7–10 days before any elective surgical procedure." },
      { icon: "🩺", title: "Monitor for symptoms", body: "Report any unusual bruising, prolonged bleeding from cuts, blood in urine or stools, or black tarry stools to your doctor." },
    ],
    interactions: ["NSAIDs (ibuprofen)", "Warfarin", "Clopidogrel"],
    storage: "Store below 30°C in a dry place. Keep away from children.",
    sideEffects: ["Stomach upset", "Heartburn", "Nausea", "Increased bleeding time"],
  },
];

const REFILL_HISTORY = [
  { id: "RFL-2026-0029", rx: "RX-2026-0041", med: "Metformin 1000mg", date: "Feb 18, 2026", pharmacy: "MedCare Pharmacy", status: "dispensed", qty: 60 },
  { id: "RFL-2025-0198", rx: "RX-2025-0172", med: "Atorvastatin 20mg", date: "Jan 10, 2026", pharmacy: "Apollo Pharmacy", status: "dispensed", qty: 30 },
  { id: "RFL-2025-0155", rx: "RX-2026-0038", med: "Lisinopril 10mg", date: "Dec 5, 2025", pharmacy: "MedCare Pharmacy", status: "dispensed", qty: 30 },
];

/* ══════════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════════ */
function SupplyBar({ daysLeft, daysSupply, color }: { daysLeft: number; daysSupply: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (daysLeft / daysSupply) * 100));
  const isLow = pct < 30;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className={`font-bold ${isLow ? "text-red-500" : "text-slate-500"}`}>
          {isLow ? "⚠ " : ""}{daysLeft} days left
        </span>
        <span className="text-slate-300">{daysSupply}-day supply</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: isLow ? "#ef4444" : color }}
        />
      </div>
    </div>
  );
}

function DownloadBtn({ rxId }: { rxId: string }) {
  const [state, setState] = useState("idle");
  const go = () => {
    setState("loading");
    setTimeout(() => { setState("done"); setTimeout(() => setState("idle"), 2200); }, 1400);
  };
  return (
    <button onClick={go}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        state === "done" ? "bg-green-100 text-green-700" :
        state === "loading" ? "bg-slate-100 text-slate-400" :
        "bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:shadow-sm"
      }`}>
      {state === "loading" && <span className="animate-spin text-base">⟳</span>}
      {state === "done" && <span>✓</span>}
      {state === "idle" && <span>↓</span>}
      <span>{state === "loading" ? "Generating PDF…" : state === "done" ? "Downloaded!" : "Download Rx"}</span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   INSTRUCTIONS DRAWER
══════════════════════════════════════════════════════════════════ */
function InstructionsDrawer({ rx, onClose }: { rx: typeof PRESCRIPTIONS[0]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("instructions");

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
        style={{ animation: "slideIn 0.28s cubic-bezier(.16,1,.3,1)" }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg font-black" style={{ backgroundColor: rx.color }}>
              💊
            </div>
            <div>
              <p className="font-black text-slate-900 leading-tight">{rx.name} <span className="font-normal text-slate-400">{rx.dose}</span></p>
              <p className="text-xs text-slate-400">{rx.brandName} · {rx.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors flex-shrink-0">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5 gap-1 sticky top-[69px] bg-white z-10">
          {[
            { id: "instructions", label: "Instructions" },
            { id: "details", label: "Details" },
            { id: "warnings", label: "Warnings" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-all ${activeTab === t.id ? "border-current text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
              style={activeTab === t.id ? { borderColor: rx.color, color: rx.color } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-5 space-y-4">

          {/* INSTRUCTIONS TAB */}
          {activeTab === "instructions" && (
            <>
              <div className="rounded-2xl p-4 mb-2" style={{ backgroundColor: rx.colorMid }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: rx.color }}>Quick Reference</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["Dose", rx.dose],
                    ["Frequency", rx.frequency],
                    ["Route", rx.route],
                    ["Timing", rx.timing],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white/70 rounded-xl px-3 py-2">
                      <p className="text-xs text-slate-400">{k}</p>
                      <p className="font-bold text-slate-800">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {rx.instructions.map((inst: { icon: string; title: string; body: string }, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: rx.colorLight }}>
                    {inst.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-bold text-slate-800 text-sm mb-0.5">{inst.title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{inst.body}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <>
              <div className="space-y-3">
                {[
                  { label: "Prescribed by", value: rx.doctor, sub: rx.doctorSpec },
                  { label: "Indication", value: rx.indication },
                  { label: "Start Date", value: rx.startDate },
                  { label: "Duration", value: rx.duration },
                  { label: "Pharmacy", value: rx.pharmacy },
                  { label: "Prescription ID", value: rx.id, mono: true },
                  { label: "Storage", value: rx.storage },
                ].map(row => (
                  <div key={row.label} className="bg-slate-50 rounded-2xl px-4 py-3">
                    <p className="text-xs text-slate-400 font-semibold mb-0.5">{row.label}</p>
                    <p className={`text-sm font-bold text-slate-800 ${row.mono ? "font-mono" : ""}`}>{row.value}</p>
                    {row.sub && <p className="text-xs text-slate-400">{row.sub}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* WARNINGS TAB */}
          {activeTab === "warnings" && (
            <>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-3">⚠ Drug Interactions</p>
                <div className="space-y-2">
                  {rx.interactions.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 text-sm mt-0.5">◆</span>
                      <p className="text-sm text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
                <p className="text-xs font-black text-rose-700 uppercase tracking-wider mb-3">🩺 Common Side Effects</p>
                <div className="flex flex-wrap gap-2">
                  {rx.sideEffects.map((se: string) => (
                      <span key={se} className="text-xs bg-white text-rose-600 border border-rose-200 px-2.5 py-1 rounded-full font-semibold">{se}</span>
                    ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl p-4">
                <p className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2">🔴 Emergency Signs</p>
                <p className="text-sm text-slate-400 leading-relaxed">Seek immediate medical attention if you experience: severe allergic reaction (rash, swelling, difficulty breathing), chest pain, extreme dizziness, or any sudden worsening of symptoms.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REFILL MODAL
══════════════════════════════════════════════════════════════════ */
function RefillModal({ rx, onClose, onSubmit }: { rx: typeof PRESCRIPTIONS[0]; onClose: () => void; onSubmit: (rxId: string) => void }) {
  const [pharmacy, setPharmacy] = useState(rx.pharmacy);
  const [note, setNote] = useState("");
  const [urgent, setUrgent] = useState(rx.daysLeft < 7);
  const [step, setStep] = useState("form"); // form | processing | done

  const pharmacies = [
    rx.pharmacy,
    "Apollo Pharmacy, Hyderabad",
    "Wellness Forever, Banjara Hills",
    "Frank Ross Pharmacy, Jubilee Hills",
  ];

  const submit = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2000);
  };

  if (step === "done") return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl" style={{ backgroundColor: rx.colorMid }}>
          ✅
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Refill Requested!</h3>
        <p className="text-slate-400 text-sm mb-1">Your refill request for</p>
        <p className="font-black text-slate-800 mb-4">{rx.name} {rx.dose}</p>
        <div className="rounded-2xl p-4 mb-6 text-left space-y-2 text-sm" style={{ backgroundColor: rx.colorLight }}>
          <div className="flex justify-between"><span className="text-slate-400">Pharmacy</span><span className="font-bold text-slate-700 text-right max-w-[60%]">{pharmacy}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Request ID</span><span className="font-mono font-bold text-slate-700">RFL-{Date.now().toString().slice(-6)}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Expected</span><span className="font-bold text-slate-700">24–48 hours</span></div>
          {urgent && <div className="flex items-center gap-1 text-red-600 font-bold"><span>⚡</span><span>Marked urgent</span></div>}
        </div>
        <button onClick={() => { onSubmit(rx.id); onClose(); }}
          className="w-full py-3 rounded-2xl text-white font-black transition-all" style={{ backgroundColor: rx.color }}>
          Done
        </button>
      </div>
    </div>
  );

  if (step === "processing") return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-10 text-center shadow-2xl">
        <div className="text-5xl mb-4 animate-bounce">💊</div>
        <h3 className="text-lg font-black text-slate-800 mb-2">Submitting Request…</h3>
        <p className="text-slate-400 text-sm mb-6">Contacting pharmacy and verifying prescription</p>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full animate-pulse" style={{ width: "65%", backgroundColor: rx.color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: rx.colorLight }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: rx.colorMid }}>💊</div>
            <div>
              <h3 className="font-black text-slate-900">Request Refill</h3>
              <p className="text-xs text-slate-400">{rx.name} {rx.dose} · {rx.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/60 hover:bg-white flex items-center justify-center text-slate-500 text-sm">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status info */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: rx.colorLight }}>
              <p className="text-xs text-slate-400">Refills Left</p>
              <p className="font-black" style={{ color: rx.color }}>{rx.refillsRemaining}</p>
            </div>
            <div className={`rounded-xl p-2.5 ${rx.daysLeft < 7 ? "bg-red-50" : "bg-amber-50"}`}>
              <p className="text-xs text-slate-400">Days Left</p>
              <p className={`font-black ${rx.daysLeft < 7 ? "text-red-600" : "text-amber-600"}`}>{rx.daysLeft}</p>
            </div>
            <div className="rounded-xl p-2.5 bg-slate-50">
              <p className="text-xs text-slate-400">Next Refill</p>
              <p className="font-black text-slate-700 text-xs leading-tight">{rx.nextRefill}</p>
            </div>
          </div>

          {rx.refillsRemaining === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex gap-2">
              <span className="text-red-500">⚠</span>
              <p className="text-xs text-red-700 font-semibold">No refills remaining. A new prescription from Dr. {rx.doctor.split(" ").slice(-1)} is required.</p>
            </div>
          )}

          {rx.refillsRemaining > 0 && (
            <>
              {/* Urgent toggle */}
              {rx.daysLeft < 10 && (
                <div className={`rounded-2xl p-3 flex items-center justify-between cursor-pointer border-2 transition-all ${urgent ? "bg-red-50 border-red-300" : "bg-slate-50 border-transparent"}`}
                  onClick={() => setUrgent(!urgent)}>
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Mark as Urgent</p>
                      <p className="text-xs text-slate-400">You have {rx.daysLeft} days of supply left</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-all relative ${urgent ? "bg-red-500" : "bg-slate-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${urgent ? "left-5" : "left-1"}`} />
                  </div>
                </div>
              )}

              {/* Pharmacy picker */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Pharmacy</p>
                <div className="space-y-2">
                  {pharmacies.map(p => (
                    <button key={p} onClick={() => setPharmacy(p)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm text-left transition-all ${pharmacy === p ? "border-current bg-opacity-10" : "border-slate-100 hover:border-slate-300"}`}
                      style={pharmacy === p ? { borderColor: rx.color, backgroundColor: rx.colorLight } : {}}>
                      <span className={`font-semibold ${pharmacy === p ? "text-slate-900" : "text-slate-600"}`}>{p}</span>
                      {pharmacy === p && <span style={{ color: rx.color }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Note to Pharmacy (optional)</p>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                  placeholder="Any special requests or instructions…"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 resize-none text-slate-700 placeholder-slate-300"
                  style={{ "--tw-ring-color": rx.color } as any} />
              </div>

              <button onClick={submit}
                className="w-full py-3.5 rounded-2xl text-white font-black text-base shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl"
                style={{ backgroundColor: rx.color, boxShadow: `0 8px 24px ${rx.color}33` }}>
                Submit Refill Request
              </button>
            </>
          )}

          {rx.refillsRemaining === 0 && (
            <button className="w-full py-3.5 rounded-2xl bg-slate-800 text-white font-black text-base hover:bg-slate-700 transition-all">
              Contact Dr. {rx.doctor.split(" ").slice(-1)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PRESCRIPTION CARD
══════════════════════════════════════════════════════════════════ */
function RxCard({ rx, onViewInstructions, onRequestRefill }: { rx: typeof PRESCRIPTIONS[0]; onViewInstructions: (rx: typeof PRESCRIPTIONS[0]) => void; onRequestRefill: (rx: typeof PRESCRIPTIONS[0]) => void }) {
  const isLowRefills = rx.refillsRemaining <= 1;
  const isLowSupply = rx.daysLeft < 10;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
      {/* Top color bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: rx.color }} />

      <div className="p-5">
        {/* Med name row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
              style={{ backgroundColor: rx.colorLight }}>
              💊
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-slate-900 text-lg leading-tight">{rx.name}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: rx.color }}>{rx.dose}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{rx.brandName} · {rx.category}</p>
            </div>
          </div>

          {/* Refills badge */}
          <div className={`flex-shrink-0 text-center px-3 py-1.5 rounded-2xl border ${isLowRefills ? "bg-red-50 border-red-200" : "border-slate-100 bg-slate-50"}`}>
            <p className={`text-lg font-black leading-tight ${isLowRefills ? "text-red-600" : "text-slate-700"}`}>{rx.refillsRemaining}</p>
            <p className="text-xs text-slate-400">refills</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Frequency", value: rx.frequency, icon: "🕐" },
            { label: "Timing", value: rx.timing, icon: "⏱" },
            { label: "For", value: rx.indication, icon: "🩺" },
            { label: "Doctor", value: rx.doctor, icon: "👨‍⚕️" },
          ].map(d => (
            <div key={d.label} className="rounded-xl px-3 py-2" style={{ backgroundColor: rx.colorLight }}>
              <p className="text-xs text-slate-400 mb-0.5">{d.icon} {d.label}</p>
              <p className="text-xs font-bold text-slate-800 leading-snug">{d.value}</p>
            </div>
          ))}
        </div>

        {/* Supply bar */}
        <div className="mb-4">
          <SupplyBar daysLeft={rx.daysLeft} daysSupply={rx.daysSupply} color={rx.color} />
        </div>

        {/* Alerts */}
        {(isLowSupply || isLowRefills) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {isLowSupply && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                <span className="text-red-500 text-sm">⚠</span>
                <p className="text-xs text-red-700 font-bold">Only {rx.daysLeft} days of medicine left</p>
              </div>
            )}
            {isLowRefills && rx.refillsRemaining > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                <span className="text-amber-500 text-sm">🔔</span>
                <p className="text-xs text-amber-700 font-bold">Last refill remaining</p>
              </div>
            )}
            {rx.refillsRemaining === 0 && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                <span className="text-red-500 text-sm">🚫</span>
                <p className="text-xs text-red-700 font-bold">No refills — contact doctor</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => onViewInstructions(rx)}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all hover:shadow-md active:scale-[0.98]"
            style={{ borderColor: rx.color, color: rx.color, backgroundColor: rx.colorLight }}>
            📋 Instructions
          </button>
          <button onClick={() => onRequestRefill(rx)}
            className="flex-1 py-2.5 rounded-2xl text-sm font-black text-white transition-all hover:shadow-lg active:scale-[0.98]"
            style={{ backgroundColor: rx.color, boxShadow: `0 4px 12px ${rx.color}33` }}>
            🔄 Refill
          </button>
        </div>

        {/* Download link */}
        <div className="mt-2 flex justify-center">
          <DownloadBtn rxId={rx.id} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   REFILL HISTORY
══════════════════════════════════════════════════════════════════ */
function RefillHistoryTab() {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-4">{REFILL_HISTORY.length} past refills</p>
      <div className="space-y-3">
        {REFILL_HISTORY.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">✅</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm">{r.med}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.pharmacy}</p>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">{r.id}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 capitalize">{r.status}</span>
              <p className="text-xs text-slate-400 mt-1">{r.date}</p>
              <p className="text-xs text-slate-300">{r.qty} tablets</p>
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
const TABS = [
  { id: "active", label: "Active Prescriptions", icon: "💊" },
  { id: "history", label: "Refill History", icon: "📜" },
];

export default function PrescriptionModule() {
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [instructionsRx, setInstructionsRx] = useState<typeof PRESCRIPTIONS[0] | null>(null);
  const [refillRx, setRefillRx] = useState<typeof PRESCRIPTIONS[0] | null>(null);
  const [rxList, setRxList] = useState(PRESCRIPTIONS);

  const filtered = rxList.filter(rx =>
    rx.name.toLowerCase().includes(search.toLowerCase()) ||
    rx.indication.toLowerCase().includes(search.toLowerCase()) ||
    rx.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefillSubmit = (rxId: string) => {
    setRxList(prev => prev.map(rx =>
      rx.id === rxId ? { ...rx, refillsRemaining: Math.max(0, rx.refillsRemaining - 1), daysLeft: rx.daysSupply } : rx
    ));
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: "linear-gradient(160deg, #f8fafc 0%, #f1f5f9 40%, #faf8ff 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .tab-scroll::-webkit-scrollbar { display:none; }
        .tab-scroll { scrollbar-width:none; }
      `}</style>

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-lg shadow-md">💊</div>
              <div>
                <h1 className="font-black text-slate-900 text-base leading-tight">Prescriptions</h1>
                <p className="text-xs text-slate-400">{PATIENT.name} · {PATIENT.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-violet-50 border border-violet-200 rounded-2xl px-3 py-1.5 text-center">
                <p className="text-lg font-black text-violet-700 leading-tight">{rxList.filter(r => r.status === "active").length}</p>
                <p className="text-xs text-violet-400">active</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-scroll flex gap-1 overflow-x-auto pb-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap border-b-2 transition-all ${
                  tab === t.id ? "border-violet-600 text-violet-700 bg-violet-50" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

        {tab === "active" && (
          <>
            {/* Alert bar for urgent */}
            {rxList.some(r => r.daysLeft < 7) && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
                <span className="text-red-500 text-xl">🔔</span>
                <div>
                  <p className="font-black text-red-800 text-sm">Action Required</p>
                  <p className="text-xs text-red-600">{rxList.filter(r => r.daysLeft < 7).length} prescription{rxList.filter(r => r.daysLeft < 7).length > 1 ? "s" : ""} running critically low — request refills immediately.</p>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search medicines, conditions, doctors…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm placeholder-slate-300 text-slate-700" />
            </div>

            {/* Supply overview strip */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Supply Overview</p>
              <div className="space-y-2.5">
                {rxList.map(rx => (
                  <div key={rx.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: rx.color }} />
                    <span className="text-xs font-semibold text-slate-600 w-28 flex-shrink-0 truncate">{rx.name}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100,(rx.daysLeft/rx.daysSupply)*100)}%`, backgroundColor: rx.daysLeft < 10 ? "#ef4444" : rx.color }} />
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0 w-14 text-right">{rx.daysLeft}d left</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map(rx => (
                  <RxCard key={rx.id} rx={rx} onViewInstructions={setInstructionsRx} onRequestRefill={setRefillRx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-300">
                <p className="text-4xl mb-3">💊</p>
                <p className="font-bold">No prescriptions match your search</p>
              </div>
            )}
          </>
        )}

        {tab === "history" && <RefillHistoryTab />}
      </div>

      {/* ── MODALS ── */}
      {instructionsRx && <InstructionsDrawer rx={instructionsRx} onClose={() => setInstructionsRx(null)} />}
      {refillRx && <RefillModal rx={refillRx} onClose={() => setRefillRx(null)} onSubmit={handleRefillSubmit} />}
    </div>
  );
}
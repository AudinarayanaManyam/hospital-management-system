// import React from 'react';
// import { Download, Upload, FileText, FlaskConical, Scan, ClipboardList, Stethoscope, Edit } from 'lucide-react';

// // Mock data for demonstration
// const medicalHistory = [
//   { date: '2025-12-10', summary: 'Admitted for hypertension', doctor: 'Dr. Smith' },
//   { date: '2026-01-15', summary: 'Routine checkup', doctor: 'Dr. Lee' },
// ];

// const labReports = [
//   { id: 1, name: 'Blood Test', date: '2026-02-20', status: 'Normal', pdf: true },
//   { id: 2, name: 'Lipid Profile', date: '2026-01-10', status: 'High Cholesterol', pdf: true },
// ];

// const scanReports = [
//   { id: 1, name: 'Chest X-Ray', date: '2026-02-05', status: 'Normal', pdf: true },
// ];

// const prescriptions = [
//   { id: 1, date: '2026-02-20', doctor: 'Dr. Smith', medicine: 'Amlodipine', download: true },
//   { id: 2, date: '2026-01-10', doctor: 'Dr. Lee', medicine: 'Atorvastatin', download: true },
// ];

// const diagnosisDetails = [
//   { date: '2026-02-20', diagnosis: 'Hypertension', doctor: 'Dr. Smith' },
// ];

// const treatmentHistory = [
//   { date: '2026-02-20', treatment: 'Medication: Amlodipine', doctor: 'Dr. Smith' },
// ];

// export default function MedicalRecords() {
//   return (
//     <div className="space-y-8">
//       <h1 className="page-title">Medical Records</h1>
//       {/* Medical History */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><ClipboardList className="w-5 h-5 text-primary-600" /><span className="font-semibold">Medical History</span></div>
//         <ul className="space-y-2">
//           {medicalHistory.map((h, i) => (
//             <li key={i} className="border-b pb-2">
//               <div className="font-medium">{h.summary}</div>
//               <div className="text-xs text-gray-600">{h.date} by {h.doctor}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Lab Reports */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><FlaskConical className="w-5 h-5 text-primary-600" /><span className="font-semibold">Lab Reports</span></div>
//         <ul className="space-y-2">
//           {labReports.map(r => (
//             <li key={r.id} className="border-b pb-2 flex items-center justify-between">
//               <div>
//                 <div className="font-medium">{r.name}</div>
//                 <div className="text-xs text-gray-600">{r.date} - {r.status}</div>
//               </div>
//               {r.pdf && <button className="btn-icon" title="Download PDF"><Download className="w-4 h-4" /></button>}
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Scan Reports */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><Scan className="w-5 h-5 text-primary-600" /><span className="font-semibold">Scan Reports</span></div>
//         <ul className="space-y-2">
//           {scanReports.map(r => (
//             <li key={r.id} className="border-b pb-2 flex items-center justify-between">
//               <div>
//                 <div className="font-medium">{r.name}</div>
//                 <div className="text-xs text-gray-600">{r.date} - {r.status}</div>
//               </div>
//               {r.pdf && <button className="btn-icon" title="Download PDF"><Download className="w-4 h-4" /></button>}
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Prescriptions */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-primary-600" /><span className="font-semibold">Prescriptions</span></div>
//         <ul className="space-y-2">
//           {prescriptions.map(p => (
//             <li key={p.id} className="border-b pb-2 flex items-center justify-between">
//               <div>
//                 <div className="font-medium">{p.medicine}</div>
//                 <div className="text-xs text-gray-600">{p.date} by {p.doctor}</div>
//               </div>
//               {p.download && <button className="btn-icon" title="Download Prescription"><Download className="w-4 h-4" /></button>}
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Diagnosis Details */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><Stethoscope className="w-5 h-5 text-primary-600" /><span className="font-semibold">Diagnosis Details</span></div>
//         <ul className="space-y-2">
//           {diagnosisDetails.map((d, i) => (
//             <li key={i} className="border-b pb-2">
//               <div className="font-medium">{d.diagnosis}</div>
//               <div className="text-xs text-gray-600">{d.date} by {d.doctor}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Treatment History */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><Edit className="w-5 h-5 text-primary-600" /><span className="font-semibold">Treatment History</span></div>
//         <ul className="space-y-2">
//           {treatmentHistory.map((t, i) => (
//             <li key={i} className="border-b pb-2">
//               <div className="font-medium">{t.treatment}</div>
//               <div className="text-xs text-gray-600">{t.date} by {t.doctor}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Upload External Reports */}
//       <div className="card p-6">
//         <div className="flex items-center gap-2 mb-4"><Upload className="w-5 h-5 text-primary-600" /><span className="font-semibold">Upload External Reports</span></div>
//         <input type="file" className="mb-2" />
//         <button className="btn-primary">Upload</button>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const PATIENT = {
  name: "Sophia Hartwell", id: "MRN-20419-HW", dob: "Apr 12, 1991",
  bloodType: "A+", gender: "Female", phone: "+1 (555) 219-4087",
};

const MEDICAL_HISTORY = [
  { id: "mh1", year: 2026, month: "Feb", event: "Annual Physical Examination", doctor: "Dr. Elaine Morrow", dept: "General Practice", notes: "Blood pressure elevated. Recommended dietary changes and follow-up in 6 weeks.", severity: "moderate", tags: ["Hypertension","Routine"] },
  { id: "mh2", year: 2025, month: "Nov", event: "Diabetic Review", doctor: "Dr. Kevin Patel", dept: "Endocrinology", notes: "HbA1c at 7.1%. Dosage of Metformin increased to 1000mg twice daily.", severity: "moderate", tags: ["Diabetes","Medication Change"] },
  { id: "mh3", year: 2025, month: "Aug", event: "Cardiac Stress Test", doctor: "Dr. Sandra Wu", dept: "Cardiology", notes: "Exercise ECG within normal limits. No ischemic changes observed.", severity: "low", tags: ["Cardiology","Preventive"] },
  { id: "mh4", year: 2025, month: "Mar", event: "ER Visit — Chest Pain", doctor: "Dr. Amir Khalil", dept: "Emergency", notes: "Ruled out MI. Diagnosed as musculoskeletal pain secondary to stress. Discharged.", severity: "high", tags: ["Emergency","Chest Pain"] },
  { id: "mh5", year: 2024, month: "Oct", event: "Dermatology Consultation", doctor: "Dr. Luca Romano", dept: "Dermatology", notes: "Mild eczema on forearms. Prescribed hydrocortisone cream.", severity: "low", tags: ["Dermatology","Skin"] },
];

const LAB_REPORTS = [
  { id: "lb1", name: "Complete Blood Count (CBC)", date: "Feb 14, 2026", doctor: "Dr. Elaine Morrow", lab: "LifeLab Diagnostics", status: "normal", size: "1.2 MB", results: [{ test:"WBC", value:"7.2", unit:"×10³/µL", range:"4.5–11.0", flag:"" },{ test:"RBC", value:"4.1", unit:"×10⁶/µL", range:"3.8–5.1", flag:"" },{ test:"Hemoglobin", value:"12.8", unit:"g/dL", range:"12.0–16.0", flag:"" },{ test:"Hematocrit", value:"38.5", unit:"%", range:"36–46", flag:"" },{ test:"Platelets", value:"285", unit:"×10³/µL", range:"150–400", flag:"" }] },
  { id: "lb2", name: "HbA1c & Glucose Panel", date: "Nov 20, 2025", doctor: "Dr. Kevin Patel", lab: "PathCare Labs", status: "abnormal", size: "0.9 MB", results: [{ test:"HbA1c", value:"7.1", unit:"%", range:"<6.5", flag:"H" },{ test:"Fasting Glucose", value:"138", unit:"mg/dL", range:"70–99", flag:"H" },{ test:"Insulin", value:"14.2", unit:"µIU/mL", range:"2.6–24.9", flag:"" }] },
  { id: "lb3", name: "Lipid Profile", date: "Aug 10, 2025", doctor: "Dr. Sandra Wu", lab: "LifeLab Diagnostics", status: "normal", size: "0.7 MB", results: [{ test:"Total Cholesterol", value:"182", unit:"mg/dL", range:"<200", flag:"" },{ test:"LDL", value:"105", unit:"mg/dL", range:"<130", flag:"" },{ test:"HDL", value:"58", unit:"mg/dL", range:">50", flag:"" },{ test:"Triglycerides", value:"148", unit:"mg/dL", range:"<150", flag:"" }] },
  { id: "lb4", name: "Thyroid Function Test", date: "Mar 5, 2025", doctor: "Dr. Elaine Morrow", lab: "Apollo Diagnostics", status: "normal", size: "0.8 MB", results: [{ test:"TSH", value:"2.4", unit:"mIU/L", range:"0.4–4.0", flag:"" },{ test:"Free T4", value:"1.2", unit:"ng/dL", range:"0.8–1.8", flag:"" },{ test:"Free T3", value:"3.1", unit:"pg/mL", range:"2.3–4.2", flag:"" }] },
];

const SCAN_REPORTS = [
  { id: "sc1", name: "Chest X-Ray", date: "Mar 5, 2025", doctor: "Dr. Amir Khalil", modality: "X-Ray", bodyPart: "Chest", findings: "No active cardiopulmonary disease. Heart size normal. No pleural effusion.", impression: "Normal chest radiograph.", size: "3.4 MB", color: "#0369a1" },
  { id: "sc2", name: "Abdominal Ultrasound", date: "Aug 10, 2025", doctor: "Dr. Sandra Wu", modality: "Ultrasound", bodyPart: "Abdomen", findings: "Liver, spleen, and kidneys appear normal. No masses or fluid collections.", impression: "Unremarkable abdominal ultrasound.", size: "2.1 MB", color: "#7c3aed" },
  { id: "sc3", name: "Echocardiogram", date: "Feb 14, 2026", doctor: "Dr. Sandra Wu", modality: "Echo", bodyPart: "Heart", findings: "Normal LV function. EF 62%. No valvular abnormalities.", impression: "Normal echocardiogram. Good cardiac function.", size: "5.7 MB", color: "#be123c" },
  { id: "sc4", name: "Brain MRI", date: "Nov 20, 2025", doctor: "Dr. James Okafor", modality: "MRI", bodyPart: "Brain", findings: "No intracranial mass, hemorrhage, or infarction. Normal ventricular system.", impression: "Normal brain MRI.", size: "8.2 MB", color: "#0d9488" },
];

const PRESCRIPTIONS = [
  { id: "rx1", name: "Metformin", dose: "1000mg", frequency: "Twice daily", route: "Oral", doctor: "Dr. Kevin Patel", date: "Nov 20, 2025", duration: "Ongoing", refills: 5, status: "active", indication: "Type 2 Diabetes", color: "#0d9488" },
  { id: "rx2", name: "Lisinopril", dose: "10mg", frequency: "Once daily", route: "Oral", doctor: "Dr. Sandra Wu", date: "Feb 14, 2026", duration: "Ongoing", refills: 3, status: "active", indication: "Hypertension", color: "#7c3aed" },
  { id: "rx3", name: "Atorvastatin", dose: "20mg", frequency: "Once daily (evening)", route: "Oral", doctor: "Dr. Kevin Patel", date: "Aug 10, 2025", duration: "Ongoing", refills: 2, status: "active", indication: "Dyslipidemia", color: "#0369a1" },
  { id: "rx4", name: "Hydrocortisone Cream 1%", dose: "Apply thin layer", frequency: "Twice daily", route: "Topical", doctor: "Dr. Luca Romano", date: "Oct 5, 2024", duration: "2 weeks", refills: 0, status: "completed", indication: "Eczema", color: "#b45309" },
  { id: "rx5", name: "Ibuprofen", dose: "400mg", frequency: "Every 6–8h as needed", route: "Oral", doctor: "Dr. Amir Khalil", date: "Mar 5, 2025", duration: "7 days", refills: 0, status: "completed", indication: "Musculoskeletal pain", color: "#be123c" },
];

const DIAGNOSES = [
  { id: "dg1", condition: "Type 2 Diabetes Mellitus", icd: "E11.9", onset: "2022", status: "active", severity: "moderate", doctor: "Dr. Kevin Patel", dept: "Endocrinology", notes: "Well-controlled with medication and lifestyle modification. Regular monitoring required.", color: "#0d9488" },
  { id: "dg2", condition: "Essential Hypertension", icd: "I10", onset: "2023", status: "active", severity: "moderate", doctor: "Dr. Sandra Wu", dept: "Cardiology", notes: "On ACE inhibitor therapy. Blood pressure target <130/80 mmHg.", color: "#7c3aed" },
  { id: "dg3", condition: "Dyslipidemia", icd: "E78.5", onset: "2023", status: "active", severity: "low", doctor: "Dr. Kevin Patel", dept: "Endocrinology", notes: "Total cholesterol improving with statin therapy. Dietary counseling ongoing.", color: "#0369a1" },
  { id: "dg4", condition: "Atopic Dermatitis (Eczema)", icd: "L20.9", onset: "2024", status: "resolved", severity: "low", doctor: "Dr. Luca Romano", dept: "Dermatology", notes: "Resolved with topical corticosteroid therapy. Avoid triggering allergens.", color: "#b45309" },
];

const TREATMENTS = [
  { id: "tr1", name: "Diabetes Management Program", start: "Jan 2023", end: "Ongoing", doctor: "Dr. Kevin Patel", type: "Lifestyle + Medication", sessions: 18, progress: 72, status: "active", description: "Combination of dietary counseling, exercise prescription, and pharmacotherapy." },
  { id: "tr2", name: "Hypertension Control Protocol", start: "Mar 2023", end: "Ongoing", doctor: "Dr. Sandra Wu", type: "Medication", sessions: 12, progress: 60, status: "active", description: "ACE inhibitor therapy with regular BP monitoring and low-sodium diet." },
  { id: "tr3", name: "Cardiac Rehabilitation", start: "Mar 2025", end: "May 2025", doctor: "Dr. Sandra Wu", type: "Physical Therapy", sessions: 24, progress: 100, status: "completed", description: "Post-ER visit exercise and stress management program." },
];

const UPLOADED = [
  { id: "up1", name: "Previous Hospital Discharge Summary.pdf", date: "Jan 5, 2026", size: "2.3 MB", type: "pdf", uploadedBy: "Patient" },
  { id: "up2", name: "Foreign Lab Report - Dubai 2024.pdf", date: "Sep 12, 2024", size: "1.1 MB", type: "pdf", uploadedBy: "Patient" },
];

/* ══════════════════════════════════════════════════════════
   HELPERS & MICRO COMPONENTS
══════════════════════════════════════════════════════════ */
const severityBadge = { high: "bg-red-100 text-red-700 border-red-200", moderate: "bg-amber-100 text-amber-700 border-amber-200", low: "bg-emerald-100 text-emerald-700 border-emerald-200" };
const statusBadge = { active: "bg-violet-100 text-violet-700 border-violet-200", completed: "bg-slate-100 text-slate-500 border-slate-200", resolved: "bg-emerald-100 text-emerald-700 border-emerald-200", abnormal: "bg-red-100 text-red-700 border-red-200", normal: "bg-emerald-100 text-emerald-700 border-emerald-200" };

function Badge({ label, type = "status" }: { label: string; type?: string }) {
  const styles = { ...statusBadge, ...severityBadge };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${styles[label as keyof typeof styles] || "bg-slate-100 text-slate-500 border-slate-200"}`}>{label}</span>;
}

function DownloadBtn({ label = "Download PDF", size }: { label?: string; size?: string }) {
  const [state, setState] = useState("idle");
  const handle = () => {
    setState("loading");
    setTimeout(() => { setState("done"); setTimeout(() => setState("idle"), 2000); }, 1200);
  };
  return (
    <button onClick={handle} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${state === "done" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
      {state === "loading" ? <span className="animate-spin">⟳</span> : state === "done" ? "✓" : "↓"}
      {state === "loading" ? "Preparing…" : state === "done" ? "Downloaded!" : label}
      {size && state === "idle" && <span className="opacity-60 font-normal">· {size}</span>}
    </button>
  );
}

function SectionHeader({ title, count, icon }: { title: string; count?: number; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
      <div>
        <h2 className="font-extrabold text-slate-900 text-lg leading-tight">{title}</h2>
        {count !== undefined && <p className="text-xs text-slate-400 font-medium">{count} records</p>}
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative mb-4">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700 placeholder-slate-300" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: MEDICAL HISTORY
══════════════════════════════════════════════════════════ */
function MedicalHistorySection() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = MEDICAL_HISTORY.filter(h => h.event.toLowerCase().includes(search.toLowerCase()) || h.doctor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Medical History" count={MEDICAL_HISTORY.length} icon="📋" />
      <SearchBar value={search} onChange={setSearch} placeholder="Search events or doctors…" />
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
        <div className="space-y-4 pl-10">
          {filtered.map(h => (
            <div key={h.id} className="relative">
              <div className={`absolute -left-6 top-4 w-4 h-4 rounded-full border-2 border-white shadow ring-2 ${h.severity === "high" ? "bg-red-400 ring-red-200" : h.severity === "moderate" ? "bg-amber-400 ring-amber-200" : "bg-emerald-400 ring-emerald-200"}`} />
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <button className="w-full text-left p-4" onClick={() => setExpanded(expanded === h.id ? null : h.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">{h.month} {h.year}</span>
                        <Badge label={h.severity} />
                      </div>
                      <p className="font-bold text-slate-800">{h.event}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{h.doctor} · {h.dept}</p>
                    </div>
                    <span className={`text-slate-400 transition-transform ${expanded === h.id ? "rotate-180" : ""}`}>▾</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.tags.map(t => <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </button>
                {expanded === h.id && (
                  <div className="px-4 pb-4 border-t border-slate-50 pt-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{h.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: LAB REPORTS
══════════════════════════════════════════════════════════ */
function LabReportsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div>
      <SectionHeader title="Lab Reports" count={LAB_REPORTS.length} icon="🧪" />
      <div className="space-y-3">
        {LAB_REPORTS.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <button className="w-full text-left p-4 flex items-center gap-3" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${r.status === "abnormal" ? "bg-red-50" : "bg-emerald-50"}`}>
                {r.status === "abnormal" ? "⚠️" : "✅"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">{r.name}</p>
                <p className="text-xs text-slate-400">{r.date} · {r.lab}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={r.status} />
                <span className={`text-slate-400 transition-transform text-sm ${expanded === r.id ? "rotate-180" : ""}`}>▾</span>
              </div>
            </button>
            {expanded === r.id && (
              <div className="border-t border-slate-50 p-4">
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-2 text-slate-400 font-semibold pr-4">Test</th>
                        <th className="pb-2 text-slate-400 font-semibold pr-4">Result</th>
                        <th className="pb-2 text-slate-400 font-semibold pr-4">Unit</th>
                        <th className="pb-2 text-slate-400 font-semibold">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {r.results.map(res => (
                        <tr key={res.test} className={res.flag ? "bg-red-50/50" : ""}>
                          <td className="py-2 pr-4 font-medium text-slate-700">{res.test}</td>
                          <td className={`py-2 pr-4 font-bold ${res.flag ? "text-red-600" : "text-emerald-700"}`}>{res.value} {res.flag && <span className="ml-1 text-red-500 text-xs">[{res.flag}]</span>}</td>
                          <td className="py-2 pr-4 text-slate-400">{res.unit}</td>
                          <td className="py-2 text-slate-400">{res.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">Ordered by: {r.doctor}</p>
                  <DownloadBtn size={r.size} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: SCAN REPORTS
══════════════════════════════════════════════════════════ */
function ScanReportsSection() {
  const [selected, setSelected] = useState<typeof SCAN_REPORTS[0] | null>(null);
  const modalityIcon: Record<string, string> = { "X-Ray": "🩻", "Ultrasound": "🔊", "Echo": "🫀", "MRI": "🧲", "CT": "💿" };

  return (
    <div>
      <SectionHeader title="Scan Reports" count={SCAN_REPORTS.length} icon="🩻" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SCAN_REPORTS.map(s => (
          <button key={s.id} onClick={() => setSelected(s)}
            className="bg-white rounded-2xl border border-slate-100 p-4 text-left shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: s.color + "18" }}>
                {modalityIcon[s.modality] || "📄"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.date} · {s.modality}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{s.impression}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: s.color }}>{s.bodyPart}</span>
              <span className="text-xs text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View details →</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{modalityIcon[selected.modality]}</span>
                <div>
                  <h3 className="font-extrabold text-slate-800">{selected.name}</h3>
                  <p className="text-xs text-slate-400">{selected.date} · {selected.doctor}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">✕</button>
            </div>
            <div className="p-5">
              <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, ${selected.color} 0%, transparent 70%)` }} />
                <div className="text-center relative z-10">
                  <p className="text-4xl mb-2">{modalityIcon[selected.modality]}</p>
                  <p className="text-slate-400 text-sm font-medium">{selected.modality} Scan Preview</p>
                  <p className="text-slate-500 text-xs mt-1">{selected.bodyPart} · {selected.size}</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Findings</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selected.findings}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <p className="text-xs font-bold text-amber-600 uppercase mb-1">Impression</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selected.impression}</p>
                </div>
              </div>
              <DownloadBtn label="Download Report" size={selected.size} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: PRESCRIPTIONS
══════════════════════════════════════════════════════════ */
function PrescriptionsSection() {
  const [filter, setFilter] = useState("all");
  const filtered = PRESCRIPTIONS.filter(p => filter === "all" || p.status === filter);

  return (
    <div>
      <SectionHeader title="Prescriptions" count={PRESCRIPTIONS.length} icon="💊" />
      <div className="flex gap-2 mb-4">
        {["all","active","completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filter === f ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(rx => (
          <div key={rx.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-3 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: rx.color + "60", borderLeft: `3px solid ${rx.color}` }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="font-bold text-slate-800">{rx.name} <span className="font-normal text-slate-400 text-sm">{rx.dose}</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">{rx.indication}</p>
                </div>
                <Badge label={rx.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
                <span>🕐 {rx.frequency}</span>
                <span>💊 {rx.route}</span>
                <span>📅 {rx.date}</span>
                {rx.refills > 0 && <span>🔄 {rx.refills} refills</span>}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{rx.doctor} · {rx.duration}</p>
                <DownloadBtn label="Download Rx" size="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: DIAGNOSES
══════════════════════════════════════════════════════════ */
function DiagnosesSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div>
      <SectionHeader title="Diagnosis Details" count={DIAGNOSES.length} icon="🔬" />
      <div className="space-y-3">
        {DIAGNOSES.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <button className="w-full text-left p-4 flex items-center gap-4" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-extrabold text-white" style={{ backgroundColor: d.color }}>
                {d.icd.split(".")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{d.condition}</p>
                <p className="text-xs text-slate-400">ICD-10: {d.icd} · Since {d.onset}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={d.severity} />
                <Badge label={d.status} />
                <span className={`text-slate-400 text-sm transition-transform ${expanded === d.id ? "rotate-180" : ""}`}>▾</span>
              </div>
            </button>
            {expanded === d.id && (
              <div className="border-t border-slate-50 px-4 pb-4 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 mb-1">MANAGING PHYSICIAN</p>
                  <p className="text-sm font-semibold text-slate-700">{d.doctor}</p>
                  <p className="text-xs text-slate-400">{d.dept}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-slate-400 mb-1">CLINICAL NOTES</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{d.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: TREATMENT HISTORY
══════════════════════════════════════════════════════════ */
function TreatmentHistorySection() {
  return (
    <div>
      <SectionHeader title="Treatment History" count={TREATMENTS.length} icon="🏥" />
      <div className="space-y-4">
        {TREATMENTS.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-extrabold text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.doctor} · {t.type}</p>
              </div>
              <Badge label={t.status} />
            </div>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{t.description}</p>
            <div className="flex gap-4 text-xs text-slate-500 mb-3 flex-wrap">
              <span>📅 {t.start} → {t.end}</span>
              <span>📊 {t.sessions} sessions</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500">Progress</span>
                <span className="text-xs font-bold text-amber-600">{t.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${t.progress}%`, background: t.progress === 100 ? "#10b981" : "linear-gradient(90deg, #f59e0b, #d97706)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: UPLOAD EXTERNAL REPORTS
══════════════════════════════════════════════════════════ */
function UploadSection() {
  const [uploads, setUploads] = useState(UPLOADED);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: any[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploads(prev => [{
            id: "up" + Date.now(), name: file.name,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            size: (file.size / 1024 / 1024).toFixed(1) + " MB",
            type: file.name.split(".").pop().toLowerCase(), uploadedBy: "Patient"
          }, ...prev]);
          return 0;
        }
        return p + 8;
      });
    }, 100);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  const typeIcon: Record<string, string> = { pdf: "📄", jpg: "🖼️", png: "🖼️", docx: "📝" };

  return (
    <div>
      <SectionHeader title="Upload External Reports" count={uploads.length} icon="📤" />

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer mb-5 transition-all ${dragging ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"}`}
      >
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={e => e.target.files && handleFiles(Array.from(e.target.files))} />
        {uploading ? (
          <div>
            <p className="text-2xl mb-2 animate-bounce">📤</p>
            <p className="font-bold text-slate-700 mb-3">Uploading…</p>
            <div className="w-full max-w-xs mx-auto h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{progress}%</p>
          </div>
        ) : (
          <>
            <p className="text-3xl mb-2">📁</p>
            <p className="font-bold text-slate-700 mb-1">Drop your file here</p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG, DOCX · Max 20MB</p>
            <button className="mt-3 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors">Browse Files</button>
          </>
        )}
      </div>

      {/* Uploaded Files */}
      <div className="space-y-2">
        {uploads.map(f => (
          <div key={f.id} className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xl flex-shrink-0">{typeIcon[f.type] || "📄"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{f.name}</p>
              <p className="text-xs text-slate-400">{f.date} · {f.size} · {f.uploadedBy}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <DownloadBtn label="Download" size="" />
              <button onClick={() => setUploads(u => u.filter(x => x.id !== f.id))}
                className="w-7 h-7 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center text-xs transition-all">✕</button>
            </div>
          </div>
        ))}
        {uploads.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No uploaded reports yet.</p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAV TABS CONFIG
══════════════════════════════════════════════════════════ */
const TABS = [
  { id: "history",    label: "History",    icon: "📋", short: "History" },
  { id: "labs",       label: "Lab Reports",icon: "🧪", short: "Labs" },
  { id: "scans",      label: "Scans",      icon: "🩻", short: "Scans" },
  { id: "rx",         label: "Prescriptions",icon:"💊",short: "Rx" },
  { id: "diagnosis",  label: "Diagnosis",  icon: "🔬", short: "Diagnosis" },
  { id: "treatment",  label: "Treatments", icon: "🏥", short: "Treatment" },
  { id: "upload",     label: "Upload",     icon: "📤", short: "Upload" },
];

/* ══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════ */
export default function MedicalRecords() {
  const [activeTab, setActiveTab] = useState("history");

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-scroll { scrollbar-width: none; }
        .tab-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Top Bar */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-0">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-1">Medical Records</p>
              <h1 className="text-2xl font-extrabold text-white">{PATIENT.name}</h1>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                <span>🪪 {PATIENT.id}</span>
                <span>🩸 {PATIENT.bloodType}</span>
                <span>🎂 {PATIENT.dob}</span>
              </div>
            </div>
            <div className="bg-amber-500 rounded-2xl px-3 py-2 text-center shadow-lg">
              <p className="text-xs text-amber-100 font-medium">Records</p>
              <p className="text-xl font-extrabold">{LAB_REPORTS.length + SCAN_REPORTS.length + PRESCRIPTIONS.length}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Labs", val: LAB_REPORTS.length, color: "text-emerald-400" },
              { label: "Scans", val: SCAN_REPORTS.length, color: "text-blue-400" },
              { label: "Prescriptions", val: PRESCRIPTIONS.filter(p=>p.status==="active").length + " active", color: "text-violet-400" },
              { label: "Conditions", val: DIAGNOSES.filter(d=>d.status==="active").length + " active", color: "text-amber-400" },
            ].map(s => (
              <div key={s.label} className="bg-slate-800 rounded-xl p-2.5 text-center">
                <p className={`font-extrabold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tab-scroll flex gap-0.5 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap transition-all ${
                  activeTab === t.id ? "bg-slate-50 text-slate-900" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}>
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.short}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "history"   && <MedicalHistorySection />}
        {activeTab === "labs"      && <LabReportsSection />}
        {activeTab === "scans"     && <ScanReportsSection />}
        {activeTab === "rx"        && <PrescriptionsSection />}
        {activeTab === "diagnosis" && <DiagnosesSection />}
        {activeTab === "treatment" && <TreatmentHistorySection />}
        {activeTab === "upload"    && <UploadSection />}
      </div>
    </div>
  );
}
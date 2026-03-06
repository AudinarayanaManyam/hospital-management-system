import { useState, useRef } from "react";

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const PATIENT = {
  name: "Sophia Hartwell", id: "MRN-20419-HW",
  email: "sophia.hartwell@email.com", phone: "+1 (555) 219-4087",
};

const BILLS_DATA = [
  { id: "INV-2026-0041", service: "Cardiology Consultation", doctor: "Dr. Sandra Wu", dept: "Cardiology", date: "Feb 14, 2026", due: "Mar 15, 2026", amount: 250.00, covered: 175.00, balance: 75.00, status: "unpaid", urgent: true, items: [{ desc: "Consultation Fee", qty: 1, rate: 200.00 }, { desc: "ECG Interpretation", qty: 1, rate: 50.00 }] },
  { id: "INV-2026-0038", service: "Lab — HbA1c & Glucose Panel", doctor: "Dr. Kevin Patel", dept: "Endocrinology", date: "Feb 10, 2026", due: "Mar 25, 2026", amount: 87.50, covered: 60.00, balance: 27.50, status: "unpaid", urgent: false, items: [{ desc: "HbA1c Test", qty: 1, rate: 55.00 }, { desc: "Fasting Glucose", qty: 1, rate: 32.50 }] },
  { id: "INV-2026-0031", service: "Echocardiogram", doctor: "Dr. Sandra Wu", dept: "Cardiology", date: "Jan 28, 2026", due: "Apr 5, 2026", amount: 315.00, covered: 250.00, balance: 65.00, status: "unpaid", urgent: false, items: [{ desc: "Echocardiogram Procedure", qty: 1, rate: 280.00 }, { desc: "Radiologist Report", qty: 1, rate: 35.00 }] },
  { id: "INV-2025-0198", service: "Annual Physical Examination", doctor: "Dr. Elaine Morrow", dept: "General Practice", date: "Nov 20, 2025", due: "Dec 20, 2025", amount: 150.00, covered: 150.00, balance: 0, status: "paid", urgent: false, paidOn: "Dec 15, 2025", method: "Card", items: [{ desc: "Annual Physical", qty: 1, rate: 150.00 }] },
  { id: "INV-2025-0172", service: "Cardiac Stress Test", doctor: "Dr. Sandra Wu", dept: "Cardiology", date: "Aug 10, 2025", due: "Sep 10, 2025", amount: 420.00, covered: 336.00, balance: 84.00, status: "paid", urgent: false, paidOn: "Sep 5, 2025", method: "UPI", items: [{ desc: "Stress Test Procedure", qty: 1, rate: 350.00 }, { desc: "Physician Fee", qty: 1, rate: 70.00 }] },
  { id: "INV-2025-0120", service: "Dermatology Consult", doctor: "Dr. Luca Romano", dept: "Dermatology", date: "Oct 5, 2025", due: "Nov 5, 2025", amount: 160.00, covered: 120.00, balance: 40.00, status: "overdue", urgent: true, items: [{ desc: "Consultation", qty: 1, rate: 160.00 }] },
];

const PAYMENT_HISTORY = [
  { id: "TXN-884721", bill: "INV-2025-0198", date: "Dec 15, 2025", amount: 150.00, method: "Visa •••• 4291", gateway: "Stripe", status: "success", ref: "pi_3QX9fLAbcDef123" },
  { id: "TXN-776302", bill: "INV-2025-0172", date: "Sep 5, 2025", amount: 84.00, method: "UPI — sophia@okaxis", gateway: "Razorpay", status: "success", ref: "pay_OkRaz9241Bvv" },
  { id: "TXN-651009", bill: "INV-2025-0099", date: "Jun 12, 2025", amount: 45.00, method: "Mastercard •••• 8833", gateway: "Stripe", status: "success", ref: "pi_2PW8eLBcdEf456" },
  { id: "TXN-540187", bill: "INV-2025-0044", date: "Mar 3, 2025", amount: 200.00, method: "UPI — sophia@okaxis", gateway: "Razorpay", status: "failed", ref: "pay_FAILED_7821Xvz" },
  { id: "TXN-412800", bill: "INV-2024-0310", date: "Dec 28, 2024", amount: 130.00, method: "Visa •••• 4291", gateway: "Stripe", status: "success", ref: "pi_1OV7dKAabBc789" },
];

const INSURANCE = {
  provider: "BlueCross BlueShield", plan: "Premium PPO Family", memberId: "BCB-7741-SH",
  groupId: "GRP-48291", effective: "Jan 1, 2026", expiry: "Dec 31, 2026",
  deductible: 1500, deductibleMet: 620, outOfPocket: 5000, outOfPocketMet: 620,
  copay: { primary: 25, specialist: 50, er: 150 },
  coveragePercent: 80, network: "In-Network",
  color: "#1d4ed8",
};

const CLAIMS = [
  { id: "CLM-2026-1041", bill: "INV-2026-0041", service: "Cardiology Consultation", submitted: "Feb 18, 2026", updated: "Feb 25, 2026", billed: 250.00, approved: 175.00, patient: 75.00, status: "approved", notes: "Claim approved. Patient responsibility based on deductible." },
  { id: "CLM-2026-1038", bill: "INV-2026-0038", service: "Lab — HbA1c & Glucose Panel", submitted: "Feb 12, 2026", updated: "Mar 1, 2026", billed: 87.50, approved: 60.00, patient: 27.50, status: "processing", notes: "Under review by insurance adjuster." },
  { id: "CLM-2026-1031", bill: "INV-2026-0031", service: "Echocardiogram", submitted: "Feb 1, 2026", updated: "Feb 28, 2026", billed: 315.00, approved: 0, patient: 0, status: "pending", notes: "Awaiting additional documentation from provider." },
  { id: "CLM-2025-0982", bill: "INV-2025-0120", service: "Dermatology Consult", submitted: "Oct 10, 2025", updated: "Oct 20, 2025", billed: 160.00, approved: 120.00, patient: 40.00, status: "approved", notes: "" },
  { id: "CLM-2025-0871", bill: "INV-2025-0172", service: "Cardiac Stress Test", submitted: "Aug 14, 2025", updated: "Aug 22, 2025", billed: 420.00, approved: 336.00, patient: 84.00, status: "approved", notes: "" },
];

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const fmt = (n: number) => `$${Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const STATUS_STYLE: Record<string, { pill: string; dot: string }> = {
  unpaid:     { pill: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  paid:       { pill: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  overdue:    { pill: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-500" },
  approved:   { pill: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  processing: { pill: "bg-blue-100 text-blue-700 border-blue-200",      dot: "bg-blue-400" },
  pending:    { pill: "bg-amber-100 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  denied:     { pill: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-500" },
  success:    { pill: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  failed:     { pill: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-500" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-xl">{icon}</span>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>
      {sub && <p className="text-sm text-slate-400 ml-8">{sub}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INVOICE MODAL
══════════════════════════════════════════════════════════ */
function InvoiceModal({ bill, onClose, onPay }: { bill: typeof BILLS_DATA[0]; onClose: () => void; onPay: (bill: typeof BILLS_DATA[0]) => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const handleDl = () => { setDownloading(true); setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1400); };

  const subtotal = bill.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = +(subtotal * 0.08).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header stripe */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-1">Invoice</p>
            <p className="text-white text-lg font-black">{bill.id}</p>
            <p className="text-slate-400 text-xs mt-1">{bill.date} · Due {bill.due}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors">✕</button>
        </div>

        <div className="p-6">
          {/* Billed to */}
          <div className="flex justify-between text-sm mb-5">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Billed To</p>
              <p className="font-bold text-slate-800">{PATIENT.name}</p>
              <p className="text-slate-500 text-xs">{PATIENT.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Provider</p>
              <p className="font-bold text-slate-800">{bill.doctor}</p>
              <p className="text-slate-500 text-xs">{bill.dept}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 font-semibold uppercase">
                  <th className="text-left pb-2">Description</th>
                  <th className="text-right pb-2">Qty</th>
                  <th className="text-right pb-2">Rate</th>
                  <th className="text-right pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bill.items.map((item: { desc: string; qty: number; rate: number }, i: number) => (
                  <tr key={i}>
                    <td className="py-2 text-slate-700 pr-2">{item.desc}</td>
                    <td className="py-2 text-right text-slate-500">{item.qty}</td>
                    <td className="py-2 text-right text-slate-500">{fmt(item.rate)}</td>
                    <td className="py-2 text-right font-semibold text-slate-800">{fmt(item.qty * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-1 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax (8%)</span><span>{fmt(tax)}</span></div>
              <div className="flex justify-between text-emerald-600 font-semibold"><span>Insurance Covered</span><span>-{fmt(bill.covered)}</span></div>
              <div className="flex justify-between font-black text-slate-900 text-base pt-1 border-t border-slate-200"><span>Balance Due</span><span>{fmt(bill.balance)}</span></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleDl} className={`flex-1 py-3 rounded-2xl text-sm font-bold border-2 flex items-center justify-center gap-2 transition-all ${downloaded ? "border-emerald-400 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {downloading ? <span className="animate-spin">⟳</span> : downloaded ? "✓" : "↓"}
              {downloading ? "Generating…" : downloaded ? "Downloaded!" : "Download PDF"}
            </button>
            {bill.status !== "paid" && (
              <button onClick={() => { onClose(); onPay(bill); }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:scale-[1.02]">
                Pay {fmt(bill.balance)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAYMENT GATEWAY MODAL
══════════════════════════════════════════════════════════ */
function PaymentModal({ bill, onClose, onSuccess }: { bill: typeof BILLS_DATA[0]; onClose: () => void; onSuccess: (billId: string) => void }) {
  const [gateway, setGateway] = useState("stripe");
  const [method, setMethod] = useState("card");
  const [step, setStep] = useState("select"); // select | form | processing | done
  const [form, setForm] = useState({ card: "", expiry: "", cvv: "", name: "", upi: "" });
  const [errors, setErrors] = useState<{ card?: string; expiry?: string; cvv?: string; name?: string; upi?: string }>({});

  const gateways = [
    { id: "stripe", label: "Stripe", icon: "💳", color: "#635bff", methods: ["card", "wallet"] },
    { id: "razorpay", label: "Razorpay", icon: "₹", color: "#3395ff", methods: ["card", "upi", "netbanking"] },
  ];
  const methods = { card: "Credit / Debit Card", upi: "UPI", netbanking: "Net Banking", wallet: "Digital Wallet" };

  const validate = () => {
    const e = {};
    if (method === "card") {
      if (!form.card || form.card.replace(/\s/g,"").length < 16) e.card = "Invalid card number";
      if (!form.expiry || !/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "MM/YY required";
      if (!form.cvv || form.cvv.length < 3) e.cvv = "Invalid CVV";
      if (!form.name) e.name = "Name required";
    } else if (method === "upi") {
      if (!form.upi || !form.upi.includes("@")) e.upi = "Invalid UPI ID (e.g. name@bank)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep("processing");
    setTimeout(() => setStep("done"), 2200);
  };

  const fmtCard = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  if (step === "done") return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">Payment Successful!</h3>
        <p className="text-slate-400 text-sm mb-2">Transaction via {gateways.find(g=>g.id===gateway)?.label}</p>
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6 text-left">
          <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Amount Paid</span><span className="font-black text-emerald-600 text-lg">{fmt(bill.balance)}</span></div>
          <div className="flex justify-between text-xs text-slate-400"><span>Invoice</span><span>{bill.id}</span></div>
          <div className="flex justify-between text-xs text-slate-400 mt-0.5"><span>Ref ID</span><span>TXN-{Date.now().toString().slice(-6)}</span></div>
        </div>
        <button onClick={() => { onSuccess(bill.id); onClose(); }} className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-colors">Done</button>
      </div>
    </div>
  );

  if (step === "processing") return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-10 text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-slate-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Processing Payment…</h3>
        <p className="text-slate-400 text-sm">Please do not close this window</p>
        <div className="mt-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse" style={{width:"70%"}} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Complete Payment</h3>
            <p className="text-slate-400 text-sm">{bill.id} · <span className="font-bold text-slate-700">{fmt(bill.balance)}</span> due</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Gateway Select */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Gateway</p>
            <div className="grid grid-cols-2 gap-3">
              {gateways.map(g => (
                <button key={g.id} onClick={() => { setGateway(g.id); setMethod("card"); }}
                  className={`py-3 px-4 rounded-2xl border-2 flex items-center gap-2 font-bold text-sm transition-all ${gateway === g.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                  <span className="text-lg">{g.icon}</span> {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Method Select */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Method</p>
            <div className="flex flex-wrap gap-2">
              {(gateways.find(g=>g.id===gateway)?.methods || []).map(m => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${method === m ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 text-slate-500 hover:border-emerald-300"}`}>
                  {methods[m as keyof typeof methods]}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {method === "card" && (
              <>
                <div>
                  <input value={form.card} onChange={e => setForm(f=>({...f,card:fmtCard(e.target.value)}))}
                    placeholder="Card Number" maxLength={19}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.card?"border-red-400 bg-red-50":"border-slate-200"}`} />
                  {errors.card && <p className="text-xs text-red-500 mt-1">{errors.card}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input value={form.expiry} onChange={e => setForm(f=>({...f,expiry:fmtExp(e.target.value)}))}
                      placeholder="MM/YY" maxLength={5}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.expiry?"border-red-400 bg-red-50":"border-slate-200"}`} />
                    {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <input value={form.cvv} onChange={e => setForm(f=>({...f,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))}
                      placeholder="CVV" type="password"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.cvv?"border-red-400 bg-red-50":"border-slate-200"}`} />
                    {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                <div>
                  <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                    placeholder="Cardholder Name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.name?"border-red-400 bg-red-50":"border-slate-200"}`} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
              </>
            )}
            {method === "upi" && (
              <div>
                <input value={form.upi} onChange={e => setForm(f=>({...f,upi:e.target.value}))}
                  placeholder="UPI ID (e.g. name@okaxis)"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.upi?"border-red-400 bg-red-50":"border-slate-200"}`} />
                {errors.upi && <p className="text-xs text-red-500 mt-1">{errors.upi}</p>}
                <p className="text-xs text-slate-400 mt-1.5">A payment request will be sent to your UPI app</p>
              </div>
            )}
            {method === "netbanking" && (
              <div className="grid grid-cols-3 gap-2">
                {["SBI","HDFC","ICICI","Axis","Kotak","PNB"].map(b => (
                  <button key={b} className="py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-all">{b}</button>
                ))}
              </div>
            )}
            {method === "wallet" && (
              <div className="grid grid-cols-3 gap-2">
                {["Google Pay","Apple Pay","PayPal"].map(w => (
                  <button key={w} className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition-all">{w}</button>
                ))}
              </div>
            )}
          </div>

          {/* Security + Pay */}
          <div>
            <button onClick={handlePay}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.01] transition-all">
              Pay {fmt(bill.balance)} Securely
            </button>
            <p className="text-center text-xs text-slate-300 mt-2 flex items-center justify-center gap-1">
              <span>🔒</span> 256-bit SSL encrypted · PCI DSS compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: VIEW BILLS
══════════════════════════════════════════════════════════ */
function BillsSection({ bills, onViewInvoice, onPay }: { bills: typeof BILLS_DATA; onViewInvoice: (bill: typeof BILLS_DATA[0]) => void; onPay: (bill: typeof BILLS_DATA[0]) => void }) {
  const [filter, setFilter] = useState("all");
  const filtered = bills.filter((b: typeof BILLS_DATA[0]) => filter === "all" || b.status === filter);
  const totalUnpaid = bills.filter((b: typeof BILLS_DATA[0]) => b.status !== "paid").reduce((s, b: typeof BILLS_DATA[0]) => s + b.balance, 0);

  return (
    <div>
      <SectionTitle icon="🧾" title="Outstanding Bills" sub={`${bills.filter(b=>b.status!=="paid").length} unpaid · ${fmt(totalUnpaid)} total due`} />

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Due", val: fmt(totalUnpaid), color: "from-red-500 to-rose-600" },
          { label: "Insurance Covered", val: fmt(bills.reduce((s,b)=>s+b.covered,0)), color: "from-blue-500 to-indigo-600" },
          { label: "Paid to Date", val: fmt(bills.filter(b=>b.status==="paid").reduce((s,b)=>s+b.amount,0)), color: "from-emerald-500 to-teal-600" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-3 text-white shadow-md`}>
            <p className="text-white/70 text-xs font-semibold mb-1">{s.label}</p>
            <p className="font-black text-lg leading-tight">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all","unpaid","overdue","paid"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filter===f?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
            {f} {f !== "all" && `(${bills.filter((b: typeof BILLS_DATA[0])=>b.status===f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((bill: typeof BILLS_DATA[0]) => (
          <div key={bill.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${bill.urgent && bill.status !== "paid" ? "border-red-200" : "border-slate-100"}`}>
            {bill.urgent && bill.status !== "paid" && (
              <div className="bg-red-50 px-4 py-1.5 flex items-center gap-2 border-b border-red-100">
                <span className="text-red-500 text-xs">⚠</span>
                <span className="text-xs text-red-600 font-bold">Overdue — payment required immediately</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm">{bill.service}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{bill.doctor} · {bill.dept}</p>
                </div>
                <StatusPill status={bill.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                <span>📅 {bill.date}</span>
                <span>⏰ Due {bill.due}</span>
                <span>📋 {bill.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-sm">
                  <div><p className="text-xs text-slate-400">Billed</p><p className="font-bold text-slate-700">{fmt(bill.amount)}</p></div>
                  <div><p className="text-xs text-slate-400">Covered</p><p className="font-bold text-emerald-600">{fmt(bill.covered)}</p></div>
                  <div><p className="text-xs text-slate-400">Balance</p><p className="font-black text-slate-900">{fmt(bill.balance)}</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onViewInvoice(bill)} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Invoice</button>
                  {bill.status !== "paid" && (
                    <button onClick={() => onPay(bill)} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-black hover:bg-emerald-600 transition-colors shadow-sm">Pay Now</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: PAYMENT HISTORY
══════════════════════════════════════════════════════════ */
function PaymentHistorySection({ history }: { history: typeof PAYMENT_HISTORY }) {
  const [search, setSearch] = useState("");
  const filtered = history.filter(h => h.id.toLowerCase().includes(search.toLowerCase()) || h.method.toLowerCase().includes(search.toLowerCase()));
  const total = history.filter(h=>h.status==="success").reduce((s,h)=>s+h.amount,0);

  return (
    <div>
      <SectionTitle icon="📜" title="Payment History" sub={`${history.filter(h=>h.status==="success").length} successful · ${fmt(total)} paid`} />
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by transaction ID or method…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
      </div>
      <div className="space-y-3">
        {filtered.map((txn: typeof PAYMENT_HISTORY[0]) => (
          <div key={txn.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${txn.status==="success"?"bg-emerald-50":"bg-red-50"}`}>
              {txn.status === "success" ? "✅" : "❌"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-slate-800 text-sm">{txn.id}</p>
                <p className={`font-black text-base ${txn.status==="success"?"text-emerald-600":"text-red-500"}`}>
                  {txn.status==="success"?"-":""}{fmt(txn.amount)}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{txn.method}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-400">{txn.date} · via {txn.gateway}</p>
                <StatusPill status={txn.status} />
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">{txn.ref}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: INSURANCE
══════════════════════════════════════════════════════════ */
function InsuranceSection() {
  const ins = INSURANCE;
  const dedPct = Math.min(100, (ins.deductibleMet / ins.deductible) * 100);
  const oopPct = Math.min(100, (ins.outOfPocketMet / ins.outOfPocket) * 100);

  return (
    <div>
      <SectionTitle icon="🛡️" title="Insurance Details" sub="Active coverage for 2026" />

      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl mb-5 shadow-xl" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 60%, #312e81 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize:"14px 14px" }} />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Health Insurance</p>
              <p className="text-white text-2xl font-black">{ins.provider}</p>
              <p className="text-blue-200 text-sm mt-0.5">{ins.plan}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🛡️</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-blue-300 text-xs">Member ID</p><p className="text-white font-bold font-mono">{ins.memberId}</p></div>
            <div><p className="text-blue-300 text-xs">Group ID</p><p className="text-white font-bold font-mono">{ins.groupId}</p></div>
            <div><p className="text-blue-300 text-xs">Valid</p><p className="text-white font-bold">{ins.effective} – {ins.expiry}</p></div>
            <div><p className="text-blue-300 text-xs">Network</p><p className="text-white font-bold">{ins.network}</p></div>
          </div>
        </div>
      </div>

      {/* Deductible Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: "Deductible", met: ins.deductibleMet, total: ins.deductible, pct: dedPct, color: "bg-blue-500" },
          { label: "Out-of-Pocket Max", met: ins.outOfPocketMet, total: ins.outOfPocket, pct: oopPct, color: "bg-violet-500" },
        ].map(bar => (
          <div key={bar.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold text-slate-700">{bar.label}</span>
              <span className="font-black text-slate-800">{fmt(bar.met)} <span className="font-normal text-slate-400">/ {fmt(bar.total)}</span></span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div className={`h-full ${bar.color} rounded-full transition-all duration-700`} style={{ width: `${bar.pct}%` }} />
            </div>
            <p className="text-xs text-slate-400">{fmt(bar.total - bar.met)} remaining</p>
          </div>
        ))}
      </div>

      {/* Copay Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Co-pay Summary</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Primary Care", val: ins.copay.primary },
            { label: "Specialist", val: ins.copay.specialist },
            { label: "Emergency", val: ins.copay.er },
          ].map(cp => (
            <div key={cp.label} className="text-center bg-slate-50 rounded-xl p-3">
              <p className="text-xl font-black text-slate-800">{fmt(cp.val)}</p>
              <p className="text-xs text-slate-400 mt-0.5">{cp.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
        <p className="text-xs font-bold text-blue-500 mb-1">Coverage Rate</p>
        <p className="text-3xl font-black text-blue-700">{ins.coveragePercent}% <span className="text-base font-normal text-blue-400">covered after deductible</span></p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION: CLAIM STATUS
══════════════════════════════════════════════════════════ */
function ClaimsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const STEPS_MAP = { pending: 1, processing: 2, approved: 3, denied: 3 };

  return (
    <div>
      <SectionTitle icon="📋" title="Insurance Claims" sub={`${CLAIMS.length} claims · ${CLAIMS.filter(c=>c.status==="approved").length} approved`} />

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: "Approved", count: CLAIMS.filter(c=>c.status==="approved").length, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { label: "Processing", count: CLAIMS.filter(c=>c.status==="processing").length, color: "text-blue-600 bg-blue-50 border-blue-200" },
          { label: "Pending", count: CLAIMS.filter(c=>c.status==="pending").length, color: "text-amber-600 bg-amber-50 border-amber-200" },
          { label: "Denied", count: CLAIMS.filter(c=>c.status==="denied").length, color: "text-red-600 bg-red-50 border-red-200" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-3 text-center ${s.color}`}>
            <p className="text-xl font-black">{s.count}</p>
            <p className="text-xs font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {CLAIMS.map(claim => {
          const step = STEPS_MAP[claim.status as keyof typeof STEPS_MAP] || 0;
          return (
            <div key={claim.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <button className="w-full text-left p-4" onClick={() => setExpanded(expanded===claim.id?null:claim.id)}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{claim.service}</p>
                    <p className="text-xs text-slate-400">Claim {claim.id} · {claim.bill}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={claim.status} />
                    <span className={`text-slate-400 text-sm transition-transform ${expanded===claim.id?"rotate-180":""}`}>▾</span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>📤 Submitted {claim.submitted}</span>
                  <span>🔄 Updated {claim.updated}</span>
                </div>
              </button>

              {expanded === claim.id && (
                <div className="border-t border-slate-50 px-4 pb-4 pt-3">
                  {/* Progress Tracker */}
                  <div className="flex items-center mb-4">
                    {["Submitted","Processing","Decision"].map((s, i) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? (claim.status==="denied"&&i===2?"bg-red-500 text-white":"bg-emerald-500 text-white") : i===step-1&&claim.status==="processing"?"bg-blue-500 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>
                            {i < step ? (claim.status==="denied"&&i===2?"✕":"✓") : i+1}
                          </div>
                          <span className="text-xs text-slate-400 mt-1 whitespace-nowrap">{s}</span>
                        </div>
                        {i < 2 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < step-1?"bg-emerald-400":"bg-slate-200"}`} />}
                      </div>
                    ))}
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                    <div className="bg-slate-50 rounded-xl p-2.5 text-center"><p className="text-xs text-slate-400">Billed</p><p className="font-black text-slate-700">{fmt(claim.billed)}</p></div>
                    <div className="bg-emerald-50 rounded-xl p-2.5 text-center"><p className="text-xs text-emerald-500">Approved</p><p className="font-black text-emerald-700">{claim.approved>0?fmt(claim.approved):"—"}</p></div>
                    <div className="bg-amber-50 rounded-xl p-2.5 text-center"><p className="text-xs text-amber-500">Your Share</p><p className="font-black text-amber-700">{claim.patient>0?fmt(claim.patient):"—"}</p></div>
                  </div>

                  {claim.notes && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-xs font-bold text-blue-500 mb-1">Insurer Note</p>
                      <p className="text-xs text-slate-600">{claim.notes}</p>
                    </div>
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

/* ══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════ */
const TABS = [
  { id: "bills",    label: "Bills",          icon: "🧾" },
  { id: "history",  label: "Payments",       icon: "📜" },
  { id: "insurance",label: "Insurance",      icon: "🛡️" },
  { id: "claims",   label: "Claims",         icon: "📋" },
];

export default function BillingPayments() {
  const [tab, setTab] = useState("bills");
  const [bills, setBills] = useState(BILLS_DATA);
  const [history, setHistory] = useState(PAYMENT_HISTORY);
  const [invoiceBill, setInvoiceBill] = useState<typeof BILLS_DATA[0] | null>(null);
  const [payBill, setPayBill] = useState<typeof BILLS_DATA[0] | null>(null);

  const handlePaySuccess = (billId: string) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: "paid", balance: 0 } : b));
    setHistory(prev => [{
      id: "TXN-" + Math.floor(Math.random()*900000+100000),
      bill: billId, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
      amount: bills.find(b=>b.id===billId)?.balance || 0,
      method: "Visa •••• 4291", gateway: "Stripe", status: "success",
      ref: "pi_"+Math.random().toString(36).slice(2,14)
    }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-scroll::-webkit-scrollbar { display:none; }
        .tab-scroll { scrollbar-width:none; }
      `}</style>

      {/* Top header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-slate-400 text-xs tracking-widest font-semibold uppercase mb-1">Billing & Payments</p>
              <h1 className="text-2xl font-black text-white">{PATIENT.name}</h1>
              <p className="text-slate-400 text-xs mt-1">{PATIENT.id}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs mb-1">Total Due</p>
              <p className="text-3xl font-black text-emerald-400">
                {fmt(bills.filter(b => b.status !== "paid").reduce((s, b) => s + b.balance, 0))}
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Unpaid Bills", val: bills.filter(b=>b.status==="unpaid").length, accent:"text-amber-400" },
              { label: "Overdue", val: bills.filter(b=>b.status==="overdue").length, accent:"text-red-400" },
              { label: "Paid (2025-26)", val: history.filter(h=>h.status==="success").length, accent:"text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="bg-white/5 backdrop-blur rounded-2xl p-3 text-center border border-white/10">
                <p className={`text-xl font-black ${s.accent}`}>{s.val}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tab-scroll flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-t-2xl whitespace-nowrap transition-all ${tab===t.id?"bg-stone-50 text-slate-900":"text-slate-400 hover:text-white hover:bg-white/10"}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {tab === "bills"    && <BillsSection bills={bills} onViewInvoice={setInvoiceBill} onPay={setPayBill} />}
        {tab === "history"  && <PaymentHistorySection history={history} />}
        {tab === "insurance"&& <InsuranceSection />}
        {tab === "claims"   && <ClaimsSection />}
      </div>

      {/* Modals */}
      {invoiceBill && <InvoiceModal bill={invoiceBill} onClose={() => setInvoiceBill(null)} onPay={(b: typeof BILLS_DATA[0]) => { setInvoiceBill(null); setPayBill(b); }} />}
      {payBill && <PaymentModal bill={payBill} onClose={() => setPayBill(null)} onSuccess={handlePaySuccess} />}
    </div>
  );
}

import { useState } from 'react';
import { mockInvoices } from '../utils/mockData';
import { Plus, Receipt } from 'lucide-react';

export default function Billing() {
  const statusColors: Record<string, string> = { 'Paid': 'badge-green', 'Partial': 'badge-yellow', 'Pending': 'badge-red', 'Insurance': 'badge-purple' };
  const [invoices, setInvoices] = useState([...mockInvoices]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    date: '',
    services: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    total: 0,
    paid: 0,
    balance: 0,
    status: 'Pending',
    insuranceProvider: ''
  });
  const [error, setError] = useState('');

  // Calculate totals
  const total = invoices.reduce((a, i) => a + i.total, 0);
  const collected = invoices.reduce((a, i) => a + i.paid, 0);
  const pending = invoices.reduce((a, i) => a + i.balance, 0);

  // Update amounts when services change
  const updateService = (idx: number, key: string, value: any) => {
    setForm(f => {
      const services = f.services.map((s, i) => i === idx ? { ...s, [key]: value, amount: (key === 'quantity' || key === 'rate') ? (key === 'quantity' ? value : s.quantity) * (key === 'rate' ? value : s.rate) : s.amount } : s);
      const total = services.reduce((sum, s) => sum + (s.amount || 0), 0);
      return { ...f, services, total, balance: total - f.paid };
    });
  };

  const handleAddService = () => {
    setForm(f => ({ ...f, services: [...f.services, { description: '', quantity: 1, rate: 0, amount: 0 }] }));
  };
  const handleRemoveService = (idx: number) => {
    setForm(f => {
      const services = f.services.filter((_, i) => i !== idx);
      const total = services.reduce((sum, s) => sum + (s.amount || 0), 0);
      return { ...f, services, total, balance: total - f.paid };
    });
  };

  const handlePaidChange = (value: number) => {
    setForm(f => ({ ...f, paid: value, balance: f.total - value }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.patientName || !form.date || form.services.some(s => !s.description || s.quantity <= 0 || s.rate <= 0)) {
      setError('Fill all required fields and valid service details.');
      return;
    }
    setInvoices(prev => [
      {
        id: 'INV' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        status: form.status as 'Pending' | 'Partial' | 'Paid' | 'Insurance'
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ patientId: '', patientName: '', date: '', services: [{ description: '', quantity: 1, rate: 0, amount: 0 }], total: 0, paid: 0, balance: 0, status: 'Pending', insuranceProvider: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Billing</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Invoice</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</div><div className="text-sm text-gray-500">Total Billed</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">₹{collected.toLocaleString()}</div><div className="text-sm text-gray-500">Collected</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-red-600">₹{pending.toLocaleString()}</div><div className="text-sm text-gray-500">Pending</div></div>
      </div>
      <div className="space-y-4">
        {invoices.map(inv => (
          <div key={inv.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-primary-600" />
                <div>
                  <span className="font-semibold">{inv.id}</span>
                  <span className="text-gray-400 mx-2">·</span>
                  <span>{inv.patientName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={statusColors[inv.status]}>{inv.status}</span>
                {inv.insuranceProvider && <span className="badge-blue">{inv.insuranceProvider}</span>}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs">
                  <tr>
                    <th className="table-header">Service</th>
                    <th className="table-header">Qty</th>
                    <th className="table-header">Rate</th>
                    <th className="table-header">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.services.map((s, i) => (
                    <tr key={i}>
                      <td className="table-cell">{s.description}</td>
                      <td className="table-cell">{s.quantity}</td>
                      <td className="table-cell">₹{s.rate}</td>
                      <td className="table-cell font-medium">₹{s.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-end gap-8 text-sm">
              <span>Total: <strong>₹{inv.total.toLocaleString()}</strong></span>
              <span className="text-green-600">Paid: <strong>₹{inv.paid.toLocaleString()}</strong></span>
              <span className="text-red-600">Balance: <strong>₹{inv.balance.toLocaleString()}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Invoice */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">New Invoice</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Patient ID</label>
                <input className="input" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Patient Name</label>
                <input className="input" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Services</label>
                {form.services.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="input flex-1" placeholder="Description" value={s.description} onChange={e => updateService(i, 'description', e.target.value)} required />
                    <input className="input w-20" type="number" min={1} placeholder="Qty" value={s.quantity} onChange={e => updateService(i, 'quantity', Number(e.target.value))} required />
                    <input className="input w-24" type="number" min={1} placeholder="Rate" value={s.rate} onChange={e => updateService(i, 'rate', Number(e.target.value))} required />
                    <input className="input w-28 bg-gray-50" value={s.amount} readOnly tabIndex={-1} />
                    {form.services.length > 1 && <button type="button" className="btn-secondary px-2" onClick={() => handleRemoveService(i)}>-</button>}
                  </div>
                ))}
                <button type="button" className="btn-secondary mt-1" onClick={handleAddService}>+ Add Service</button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Total</label>
                  <input className="input bg-gray-50" value={form.total} readOnly tabIndex={-1} />
                </div>
                <div className="flex-1">
                  <label className="label">Paid</label>
                  <input className="input" type="number" min={0} value={form.paid} onChange={e => handlePaidChange(Number(e.target.value))} />
                </div>
                <div className="flex-1">
                  <label className="label">Balance</label>
                  <input className="input bg-gray-50" value={form.balance} readOnly tabIndex={-1} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Partial</option>
                    <option>Insurance</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">Insurance Provider (optional)</label>
                  <input className="input" value={form.insuranceProvider} onChange={e => setForm(f => ({ ...f, insuranceProvider: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Create Invoice</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

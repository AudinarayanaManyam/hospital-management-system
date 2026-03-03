
import { useState } from 'react';
import { mockPrescriptions } from '../utils/mockData';
import { Plus, FileText } from 'lucide-react';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([...mockPrescriptions]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    date: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', quantity: 1 }],
    notes: '',
    status: 'Active' as 'Active' | 'Dispensed' | 'Expired',
  });
  const [error, setError] = useState('');

  const handleAddMedicine = () => {
    setForm(f => ({ ...f, medicines: [...f.medicines, { name: '', dosage: '', frequency: '', duration: '', quantity: 1 }] }));
  };
  const handleRemoveMedicine = (idx: number) => {
    setForm(f => ({ ...f, medicines: f.medicines.filter((_, i) => i !== idx) }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.patientName || !form.doctorName || !form.date || !form.diagnosis || form.medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration || m.quantity <= 0)) {
      setError('Fill all required fields and valid medicine details.');
      return;
    }
    setPrescriptions(prev => [
      {
        id: 'RX' + (prev.length + 1).toString().padStart(3, '0'),
        patientId: form.patientId || '',
        patientName: form.patientName,
        doctorId: form.doctorId || '',
        doctorName: form.doctorName,
        date: form.date,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes,
        status: form.status as 'Active' | 'Dispensed' | 'Expired',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ patientId: '', patientName: '', doctorId: '', doctorName: '', date: '', diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '', quantity: 1 }], notes: '', status: 'Active' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Prescriptions</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Prescription</button>
      </div>
      <div className="grid gap-4">
        {prescriptions.map(rx => (
          <div key={rx.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <div className="font-semibold">{rx.patientName}</div>
                  <div className="text-sm text-gray-500">{rx.doctorName} · {rx.date}</div>
                  <div className="text-sm text-gray-700 mt-1">Diagnosis: <span className="font-medium">{rx.diagnosis}</span></div>
                </div>
              </div>
              <span className={rx.status === 'Active' ? 'badge-green' : rx.status === 'Dispensed' ? 'badge-blue' : 'badge-red'}>{rx.status}</span>
            </div>
            <div className="mt-4 border-t pt-3">
              <div className="text-xs font-bold text-gray-500 uppercase mb-2">Medicines</div>
              <div className="space-y-1">
                {rx.medicines.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800 w-40">{m.name}</span>
                    <span className="text-gray-500">{m.dosage}</span>
                    <span className="text-gray-500">{m.frequency}</span>
                    <span className="text-gray-500">{m.duration}</span>
                    <span className="text-gray-400">Qty: {m.quantity}</span>
                  </div>
                ))}
              </div>
              {rx.notes && <div className="mt-2 text-sm text-gray-500 italic">Note: {rx.notes}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Prescription */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">New Prescription</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Patient Name</label>
                  <input className="input" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Patient ID (optional)</label>
                  <input className="input" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Doctor Name</label>
                  <input className="input" value={form.doctorName} onChange={e => setForm(f => ({ ...f, doctorName: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Doctor ID (optional)</label>
                  <input className="input" value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Date</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Active' | 'Dispensed' | 'Expired' }))}>
                    <option>Active</option>
                    <option>Dispensed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Diagnosis</label>
                <input className="input" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Medicines</label>
                <div className="space-y-2">
                  {form.medicines.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <input className="input flex-1" placeholder="Name" value={m.name} onChange={e => setForm(f => ({ ...f, medicines: f.medicines.map((mm, i) => i === idx ? { ...mm, name: e.target.value } : mm) }))} required />
                      <input className="input w-24" placeholder="Dosage" value={m.dosage} onChange={e => setForm(f => ({ ...f, medicines: f.medicines.map((mm, i) => i === idx ? { ...mm, dosage: e.target.value } : mm) }))} required />
                      <input className="input w-24" placeholder="Frequency" value={m.frequency} onChange={e => setForm(f => ({ ...f, medicines: f.medicines.map((mm, i) => i === idx ? { ...mm, frequency: e.target.value } : mm) }))} required />
                      <input className="input w-24" placeholder="Duration" value={m.duration} onChange={e => setForm(f => ({ ...f, medicines: f.medicines.map((mm, i) => i === idx ? { ...mm, duration: e.target.value } : mm) }))} required />
                      <input className="input w-16" type="number" min={1} placeholder="Qty" value={m.quantity} onChange={e => setForm(f => ({ ...f, medicines: f.medicines.map((mm, i) => i === idx ? { ...mm, quantity: Number(e.target.value) } : mm) }))} required />
                      {form.medicines.length > 1 && (
                        <button type="button" className="btn-secondary px-2 py-1" onClick={() => handleRemoveMedicine(idx)}>-</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-secondary mt-2" onClick={handleAddMedicine}>+ Add Medicine</button>
                </div>
              </div>
              <div>
                <label className="label">Notes (optional)</label>
                <input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

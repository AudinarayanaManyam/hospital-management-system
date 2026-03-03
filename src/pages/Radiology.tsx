import { Scan, Plus } from 'lucide-react';

import { useState } from 'react';

const initialTests = [
  { id: 'RAD001', patient: 'Rajesh Kumar', test: 'Chest X-Ray', orderedBy: 'Dr. Arun Mehta', date: '2024-03-15', status: 'Completed', type: 'X-Ray' },
  { id: 'RAD002', patient: 'Mohammed Ali', test: 'MRI Brain', orderedBy: 'Dr. Kavya Nair', date: '2024-03-14', status: 'Completed', type: 'MRI' },
  { id: 'RAD003', patient: 'Venkat Rao', test: 'CT Abdomen', orderedBy: 'Dr. Anita Joshi', date: '2024-03-15', status: 'In Progress', type: 'CT Scan' },
  { id: 'RAD004', patient: 'Sunita Reddy', test: 'USG Pelvis', orderedBy: 'Dr. Sameera Khan', date: '2024-03-16', status: 'Pending', type: 'Ultrasound' },
];
const statusColors: Record<string, string> = { Pending: 'badge-yellow', 'In Progress': 'badge-blue', Completed: 'badge-green' };
const typeColors: Record<string, string> = { 'X-Ray': 'badge-gray', 'MRI': 'badge-purple', 'CT Scan': 'badge-blue', 'Ultrasound': 'badge-green' };

export default function Radiology() {
  const [tests, setTests] = useState(initialTests);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patient: '',
    test: '',
    type: 'X-Ray',
    orderedBy: '',
    date: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.patient || !form.test || !form.type || !form.orderedBy || !form.date) {
      setError('Please fill all required fields.');
      return;
    }
    setTests(prev => [
      {
        id: 'RAD' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ patient: '', test: '', type: 'X-Ray', orderedBy: '', date: '', status: 'Pending' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Radiology</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Request</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {['X-Ray', 'MRI', 'CT Scan', 'Ultrasound'].map(t => (
          <div key={t} className="stat-card"><div className="text-xl font-bold">{tests.filter(r => r.type === t).length}</div><div className="text-sm text-gray-500">{t}</div></div>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Patient</th>
              <th className="table-header">Test</th>
              <th className="table-header">Type</th>
              <th className="table-header">Ordered By</th>
              <th className="table-header">Date</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-xs">{t.id}</td>
                <td className="table-cell font-medium">{t.patient}</td>
                <td className="table-cell"><div className="flex items-center gap-2"><Scan className="w-4 h-4 text-teal-500" />{t.test}</div></td>
                <td className="table-cell"><span className={typeColors[t.type]}>{t.type}</span></td>
                <td className="table-cell text-primary-600">{t.orderedBy}</td>
                <td className="table-cell">{t.date}</td>
                <td className="table-cell"><span className={statusColors[t.status]}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for New Radiology Request */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">New Radiology Request</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Patient Name</label>
                <input className="input" value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Test Name</label>
                <input className="input" value={form.test} onChange={e => setForm(f => ({ ...f, test: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option>X-Ray</option>
                  <option>MRI</option>
                  <option>CT Scan</option>
                  <option>Ultrasound</option>
                </select>
              </div>
              <div>
                <label className="label">Ordered By</label>
                <input className="input" value={form.orderedBy} onChange={e => setForm(f => ({ ...f, orderedBy: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Add</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

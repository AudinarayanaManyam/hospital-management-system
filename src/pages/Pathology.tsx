
import { useState } from 'react';
import { mockLabTests } from '../utils/mockData';
import { FlaskConical, Plus } from 'lucide-react';

export default function Pathology() {
  const [labTests, setLabTests] = useState([...mockLabTests]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    testName: '',
    orderedBy: '',
    date: '',
    result: '',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
  });
  const [error, setError] = useState('');

  const statusColors: Record<string, string> = { Pending: 'badge-yellow', 'In Progress': 'badge-blue', Completed: 'badge-green', Cancelled: 'badge-red' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.patientName || !form.testName || !form.orderedBy || !form.date || !form.status) {
      setError('Please fill all required fields.');
      return;
    }
    setLabTests(prev => [
      {
        id: 'LAB' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        patientId: form.patientId || '',
        status: form.status as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ patientId: '', patientName: '', testName: '', orderedBy: '', date: '', result: '', status: 'Pending' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Pathology Lab</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Test</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {['Pending', 'In Progress', 'Completed', 'Cancelled'].map((s, i) => {
          const colors = ['text-yellow-600', 'text-blue-600', 'text-green-600', 'text-red-600'];
          return <div key={s} className="stat-card"><div className={`text-2xl font-bold ${colors[i]}`}>{labTests.filter(t => t.status === s).length}</div><div className="text-sm text-gray-500">{s}</div></div>;
        })}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Test ID</th>
              <th className="table-header">Patient</th>
              <th className="table-header">Test</th>
              <th className="table-header">Ordered By</th>
              <th className="table-header">Date</th>
              <th className="table-header">Result</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-xs">{t.id}</td>
                <td className="table-cell font-medium">{t.patientName}</td>
                <td className="table-cell"><div className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-500" />{t.testName}</div></td>
                <td className="table-cell text-primary-600">{t.orderedBy}</td>
                <td className="table-cell">{t.date}</td>
                <td className="table-cell">{t.result || '—'}</td>
                <td className="table-cell"><span className={statusColors[t.status]}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for New Test */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">New Lab Test</h3>
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
              <div>
                <label className="label">Test Name</label>
                <input className="input" value={form.testName} onChange={e => setForm(f => ({ ...f, testName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Ordered By</label>
                <input className="input" value={form.orderedBy} onChange={e => setForm(f => ({ ...f, orderedBy: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Date</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' }))}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Result (optional)</label>
                <input className="input" value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Order</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

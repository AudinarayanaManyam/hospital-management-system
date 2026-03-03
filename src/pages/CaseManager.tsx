
import { useState } from 'react';
import { mockPatients } from '../utils/mockData';
import { Briefcase, Plus, AlertCircle } from 'lucide-react';

const priorityColors: Record<string, string> = { Critical: 'badge-red', High: 'badge-yellow', Medium: 'badge-blue', Low: 'badge-gray' };
const statusColors: Record<string, string> = { Active: 'badge-green', 'Under Review': 'badge-yellow', ICU: 'badge-red', Closed: 'badge-gray' };

export default function CaseManager() {
  const [cases, setCases] = useState([
    { id: 'CASE001', patient: 'Rajesh Kumar', diagnosis: 'Hypertension + Diabetes', manager: 'Dr. Arun Mehta', priority: 'High', status: 'Active', admitDate: '2024-03-10', nextReview: '2024-03-20' },
    { id: 'CASE002', patient: 'Priya Sharma', diagnosis: 'High-Risk Pregnancy', manager: 'Dr. Sameera Khan', priority: 'Critical', status: 'Active', admitDate: '2024-03-12', nextReview: '2024-03-16' },
    { id: 'CASE003', patient: 'Mohammed Ali', diagnosis: 'Brain Tumor Evaluation', manager: 'Dr. Kavya Nair', priority: 'High', status: 'Under Review', admitDate: '2024-03-08', nextReview: '2024-03-18' },
    { id: 'CASE004', patient: 'Venkat Rao', diagnosis: 'Acute MI - Post Surgery', manager: 'Dr. Anita Joshi', priority: 'Critical', status: 'ICU', admitDate: '2024-03-14', nextReview: '2024-03-15' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patient: '',
    diagnosis: '',
    manager: '',
    priority: 'High',
    status: 'Active',
    admitDate: '',
    nextReview: '',
  });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.patient || !form.diagnosis || !form.manager || !form.priority || !form.status || !form.admitDate || !form.nextReview) {
      setError('Please fill all required fields.');
      return;
    }
    setCases(prev => [
      {
        id: 'CASE' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ patient: '', diagnosis: '', manager: '', priority: 'High', status: 'Active', admitDate: '', nextReview: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Case Manager</h1><p className="text-sm text-gray-500">Complex case tracking and coordination</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Case</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card border-t-4 border-red-400"><div className="text-2xl font-bold text-red-600">{cases.filter(c => c.priority === 'Critical').length}</div><div className="text-sm text-gray-500">Critical Cases</div></div>
        <div className="stat-card border-t-4 border-yellow-400"><div className="text-2xl font-bold text-yellow-600">{cases.filter(c => c.priority === 'High').length}</div><div className="text-sm text-gray-500">High Priority</div></div>
        <div className="stat-card border-t-4 border-green-400"><div className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'Active').length}</div><div className="text-sm text-gray-500">Active Cases</div></div>
        <div className="stat-card border-t-4 border-blue-400"><div className="text-2xl font-bold text-blue-600">{cases.length}</div><div className="text-sm text-gray-500">Total Cases</div></div>
      </div>
      <div className="space-y-4">
        {cases.map(c => (
          <div key={c.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Briefcase className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{c.patient}</span>
                    <span className="font-mono text-xs text-gray-400">{c.id}</span>
                  </div>
                  <div className="text-sm text-primary-600">{c.manager}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={priorityColors[c.priority]}>{c.priority}</span>
                <span className={statusColors[c.status]}>{c.status}</span>
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-3 flex items-center gap-1.5">
              {c.priority === 'Critical' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              <span><strong>Diagnosis:</strong> {c.diagnosis}</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-500">
              <span>Admitted: {c.admitDate}</span>
              <span>Next Review: <span className="text-orange-600 font-medium">{c.nextReview}</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Case */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">New Case</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Patient</label>
                <input className="input" value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Diagnosis</label>
                <input className="input" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Manager</label>
                <input className="input" value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Priority</label>
                  <select className="input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Active</option>
                    <option>Under Review</option>
                    <option>ICU</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Admit Date</label>
                  <input className="input" type="date" value={form.admitDate} onChange={e => setForm(f => ({ ...f, admitDate: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Next Review</label>
                  <input className="input" type="date" value={form.nextReview} onChange={e => setForm(f => ({ ...f, nextReview: e.target.value }))} required />
                </div>
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


import { useState } from 'react';
import { mockBirthRecords, mockDeathRecords } from '../utils/mockData';
import { Award, Download, Eye } from 'lucide-react';

export default function Certificates() {
  const [certs, setCerts] = useState([
    ...mockBirthRecords.map(r => ({ id: r.certificateNo, type: 'Birth', patient: r.babyName, date: r.dob, issuedTo: r.motherName, doctor: r.doctor })),
    ...mockDeathRecords.map(r => ({ id: r.certificateNo, type: 'Death', patient: r.patientName, date: r.dod, issuedTo: 'Next of Kin', doctor: r.doctor })),
    { id: 'MC-2024-001', type: 'Medical Fitness', patient: 'Rajesh Kumar', date: '2024-03-15', doctor: 'Dr. Arun Mehta', issuedTo: 'Rajesh Kumar' },
    { id: 'MC-2024-002', type: 'Discharge Summary', patient: 'Sunita Reddy', date: '2024-03-10', doctor: 'Dr. Suresh Babu', issuedTo: 'Sunita Reddy' },
    { id: 'MC-2024-003', type: 'Sick Leave', patient: 'Mohammed Ali', date: '2024-03-14', doctor: 'Dr. Kavya Nair', issuedTo: 'Mohammed Ali' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: 'Birth',
    patient: '',
    date: '',
    doctor: '',
    issuedTo: '',
  });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.type || !form.patient || !form.date || !form.doctor) {
      setError('Please fill all required fields.');
      return;
    }
    setCerts(prev => [
      {
        id: 'CERT' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        issuedTo: form.issuedTo || form.patient,
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ type: 'Birth', patient: '', date: '', doctor: '', issuedTo: '' });
  };

  const birthCount = certs.filter(c => c.type === 'Birth').length;
  const deathCount = certs.filter(c => c.type === 'Death').length;
  const medCount = certs.filter(c => c.type !== 'Birth' && c.type !== 'Death').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Certificates & Documents</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Award className="w-4 h-4" /> Issue Certificate</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">{birthCount}</div><div className="text-sm text-gray-500">Birth Certificates</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-red-600">{deathCount}</div><div className="text-sm text-gray-500">Death Certificates</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-blue-600">{medCount}</div><div className="text-sm text-gray-500">Medical Certificates</div></div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Certificate No</th>
              <th className="table-header">Type</th>
              <th className="table-header">Patient</th>
              <th className="table-header">Date</th>
              <th className="table-header">Doctor</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-xs text-blue-600">{c.id}</td>
                <td className="table-cell"><span className={c.type === 'Birth' ? 'badge-green' : c.type === 'Death' ? 'badge-red' : 'badge-blue'}>{c.type}</span></td>
                <td className="table-cell font-medium">{c.patient}</td>
                <td className="table-cell">{c.date}</td>
                <td className="table-cell text-primary-600">{c.doctor}</td>
                <td className="table-cell">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Download className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Issue Certificate */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Issue Certificate</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Certificate Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option>Birth</option>
                  <option>Death</option>
                  <option>Medical Fitness</option>
                  <option>Discharge Summary</option>
                  <option>Sick Leave</option>
                </select>
              </div>
              <div>
                <label className="label">Patient Name</label>
                <input className="input" value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Date</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Doctor</label>
                <input className="input" value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Issued To (optional)</label>
                <input className="input" value={form.issuedTo} onChange={e => setForm(f => ({ ...f, issuedTo: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Issue</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

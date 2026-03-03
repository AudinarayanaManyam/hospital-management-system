
import { useState } from 'react';
import { mockBeds } from '../utils/mockData';
import { Plus } from 'lucide-react';

export default function BedManagement() {
  const [beds, setBeds] = useState([...mockBeds]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    number: '',
    ward: '',
    type: 'General' as 'General' | 'ICU' | 'Private' | 'Semi-Private' | 'Emergency',
    status: 'Available',
    patientName: '',
  });
  const [error, setError] = useState('');

  const statusColors: Record<string, string> = { 'Available': 'bg-green-100 border-green-300 text-green-700', 'Occupied': 'bg-red-100 border-red-300 text-red-700', 'Reserved': 'bg-yellow-100 border-yellow-300 text-yellow-700', 'Maintenance': 'bg-gray-100 border-gray-300 text-gray-500' };
  const stats = ['Available', 'Occupied', 'Reserved', 'Maintenance'].map(s => ({ label: s, count: beds.filter(b => b.status === s).length }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.number || !form.ward || !form.status) {
      setError('Please fill all required fields.');
      return;
    }
    setBeds(prev => [
      {
        id: 'BED' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        type: form.type as 'General' | 'ICU' | 'Private' | 'Semi-Private' | 'Emergency',
        status: form.status as 'Available' | 'Occupied' | 'Reserved' | 'Maintenance',
        patientName: form.status === 'Occupied' ? form.patientName : '',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ number: '', ward: '', type: 'General', status: 'Available', patientName: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Bed Management</h1><p className="text-sm text-gray-500">Real-time bed occupancy tracking</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Bed</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const colors = ['text-green-600', 'text-red-600', 'text-yellow-600', 'text-gray-500'];
          return <div key={s.label} className="stat-card"><div className={`text-2xl font-bold ${colors[i]}`}>{s.count}</div><div className="text-sm text-gray-500">{s.label}</div></div>;
        })}
      </div>
      <div className="card">
        <h2 className="section-title mb-4">Bed Grid</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {beds.map(b => (
            <div key={b.id} className={`border-2 rounded-xl p-3 cursor-pointer hover:opacity-80 transition-opacity ${statusColors[b.status]}`}>
              <div className="font-bold text-sm">{b.number}</div>
              <div className="text-xs mt-1">{b.ward}</div>
              <div className="text-xs font-medium mt-1">{b.status}</div>
              {b.patientName && <div className="text-xs mt-1 truncate">{b.patientName}</div>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(statusColors).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5 text-xs">
              <div className={`w-3 h-3 rounded border-2 ${c}`} />{s}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add Bed */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Bed</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Bed Number</label>
                <input className="input" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Ward</label>
                <input className="input" value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'General' | 'ICU' | 'Private' | 'Semi-Private' | 'Emergency' }))}>
                    <option>General</option>
                    <option>ICU</option>
                    <option>Private</option>
                    <option>Semi-Private</option>
                    <option>Emergency</option>
                  </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' }))}>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Reserved</option>
                  <option>Maintenance</option>
                </select>
              </div>
              {form.status === 'Occupied' && (
                <div>
                  <label className="label">Patient Name</label>
                  <input className="input" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
                </div>
              )}
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


import { useState } from 'react';
import { mockAmbulances } from '../utils/mockData';
import { Truck, Phone, MapPin, Plus } from 'lucide-react';

export default function Ambulance() {
  const statusColors: Record<string, string> = { Available: 'badge-green', 'On Call': 'badge-yellow', Maintenance: 'badge-red' };
  const typeColors: Record<string, string> = { Basic: 'badge-gray', Advanced: 'badge-blue', ICU: 'badge-red' };
  const [ambulances, setAmbulances] = useState([...mockAmbulances]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    vehicleNo: '',
    type: 'Basic',
    driver: '',
    driverPhone: '',
    status: 'Available',
    lastLocation: ''
  });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.vehicleNo || !form.driver || !form.driverPhone) {
      setError('Vehicle No, Driver, and Driver Phone are required.');
      return;
    }
    setAmbulances(prev => [
      {
        id: 'AMB' + (prev.length + 1).toString().padStart(2, '0'),
        ...form,
        type: form.type as 'Basic' | 'Advanced' | 'ICU',
        status: form.status as 'Available' | 'On Call' | 'Maintenance'
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ vehicleNo: '', type: 'Basic', driver: '', driverPhone: '', status: 'Available', lastLocation: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Ambulance Fleet</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Vehicle</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['Available', 'On Call', 'Maintenance'].map((s, i) => {
          const colors = ['text-green-600', 'text-yellow-600', 'text-red-600'];
          return <div key={s} className="stat-card"><div className={`text-2xl font-bold ${colors[i]}`}>{ambulances.filter(a => a.status === s).length}</div><div className="text-sm text-gray-500">{s}</div></div>;
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ambulances.map(a => (
          <div key={a.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><Truck className="w-5 h-5 text-red-500" /></div>
                <div>
                  <div className="font-semibold">{a.vehicleNo}</div>
                  <span className={typeColors[a.type]}>{a.type}</span>
                </div>
              </div>
              <span className={statusColors[a.status]}>{a.status}</span>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div>Driver: <span className="font-medium">{a.driver}</span></div>
              <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{a.driverPhone}</div>
              {a.lastLocation && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />Last: {a.lastLocation}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add Vehicle */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Ambulance Vehicle</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Vehicle No</label>
                <input className="input" value={form.vehicleNo} onChange={e => setForm(f => ({ ...f, vehicleNo: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option>Basic</option>
                  <option>Advanced</option>
                  <option>ICU</option>
                </select>
              </div>
              <div>
                <label className="label">Driver</label>
                <input className="input" value={form.driver} onChange={e => setForm(f => ({ ...f, driver: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Driver Phone</label>
                <input className="input" value={form.driverPhone} onChange={e => setForm(f => ({ ...f, driverPhone: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Available</option>
                  <option>On Call</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div>
                <label className="label">Last Location (optional)</label>
                <input className="input" value={form.lastLocation} onChange={e => setForm(f => ({ ...f, lastLocation: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Add Vehicle</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

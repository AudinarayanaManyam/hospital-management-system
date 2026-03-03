import { useState } from 'react';
import { mockBloodBank } from '../utils/mockData';
import { Droplets, Plus } from 'lucide-react';

export default function BloodBank() {
  const [bloodUnits, setBloodUnits] = useState([...mockBloodBank]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: 'A+',
    units: 1,
    donorName: '',
    donationDate: '',
    expiryDate: '',
    status: 'Available',
  });
  const [error, setError] = useState('');
  const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const getUnits = (g: string) => bloodUnits.filter(b => b.bloodGroup === g && b.status === 'Available').reduce((a, b) => a + b.units, 0);
  const statusColors: Record<string, string> = { Available: 'badge-green', Reserved: 'badge-yellow', Used: 'badge-gray', Expired: 'badge-red' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.bloodGroup || !form.donorName || !form.donationDate || !form.expiryDate || !form.status || !form.units) {
      setError('Please fill all required fields.');
      return;
    }
    setBloodUnits(prev => [
      {
        id: 'BB' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        status: form.status as 'Available' | 'Reserved' | 'Used' | 'Expired',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ bloodGroup: 'A+', units: 1, donorName: '', donationDate: '', expiryDate: '', status: 'Available' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Blood Bank</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Donation</button>
      </div>
      <div className="card">
        <h2 className="section-title mb-4">Blood Group Availability</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {groups.map(g => {
            const units = getUnits(g);
            return (
              <div key={g} className={`text-center p-3 rounded-xl border-2 ${units < 5 ? 'border-red-200 bg-red-50' : units < 10 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
                <div className="flex justify-center mb-1"><Droplets className={`w-5 h-5 ${units < 5 ? 'text-red-500' : units < 10 ? 'text-yellow-500' : 'text-green-500'}`} /></div>
                <div className="font-bold text-lg">{g}</div>
                <div className="text-sm font-medium">{units}u</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card overflow-x-auto">
        <h2 className="section-title mb-4">Blood Inventory</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Blood Group</th>
              <th className="table-header">Units</th>
              <th className="table-header">Donor</th>
              <th className="table-header">Donation Date</th>
              <th className="table-header">Expiry</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {bloodUnits.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-xs">{b.id}</td>
                <td className="table-cell"><span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-red-500" />{b.bloodGroup}</span></td>
                <td className="table-cell font-bold">{b.units}</td>
                <td className="table-cell">{b.donorName}</td>
                <td className="table-cell">{b.donationDate}</td>
                <td className="table-cell">{b.expiryDate}</td>
                <td className="table-cell"><span className={statusColors[b.status]}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for New Blood Donation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Blood Donation</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Blood Group</label>
                <select className="input" value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}>
                  {groups.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Units</label>
                <input className="input" type="number" min={1} value={form.units} onChange={e => setForm(f => ({ ...f, units: Number(e.target.value) }))} required />
              </div>
              <div>
                <label className="label">Donor Name</label>
                <input className="input" value={form.donorName} onChange={e => setForm(f => ({ ...f, donorName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Donation Date</label>
                <input className="input" type="date" value={form.donationDate} onChange={e => setForm(f => ({ ...f, donationDate: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Expiry Date</label>
                <input className="input" type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Available</option>
                  <option>Reserved</option>
                  <option>Used</option>
                  <option>Expired</option>
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

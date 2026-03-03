
import { useState } from 'react';
import { Plus, Phone, Users, Bed } from 'lucide-react';
import { mockDepartments } from '../utils/mockData';

export default function Departments() {
  const [departments, setDepartments] = useState([...mockDepartments]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    head: '',
    beds: '',
    staff: '',
    phone: '',
    status: 'Active',
  });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.head || !form.beds || !form.staff || !form.phone) {
      setError('Please fill all required fields.');
      return;
    }
    setDepartments(prev => [
      {
        id: 'DEP' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        beds: Number(form.beds),
        staff: Number(form.staff),
        status: form.status as 'Active' | 'Inactive'
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ name: '', head: '', beds: '', staff: '', phone: '', status: 'Active' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Departments</h1><p className="text-sm text-gray-500">{departments.length} active departments</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Department</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map(d => (
          <div key={d.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-lg">{d.name}</h3>
              <span className={d.status === 'Active' ? 'badge-green' : 'badge-red'}>{d.status}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Head: <span className="font-medium text-primary-700">{d.head}</span></p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bed className="w-4 h-4 text-blue-500" />{d.beds} Beds
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-green-500" />{d.staff} Staff
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3" />{d.phone}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add Department */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Department</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Department Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Head of Department</label>
                <input className="input" value={form.head} onChange={e => setForm(f => ({ ...f, head: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Beds</label>
                  <input className="input" type="number" min={0} value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Staff</label>
                  <input className="input" type="number" min={0} value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Inactive</option>
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

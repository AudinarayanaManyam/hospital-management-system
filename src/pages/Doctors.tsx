
import { useState } from 'react';
import { Search, Plus, Phone, Mail, Star } from 'lucide-react';
import { mockDoctors } from '../utils/mockData';

export default function Doctors() {
  const [doctors, setDoctors] = useState([...mockDoctors]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    qualification: '',
    phone: '',
    email: '',
    department: '',
    experience: '',
    status: 'Active',
    schedule: '',
  });
  const [error, setError] = useState('');

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = { 'Active': 'badge-green', 'On Leave': 'badge-yellow', 'Off Duty': 'badge-gray' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.specialization || !form.qualification || !form.phone || !form.department || !form.experience) {
      setError('Please fill all required fields.');
      return;
    }
    setDoctors(prev => [
      {
        id: 'D' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        experience: Number(form.experience),
        status: form.status as 'Active' | 'On Leave' | 'Off Duty'
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ name: '', specialization: '', qualification: '', phone: '', email: '', department: '', experience: '', status: 'Active', schedule: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Doctors</h1><p className="text-sm text-gray-500 mt-1">{doctors.length} doctors on staff</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Doctor</button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                  {d.name.split(' ').slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{d.name}</div>
                  <div className="text-xs text-primary-600 font-medium">{d.specialization}</div>
                </div>
              </div>
              <span className={statusColors[d.status]}>{d.status}</span>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-yellow-500" />{d.qualification}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{d.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{d.email}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <span>{d.department}</span>
              <span>{d.experience} yrs exp.</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">{d.schedule}</div>
          </div>
        ))}
      </div>

      {/* Modal for Add Doctor */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Doctor</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Specialization</label>
                  <input className="input" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Qualification</label>
                  <input className="input" value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Email</label>
                  <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Department</label>
                  <input className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Experience (years)</label>
                  <input className="input" type="number" min={0} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Off Duty</option>
                </select>
              </div>
              <div>
                <label className="label">Schedule (optional)</label>
                <input className="input" value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} />
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

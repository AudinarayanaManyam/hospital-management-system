
import { useState } from 'react';
import { Search, Plus, Filter, Phone, Mail, Droplets, Eye } from 'lucide-react';
import { mockPatients } from '../utils/mockData';

export default function Patients() {
  const [patients, setPatients] = useState([...mockPatients]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: '',
    insurance: '',
    status: 'Active',
  });
  const [error, setError] = useState('');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    'Active': 'badge-green', 'Admitted': 'badge-blue', 'Discharged': 'badge-gray', 'OPD': 'badge-yellow'
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.age || !form.gender || !form.phone || !form.bloodGroup) {
      setError('Please fill all required fields.');
      return;
    }
    setPatients(prev => [
      {
        id: 'P' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        gender: form.gender as 'Male' | 'Female' | 'Other',
        age: Number(form.age),
        status: form.status as 'Active' | 'Admitted' | 'Discharged' | 'OPD',
        registrationDate: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ name: '', age: '', gender: 'Male', phone: '', email: '', address: '', bloodGroup: '', insurance: '', status: 'Active' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">{patients.length} total patients registered</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Register Patient
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Admitted</option>
            <option>Discharged</option>
            <option>OPD</option>
          </select>
          <button className="btn-secondary"><Filter className="w-4 h-4" /> Filter</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-lg">
              <tr>
                <th className="table-header">Patient ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Age/Gender</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Blood Group</th>
                <th className="table-header">Insurance</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p.id}</span></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">{p.name.charAt(0)}</div>
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">{p.age}y / {p.gender}</td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3" />{p.phone}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Mail className="w-3 h-3" />{p.email}</span>
                    </div>
                  </td>
                  <td className="table-cell"><span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-red-500" />{p.bloodGroup}</span></td>
                  <td className="table-cell"><span className="text-xs">{p.insurance || '—'}</span></td>
                  <td className="table-cell"><span className={statusColors[p.status]}>{p.status}</span></td>
                  <td className="table-cell">
                    <button className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Register Patient */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Register Patient</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Age</label>
                  <input className="input" type="number" min={0} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Gender</label>
                  <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
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
              <div>
                <label className="label">Address</label>
                <input className="input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Blood Group</label>
                  <input className="input" value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Insurance (optional)</label>
                  <input className="input" value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Register</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

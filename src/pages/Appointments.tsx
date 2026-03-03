import { useState } from 'react';
import { Plus, Search, Calendar, Clock } from 'lucide-react';
import { mockAppointments } from '../utils/mockData';

export default function Appointments() {
  const [appointments, setAppointments] = useState([...mockAppointments]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    doctorName: '',
    department: '',
    date: '',
    time: '',
    type: 'OPD',
    status: 'Scheduled',
    patientId: '',
    doctorId: '',
  });
  const [error, setError] = useState('');

  const filtered = appointments.filter(a => {
    const m = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctorName.toLowerCase().includes(search.toLowerCase());
    return m && (filter === 'All' || a.status === filter);
  });

  const statusColors: Record<string, string> = { 'Scheduled': 'badge-blue', 'Completed': 'badge-green', 'Cancelled': 'badge-red', 'No-Show': 'badge-gray' };
  const typeColors: Record<string, string> = { 'OPD': 'badge-blue', 'IPD': 'badge-purple', 'Emergency': 'badge-red', 'Follow-up': 'badge-yellow' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.patientName || !form.doctorName || !form.department || !form.date || !form.time) {
      setError('Please fill all required fields.');
      return;
    }
    setAppointments(prev => [
      {
        id: 'APT' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        type: form.type as 'OPD' | 'IPD' | 'Emergency' | 'Follow-up',
        status: form.status as 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ patientName: '', doctorName: '', department: '', date: '', time: '', type: 'OPD', status: 'Scheduled', patientId: '', doctorId: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Appointments</h1><p className="text-sm text-gray-500">Schedule and manage patient appointments</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> New Appointment</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {['Scheduled', 'Completed', 'Cancelled', 'No-Show'].map((s, i) => {
          const count = appointments.filter(a => a.status === s).length;
          const colors = ['bg-blue-50 text-blue-700', 'bg-green-50 text-green-700', 'bg-red-50 text-red-700', 'bg-gray-50 text-gray-700'];
          return (
            <div key={s} className="stat-card">
              <div className={`text-2xl font-bold ${colors[i].split(' ')[1]}`}>{count}</div>
              <div className="text-sm text-gray-500">{s}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input w-40" value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Appt ID</th>
                <th className="table-header">Patient</th>
                <th className="table-header">Doctor</th>
                <th className="table-header">Department</th>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Type</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="table-cell font-mono text-xs">{a.id}</td>
                  <td className="table-cell font-medium">{a.patientName}</td>
                  <td className="table-cell text-primary-600">{a.doctorName}</td>
                  <td className="table-cell">{a.department}</td>
                  <td className="table-cell">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-xs"><Calendar className="w-3 h-3" />{a.date}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" />{a.time}</span>
                    </div>
                  </td>
                  <td className="table-cell"><span className={typeColors[a.type]}>{a.type}</span></td>
                  <td className="table-cell"><span className={statusColors[a.status]}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for New Appointment */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">New Appointment</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Patient ID</label>
                <input className="input" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Patient Name</label>
                <input className="input" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Doctor ID</label>
                <input className="input" value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Doctor Name</label>
                <input className="input" value={form.doctorName} onChange={e => setForm(f => ({ ...f, doctorName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Department</label>
                <input className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Date</label>
                  <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Time</label>
                  <input className="input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Type</label>
                  <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option>OPD</option>
                    <option>IPD</option>
                    <option>Emergency</option>
                    <option>Follow-up</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                    <option>No-Show</option>
                  </select>
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
         


import { useState } from 'react';
import { mockDutyRoster } from '../utils/mockData';
import { Clock, Plus } from 'lucide-react';

export default function DutyRoster() {
  const [roster, setRoster] = useState([...mockDutyRoster]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    staffName: '',
    role: '',
    department: '',
    date: '',
    shift: 'Morning',
    status: 'Scheduled',
  });
  const [error, setError] = useState('');
  const shiftColors: Record<string, string> = { Morning: 'badge-yellow', Afternoon: 'badge-blue', Night: 'badge-purple' };
  const statusColors: Record<string, string> = { Scheduled: 'badge-gray', Present: 'badge-green', Absent: 'badge-red', Leave: 'badge-yellow' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.staffName || !form.role || !form.department || !form.date || !form.shift || !form.status) {
      setError('Please fill all required fields.');
      return;
    }
    setRoster(prev => [
      {
        id: 'DR' + (prev.length + 1).toString().padStart(3, '0'),
        staffId: 'S' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        shift: form.shift as 'Morning' | 'Afternoon' | 'Night',
        status: form.status as 'Scheduled' | 'Present' | 'Absent' | 'Leave',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ staffName: '', role: '', department: '', date: '', shift: 'Morning', status: 'Scheduled' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Duty Roster</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Schedule Shift</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {['Present', 'Scheduled', 'Absent', 'Leave'].map((s, i) => {
          const colors = ['text-green-600', 'text-gray-600', 'text-red-600', 'text-yellow-600'];
          return <div key={s} className="stat-card"><div className={`text-2xl font-bold ${colors[i]}`}>{roster.filter(r => r.status === s).length}</div><div className="text-sm text-gray-500">{s}</div></div>;
        })}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Staff</th>
              <th className="table-header">Role</th>
              <th className="table-header">Department</th>
              <th className="table-header">Date</th>
              <th className="table-header">Shift</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {roster.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="table-cell font-medium">{r.staffName}</td>
                <td className="table-cell">{r.role}</td>
                <td className="table-cell">{r.department}</td>
                <td className="table-cell">{r.date}</td>
                <td className="table-cell"><span className={shiftColors[r.shift]}><Clock className="w-3 h-3 inline mr-1" />{r.shift}</span></td>
                <td className="table-cell"><span className={statusColors[r.status]}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for New Duty Shift */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Schedule Duty Shift</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div><label className="label">Staff Name</label><input className="input" value={form.staffName} onChange={e => setForm(f => ({ ...f, staffName: e.target.value }))} required /></div>
              <div><label className="label">Role</label><input className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required /></div>
              <div><label className="label">Department</label><input className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required /></div>
              <div><label className="label">Date</label><input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required /></div>
              <div><label className="label">Shift</label><select className="input" value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value }))}><option>Morning</option><option>Afternoon</option><option>Night</option></select></div>
              <div><label className="label">Status</label><select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option>Scheduled</option><option>Present</option><option>Absent</option><option>Leave</option></select></div>
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

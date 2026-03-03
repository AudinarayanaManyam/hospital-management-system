
import React, { useState } from 'react';
import { mockStaff } from '../utils/mockData';
import { UserCog, Plus, Phone, Mail } from 'lucide-react';

export default function HumanResources() {
  const [staff, setStaff] = useState<typeof mockStaff>([...mockStaff]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: '',
    phone: '',
    email: '',
    joinDate: '',
    salary: '',
    status: 'Active',
  });
  const [error, setError] = useState<string>('');
  const statusColors: Record<string, string> = { Active: 'badge-green', 'On Leave': 'badge-yellow', Resigned: 'badge-red' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.role || !form.department || !form.phone || !form.email || !form.joinDate || !form.salary || !form.status) {
      setError('Please fill all required fields.');
      return;
    }
    setStaff((prev: typeof mockStaff) => [
      {
        id: 'S' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        salary: Number(form.salary),
        status: form.status as 'Active' | 'On Leave' | 'Resigned',
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ name: '', role: '', department: '', phone: '', email: '', joinDate: '', salary: '', status: 'Active' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Human Resources</h1><p className="text-sm text-gray-500">{staff.length} staff members</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Staff</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">{staff.filter(s => s.status === 'Active').length}</div><div className="text-sm text-gray-500">Active Staff</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-yellow-600">{staff.filter(s => s.status === 'On Leave').length}</div><div className="text-sm text-gray-500">On Leave</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-gray-600">₹{staff.reduce((a, s) => a + s.salary, 0).toLocaleString()}</div><div className="text-sm text-gray-500">Monthly Payroll</div></div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Staff ID</th>
              <th className="table-header">Name</th>
              <th className="table-header">Role</th>
              <th className="table-header">Department</th>
              <th className="table-header">Contact</th>
              <th className="table-header">Join Date</th>
              <th className="table-header">Salary</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-xs">{s.id}</td>
                <td className="table-cell"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">{s.name.charAt(0)}</div><span className="font-medium">{s.name}</span></div></td>
                <td className="table-cell">{s.role}</td>
                <td className="table-cell">{s.department}</td>
                <td className="table-cell"><div className="text-xs"><div className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</div><div className="flex items-center gap-1 text-gray-400"><Mail className="w-3 h-3" />{s.email}</div></div></td>
                <td className="table-cell">{s.joinDate}</td>
                <td className="table-cell font-medium">₹{s.salary.toLocaleString()}</td>
                <td className="table-cell"><span className={statusColors[s.status]}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for New Staff */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Staff Member</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div><label className="label">Name</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><label className="label">Role</label><input className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required /></div>
              <div><label className="label">Department</label><input className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required /></div>
              <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div><label className="label">Join Date</label><input className="input" type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} required /></div>
              <div><label className="label">Salary</label><input className="input" type="number" min={0} value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} required /></div>
              <div><label className="label">Status</label><select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option>Active</option><option>On Leave</option><option>Resigned</option></select></div>
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

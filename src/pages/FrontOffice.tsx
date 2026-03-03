import { mockPatients, mockAppointments } from '../utils/mockData';
import { MonitorPlay, UserPlus, Calendar, Phone, Clock } from 'lucide-react';

export default function FrontOffice() {
  const todayAppts = mockAppointments.slice(0, 3);
  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Front Office</h1><p className="text-sm text-gray-500">Reception & patient management desk</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold text-blue-600">12</div><div className="text-sm text-gray-500">Check-ins Today</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">8</div><div className="text-sm text-gray-500">Check-outs Today</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-orange-600">5</div><div className="text-sm text-gray-500">Waiting Patients</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-purple-600">3</div><div className="text-sm text-gray-500">New Registrations</div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title mb-4 flex items-center gap-2"><UserPlus className="w-4 h-4" />Quick Registration</h2>
          <div className="space-y-3">
            <div><label className="label">Full Name</label><input className="input" placeholder="Patient full name" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Age</label><input className="input" type="number" placeholder="Age" /></div>
              <div><label className="label">Gender</label><select className="input"><option>Male</option><option>Female</option><option>Other</option></select></div>
            </div>
            <div><label className="label">Phone</label><input className="input" placeholder="+91 XXXXXXXXXX" /></div>
            <div><label className="label">Visit Type</label><select className="input"><option>OPD</option><option>Emergency</option><option>Follow-up</option></select></div>
            <button className="btn-primary w-full justify-center">Register Patient</button>
          </div>
        </div>
        <div className="card">
          <h2 className="section-title mb-4 flex items-center gap-2"><Clock className="w-4 h-4" />Today's Schedule</h2>
          <div className="space-y-3">
            {todayAppts.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-sm">{a.patientName}</div>
                  <div className="text-xs text-gray-500">{a.doctorName} · {a.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{a.time}</div>
                  <span className={a.status === 'Completed' ? 'badge-green' : 'badge-blue'}>{a.status}</span>
                </div>
              </div>
            ))}
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-sm font-medium text-orange-700">Walk-in Patient</div>
              <div className="text-xs text-orange-500 mt-0.5">Waiting for 15 mins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

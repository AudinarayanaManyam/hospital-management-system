import { mockPatients, mockAppointments } from '../utils/mockData';
import { Activity, LogIn, LogOut } from 'lucide-react';

export default function OPD() {
  const opdPatients = mockPatients.filter(p => p.status === 'OPD' || p.status === 'Active');
  const today = mockAppointments.filter(a => a.type === 'OPD');

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">OPD Management</h1><p className="text-sm text-gray-500">Outpatient Department - In/Out Tracking</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-3"><LogIn className="w-8 h-8 text-green-500" /><div><div className="text-2xl font-bold text-green-600">34</div><div className="text-sm text-gray-500">Today Check-in</div></div></div>
        <div className="stat-card flex items-center gap-3"><LogOut className="w-8 h-8 text-blue-500" /><div><div className="text-2xl font-bold text-blue-600">28</div><div className="text-sm text-gray-500">Today Check-out</div></div></div>
        <div className="stat-card flex items-center gap-3"><Activity className="w-8 h-8 text-orange-500" /><div><div className="text-2xl font-bold text-orange-600">6</div><div className="text-sm text-gray-500">Currently Inside</div></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title mb-4">OPD Queue</h2>
          <div className="space-y-2">
            {today.map((a, i) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">{i + 1}</div>
                  <div>
                    <div className="font-medium text-sm">{a.patientName}</div>
                    <div className="text-xs text-gray-500">{a.doctorName} · {a.time}</div>
                  </div>
                </div>
                <span className={a.status === 'Completed' ? 'badge-green' : 'badge-blue'}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="section-title mb-4">Department OPD Stats</h2>
          <div className="space-y-3">
            {['Cardiology', 'Neurology', 'Gynecology', 'Pediatrics', 'Surgery'].map((dept, i) => {
              const vals = [8, 5, 7, 6, 4];
              return (
                <div key={dept} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24">{dept}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(vals[i] / 10) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-6">{vals[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

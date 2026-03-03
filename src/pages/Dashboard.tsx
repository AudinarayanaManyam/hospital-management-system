import { Users, Stethoscope, Bed, Calendar, TrendingUp, AlertCircle, Activity, DollarSign, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { PageType } from '../App';

const admissionsData = [
  { month: 'Jan', admissions: 120, discharges: 110 },
  { month: 'Feb', admissions: 145, discharges: 130 },
  { month: 'Mar', admissions: 132, discharges: 125 },
  { month: 'Apr', admissions: 160, discharges: 150 },
  { month: 'May', admissions: 178, discharges: 165 },
  { month: 'Jun', admissions: 155, discharges: 148 },
];

const deptData = [
  { name: 'Cardiology', value: 28, color: '#0ea5e9' },
  { name: 'Neurology', value: 18, color: '#8b5cf6' },
  { name: 'Pediatrics', value: 22, color: '#10b981' },
  { name: 'Gynecology', value: 15, color: '#f59e0b' },
  { name: 'Orthopedics', value: 17, color: '#ef4444' },
];

interface DashboardProps {
  onNavigate: (page: PageType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Total Patients', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', page: 'patients' as PageType },
    { label: 'Active Doctors', value: '48', change: '+2', icon: Stethoscope, color: 'text-green-600', bg: 'bg-green-50', page: 'doctors' as PageType },
    { label: 'Beds Occupied', value: '186/220', change: '84%', icon: Bed, color: 'text-orange-600', bg: 'bg-orange-50', page: 'bed-management' as PageType },
    { label: "Today's Appointments", value: '62', change: '+8', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', page: 'appointments' as PageType },
    { label: 'Revenue Today', value: '₹1.24L', change: '+15%', icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50', page: 'finance' as PageType },
    { label: 'OPD Today', value: '34', change: 'In: 34', icon: Activity, color: 'text-red-600', bg: 'bg-red-50', page: 'opd' as PageType },
  ];

  const alerts = [
    { msg: 'Low blood stock: O- (3 units)', type: 'urgent', page: 'blood-bank' as PageType },
    { msg: 'IV Drip Set below minimum stock', type: 'warning', page: 'inventory' as PageType },
    { msg: '5 pending lab reports', type: 'info', page: 'pathology' as PageType },
    { msg: 'Dr. Rajan Pillai on leave today', type: 'info', page: 'duty-roster' as PageType },
    { msg: 'Amoxicillin expiry: 15 Mar 2025', type: 'warning', page: 'pharmacy' as PageType },
  ];

  const recentPatients = [
    { id: 'P001', name: 'Rajesh Kumar', dept: 'Cardiology', status: 'Active', time: '09:30 AM' },
    { id: 'P002', name: 'Priya Sharma', dept: 'Gynecology', status: 'Admitted', time: '10:15 AM' },
    { id: 'P003', name: 'Mohammed Ali', dept: 'Neurology', status: 'OPD', time: '11:00 AM' },
    { id: 'P005', name: 'Venkat Rao', dept: 'Surgery', status: 'Admitted', time: '08:45 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monday, March 15, 2024 — Good morning, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.label} onClick={() => onNavigate(s.page)} className="stat-card text-left hover:scale-[1.02] transition-transform">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              <div className="text-xs text-green-600 mt-1 font-medium">{s.change}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Admissions vs Discharges</h2>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={admissionsData}>
              <defs>
                <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="admissions" stroke="#0ea5e9" fill="url(#colorAdm)" strokeWidth={2} />
              <Area type="monotone" dataKey="discharges" stroke="#10b981" fill="url(#colorDis)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Dept Distribution */}
        <div className="card">
          <h2 className="section-title mb-4">Patient Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {deptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {deptData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" /> Alerts & Notifications
            </h2>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <button key={i} onClick={() => onNavigate(a.page)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.type === 'urgent' ? 'bg-red-500' : a.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
                  <span className="text-sm text-gray-700">{a.msg}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Patients</h2>
            <button onClick={() => onNavigate('patients')} className="text-xs text-primary-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {recentPatients.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.dept} · {p.time}</div>
                  </div>
                </div>
                <span className={`badge ${p.status === 'Admitted' ? 'badge-blue' : p.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

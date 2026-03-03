import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { BarChart3, Download } from 'lucide-react';

const deptRevenue = [
  { dept: 'Cardiology', revenue: 580000 },
  { dept: 'Neurology', revenue: 420000 },
  { dept: 'Orthopedics', revenue: 390000 },
  { dept: 'Gynecology', revenue: 310000 },
  { dept: 'Pediatrics', revenue: 280000 },
];

const patientTrend = [
  { month: 'Oct', opd: 380, ipd: 85 },
  { month: 'Nov', opd: 420, ipd: 92 },
  { month: 'Dec', opd: 510, ipd: 110 },
  { month: 'Jan', opd: 460, ipd: 95 },
  { month: 'Feb', opd: 498, ipd: 105 },
  { month: 'Mar', opd: 535, ipd: 118 },
];

export default function Reports() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Reports & Analytics</h1></div>
        <button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title mb-4">Department Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `₹${v/1000}K`} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v: number) => `₹${(v/1000).toFixed(0)}K`} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="section-title mb-4">Patient Trend (OPD vs IPD)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={patientTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="opd" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ipd" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h2 className="section-title mb-4">Quick Reports</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['Daily Report', 'Patient Summary', 'Revenue Report', 'Lab Reports', 'Staff Report', 'Inventory Report'].map(r => (
            <button key={r} className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors group">
              <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
              <span className="text-xs text-gray-600 font-medium text-center">{r}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

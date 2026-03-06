import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { BarChart3, Download } from 'lucide-react';

export default function Reports() {
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

  const [activeReport, setActiveReport] = useState<string | null>(null);
  const reportList = [
    'Daily Report',
    'Patient Summary',
    'Revenue Report',
    'Lab Reports',
    'Staff Report',
    'Inventory Report',
  ];

  function renderReportPage(report: string) {
    switch (report) {
      case 'Daily Report':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">Daily Report</h2>
              <button className="btn-secondary" onClick={() => setActiveReport(null)}>Back</button>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">Summary of today's hospital activity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary-700">42</div>
                  <div className="text-xs text-gray-600">Admissions</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">37</div>
                  <div className="text-xs text-gray-600">Discharges</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">380</div>
                  <div className="text-xs text-gray-600">OPD Visits</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">₹2,10,000</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Admissions Trend</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={patientTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="opd" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="ipd" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'Patient Summary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">Patient Summary</h2>
              <button className="btn-secondary" onClick={() => setActiveReport(null)}>Back</button>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">Patient Demographics</h3>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">1,250</div>
                  <div className="text-xs text-gray-600">Total Patients</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-700">320</div>
                  <div className="text-xs text-gray-600">Children</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">780</div>
                  <div className="text-xs text-gray-600">Adults</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">150</div>
                  <div className="text-xs text-gray-600">Seniors</div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Patient Trend</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={patientTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="opd" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="ipd" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'Revenue Report':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">Revenue Report</h2>
              <button className="btn-secondary" onClick={() => setActiveReport(null)}>Back</button>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">Department Revenue Breakdown</h3>
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
          </div>
        );
      case 'Lab Reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">Lab Reports</h2>
              <button className="btn-secondary" onClick={() => setActiveReport(null)}>Back</button>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">Lab Test Statistics</h3>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">1,120</div>
                  <div className="text-xs text-gray-600">Total Tests</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">42</div>
                  <div className="text-xs text-gray-600">Abnormal</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">18</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Staff Report':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">Staff Report</h2>
              <button className="btn-secondary" onClick={() => setActiveReport(null)}>Back</button>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">Staff Attendance & Performance</h3>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">22</div>
                  <div className="text-xs text-gray-600">Doctors</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">48</div>
                  <div className="text-xs text-gray-600">Nurses</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">30</div>
                  <div className="text-xs text-gray-600">Support Staff</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Inventory Report':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">Inventory Report</h2>
              <button className="btn-secondary" onClick={() => setActiveReport(null)}>Back</button>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">Inventory Status</h3>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">1,200</div>
                  <div className="text-xs text-gray-600">Medicines</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">320</div>
                  <div className="text-xs text-gray-600">Lab Supplies</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">5</div>
                  <div className="text-xs text-gray-600">Low Stock Alerts</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      {!activeReport ? (
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
              {reportList.map(r => (
                <button
                  key={r}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-primary-50 rounded-xl transition-colors group"
                  onClick={() => setActiveReport(r)}
                >
                  <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  <span className="text-xs text-gray-600 font-medium text-center">{r}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        renderReportPage(activeReport)
      )}
    </>
  );
}

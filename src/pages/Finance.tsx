import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const monthlyData = [
  { month: 'Oct', revenue: 1850000, expenses: 1200000 },
  { month: 'Nov', revenue: 2100000, expenses: 1350000 },
  { month: 'Dec', revenue: 2350000, expenses: 1450000 },
  { month: 'Jan', revenue: 1950000, expenses: 1280000 },
  { month: 'Feb', revenue: 2200000, expenses: 1420000 },
  { month: 'Mar', revenue: 2480000, expenses: 1550000 },
];

export default function Finance() {
  const totalRevenue = 2480000;
  const totalExpenses = 1550000;
  const profit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Finance</h1><p className="text-sm text-gray-500">Financial overview and reports</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card border-l-4 border-green-400">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-sm text-gray-500">Revenue (Mar)</span></div>
          <div className="text-2xl font-bold text-green-600">₹{(totalRevenue/100000).toFixed(1)}L</div>
        </div>
        <div className="stat-card border-l-4 border-red-400">
          <div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-red-500" /><span className="text-sm text-gray-500">Expenses (Mar)</span></div>
          <div className="text-2xl font-bold text-red-600">₹{(totalExpenses/100000).toFixed(1)}L</div>
        </div>
        <div className="stat-card border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-blue-500" /><span className="text-sm text-gray-500">Net Profit (Mar)</span></div>
          <div className="text-2xl font-bold text-blue-600">₹{(profit/100000).toFixed(1)}L</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title mb-4">Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip formatter={(v: number) => `₹${(v/100000).toFixed(1)}L`} />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="section-title mb-4">Revenue Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'OPD Consultations', amount: 620000, pct: 25 },
              { label: 'IPD / Room Charges', amount: 990000, pct: 40 },
              { label: 'Pharmacy', amount: 372000, pct: 15 },
              { label: 'Diagnostics', amount: 297600, pct: 12 },
              { label: 'Other Services', amount: 200400, pct: 8 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">₹{(item.amount/100000).toFixed(1)}L ({item.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

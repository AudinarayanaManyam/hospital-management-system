import { CreditCard, FileText, CheckCircle, Clock } from 'lucide-react';

const tpaClaims = [
  { id: 'TPA001', patient: 'Rajesh Kumar', insurer: 'Star Health', tpa: 'Medi Assist', amount: 45000, submitted: '2024-03-10', status: 'Approved', approved: 42000 },
  { id: 'TPA002', patient: 'Priya Sharma', insurer: 'HDFC Ergo', tpa: 'Paramount TPA', amount: 87000, submitted: '2024-03-12', status: 'Pending', approved: 0 },
  { id: 'TPA003', patient: 'Mohammed Ali', insurer: 'New India', tpa: 'Health India', amount: 9000, submitted: '2024-03-08', status: 'Under Review', approved: 0 },
  { id: 'TPA004', patient: 'Sunita Reddy', insurer: 'Bajaj Allianz', tpa: 'Vidal Health', amount: 24000, submitted: '2024-03-05', status: 'Approved', approved: 22000 },
];
const statusColors: Record<string, string> = { Approved: 'badge-green', Pending: 'badge-yellow', 'Under Review': 'badge-blue', Rejected: 'badge-red' };

export default function TPA() {
  return (
    <div className="space-y-5">
      <div><h1 className="page-title">TPA Management</h1><p className="text-sm text-gray-500">Third Party Administrator claims tracking</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold">{tpaClaims.length}</div><div className="text-sm text-gray-500">Total Claims</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">{tpaClaims.filter(c => c.status === 'Approved').length}</div><div className="text-sm text-gray-500">Approved</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-yellow-600">{tpaClaims.filter(c => c.status === 'Pending').length}</div><div className="text-sm text-gray-500">Pending</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-blue-600">₹{tpaClaims.reduce((a, c) => a + c.approved, 0).toLocaleString()}</div><div className="text-sm text-gray-500">Approved Amount</div></div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Claim ID</th>
              <th className="table-header">Patient</th>
              <th className="table-header">Insurer</th>
              <th className="table-header">TPA</th>
              <th className="table-header">Claimed</th>
              <th className="table-header">Approved</th>
              <th className="table-header">Submitted</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {tpaClaims.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="table-cell font-mono text-xs">{c.id}</td>
                <td className="table-cell font-medium">{c.patient}</td>
                <td className="table-cell">{c.insurer}</td>
                <td className="table-cell text-purple-600">{c.tpa}</td>
                <td className="table-cell">₹{c.amount.toLocaleString()}</td>
                <td className="table-cell">{c.approved > 0 ? `₹${c.approved.toLocaleString()}` : '—'}</td>
                <td className="table-cell">{c.submitted}</td>
                <td className="table-cell"><span className={statusColors[c.status]}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

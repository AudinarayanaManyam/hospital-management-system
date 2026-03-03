import { Shield, Phone, CheckCircle } from 'lucide-react';

const insurers = [
  { name: 'Star Health Insurance', code: 'STAR', claims: 24, approved: 20, pending: 3, rejected: 1, amount: 185000 },
  { name: 'HDFC ERGO', code: 'HDFC', claims: 18, approved: 15, pending: 2, rejected: 1, amount: 142000 },
  { name: 'Bajaj Allianz', code: 'BAJAJ', claims: 12, approved: 10, pending: 2, rejected: 0, amount: 98000 },
  { name: 'New India Assurance', code: 'NIA', claims: 15, approved: 12, pending: 2, rejected: 1, amount: 124000 },
];

export default function Insurance() {
  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Insurance Management</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold">69</div><div className="text-sm text-gray-500">Total Claims</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">57</div><div className="text-sm text-gray-500">Approved</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-yellow-600">9</div><div className="text-sm text-gray-500">Pending</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-red-600">3</div><div className="text-sm text-gray-500">Rejected</div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insurers.map(ins => (
          <div key={ins.code} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-blue-600" /></div>
              <div>
                <div className="font-semibold">{ins.name}</div>
                <div className="text-xs text-gray-400">{ins.code}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="font-bold text-lg">{ins.claims}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="font-bold text-lg text-green-600">{ins.approved}</div>
                <div className="text-xs text-gray-500">Approved</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded-lg">
                <div className="font-bold text-lg text-yellow-600">{ins.pending}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">Total Amount: <span className="text-primary-600">₹{ins.amount.toLocaleString()}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

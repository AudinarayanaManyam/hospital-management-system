
import { useState } from 'react';
import { mockInventory } from '../utils/mockData';
import { Pill, AlertTriangle, Plus } from 'lucide-react';

export default function Pharmacy() {
  const [inventory, setInventory] = useState([...mockInventory]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Medicine',
    quantity: '',
    unit: '',
    minStock: '',
    price: '',
    supplier: '',
    expiryDate: '',
    location: '',
  });
  const [error, setError] = useState('');

  const meds = inventory.filter(i => i.category === 'Medicine');
  const lowStock = meds.filter(m => m.quantity <= m.minStock);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.quantity || !form.unit || !form.minStock || !form.price || !form.supplier) {
      setError('Please fill all required fields.');
      return;
    }
    setInventory(prev => [
      {
        id: 'M' + (prev.length + 1).toString().padStart(3, '0'),
        ...form,
        category: form.category as 'Medicine' | 'Equipment' | 'Consumable' | 'Surgical',
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
        price: Number(form.price),
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ name: '', category: 'Medicine', quantity: '', unit: '', minStock: '', price: '', supplier: '', expiryDate: '', location: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Pharmacy</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Medicine</button>
      </div>
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-700 font-medium">{lowStock.length} medicines below minimum stock level</span>
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Medicine</th>
              <th className="table-header">Category</th>
              <th className="table-header">Stock</th>
              <th className="table-header">Min Stock</th>
              <th className="table-header">Price</th>
              <th className="table-header">Supplier</th>
              <th className="table-header">Expiry</th>
              <th className="table-header">Location</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const isLow = item.quantity <= item.minStock;
              return (
                <tr key={item.id} className={`hover:bg-gray-50 ${isLow ? 'bg-yellow-50/50' : ''}`}>
                  <td className="table-cell">
                    <div className="flex items-center gap-2"><Pill className="w-4 h-4 text-blue-500" /><span className="font-medium">{item.name}</span></div>
                  </td>
                  <td className="table-cell">{item.category}</td>
                  <td className="table-cell"><span className={isLow ? 'text-red-600 font-bold' : 'text-gray-700'}>{item.quantity} {item.unit}</span></td>
                  <td className="table-cell text-gray-500">{item.minStock}</td>
                  <td className="table-cell">₹{item.price}</td>
                  <td className="table-cell">{item.supplier}</td>
                  <td className="table-cell">{item.expiryDate || '—'}</td>
                  <td className="table-cell">{item.location}</td>
                  <td className="table-cell">{isLow ? <span className="badge-red">Low Stock</span> : <span className="badge-green">OK</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Add Medicine */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Medicine</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div>
                <label className="label">Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option>Medicine</option>
                    <option>Consumable</option>
                    <option>Equipment</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">Unit</label>
                  <input className="input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Quantity</label>
                  <input className="input" type="number" min={0} value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Min Stock</label>
                  <input className="input" type="number" min={0} value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Price (₹)</label>
                  <input className="input" type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className="flex-1">
                  <label className="label">Supplier</label>
                  <input className="input" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label">Expiry Date</label>
                  <input className="input" type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="label">Location</label>
                  <input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
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

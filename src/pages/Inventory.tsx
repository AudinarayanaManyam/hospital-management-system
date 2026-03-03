
import React, { useState } from 'react';
import { mockInventory } from '../utils/mockData';
import { Package, AlertTriangle, Plus } from 'lucide-react';


export default function Inventory() {
  const [inventory, setInventory] = useState<typeof mockInventory>([...mockInventory]);
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
  const catColors: Record<string, string> = { Medicine: 'badge-blue', Equipment: 'badge-purple', Consumable: 'badge-yellow', Surgical: 'badge-red' };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.category || !form.quantity || !form.unit || !form.minStock || !form.price || !form.supplier || !form.location) {
      setError('Please fill all required fields.');
      return;
    }
    setInventory(prev => [
      {
        id: 'I' + (prev.length + 1).toString().padStart(3, '0'),
        name: form.name,
        category: form.category as 'Medicine' | 'Equipment' | 'Consumable' | 'Surgical',
        quantity: Number(form.quantity),
        unit: form.unit,
        minStock: Number(form.minStock),
        price: Number(form.price),
        supplier: form.supplier,
        expiryDate: form.expiryDate || undefined,
        location: form.location,
      },
      ...prev
    ]);
    setShowModal(false);
    setForm({ name: '', category: 'Medicine', quantity: '', unit: '', minStock: '', price: '', supplier: '', expiryDate: '', location: '' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Inventory</h1></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Item</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {['Medicine', 'Equipment', 'Consumable', 'Surgical'].map(c => (
          <div key={c} className="stat-card">
            <div className="text-xl font-bold">{inventory.filter(i => i.category === c).length}</div>
            <div className="text-sm text-gray-500">{c} Items</div>
          </div>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Item</th>
              <th className="table-header">Category</th>
              <th className="table-header">Stock</th>
              <th className="table-header">Min</th>
              <th className="table-header">Price</th>
              <th className="table-header">Supplier</th>
              <th className="table-header">Location</th>
              <th className="table-header">Alert</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const isLow = item.quantity <= item.minStock;
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="table-cell"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /><span className="font-medium">{item.name}</span></div></td>
                  <td className="table-cell"><span className={catColors[item.category]}>{item.category}</span></td>
                  <td className="table-cell"><span className={isLow ? 'text-red-600 font-bold' : ''}>{item.quantity} {item.unit}</span></td>
                  <td className="table-cell text-gray-500">{item.minStock}</td>
                  <td className="table-cell">₹{item.price}</td>
                  <td className="table-cell">{item.supplier}</td>
                  <td className="table-cell">{item.location}</td>
                  <td className="table-cell">{isLow && <span className="flex items-center gap-1 text-yellow-600 text-xs"><AlertTriangle className="w-3 h-3" />Low</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for New Inventory Item */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Inventory Item</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              <div><label className="label">Name</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><label className="label">Category</label><select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option>Medicine</option><option>Equipment</option><option>Consumable</option><option>Surgical</option></select></div>
              <div><label className="label">Quantity</label><input className="input" type="number" min={0} value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required /></div>
              <div><label className="label">Unit</label><input className="input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required /></div>
              <div><label className="label">Min Stock</label><input className="input" type="number" min={0} value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} required /></div>
              <div><label className="label">Price</label><input className="input" type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required /></div>
              <div><label className="label">Supplier</label><input className="input" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} required /></div>
              <div><label className="label">Expiry Date <span className="text-gray-400">(optional)</span></label><input className="input" type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
              <div><label className="label">Location</label><input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required /></div>
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

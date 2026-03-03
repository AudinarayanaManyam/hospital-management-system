import { useState } from 'react';
import { mockBirthRecords, mockDeathRecords } from '../utils/mockData';
import { Heart, Baby, Plus } from 'lucide-react';

export default function BirthDeath() {
  const [tab, setTab] = useState<'birth' | 'death'>('birth');
  const [birthRecords, setBirthRecords] = useState([...mockBirthRecords]);
  const [deathRecords, setDeathRecords] = useState([...mockDeathRecords]);
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState<'birth' | 'death'>('birth');
  const [birthForm, setBirthForm] = useState({
    babyName: '', motherName: '', fatherName: '', dob: '', timeOfBirth: '', weight: '', gender: 'Male', doctor: '', ward: '', certificateNo: ''
  });
  const [deathForm, setDeathForm] = useState({
    patientName: '', age: '', gender: 'Male', dod: '', timeOfDeath: '', cause: '', doctor: '', ward: '', certificateNo: ''
  });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formType === 'birth') {
      const { babyName, motherName, fatherName, dob, timeOfBirth, weight, gender, doctor, ward } = birthForm;
      if (!babyName || !motherName || !fatherName || !dob || !timeOfBirth || !weight || !gender || !doctor || !ward) {
        setError('Please fill all required fields.');
        return;
      }
      setBirthRecords(prev => [
        {
          id: 'BR' + (prev.length + 1).toString().padStart(3, '0'),
          ...birthForm,
          gender: birthForm.gender as 'Male' | 'Female',
          certificateNo: 'BC-' + new Date().getFullYear() + '-' + (prev.length + 1).toString().padStart(3, '0'),
        },
        ...prev
      ]);
      setShowModal(false);
      setBirthForm({ babyName: '', motherName: '', fatherName: '', dob: '', timeOfBirth: '', weight: '', gender: 'Male', doctor: '', ward: '', certificateNo: '' });
    } else {
      const { patientName, age, gender, dod, timeOfDeath, cause, doctor, ward } = deathForm;
      if (!patientName || !age || !gender || !dod || !timeOfDeath || !cause || !doctor || !ward) {
        setError('Please fill all required fields.');
        return;
      }
      setDeathRecords(prev => [
        {
          id: 'DT' + (prev.length + 1).toString().padStart(3, '0'),
          ...deathForm,
          age: Number(deathForm.age),
          gender: deathForm.gender as 'Male' | 'Female',
          certificateNo: 'DC-' + new Date().getFullYear() + '-' + (prev.length + 1).toString().padStart(3, '0'),
        },
        ...prev
      ]);
      setShowModal(false);
      setDeathForm({ patientName: '', age: '', gender: 'Male', dod: '', timeOfDeath: '', cause: '', doctor: '', ward: '', certificateNo: '' });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Birth & Death Records</h1></div>
        <button className="btn-primary" onClick={() => { setShowModal(true); setFormType(tab); }}><Plus className="w-4 h-4" /> Add Record</button>
      </div>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('birth')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'birth' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>
          <span className="flex items-center gap-1.5"><Baby className="w-4 h-4" />Birth Records ({birthRecords.length})</span>
        </button>
        <button onClick={() => setTab('death')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'death' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}>
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" />Death Records ({deathRecords.length})</span>
        </button>
      </div>
      {tab === 'birth' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Cert No</th>
                <th className="table-header">Baby Name</th>
                <th className="table-header">Mother</th>
                <th className="table-header">Father</th>
                <th className="table-header">DOB</th>
                <th className="table-header">Time</th>
                <th className="table-header">Weight</th>
                <th className="table-header">Gender</th>
                <th className="table-header">Doctor</th>
              </tr>
            </thead>
            <tbody>
              {birthRecords.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="table-cell font-mono text-xs text-green-600">{r.certificateNo}</td>
                  <td className="table-cell font-medium">{r.babyName}</td>
                  <td className="table-cell">{r.motherName}</td>
                  <td className="table-cell">{r.fatherName}</td>
                  <td className="table-cell">{r.dob}</td>
                  <td className="table-cell">{r.timeOfBirth}</td>
                  <td className="table-cell">{r.weight}</td>
                  <td className="table-cell"><span className={r.gender === 'Male' ? 'badge-blue' : 'badge-purple'}>{r.gender}</span></td>
                  <td className="table-cell text-primary-600">{r.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'death' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Cert No</th>
                <th className="table-header">Patient</th>
                <th className="table-header">Age</th>
                <th className="table-header">Gender</th>
                <th className="table-header">Date</th>
                <th className="table-header">Time</th>
                <th className="table-header">Cause</th>
                <th className="table-header">Doctor</th>
              </tr>
            </thead>
            <tbody>
              {deathRecords.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="table-cell font-mono text-xs text-red-600">{r.certificateNo}</td>
                  <td className="table-cell font-medium">{r.patientName}</td>
                  <td className="table-cell">{r.age}</td>
                  <td className="table-cell">{r.gender}</td>
                  <td className="table-cell">{r.dod}</td>
                  <td className="table-cell">{r.timeOfDeath}</td>
                  <td className="table-cell">{r.cause}</td>
                  <td className="table-cell text-primary-600">{r.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for New Birth/Death Record */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add {formType === 'birth' ? 'Birth' : 'Death'} Record</h3>
            {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
            <form className="space-y-3" onSubmit={handleAdd}>
              {formType === 'birth' ? (
                <>
                  <div><label className="label">Baby Name</label><input className="input" value={birthForm.babyName} onChange={e => setBirthForm(f => ({ ...f, babyName: e.target.value }))} required /></div>
                  <div><label className="label">Mother Name</label><input className="input" value={birthForm.motherName} onChange={e => setBirthForm(f => ({ ...f, motherName: e.target.value }))} required /></div>
                  <div><label className="label">Father Name</label><input className="input" value={birthForm.fatherName} onChange={e => setBirthForm(f => ({ ...f, fatherName: e.target.value }))} required /></div>
                  <div><label className="label">DOB</label><input className="input" type="date" value={birthForm.dob} onChange={e => setBirthForm(f => ({ ...f, dob: e.target.value }))} required /></div>
                  <div><label className="label">Time of Birth</label><input className="input" value={birthForm.timeOfBirth} onChange={e => setBirthForm(f => ({ ...f, timeOfBirth: e.target.value }))} required /></div>
                  <div><label className="label">Weight</label><input className="input" value={birthForm.weight} onChange={e => setBirthForm(f => ({ ...f, weight: e.target.value }))} required /></div>
                  <div><label className="label">Gender</label><select className="input" value={birthForm.gender} onChange={e => setBirthForm(f => ({ ...f, gender: e.target.value }))}><option>Male</option><option>Female</option></select></div>
                  <div><label className="label">Doctor</label><input className="input" value={birthForm.doctor} onChange={e => setBirthForm(f => ({ ...f, doctor: e.target.value }))} required /></div>
                  <div><label className="label">Ward</label><input className="input" value={birthForm.ward} onChange={e => setBirthForm(f => ({ ...f, ward: e.target.value }))} required /></div>
                </>
              ) : (
                <>
                  <div><label className="label">Patient Name</label><input className="input" value={deathForm.patientName} onChange={e => setDeathForm(f => ({ ...f, patientName: e.target.value }))} required /></div>
                  <div><label className="label">Age</label><input className="input" type="number" min={0} value={deathForm.age} onChange={e => setDeathForm(f => ({ ...f, age: e.target.value }))} required /></div>
                  <div><label className="label">Gender</label><select className="input" value={deathForm.gender} onChange={e => setDeathForm(f => ({ ...f, gender: e.target.value }))}><option>Male</option><option>Female</option></select></div>
                  <div><label className="label">Date of Death</label><input className="input" type="date" value={deathForm.dod} onChange={e => setDeathForm(f => ({ ...f, dod: e.target.value }))} required /></div>
                  <div><label className="label">Time of Death</label><input className="input" value={deathForm.timeOfDeath} onChange={e => setDeathForm(f => ({ ...f, timeOfDeath: e.target.value }))} required /></div>
                  <div><label className="label">Cause</label><input className="input" value={deathForm.cause} onChange={e => setDeathForm(f => ({ ...f, cause: e.target.value }))} required /></div>
                  <div><label className="label">Doctor</label><input className="input" value={deathForm.doctor} onChange={e => setDeathForm(f => ({ ...f, doctor: e.target.value }))} required /></div>
                  <div><label className="label">Ward</label><input className="input" value={deathForm.ward} onChange={e => setDeathForm(f => ({ ...f, ward: e.target.value }))} required /></div>
                </>
              )}
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

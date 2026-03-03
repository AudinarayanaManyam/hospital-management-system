import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock } from 'lucide-react';

const staffList = [
  { id: 'S001', name: 'Ramesh Verma', role: 'Head Nurse', checkedIn: true, time: '08:45' },
  { id: 'S002', name: 'Deepa Menon', role: 'Pharmacist', checkedIn: true, time: '09:00' },
  { id: 'S003', name: 'Arjun Singh', role: 'Lab Technician', checkedIn: true, time: '08:55' },
  { id: 'S004', name: 'Fatima Begum', role: 'Receptionist', checkedIn: false, time: null },
  { id: 'S005', name: 'Kiran Kumar', role: 'Ambulance Driver', checkedIn: false, time: null },
];

export default function QRAttendance() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState<string | null>(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned('S004 - Fatima Begum checked in at 09:32');
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">QR Code Attendance</h1><p className="text-sm text-gray-500">Staff attendance via QR scanning</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card flex flex-col items-center text-center">
          <div className={`w-48 h-48 border-4 rounded-2xl flex items-center justify-center mb-4 ${scanning ? 'border-primary-400 animate-pulse bg-primary-50' : 'border-gray-200 bg-gray-50'}`}>
            <QrCode className={`w-24 h-24 ${scanning ? 'text-primary-500' : 'text-gray-300'}`} />
          </div>
          <button onClick={handleScan} disabled={scanning} className="btn-primary w-full justify-center">
            {scanning ? 'Scanning...' : 'Start QR Scan'}
          </button>
          {scanned && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-sm text-green-700 w-full">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />{scanned}
            </div>
          )}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl w-full">
            <div className="text-xs text-gray-500 mb-2">Your QR Code</div>
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <QrCode className="w-14 h-14 text-gray-800" />
            </div>
            <div className="text-xs text-gray-400 mt-1">ID: ADMIN-001</div>
          </div>
        </div>
        <div className="card lg:col-span-2">
          <h2 className="section-title mb-4 flex items-center gap-2"><Clock className="w-4 h-4" />Today's Attendance</h2>
          <div className="space-y-2">
            {staffList.map(s => (
              <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border ${s.checkedIn ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${s.checkedIn ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>{s.name.charAt(0)}</div>
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  {s.checkedIn ? <><div className="badge-green">Present</div><div className="text-xs text-gray-500 mt-0.5">{s.time}</div></> : <span className="badge-gray">Absent</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between text-sm">
            <span className="text-green-600 font-medium">{staffList.filter(s => s.checkedIn).length} Present</span>
            <span className="text-gray-500">{staffList.filter(s => !s.checkedIn).length} Absent</span>
            <span className="text-gray-500">{Math.round(staffList.filter(s => s.checkedIn).length / staffList.length * 100)}% Attendance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

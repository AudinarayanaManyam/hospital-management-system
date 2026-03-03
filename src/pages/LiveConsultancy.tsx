import { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Monitor, Users } from 'lucide-react';

const upcomingConsultations = [
  { id: 1, patient: 'Rajesh Kumar', doctor: 'Dr. Arun Mehta', time: '10:00 AM', type: 'Follow-up', status: 'Scheduled' },
  { id: 2, patient: 'Priya Sharma', doctor: 'Dr. Sameera Khan', time: '11:30 AM', type: 'Consultation', status: 'In Progress' },
  { id: 3, patient: 'Mohammed Ali', doctor: 'Dr. Kavya Nair', time: '02:00 PM', type: 'Second Opinion', status: 'Scheduled' },
];

export default function LiveConsultancy() {
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [inCall, setInCall] = useState(false);

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Live Consultancy</h1><p className="text-sm text-gray-500">Video consultation platform for remote patients</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <div className={`rounded-xl overflow-hidden mb-4 flex items-center justify-center ${inCall ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`} style={{ height: '300px' }}>
            {inCall ? (
              <div className="text-center text-white">
                <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-3xl font-bold mx-auto mb-3">P</div>
                <div className="font-medium">Priya Sharma</div>
                <div className="text-sm text-gray-400">Connected · 00:05:23</div>
                <div className="mt-3 flex gap-2 justify-center">
                  <div className="w-24 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">Your Camera</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Video className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <div>No active consultation</div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setVideoOn(!videoOn)} className={`p-3 rounded-full ${videoOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}>{videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}</button>
            <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-full ${micOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}>{micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}</button>
            <button onClick={() => setInCall(!inCall)} className={`px-6 py-3 rounded-full font-medium text-white ${inCall ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition-colors`}>
              {inCall ? <><Phone className="w-4 h-4 inline mr-1.5 rotate-135" />End Call</> : <><Phone className="w-4 h-4 inline mr-1.5" />Join Call</>}
            </button>
            <button className="p-3 rounded-full bg-gray-100 text-gray-700"><Monitor className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="card">
          <h2 className="section-title mb-4 flex items-center gap-2"><Users className="w-4 h-4" />Consultations</h2>
          <div className="space-y-3">
            {upcomingConsultations.map(c => (
              <div key={c.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{c.patient}</span>
                  <span className={c.status === 'In Progress' ? 'badge-green' : 'badge-blue'}>{c.status}</span>
                </div>
                <div className="text-xs text-gray-500">{c.doctor}</div>
                <div className="text-xs text-gray-400">{c.time} · {c.type}</div>
                {c.status === 'Scheduled' && <button className="btn-primary mt-2 text-xs py-1">Start Call</button>}
                {c.status === 'In Progress' && <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs mt-2 hover:bg-orange-600">Join</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

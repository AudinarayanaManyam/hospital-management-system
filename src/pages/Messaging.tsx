import { useState } from 'react';
import { mockMessages } from '../utils/mockData';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';

export default function Messaging() {
  const [selected, setSelected] = useState(mockMessages[0]);
  const [newMsg, setNewMsg] = useState('');

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Internal Messaging</h1></div>
      <div className="card flex gap-0 p-0 overflow-hidden" style={{ height: '500px' }}>
        <div className="w-64 border-r border-gray-100 overflow-y-auto flex-shrink-0">
          <div className="p-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Inbox</div>
          {mockMessages.map(m => (
            <button key={m.id} onClick={() => setSelected(m)} className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected.id === m.id ? 'bg-primary-50' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{m.from}</span>
                {!m.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
              <div className="text-xs text-gray-600 mt-0.5 truncate">{m.subject}</div>
              {m.priority === 'Urgent' && <span className="badge-red mt-1">Urgent</span>}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {selected.priority === 'Urgent' && <AlertCircle className="w-4 h-4 text-red-500" />}
              <h3 className="font-semibold text-gray-900">{selected.subject}</h3>
            </div>
            <div className="text-xs text-gray-500 mt-1">From: {selected.from} → To: {selected.to}</div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">{selected.content}</div>
            <div className="text-xs text-gray-400 mt-2">{new Date(selected.timestamp).toLocaleString()}</div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Type a reply..." value={newMsg} onChange={e => setNewMsg(e.target.value)} />
              <button className="btn-primary"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

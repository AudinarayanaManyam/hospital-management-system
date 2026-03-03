import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const events: Record<string, { label: string; color: string }[]> = {
  '2024-03-15': [{ label: 'Health Camp', color: 'bg-green-400' }],
  '2024-03-20': [{ label: 'Board Meeting', color: 'bg-blue-400' }],
  '2024-03-25': [{ label: 'Blood Donation Drive', color: 'bg-red-400' }],
  '2024-04-01': [{ label: 'New FY Start', color: 'bg-purple-400' }],
  '2024-04-14': [{ label: 'Ambedkar Jayanti', color: 'bg-orange-400' }],
};

const holidays = ['2024-01-26', '2024-03-25', '2024-04-14', '2024-08-15', '2024-10-02', '2024-11-01'];

export default function AnnualCalendar() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(2); // 0-indexed, 2 = March

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isHoliday = (d: number) => holidays.includes(getDateKey(d));
  const isToday = (d: number) => new Date().toISOString().slice(0, 10) === getDateKey(d);

  return (
    <div className="space-y-5">
      <div><h1 className="page-title">Annual Calendar</h1></div>
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-xl font-bold text-gray-900">{months[month]} {year}</h2>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(d => <div key={d} className="text-center text-xs font-bold text-gray-500 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const d = i + 1;
            const key = getDateKey(d);
            const evts = events[key] || [];
            const holiday = isHoliday(d);
            const today = isToday(d);
            return (
              <div key={d} className={`p-2 rounded-xl min-h-14 cursor-pointer hover:bg-gray-50 transition-colors border ${today ? 'border-primary-400 bg-primary-50' : holiday ? 'border-red-200 bg-red-50' : 'border-transparent'}`}>
                <div className={`text-sm font-medium ${today ? 'text-primary-700' : holiday ? 'text-red-600' : d % 7 === 0 ? 'text-red-400' : 'text-gray-700'}`}>{d}</div>
                {evts.map((e, idx) => <div key={idx} className={`text-xs mt-1 px-1 py-0.5 rounded text-white truncate ${e.color}`}>{e.label}</div>)}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 flex-wrap pt-4 border-t">
          <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded bg-primary-400" />Today</div>
          <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded bg-red-200" />Holiday</div>
          <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded bg-green-400" />Health Event</div>
          <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded bg-blue-400" />Meeting</div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';

export default function EventsCalendar({ events, setEvents }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', time: '', room: '' });

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const formatDateKey = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d.toISOString().split('T')[0];
  };

  const handleSave = (e) => {
    e.preventDefault();
    const dateKey = formatDateKey(selectedDay);
    setEvents([...events, { id: Date.now(), date: dateKey, ...form }]);
    setIsModalOpen(false);
    setForm({ title: '', time: '', room: '' });
  };

  return (
    <div className="p-5 relative min-h-[500px] flex flex-col bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 italic">Calendar Access</h3>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16}/></button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16}/></button>
        </div>
      </div>

      <p className="text-center font-black text-indigo-600 text-[10px] uppercase mb-4 tracking-widest">
        {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
      </p>

      <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-slate-400 text-center mb-2 uppercase">
        {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(0).map((_, i) => <div key={i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const key = formatDateKey(d);
          const hasEvent = events.some(e => e.date === key);
          return (
            <button 
              key={d} 
              onClick={() => { setSelectedDay(d); setIsModalOpen(true); }}
              className={`aspect-square text-[11px] rounded-lg flex items-center justify-center relative transition-all ${hasEvent ? 'bg-indigo-50 text-indigo-600 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              {d}
              {hasEvent && <span className="absolute bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></span>}
            </button>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-white/98 z-20 p-6 flex flex-col animate-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black uppercase text-slate-400">Manage: {selectedDay} {viewDate.toLocaleString('default', { month: 'short' })}</h4>
            <button onClick={() => setIsModalOpen(false)}><X size={18} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-3 mb-6">
            <input type="text" placeholder="Event Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2.5 bg-slate-50 rounded-xl text-xs outline-none focus:ring-1 ring-indigo-500" />
            <div className="flex gap-2">
              <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="flex-1 p-2.5 bg-slate-50 rounded-xl text-xs" />
              <input type="text" placeholder="Room" value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="flex-1 p-2.5 bg-slate-50 rounded-xl text-xs" />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100">Add Academic Event</button>
          </form>
          <div className="flex-1 overflow-y-auto space-y-2">
             {events.filter(e => e.date === formatDateKey(selectedDay)).map(e => (
               <div key={e.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <div className="text-[11px] font-bold text-slate-800">{e.title} <span className="block text-[9px] text-slate-400 font-medium">{e.time}</span></div>
                  <button onClick={() => setEvents(events.filter(ev => ev.id !== e.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
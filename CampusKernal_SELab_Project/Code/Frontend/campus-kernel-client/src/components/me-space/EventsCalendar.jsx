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
    <div className="p-5 relative min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white italic">Calendar Access</h3>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors rounded"><ChevronLeft size={16}/></button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors rounded"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="font-black text-blue-600 dark:text-blue-500 text-[10px] uppercase tracking-widest">
          {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-bold bg-slate-50 dark:bg-slate-800/50 inline-block px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
          Click on any date to add an event
        </p>
      </div>

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
                className={`aspect-square text-[11px] rounded-lg flex items-center justify-center relative transition-all duration-300 ${hasEvent ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                {d}
                {hasEvent && <span className="absolute bottom-1 w-1 h-1 bg-white dark:bg-slate-900 rounded-full shadow-sm"></span>}
              </button>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md z-20 p-6 flex flex-col animate-in slide-in-from-right-4 duration-300 rounded-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Manage: {selectedDay} {viewDate.toLocaleString('default', { month: 'short' })}</h4>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={18} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-3 mb-6">
            <input type="text" placeholder="Event Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs outline-none focus:ring-2 ring-orange-500/50 dark:text-white border border-transparent dark:focus:border-slate-700 transition-all cursor-text" />
            <div className="flex gap-2">
              <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs dark:text-white outline-none border border-transparent dark:border-slate-700/50 focus:border-slate-700 transition-all cursor-pointer" />
              <input type="text" placeholder="Room" value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs dark:text-white outline-none focus:ring-2 ring-orange-500/50 border border-transparent dark:border-slate-700/50 dark:focus:border-slate-700 transition-all cursor-text" />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95">Add Academic Event</button>
          </form>
          <div className="flex-1 overflow-y-auto space-y-2">
             {events.filter(e => e.date === formatDateKey(selectedDay)).map(e => (
               <div key={e.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl flex justify-between items-center">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">{e.title} <span className="block text-[9px] text-slate-400 font-medium">{e.time}</span></div>
                  <button onClick={() => setEvents(events.filter(ev => ev.id !== e.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
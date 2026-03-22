import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function EventsCalendar({ initialEvents = [], onUpdate }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', time: '', room: '' });
  const [loading, setLoading] = useState(false);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const formatDateKey = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return (new Date(d.getTime() - tzOffset)).toISOString().split('T')[0];
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dateKey = formatDateKey(selectedDay);
    
    try {
      const newEvent = { date: dateKey, title: form.title, time: form.time, room: form.room };
      const updatedEvents = [...initialEvents, newEvent];
      
      await api.put('/me/update', { events: updatedEvents });
      
      setForm({ title: '', time: '', room: '' });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to add event');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const updatedEvents = initialEvents.filter(e => e._id !== eventId && e.id !== eventId);
      await api.put('/me/update', { events: updatedEvents });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 relative min-h-[500px] flex flex-col font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Calendar</h3>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-transparent shadow-sm"><ChevronLeft size={16}/></button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-transparent shadow-sm"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider text-sm">
          {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
        </p>
        <p className="text-xs text-slate-500 mt-2">Click on any date to add an event</p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs font-bold text-slate-500 text-center mb-2 uppercase">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(0).map((_, i) => <div key={i} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const key = formatDateKey(d);
          const hasEvent = initialEvents.some(e => e.date === key);
          return (
              <button 
                key={d} 
                onClick={() => { setSelectedDay(d); setIsModalOpen(true); }}
                className={`aspect-square text-sm rounded-md flex items-center justify-center transition-colors border ${hasEvent ? 'bg-blue-600 text-white font-bold border-blue-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              >
                {d}
              </button>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 bg-white dark:bg-slate-900 z-20 p-6 flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Events for {selectedDay} {viewDate.toLocaleString('default', { month: 'short' })}</h4>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4 mb-6">
            <input type="text" placeholder="Event Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-md focus:outline-none focus:border-blue-500 text-sm" />
            <div className="flex gap-3">
              <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-md focus:outline-none focus:border-blue-500 text-sm" />
              <input type="text" placeholder="Room" value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-md focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 text-sm">
              {loading ? 'Saving...' : 'Add Event'}
            </button>
          </form>
          <div className="flex-1 overflow-y-auto space-y-3">
             {initialEvents.filter(e => e.date === formatDateKey(selectedDay)).length === 0 && <p className="text-sm text-slate-500">No events scheduled.</p>}
             {initialEvents.filter(e => e.date === formatDateKey(selectedDay)).map(e => (
               <div key={e._id || e.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{e.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{e.time} {e.room && `• Room: ${e.room}`}</div>
                  </div>
                  <button onClick={() => handleDelete(e._id || e.id)} className="text-slate-400 hover:text-red-600 p-2 border border-transparent hover:border-red-200 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, MapPin, Clock } from 'lucide-react';

export default function EventsCalendar() {
  // Logic for the date grid
  const [currentDay] = useState(10); // Simulating today is March 10th
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Prototype Events (Sub-Module 1.1)
  const academicEvents = [
    { id: 1, day: 15, title: 'SE Lab Viva', time: '14:00', room: 'Lab 4' },
    { id: 2, day: 22, title: 'Unity March Meet', time: '09:00', room: 'Main Gate' },
  ];

  return (
    <div className="p-5 bg-white h-full flex flex-col">
      {/* 1. Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <CalIcon size={18} className="text-blue-600" />
          Events Calendar
        </h3>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-all active:scale-95">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-all active:scale-95">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 2. Days of the Week Header */}
      <div className="grid grid-cols-7 gap-1 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest mb-3">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>

      {/* 3. Modern Date Grid */}
      
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((d) => {
          const isToday = d === currentDay;
          const hasEvent = academicEvents.some(e => e.day === d);

          return (
            <div 
              key={d} 
              className={`aspect-square flex flex-col items-center justify-center text-xs rounded-xl cursor-pointer transition-all relative
                ${isToday ? 'bg-blue-600 text-white font-bold shadow-lg ring-4 ring-blue-50' : 'hover:bg-blue-50 text-slate-600'}
                ${hasEvent && !isToday ? 'text-blue-600 font-bold' : ''}
              `}
            >
              {d}
              {hasEvent && (
                <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isToday ? 'bg-white' : 'bg-blue-500'}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Upcoming Agenda Section */}
      <div className="mt-auto pt-4 border-t border-slate-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Today's Agenda</p>
        <div className="space-y-3">
          {academicEvents.filter(e => e.day >= currentDay).slice(0, 2).map(event => (
            <div key={event.id} className="group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                  {event.day}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Clock size={10} /> {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {event.room}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
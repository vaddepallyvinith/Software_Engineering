import React from 'react';
import { Clock, BookOpen, MapPin } from 'lucide-react';

export default function Timetable({ academicEvents = [] }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper to get the current week's dates
  const getWeekDates = () => {
    const now = new Date();
    const startOfWeek = now.getDate() - now.getDay() + 1;
    return daysOfWeek.map((day, index) => {
      const date = new Date(now.setDate(startOfWeek + index));
      return { day, dateKey: date.toISOString().split('T')[0] };
    });
  };

  const weekDays = getWeekDates();

  return (
    <div className="p-6 bg-white rounded-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Weekly Overview</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Current Academic Week</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">
          Semester 6 • UoH
        </div>
      </div>

      {/* HORIZONTAL WEEKLY SCROLL */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map(({ day, dateKey }) => {
          // Filter events passed from the Calendar/Parent that match this date
          const dayEvents = academicEvents
            .filter(e => e.date === dateKey)
            .sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div key={day} className="flex flex-col gap-3">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{day.slice(0, 3)}</p>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  {dayEvents.length > 0 && <div className="h-full bg-indigo-500 w-full"></div>}
                </div>
              </div>

              <div className="space-y-3">
                {dayEvents.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-slate-50 rounded-2xl flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 italic font-bold">Free</span>
                  </div>
                ) : (
                  dayEvents.map(event => (
                    <div key={event.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                      <p className="text-[10px] font-black text-indigo-600 mb-1">{event.time}</p>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600">
                        {event.title}
                      </p>
                      {event.room && (
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                          <MapPin size={10} /> {event.room}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
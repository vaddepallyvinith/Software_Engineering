import React from 'react';
import { Clock, BookOpen, MapPin } from 'lucide-react';

export default function Timetable({ academicEvents = [] }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
    <div className="p-6 font-sans">
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Overview</h2>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-semibold">Current Academic Week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map(({ day, dateKey }) => {
          const dayEvents = academicEvents
            .filter(e => e.date === dateKey)
            .sort((a, b) => a.time.localeCompare(b.time));

          return (
            <div key={day} className="flex flex-col gap-3 min-w-[120px]">
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">{day.slice(0, 3)}</p>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  {dayEvents.length > 0 && <div className="h-full bg-blue-500 w-full rounded-full"></div>}
                </div>
              </div>

              <div className="space-y-3">
                {dayEvents.length === 0 ? (
                  <div className="h-20 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-xs text-slate-400 italic">Free</span>
                  </div>
                ) : (
                  dayEvents.map(event => (
                    <div key={event._id || event.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5"><Clock size={12}/> {event.time}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight mb-2">
                        {event.title}
                      </p>
                      {event.room && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 py-1 px-2 rounded border border-slate-100 dark:border-slate-700">
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
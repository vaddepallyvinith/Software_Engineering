import { useState } from 'react';
import { Clock, BookOpen, PlusCircle, AlertTriangle } from 'lucide-react';

export default function Timetable() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Dummy data for the initial schedule
  const [events, setEvents] = useState([
    { id: 1, title: 'Software Engineering Lab', day: 'Tuesday', startTime: '14:00', endTime: '16:00', type: 'Lab' },
    { id: 2, title: 'Machine Learning', day: 'Wednesday', startTime: '10:00', endTime: '11:30', type: 'Lecture' }
  ]);

  const [title, setTitle] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('Lecture');
  const [conflictError, setConflictError] = useState('');

  // Function to simulate checking for overlapping classes (Constraint)
  const checkConflict = (newDay, newStart, newEnd) => {
    return events.some(event => {
      if (event.day !== newDay) return false;
      // Simple string comparison for times works with 24h format (e.g., "14:00" > "10:00")
      return (newStart >= event.startTime && newStart < event.endTime) || 
             (newEnd > event.startTime && newEnd <= event.endTime) ||
             (newStart <= event.startTime && newEnd >= event.endTime);
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    setConflictError('');

    if (checkConflict(day, startTime, endTime)) {
      setConflictError('Schedule Conflict! You already have a class during this time.');
      return;
    }

    const newEvent = {
      id: Date.now(),
      title, day, startTime, endTime, type
    };

    setEvents([...events, newEvent]);
    setTitle(''); setStartTime(''); setEndTime('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Dynamic Timetable</h2>

      {/* SCHEDULE FORM */}
      <form onSubmit={handleAddEvent} className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
          <input 
            type="text" placeholder="Course/Event Title" required
            value={title} onChange={(e) => setTitle(e.target.value)}
            className="md:col-span-2 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <select value={day} onChange={(e) => setDay(e.target.value)} className="p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white">
            {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input 
            type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Conflict Error Message */}
        {conflictError && (
          <div className="flex items-center gap-2 text-red-600 mb-3 text-sm font-bold">
            <AlertTriangle size={16} /> {conflictError}
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors">
          <PlusCircle size={20} /> Add to Schedule
        </button>
      </form>

      {/* WEEKLY VIEW GRID */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map(d => {
          const dayEvents = events.filter(e => e.day === d).sort((a, b) => a.startTime.localeCompare(b.startTime));
          
          return (
            <div key={d} className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="bg-slate-800 text-white text-center py-2 font-bold">{d}</div>
              <div className="p-3 flex flex-col gap-2 min-h-[100px]">
                {dayEvents.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center italic mt-4">No classes</p>
                ) : (
                  dayEvents.map(event => (
                    <div key={event.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
                      <p className="font-semibold text-gray-800 text-sm truncate" title={event.title}>{event.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Clock size={12} /> {event.startTime} - {event.endTime}
                      </div>
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
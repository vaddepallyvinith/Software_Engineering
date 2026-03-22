import { useState } from 'react';
import { Calendar as CalIcon, BarChart3, ListTodo, GraduationCap, Clock } from 'lucide-react';
import TaskList from '../components/me-space/TaskList';
import Timetable from '../components/me-space/Timetable';
import PerformanceTracker from '../components/me-space/PerformanceTracker';
import StatsOverview from '../components/me-space/StatsOverview';
import EventsCalendar from '../components/me-space/EventsCalendar';

export default function MeSpace() {
  const [activeTab, setActiveTab] = useState('events');
  
  // SHARED STATE: The source of truth for the entire workspace
  const [academicEvents, setAcademicEvents] = useState([
    { id: 1, date: '2026-03-10', title: 'Software Engineering Lecture', time: '14:00', room: 'F31' },
    { id: 2, date: '2026-03-11', title: 'ML Lab Session', time: '10:00', room: 'Lab 2' },
    { id: 3, date: '2026-03-15', title: 'Semester Project Viva', time: '11:00', room: 'Conference Hall' }
  ]);

  return (
    <div className="space-y-6 pb-12 pr-4 animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-blue-50 dark:bg-slate-900 rounded-[2rem] border-l-[8px] border-l-blue-600 dark:border-l-blue-500 shadow-sm transition-all duration-300">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Academic Workspace</h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold text-base mt-1">Welcome back, Vinith. Here is your Semester 6 overview.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all">
           <GraduationCap className="text-cyan-600 dark:text-cyan-500" size={16} />
           University of Hyderabad • B.Tech CSE
        </div>
      </header>

      {/* 2. STATS OVERVIEW */}
      <StatsOverview taskCount={academicEvents.length} overdueCount="2" cgpa="8.42" />

      {/* 3. TAB NAVIGATION */}
      <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md shadow-inner rounded-2xl w-fit border border-white/20 dark:border-slate-800">
        <button onClick={() => setActiveTab('events')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'events' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
          <CalIcon size={16} /> Events & Timetable
        </button>
        <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'performance' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
          <BarChart3 size={16} /> Performance
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'tasks' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transform scale-[1.02]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
          <ListTodo size={16} /> Tasks
        </button>
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN (8 Units) --- */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'events' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* BLOCK 1: WEEKLY STREAM (Timetable) */}
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden transition-all duration-500">
                <Timetable academicEvents={academicEvents} />
              </section>

              {/* BLOCK 2: UPCOMING EVENTS FEED */}
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 p-8 transition-all duration-500">
                <div className="flex justify-between items-end mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Future Focus</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">Upcoming Deadlines</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {academicEvents
                    .filter(e => {
                      const eventDate = new Date(e.date + 'T00:00:00');
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return eventDate >= today;
                    })
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(event => (
                      <div key={event.id} className="group p-5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 hover:border-cyan-400 dark:hover:border-cyan-500 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex items-center gap-4 cursor-default">
                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 h-16 w-16 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-teal-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 text-slate-800 dark:text-slate-200">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-black leading-none mt-1">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"><Clock size={12} className="text-cyan-500" /> {event.time} • {event.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden transition-all duration-500">
                <PerformanceTracker />
              </section>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden transition-all duration-500">
                <TaskList />
              </section>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (4 Units) --- */}
        <div className="lg:col-span-4">
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden sticky top-6 transition-all duration-500">
            <EventsCalendar events={academicEvents} setEvents={setAcademicEvents} />
          </section>
        </div>

      </div>
    </div>
  );
}
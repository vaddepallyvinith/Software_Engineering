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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Workspace</h1>
          <p className="text-slate-500 font-medium text-sm">Welcome back, Vinith. Here is your Semester 6 overview.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
           <GraduationCap className="text-indigo-600" size={16} />
           University of Hyderabad • B.Tech CSE
        </div>
      </header>

      {/* 2. STATS OVERVIEW */}
      <StatsOverview taskCount={academicEvents.length} overdueCount="2" cgpa="8.42" />

      {/* 3. TAB NAVIGATION */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('events')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'events' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <CalIcon size={16} /> Events & Timetable
        </button>
        <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'performance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <BarChart3 size={16} /> Performance
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
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
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <Timetable academicEvents={academicEvents} />
              </section>

              {/* BLOCK 2: UPCOMING EVENTS FEED */}
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Upcoming Deadlines</h2>
                  <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">Future Focus</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {academicEvents
                    .filter(e => new Date(e.date) > new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(event => (
                      <div key={event.id} className="group p-5 bg-slate-50 border border-transparent hover:border-indigo-200 rounded-[2rem] transition-all flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-white h-14 w-14 rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <span className="text-[10px] font-black uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-lg font-black leading-none">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">{event.time} • {event.room}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'performance' && <PerformanceTracker />}
          {activeTab === 'tasks' && <TaskList />}
        </div>

        {/* --- RIGHT COLUMN (4 Units) --- */}
        <div className="lg:col-span-4">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <EventsCalendar events={academicEvents} setEvents={setAcademicEvents} />
          </section>
        </div>

      </div>
    </div>
  );
}
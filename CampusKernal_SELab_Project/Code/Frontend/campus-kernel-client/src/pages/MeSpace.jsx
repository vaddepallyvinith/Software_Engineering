import { useState, useEffect } from 'react';
import { Calendar as CalIcon, BarChart3, ListTodo, GraduationCap, Clock, Loader2 } from 'lucide-react';
import TaskList from '../components/me-space/TaskList';
import Timetable from '../components/me-space/Timetable';
import PerformanceTracker from '../components/me-space/PerformanceTracker';
import StatsOverview from '../components/me-space/StatsOverview';
import EventsCalendar from '../components/me-space/EventsCalendar';
import api from '../services/api';

export default function MeSpace() {
  const [activeTab, setActiveTab] = useState('events');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/me');
      setUserData(res.data.user);
    } catch (error) {
      console.error("Failed to fetch MeSpace data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="animate-spin w-12 h-12 text-cyan-500" />
      </div>
    );
  }

  const academicEvents = userData?.events || [];
  const tasks = userData?.tasks || [];
  const records = userData?.records || [];
  const cgpa = Number(userData?.cgpa || 0).toFixed(2);
  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Completed').length;

  return (
    <div className="space-y-6 pb-12 pr-4 animate-in fade-in duration-500">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-12 mb-8 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px] group-hover:bg-teal-500/30 transition-colors duration-1000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6 shadow-sm shadow-blue-500/10">
              <GraduationCap size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Personal Academic HQ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Semester.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md leading-relaxed">
              Track your performance, organize your timetable, and crush your academic goals at {userData?.profile?.universityName || 'your university'}.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-center justify-center py-6 px-10 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl relative z-20 hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-0 rounded-[2rem] border border-cyan-500/30 animate-pulse" style={{ animationDuration: '3s' }}></div>
             <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500 mb-2 drop-shadow-lg">{cgpa}</div>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <BarChart3 size={14} className="text-cyan-500" /> Current CGPA
             </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="relative z-20 -mt-14 mb-10 px-4 md:px-8">
        <StatsOverview taskCount={tasks.length} overdueCount={overdueCount} cgpa={cgpa} />
      </div>

      {/* 3. TAB NAVIGATION */}
      <div className="flex flex-wrap p-2 bg-slate-100 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg rounded-[2rem] w-full md:w-fit border border-slate-200 dark:border-white/10 mb-8 gap-2 relative z-20">
        <button onClick={() => setActiveTab('events')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'events' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'}`}>
          <CalIcon size={18} /> Timetable
        </button>
        <button onClick={() => setActiveTab('performance')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'performance' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'}`}>
          <BarChart3 size={18} /> Performance
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'tasks' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'}`}>
          <ListTodo size={18} /> Tasks
        </button>
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN (8 Units) --- */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'events' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden transition-all duration-500">
                <Timetable academicEvents={academicEvents} />
              </section>

              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 p-8 transition-all duration-500">
                <div className="flex justify-between items-end mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Future Focus</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">Upcoming Deadlines</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {academicEvents.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming events.</p>}
                  {academicEvents
                    .filter(e => {
                      const eventDate = new Date(e.date + 'T00:00:00');
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return eventDate >= today;
                    })
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(event => (
                      <div key={event._id || event.id} className="group p-5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 hover:border-cyan-400 dark:hover:border-cyan-500 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex items-center gap-4 cursor-default">
                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 h-16 w-16 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-teal-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 text-slate-800 dark:text-slate-200">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-black leading-none mt-1">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"><Clock size={12} className="text-cyan-500" /> {event.time} {event.room ? `• ${event.room}` : ''}</span>
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
                <PerformanceTracker initialRecords={records} onUpdate={fetchData} />
              </section>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden transition-all duration-500">
                <TaskList initialTasks={tasks} onUpdate={fetchData} />
              </section>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (4 Units) --- */}
        <div className="lg:col-span-4">
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden sticky top-6 transition-all duration-500">
            <EventsCalendar initialEvents={academicEvents} onUpdate={fetchData} />
          </section>
        </div>

      </div>
    </div>
  );
}
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
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  const academicEvents = userData?.events || [];
  const tasks = userData?.tasks || [];
  const records = userData?.records || [];
  const cgpa = Number(userData?.cgpa || 0).toFixed(2);
  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200">

      {/* 1. HERO BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded mb-4 border border-slate-200 dark:border-slate-700">
              <GraduationCap size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personal Academic HQ</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Master Your Degree</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your performance, organize your timetable, and crush your academic goals at {userData?.profile?.universityName || 'your university'}.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{cgpa}</div>
            <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
              <BarChart3 size={16} /> Current CGPA
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="mb-6">
        <StatsOverview taskCount={tasks.length} overdueCount={overdueCount} cgpa={cgpa} completedCount={tasks.filter(t => t.status === 'Completed').length} />
      </div>

      {/* 3. TAB NAVIGATION */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button onClick={() => setActiveTab('events')} className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-semibold transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <CalIcon size={16} /> Timetable
        </button>
        <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-semibold transition-colors ${activeTab === 'performance' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <BarChart3 size={16} /> Performance
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-semibold transition-colors ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <ListTodo size={16} /> Tasks
        </button>
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- LEFT COLUMN (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'events' && (
            <div className="space-y-6">
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
                <Timetable academicEvents={academicEvents} />
              </section>

              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
                <div className="mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {academicEvents.length === 0 && <p className="text-sm text-slate-500">No upcoming events.</p>}
                  {academicEvents
                    .filter(e => {
                      const eventDate = new Date(e.date + 'T00:00:00');
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return eventDate >= today;
                    })
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(event => (
                      <div key={event._id || event.id} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 h-14 w-14 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                          <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                            <Clock size={14} className="text-blue-500" /> {event.time} {event.room ? `• ${event.room}` : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <PerformanceTracker initialRecords={records} onUpdate={fetchData} />
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <TaskList initialTasks={tasks} onUpdate={fetchData} />
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN (1/3 width) --- */}
        <div className="lg:col-span-1">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm sticky top-6">
            <EventsCalendar initialEvents={academicEvents} onUpdate={fetchData} />
          </section>
        </div>

      </div>
    </div>
  );
}
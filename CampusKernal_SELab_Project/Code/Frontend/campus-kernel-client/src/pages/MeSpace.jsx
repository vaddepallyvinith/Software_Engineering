import { useState } from 'react';
import TaskList from '../components/me-space/TaskList';
import Timetable from '../components/me-space/Timetable';
import PerformanceTracker from '../components/me-space/PerformanceTracker';
import StatsOverview from '../components/me-space/StatsOverview';


export default function MeSpace() {
  // Shared state simulation (In the future, this comes from a Global Context or Backend)
  const [tasks] = useState([
    { id: 1, deadline: '2026-03-01', status: 'Not Started' },
    { id: 2, deadline: '2026-03-15', status: 'In Progress' }
  ]);

  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Completed').length;

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Academic Space</h1>
          <p className="text-slate-500 font-medium text-sm">Welcome back, Vinith. Here’s what’s happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
           Semester 6 • University of Hyderabad
        </div>
      </header>

      {/* New Stats Section */}
      <StatsOverview 
        taskCount={tasks.length} 
        overdueCount={overdueCount} 
        cgpa="8.42" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Timetable />
          <PerformanceTracker />
        </div>
        <div className="lg:col-span-4">
          <TaskList />
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import TaskList from '../components/me-space/TaskList';
import Timetable from '../components/me-space/Timetable';
import PerformanceTracker from '../components/me-space/PerformanceTracker';
import StatsOverview from '../components/me-space/StatsOverview';
import EventsCalendar from '../components/me-space/EventsCalendar';

export default function MeSpace() {
  // Shared state for the prototype logic
  const [tasks] = useState([
    { id: 1, title: 'SE Lab Report', deadline: '2026-03-01', status: 'Not Started' },
    { id: 2, title: 'ML Assignment', deadline: '2026-03-15', status: 'In Progress' },
    { id: 3, title: 'DBMS Schema', deadline: '2026-03-09', status: 'Completed' }
  ]);

  // Constraint Logic: Calculate overdue tasks for the Stats cards
  const overdueCount = tasks.filter(t => 
    new Date(t.deadline) < new Date() && t.status !== 'Completed'
  ).length;

  return (
    <div className="space-y-6 pb-12 pr-4 animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Workspace</h1>
          <p className="text-slate-500 font-medium text-sm">Welcome back, Vinith. Here is your Semester 6 overview.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
           </span>
           University of Hyderabad • B.Tech CSE
        </div>
      </header>

      {/* 2. STATS OVERVIEW (Top Row) */}
      <StatsOverview 
        taskCount={tasks.length} 
        overdueCount={overdueCount} 
        cgpa="8.42" 
      />

      {/* 3. MAIN DASHBOARD GRID (4 Blocks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN (8 Units) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* BLOCK 1: TIMETABLE MANAGER (Sub-Module 1.1) */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <Timetable />
          </section>

          {/* BLOCK 4: PERFORMANCE TRACKER (Sub-Module 1.3) */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <PerformanceTracker />
          </section>

        </div>

        {/* --- RIGHT COLUMN (4 Units) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* BLOCK 3: TO-DO LIST / TASK TRACKER (Sub-Module 1.2) */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <TaskList />
          </section>

          {/* BLOCK 2: EVENTS CALENDAR (Google-like Mini Calendar) */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <EventsCalendar />
          </section>

        </div>

      </div>
    </div>
  );
}
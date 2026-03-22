import { CheckCircle, AlertCircle, Clock, GraduationCap } from 'lucide-react';

export default function StatsOverview({ taskCount, overdueCount, cgpa }) {
  const stats = [
    { label: 'Total Tasks', value: taskCount, icon: <Clock className="text-blue-600" size={20} /> },
    { label: 'Overdue', value: overdueCount, icon: <AlertCircle className="text-red-600" size={20} /> },
    { label: 'Current CGPA', value: cgpa, icon: <GraduationCap className="text-purple-600" size={20} /> },
    { label: 'Completed', value: '12', icon: <CheckCircle className="text-green-600" size={20} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-800 w-10 h-10 rounded-md flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
            {stat.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-none mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
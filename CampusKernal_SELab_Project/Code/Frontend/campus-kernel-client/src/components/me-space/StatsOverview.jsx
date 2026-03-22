import { CheckCircle, AlertCircle, Clock, GraduationCap } from 'lucide-react';

export default function StatsOverview({ taskCount, overdueCount, cgpa }) {
  const stats = [
    { label: 'Total Tasks', value: taskCount, icon: <Clock className="text-blue-600" size={20} />, color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' },
    { label: 'Overdue', value: overdueCount, icon: <AlertCircle className="text-red-500" size={20} />, color: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' },
    { label: 'Current CGPA', value: cgpa, icon: <GraduationCap className="text-purple-600 dark:text-purple-400" size={20} />, color: 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30' },
    { label: 'Completed', value: '12', icon: <CheckCircle className="text-green-600 dark:text-green-500" size={20} />, color: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.color} p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 hover:shadow-md cursor-default`}>
          <div className="bg-white dark:bg-slate-900 w-12 h-12 rounded-[14px] shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
            {stat.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
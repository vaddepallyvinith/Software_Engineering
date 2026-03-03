import { CheckCircle, AlertCircle, Clock, GraduationCap } from 'lucide-react';

export default function StatsOverview({ taskCount, overdueCount, cgpa }) {
  const stats = [
    { label: 'Total Tasks', value: taskCount, icon: <Clock className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Overdue', value: overdueCount, icon: <AlertCircle className="text-red-600" />, color: 'bg-red-50' },
    { label: 'Current CGPA', value: cgpa, icon: <GraduationCap className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Completed', value: '12', icon: <CheckCircle className="text-green-600" />, color: 'bg-green-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.color} p-5 rounded-2xl border border-white/50 shadow-sm flex items-center gap-4`}>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            {stat.icon}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
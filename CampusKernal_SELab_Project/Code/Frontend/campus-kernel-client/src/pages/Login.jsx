import TaskList from '../components/me-space/TaskList';
import Timetable from '../components/me-space/Timetable';
import PerformanceTracker from '../components/me-space/PerformanceTracker';

export default function MeSpace() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Academic Dashboard</h1>
        <p className="text-blue-100 opacity-90">Welcome, Vinith. Here is your current academic standing.</p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timetable (Large) */}
        <div className="lg:col-span-8 space-y-8">
          <Timetable />
        </div>

        {/* Right Column: Mini Stats & Task List */}
        <div className="lg:col-span-4 space-y-8">
          <TaskList />
        </div>

        {/* Bottom Full Row: Performance Tracker */}
        <div className="lg:col-span-12">
          <PerformanceTracker />
        </div>
      </div>
    </div>
  );
}
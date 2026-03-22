import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, PlusCircle, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function TaskList({ initialTasks = [], onUpdate }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newTask = {
      title,
      subject,
      deadline,
      priority,
      status: 'Not Started'
    };

    try {
      const updatedTasks = [newTask, ...initialTasks];
      await api.put('/me/update', { tasks: updatedTasks });
      
      setTitle('');
      setSubject('');
      setDeadline('');
      setPriority('Medium');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to add task', error);
      alert('Failed to save task to database');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const updatedTasks = initialTasks.filter(t => t._id !== taskId && t.id !== taskId);
      await api.put('/me/update', { tasks: updatedTasks });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const isOverdue = (taskDeadline, status) => {
    const today = new Date();
    return new Date(taskDeadline) < today && status !== 'Completed';
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 tracking-tight">Academic Task Tracker</h2>
      
      {/* ADD TASK FORM */}
      <form onSubmit={handleAddTask} className="mb-8 grid grid-cols-1 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white"
          />
          <input 
            type="text" placeholder="Subject (e.g., Machine Learning)" value={subject} onChange={(e) => setSubject(e.target.value)} required
            className="w-full p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white"
          />
          <input 
            type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required 
            className="w-full p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white text-slate-600 dark:text-slate-300"
          />
          <select 
            value={priority} onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2 transition-all active:scale-95 mt-2 disabled:opacity-50">
          <PlusCircle size={20} /> {loading ? 'Saving...' : 'Add Task'}
        </button>
      </form>

      {/* TASK LIST DISPLAY */}
      <div className="flex flex-col gap-4">
        {initialTasks.length === 0 && <p className="text-slate-500 text-center py-4">No tasks added yet.</p>}
        {initialTasks.map((task) => {
          const overdue = isOverdue(task.deadline, task.status);
          const taskId = task._id || task.id;
          
          return (
            <div 
              key={taskId} 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                overdue ? 'bg-red-50/50 dark:bg-red-900/10 border-red-300 dark:border-red-500/30' : 'bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-semibold text-lg ${overdue ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <button onClick={() => handleDeleteTask(taskId)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{task.subject}</p>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(task.deadline).toLocaleString()}
                </span>
                <span className="flex items-center gap-1.5">
                  {task.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
                  {task.status}
                </span>
                {overdue && (
                  <span className="flex items-center gap-1.5 text-red-600 font-bold ml-auto">
                    <AlertCircle className="w-4 h-4" />
                    Overdue!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
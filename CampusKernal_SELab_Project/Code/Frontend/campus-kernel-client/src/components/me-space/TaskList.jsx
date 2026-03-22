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
      
      setTitle(''); setSubject(''); setDeadline(''); setPriority('Medium');
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Academic Task Tracker</h2>
      
      {/* ADD TASK FORM */}
      <form onSubmit={handleAddTask} className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm" />
          <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm" />
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm" />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm">
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
          <PlusCircle size={18} /> {loading ? 'Saving...' : 'Add Task'}
        </button>
      </form>

      {/* TASK LIST */}
      <div className="flex flex-col gap-3">
        {initialTasks.length === 0 && <p className="text-slate-500 text-sm">No tasks added yet.</p>}
        {initialTasks.map((task) => {
          const overdue = isOverdue(task.deadline, task.status);
          const taskId = task._id || task.id;
          
          return (
            <div key={taskId} className={`p-4 rounded-lg border ${overdue ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-base ${overdue ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{task.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${task.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{task.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(task.deadline).toLocaleString()}</span>
                  <span className="flex items-center gap-1">
                    {task.status === 'Completed' ? <CheckCircle2 size={14} className="text-green-500" /> : <Clock size={14} className="text-blue-500" />} {task.status}
                  </span>
                  {overdue && <span className="flex items-center gap-1 text-red-600 font-bold"><AlertCircle size={14} /> Overdue</span>}
                </div>
              </div>
              <button onClick={() => handleDeleteTask(taskId)} className="self-end md:self-auto p-2 text-slate-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 hover:bg-red-50 rounded-md">
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
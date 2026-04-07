import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, PlusCircle, Trash2, Pencil } from 'lucide-react';
import api from '../../services/api';

export default function TaskList({ initialTasks = [], onUpdate }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let updatedTasks;
      if (editingTaskId) {
        updatedTasks = initialTasks.map(t => {
          if ((t._id || t.id) === editingTaskId) {
            return { ...t, title, subject, deadline, priority };
          }
          return t;
        });
      } else {
        const newTask = {
          title,
          subject,
          deadline,
          priority,
          status: 'Not Started'
        };
        updatedTasks = [newTask, ...initialTasks];
      }

      await api.put('/me/update', { tasks: updatedTasks });
      
      setTitle(''); setSubject(''); setDeadline(''); setPriority('Medium');
      setEditingTaskId(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to save task', error);
      alert('Failed to save task to database');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setSubject(task.subject);
    setDeadline(task.deadline);
    setPriority(task.priority);
    setEditingTaskId(task._id || task.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setTitle(''); setSubject(''); setDeadline(''); setPriority('Medium');
    setEditingTaskId(null);
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

  const handleToggleComplete = async (task) => {
    const taskId = task._id || task.id;
    const updatedTasks = initialTasks.map(t => {
      if ((t._id || t.id) === taskId) {
        return { ...t, status: t.status === 'Completed' ? 'Not Started' : 'Completed' };
      }
      return t;
    });
    
    try {
      await api.put('/me/update', { tasks: updatedTasks });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to update task status', err);
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
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
            <PlusCircle size={18} /> {loading ? 'Saving...' : (editingTaskId ? 'Update Task' : 'Add Task')}
          </button>
          {editingTaskId && (
            <button type="button" onClick={handleCancelEdit} className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center">
              Cancel
            </button>
          )}
        </div>
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
              <div className="flex gap-1 self-end md:self-auto">
                <button onClick={() => handleToggleComplete(task)} className={`p-2 transition-colors border border-transparent rounded-md ${task.status === 'Completed' ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-slate-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50'}`} title={task.status === 'Completed' ? "Mark as Not Started" : "Mark as Completed"}>
                  <CheckCircle2 size={18} />
                </button>
                <button onClick={() => handleEditTask(task)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-200 hover:bg-blue-50 rounded-md" title="Edit">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDeleteTask(taskId)} className="p-2 text-slate-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 hover:bg-red-50 rounded-md" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
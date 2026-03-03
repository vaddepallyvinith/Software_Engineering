import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, PlusCircle } from 'lucide-react';

export default function TaskList() {
  // Existing task list state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete Software Engineering Lab Report',
      subject: 'Software Engineering',
      deadline: '2026-03-01T23:59:00', 
      priority: 'High',
      status: 'Not Started'
    }
  ]);

  // New state variables for the form inputs
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Function to handle form submission
  const handleAddTask = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    const newTask = {
      id: Date.now(), // Generates a unique ID for the frontend
      title: title,
      subject: subject,
      deadline: deadline,
      priority: priority,
      status: 'Not Started'
    };

    // Add new task to the top of the list
    setTasks([newTask, ...tasks]);

    // Clear the form fields
    setTitle('');
    setSubject('');
    setDeadline('');
    setPriority('Medium');
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Academic Task Tracker</h2>
      
      {/* ADD TASK FORM */}
      
      <form onSubmit={handleAddTask} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Task Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="Subject (e.g., Machine Learning)" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="datetime-local" 
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required // Enforces the constraint that every task must have a deadline
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          />
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {/* Enforces the constraint of predefined priority levels */}
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <PlusCircle size={20} />
          Add Task
        </button>
      </form>

      {/* TASK LIST DISPLAY */}
      <div className="flex flex-col gap-4">
        {tasks.map((task) => {
          const overdue = isOverdue(task.deadline, task.status);
          
          return (
            <div 
              key={task.id} 
              className={`p-4 rounded-lg border transition-all ${
                overdue ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold text-lg ${overdue ? 'text-red-700' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-3">{task.subject}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
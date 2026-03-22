import { useState, useMemo } from 'react';
import { TrendingUp, Lock, Plus } from 'lucide-react';
import api from '../../services/api';

const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 };

export default function PerformanceTracker({ initialRecords = [], onUpdate }) {
  const [subject, setSubject] = useState('');
  const [credits, setCredits] = useState(4);
  const [grade, setGrade] = useState('A');
  const [loading, setLoading] = useState(false);

  const cgpa = useMemo(() => {
    const totalPoints = initialRecords.reduce((acc, curr) => acc + (gradePoints[curr.grade] * curr.credits), 0);
    const totalCredits = initialRecords.reduce((acc, curr) => acc + curr.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [initialRecords]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newRecord = {
      subject,
      credits: parseInt(credits),
      grade,
      semester: 2, 
      finalized: false
    };
    
    const updatedRecords = [...initialRecords, newRecord];
    const totalPoints = updatedRecords.reduce((acc, curr) => acc + (gradePoints[curr.grade] * curr.credits), 0);
    const totalCredits = updatedRecords.reduce((acc, curr) => acc + curr.credits, 0);
    const newCgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;

    try {
      await api.put('/me/update', { records: updatedRecords, cgpa: newCgpa });
      setSubject('');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to add grade record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Performance Tracker</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded border border-blue-200 dark:border-blue-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600 w-4 h-4" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">CGPA:</span>
          <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{cgpa}</span>
        </div>
      </div>

      {/* GRADE ENTRY FORM */}
      <form onSubmit={handleAddRecord} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <input 
          type="text" placeholder="Subject Name" required value={subject} onChange={(e) => setSubject(e.target.value)}
          className="md:col-span-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full"
        />
        <input 
          type="number" min="1" max="5" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full"
        />
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full">
          {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
          <Plus size={18} /> {loading ? 'Saving...' : 'Add Grade'}
        </button>
      </form>

      {/* PERFORMANCE TABLE */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        {initialRecords.length === 0 ? (
          <p className="text-slate-500 text-center py-8 text-sm">No grades recorded yet. Add your first subject above.</p>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {initialRecords.map((record) => (
                <tr key={record._id || record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{record.subject}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{record.credits}</td>
                  <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">{record.grade}</td>
                  <td className="px-4 py-3">
                    {record.finalized ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <Lock size={12} /> Locked (Sem {record.semester})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                        Editable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
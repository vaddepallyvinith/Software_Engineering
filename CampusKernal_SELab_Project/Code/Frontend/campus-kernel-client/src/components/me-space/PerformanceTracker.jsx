import { useState, useMemo } from 'react';
import { TrendingUp, Lock, Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';

const gradePoints = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0 };

export default function PerformanceTracker({ initialRecords = [], onUpdate }) {
  const [subject, setSubject] = useState('');
  const [credits, setCredits] = useState(4);
  const [grade, setGrade] = useState('A');
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);

  const cgpa = useMemo(() => {
    const totalPoints = initialRecords.reduce((acc, curr) => acc + (gradePoints[curr.grade] * curr.credits), 0);
    const totalCredits = initialRecords.reduce((acc, curr) => acc + curr.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [initialRecords]);

  const recordsBySemester = useMemo(() => {
    const groups = {};
    initialRecords.forEach(r => {
      const sem = r.semester || 1;
      if (!groups[sem]) groups[sem] = { records: [], totalPoints: 0, totalCredits: 0 };
      groups[sem].records.push(r);
      groups[sem].totalPoints += (gradePoints[r.grade] * r.credits);
      groups[sem].totalCredits += r.credits;
    });
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
  }, [initialRecords]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setLoading(true);

    let updatedRecords;
    if (editingRecordId) {
      updatedRecords = initialRecords.map(r => {
        if ((r._id || r.id) === editingRecordId) {
          return { ...r, subject, credits: parseInt(credits), grade, semester: parseInt(semester) };
        }
        return r;
      });
    } else {
      const newRecord = {
        subject,
        credits: parseInt(credits),
        grade,
        semester: parseInt(semester),
        finalized: false
      };
      updatedRecords = [...initialRecords, newRecord];
    }

    const totalPoints = updatedRecords.reduce((acc, curr) => acc + (gradePoints[curr.grade] * curr.credits), 0);
    const totalCredits = updatedRecords.reduce((acc, curr) => acc + curr.credits, 0);
    const newCgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;

    try {
      await api.put('/me/update', { records: updatedRecords, cgpa: newCgpa });
      setSubject('');
      setCredits(4);
      setGrade('A');
      setEditingRecordId(null);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to add grade record');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record) => {
    setSubject(record.subject);
    setCredits(record.credits);
    setGrade(record.grade);
    setSemester(record.semester || 1);
    setEditingRecordId(record._id || record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setSubject('');
    setCredits(4);
    setGrade('A');
    setEditingRecordId(null);
  };

  const handleDeleteRecord = async (recordId) => {
    const updatedRecords = initialRecords.filter(r => (r._id || r.id) !== recordId);
    const totalPoints = updatedRecords.reduce((acc, curr) => acc + (gradePoints[curr.grade] * curr.credits), 0);
    const totalCredits = updatedRecords.reduce((acc, curr) => acc + curr.credits, 0);
    const newCgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;

    try {
      await api.put('/me/update', { records: updatedRecords, cgpa: newCgpa });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
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
      <form onSubmit={handleAddRecord} className="mb-8 flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 items-end">
        <div className="flex-[2] w-full">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Subject Name</label>
          <input
            type="text" placeholder="e.g. Data Structures" required value={subject} onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Semester</label>
          <input
            type="number" min="1" max="10" placeholder="Sem" value={semester} onChange={(e) => setSemester(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Credits</label>
          <input
            type="number" min="1" max="6" placeholder="Cr" value={credits} onChange={(e) => setCredits(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Grade</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md focus:outline-none focus:border-blue-500 text-sm w-full">
            {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="flex-[2] flex gap-2 w-full h-[38px]">
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> {loading ? 'Saving...' : (editingRecordId ? 'Update' : 'Add Course')}
          </button>
          {editingRecordId && (
            <button type="button" onClick={handleCancelEdit} className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-md transition-colors flex items-center justify-center">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PERFORMANCE TABLE */}
      <div className="space-y-6">
        {initialRecords.length === 0 ? (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-slate-500 text-center py-8 text-sm">No grades recorded yet. Add your first subject above.</p>
          </div>
        ) : (
          recordsBySemester.map(([sem, data]) => {
            const sgpa = data.totalCredits > 0 ? (data.totalPoints / data.totalCredits).toFixed(2) : "0.00";
            return (
              <div key={sem} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Semester {sem}</h3>
                  <div className="text-sm font-semibold bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    SGPA: <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">{sgpa}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Credits</th>
                        <th className="px-4 py-3">Grade</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {data.records.map((record) => (
                        <tr key={record._id || record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{record.subject}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{record.credits}</td>
                          <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">{record.grade}</td>
                          <td className="px-4 py-3">
                            {record.finalized ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                <Lock size={12} /> Locked
                              </span>
                            ) : (
                              <div className="flex gap-2">
                                <button onClick={() => handleEditRecord(record)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-200 hover:bg-blue-50 rounded" title="Edit">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDeleteRecord(record._id || record.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 hover:bg-red-50 rounded" title="Delete">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
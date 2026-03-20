import { useState, useMemo } from 'react';
import { TrendingUp, Award, Lock, Plus } from 'lucide-react';

// Grading scale map for calculation
const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 };

export default function PerformanceTracker() {

  const [records, setRecords] = useState([
    { id: 1, subject: 'Data Structures', credits: 4, grade: 'A+', semester: 1, finalized: true },
    { id: 2, subject: 'Discrete Math', credits: 3, grade: 'A', semester: 1, finalized: true },
    { id: 3, subject: 'Operating Systems', credits: 4, grade: 'B+', semester: 2, finalized: false }
  ]);

  const [subject, setSubject] = useState('');
  const [credits, setCredits] = useState(4);
  const [grade, setGrade] = useState('A');

  // Constraint: Automated CGPA calculation using useMemo for performance
  const cgpa = useMemo(() => {
    const totalPoints = records.reduce((acc, curr) => acc + (gradePoints[curr.grade] * curr.credits), 0);
    const totalCredits = records.reduce((acc, curr) => acc + curr.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [records]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      subject,
      credits: parseInt(credits),
      grade,
      semester: 2, // Defaulting to current semester for prototype
      finalized: false
    };
    setRecords([...records, newRecord]);
    setSubject('');
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Performance Tracker</h2>
        <div className="bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-500/20 flex items-center gap-2">
          <TrendingUp className="text-orange-500 w-5 h-5" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">CGPA:</span>
          <span className="text-xl font-black text-orange-600 dark:text-orange-400">{cgpa}</span>
        </div>
      </div>

      {/* GRADE ENTRY FORM */}
      <form onSubmit={handleAddRecord} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700/50">
        <input 
          type="text" placeholder="Subject Name" required value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="md:col-span-1 p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white"
        />
        <input 
          type="number" min="1" max="5" placeholder="Credits" value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white"
        />
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="p-3 rounded-xl text-sm outline-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-white">
          {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95 flex items-center justify-center gap-1">
          <Plus size={18} /> Add Grade
        </button>
      </form>

      {/* PERFORMANCE TABLE */}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
          <thead className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-4 rounded-tl-xl rounded-bl-xl border-y border-l border-slate-100 dark:border-slate-800">Subject</th>
              <th className="px-5 py-4 border-y border-slate-100 dark:border-slate-800">Credits</th>
              <th className="px-5 py-4 border-y border-slate-100 dark:border-slate-800">Grade</th>
              <th className="px-5 py-4 rounded-tr-xl rounded-br-xl border-y border-r border-slate-100 dark:border-slate-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-5 font-bold text-slate-900 dark:text-white">{record.subject}</td>
                <td className="px-5 py-5">{record.credits}</td>
                <td className="px-5 py-5 font-black text-orange-500 dark:text-orange-400">{record.grade}</td>
                <td className="px-5 py-5">
                  {record.finalized ? (
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <Lock size={14} /> Locked (Sem {record.semester})
                    </span>
                  ) : (
                    <span className="text-green-500 font-bold text-xs">Editable</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
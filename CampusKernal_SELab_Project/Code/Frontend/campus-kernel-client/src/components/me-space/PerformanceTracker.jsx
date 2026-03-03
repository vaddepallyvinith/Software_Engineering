import { useState, useMemo } from 'react';
import { TrendingUp, Award, Lock, Plus } from 'lucide-react';

export default function PerformanceTracker() {
  // Grading scale map for calculation
  const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 };

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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Performance Tracker</h2>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
          <TrendingUp className="text-blue-600 w-5 h-5" />
          <span className="text-sm font-medium text-gray-600">Current CGPA:</span>
          <span className="text-xl font-bold text-blue-700">{cgpa}</span>
        </div>
      </div>

      {/* GRADE ENTRY FORM */}
      <form onSubmit={handleAddRecord} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border">
        <input 
          type="text" placeholder="Subject Name" required value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="md:col-span-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="number" min="1" max="5" placeholder="Credits" value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className="p-2 border rounded bg-white">
          {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white rounded font-bold hover:bg-blue-700 flex items-center justify-center gap-1">
          <Plus size={18} /> Add Grade
        </button>
      </form>

      {/* PERFORMANCE TABLE */}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{record.subject}</td>
                <td className="px-4 py-4">{record.credits}</td>
                <td className="px-4 py-4 font-bold text-blue-600">{record.grade}</td>
                <td className="px-4 py-4">
                  {record.finalized ? (
                    <span className="flex items-center gap-1 text-gray-400">
                      <Lock size={14} /> Locked (Sem {record.semester})
                    </span>
                  ) : (
                    <span className="text-green-500 font-medium">Editable</span>
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
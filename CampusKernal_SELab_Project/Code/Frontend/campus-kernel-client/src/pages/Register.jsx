import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', institute: 'University of Hyderabad', year: '4th Year', tags: '', password: ''
  });

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join the unified academic ecosystem</p>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 border rounded-lg w-full" required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-3 border rounded-lg w-full" required />
          </div>
          <input type="text" value={formData.institute} readOnly className="p-3 border rounded-lg w-full bg-gray-50 text-gray-500 cursor-not-allowed" />
          <div className="grid grid-cols-2 gap-4">
            <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="p-3 border rounded-lg w-full bg-white">
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-3 border rounded-lg w-full" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Academic Interests (Tags)</label>
            <input type="text" placeholder="e.g. Machine Learning, Python, UI Design" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4">
            <UserPlus size={20} /> Create Student Profile
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already a member? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
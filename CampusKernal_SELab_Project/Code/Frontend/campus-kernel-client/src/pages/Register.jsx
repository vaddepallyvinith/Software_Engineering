import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', institute: 'University of Hyderabad', year: '2026', tags: ''
  });

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join the unified academic ecosystem</p>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="p-3 border rounded-lg w-full" required />
            <input type="email" placeholder="Email" className="p-3 border rounded-lg w-full" required />
          </div>
          <input type="text" value={formData.institute} readOnly className="p-3 border rounded-lg w-full bg-gray-50 text-gray-500 cursor-not-allowed" />
          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 border rounded-lg w-full bg-white">
              <option>1st Year</option><option>2nd Year</option>
              <option>3rd Year</option><option selected>4th Year</option>
            </select>
            <input type="password" placeholder="Password" className="p-3 border rounded-lg w-full" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Academic Interests (Tags)</label>
            <input type="text" placeholder="e.g. Machine Learning, Python, UI Design" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4">
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
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    universityName: 'University of Hyderabad',
    country: 'India',
    course: '',
    currentYear: 1,
    yearOfGraduation: 2027,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        universityName: formData.universityName,
        country: formData.country,
        course: formData.course,
        currentYear: Number(formData.currentYear),
        yearOfGraduation: Number(formData.yearOfGraduation)
      };
      await api.post('/auth/register', payload);
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join the unified academic ecosystem</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" placeholder="e.g. India" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
             <input type="text" value={formData.universityName} onChange={e => setFormData({...formData, universityName: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <input type="text" placeholder="e.g. B.Tech Computer Science" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
              <select value={formData.currentYear} onChange={e => setFormData({...formData, currentYear: Number(e.target.value)})} className="p-3 border rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
                <option value={5}>5th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input type="number" placeholder="2027" value={formData.yearOfGraduation} onChange={e => setFormData({...formData, yearOfGraduation: Number(e.target.value)})} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" min="2000" max="2100" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 transition-colors">
            <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Create Student Profile'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already a member? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
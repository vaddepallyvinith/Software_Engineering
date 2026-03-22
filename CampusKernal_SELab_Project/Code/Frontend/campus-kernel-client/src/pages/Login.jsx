import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Access your academic dashboard</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              required 
            />
          </div>
          <div>
             <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-medium text-gray-700">Password</label>
               <a href="#" onClick={(e) => {
                 e.preventDefault();
                 alert('Forgot password functionality will be implemented in a future update. For now, please re-register if you lost your account.');
               }} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">Forgot Password?</a>
             </div>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors"
          >
            <LogIn size={20} /> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
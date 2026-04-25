import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-slate-200">

        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              CK
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Campus Kernel</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Unified Ecosystem</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Forgot Password</h2>
        <p className="text-slate-500 text-center mb-8 text-sm font-medium">Enter your email to receive a reset link</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-6 text-sm text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-2.5 border border-slate-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none block text-slate-900 bg-white placeholder-slate-400 font-medium text-sm transition-shadow"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 mt-2 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/20"
          >
            <Mail size={20} /> {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600 font-medium">
          Remember your password? <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1 inline-flex items-center gap-1"><ArrowLeft size={14}/> Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // CAPTCHA State
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const canvasRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    drawCaptcha(text);
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 200},${Math.random() * 200},${Math.random() * 200},0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = 'bold 32px Arial';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.fillStyle = `rgb(${Math.random() * 150},${Math.random() * 150},${Math.random() * 150})`;
      const x = 20 + i * 25;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (userInput !== captchaText) {
      setError('Incorrect CAPTCHA entered. Please try again.');
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
      generateCaptcha();
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

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8 text-sm font-medium">Sign in to your academic dashboard</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="Enter your student email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="p-2.5 border border-slate-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none block text-slate-900 bg-white placeholder-slate-400 font-medium text-sm transition-shadow"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-bold transition-colors">Forgot Password?</Link>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="p-2.5 border border-slate-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none block text-slate-900 bg-white placeholder-slate-400 font-medium text-sm transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Security Verification</label>
            <div className="flex gap-2 items-center mb-2 p-2 border border-slate-200 rounded-md bg-slate-50 shadow-inner">
              <canvas ref={canvasRef} width="180" height="50" className="bg-white rounded border border-slate-300 shadow-sm" />
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors ml-auto flex items-center justify-center shrink-0 border border-transparent hover:border-blue-200"
                title="Refresh Captcha Image"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter the characters from the image"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              className="p-2.5 border border-slate-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none block text-slate-900 bg-white placeholder-slate-400 font-bold text-sm transition-shadow tracking-widest"
              required
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 mt-2 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/20"
          >
            <LogIn size={20} /> {loading ? 'Verifying...' : 'Login Securely'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600 font-medium">
          New here? <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
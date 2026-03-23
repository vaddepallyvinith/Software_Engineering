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
    // Avoid confusing characters like O/0, I/1, l
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
    
    // Background noise
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random()*200},${Math.random()*200},${Math.random()*200},0.5)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Draw text with variations
    ctx.font = 'bold 32px Arial';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      // Randomly color the text to make bots confused
      ctx.fillStyle = `rgb(${Math.random()*150},${Math.random()*150},${Math.random()*150})`;
      // Translate to character position
      const x = 20 + i * 25;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      ctx.translate(x, y);
      // Random rotation
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Security 1st: Check CAPTCHA locally
    if (userInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError('Incorrect CAPTCHA entered. Please try again.');
      generateCaptcha(); // Auto-refresh for security
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
      // Auto-refresh CAPTCHA on failed auth to stop brute force loops
      generateCaptcha(); 
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Verification</label>
            <div className="flex gap-2 items-center mb-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <canvas ref={canvasRef} width="180" height="50" className="bg-white rounded border border-gray-300 shadow-sm" />
              <button 
                type="button" 
                onClick={generateCaptcha} 
                className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors ml-auto flex items-center justify-center shrink-0"
                title="Refresh Captcha Image"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Enter the 6 characters from image..." 
              value={userInput} 
              onChange={e => setUserInput(e.target.value)} 
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              required 
              maxLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors"
          >
            <LogIn size={20} /> {loading ? 'Verifying...' : 'Login Securely'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
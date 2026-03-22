import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Building, MapPin, Check, GraduationCap, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    universityName: ''
  });

  useEffect(() => {
    api.get('/me').then(res => {
      const user = res.data.user;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        course: user.profile?.course || '',
        universityName: user.profile?.universityName || ''
      });
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center mt-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200">
      
      {/* Basic Hero Text */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 mt-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information, update security credentials, and customize your ecosystem preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Forms */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Profile Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                Profile Identity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md cursor-not-allowed opacity-70 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Course</label>
                  <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">University</label>
                  <input type="text" name="universityName" value={formData.universityName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-orange-500" />
                Account Security
              </h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-sm font-semibold mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
                <hr className="border-slate-200 dark:border-slate-800 my-4" />
                <div>
                  <label className="block text-sm font-semibold mb-1">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-start md:justify-end pt-2">
              <button type="submit" className="flex items-center gap-2 bg-blue-600 font-sans text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm">
                {saved && <Check size={18} />}
                {saved ? 'Saved' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Status Component */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Status</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Your account is fully secured within the {formData.universityName || 'Campus'} ecosystem.
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold">2FA Authentication</span>
                <span className="text-[10px] tracking-widest font-bold text-green-600 dark:text-green-400 uppercase">Enabled</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-semibold">Active Sessions</span>
                <span className="text-[10px] tracking-widest font-bold uppercase text-slate-700 dark:text-slate-300">1 Device</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-semibold">Data Privacy</span>
                <span className="text-[10px] tracking-widest font-bold text-blue-600 dark:text-blue-400 uppercase">Standard</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

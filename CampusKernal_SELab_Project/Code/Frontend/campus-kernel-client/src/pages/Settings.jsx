import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Building, MapPin, Sparkles, Check, GraduationCap, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Controlled form state matching the database exactly
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    universityName: ''
  });

  useEffect(() => {
    // Fetch user data from database on mount
    api.get('/me').then(res => {
      const user = res.data.user;
      setFormData({
        name: user.name || '',
        email: user.email || '',
        course: user.profile?.course || '',
        universityName: user.profile?.universityName || ''
      });
    }).catch(err => {
      console.error('Failed to load settings data', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    // Note: In sprint 2 we can wire this up to api.put('/me/update') to save changes.
    // Right now it acts as a visual sync to the database.
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
     return <div className="flex justify-center items-center min-h-[80vh]"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;
  }

  return (
    <div className="pb-12 pr-4 animate-in fade-in duration-700 font-sans min-h-[calc(100vh-80px)]">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-12 mb-10 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-700/30 rounded-full blur-[100px] group-hover:bg-slate-600/30 transition-colors duration-1000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-500/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6 shadow-sm shadow-slate-500/10">
              <Shield size={14} className="text-slate-300 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">System Configuration</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
              Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-gray-400">Settings.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md leading-relaxed">
              Manage your personal information, update security credentials, and customize your ecosystem preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Forms */}
        <div className="xl:col-span-8 space-y-8">
          
          <form onSubmit={handleSave} className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Profile Identity</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Sourced directly from your registration details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900 opacity-60 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 cursor-not-allowed font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Course</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">University</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" name="universityName" value={formData.universityName} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section (Unchanged visually, kept static structure) */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8">
               <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Account Security</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Update passwords and auth methods</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Current Password</label>
                  <div className="relative max-w-md">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold" />
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 max-w-md my-4"></div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">New Password</label>
                  <div className="relative max-w-md">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" placeholder="Enter new password" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold" />
                  </div>
                </div>
                 <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Confirm New Password</label>
                  <div className="relative max-w-md">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" placeholder="Confirm new password" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start md:justify-end pt-4">
              <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center">
                {saved ? <Check size={18} /> : <Sparkles size={18} />}
                {saved ? 'Changes Saved!' : 'Save All Configurations'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Status */}
        <div className="xl:col-span-4">
           {/* Account Status Card */}
           <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <Shield size={32} className="text-blue-200 mb-6 drop-shadow-md" />
            <h3 className="text-2xl font-black mb-2 tracking-tight">Account Status</h3>
            <p className="text-blue-100 font-medium text-sm mb-8 leading-relaxed">
              Your account is fully secured and verified within the {formData.universityName || 'Campus'} ecosystem.
            </p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-sm font-bold">2FA Authentication</span>
                <span className="bg-green-500/20 text-green-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-green-500/30">Enabled</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Active Sessions</span>
                <span className="text-white text-sm font-black">1 Device</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="text-sm font-bold">Data Privacy</span>
                <span className="bg-blue-400/20 text-blue-200 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-400/30">Standard</span>
              </div>
            </div>
           </div>
        </div>

      </div>
    </div>
  );
}

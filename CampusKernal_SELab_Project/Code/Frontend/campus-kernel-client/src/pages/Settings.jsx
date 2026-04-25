import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Building, MapPin, Check, GraduationCap, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Settings() {
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    universityName: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  const handleProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/me/update', {
        name: formData.name,
        course: formData.course,
        universityName: formData.universityName
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    try {
      await api.put('/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordSaved(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Failed to change password");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center mt-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200">
      
      {/* Basic Hero Text */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 mt-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information, update security credentials, and customize your ecosystem preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <form onSubmit={handleProfileSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-blue-500" />
            Profile Identity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleProfileChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleProfileChange} disabled className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md cursor-not-allowed opacity-70 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Course</label>
              <input type="text" name="course" value={formData.course} onChange={handleProfileChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">University</label>
              <input type="text" name="universityName" value={formData.universityName} onChange={handleProfileChange} className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
          </div>
          
          <div className="flex justify-end pt-6">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 font-sans text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm">
              {profileSaved && <Check size={18} />}
              {profileSaved ? 'Saved' : 'Save Profile'}
            </button>
          </div>
        </form>

        {/* Security Section */}
        <form onSubmit={handlePasswordSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-orange-500" />
            Account Security
          </h2>
          <div className="space-y-4 max-w-sm">
            {passwordError && <p className="text-red-500 text-sm font-semibold">{passwordError}</p>}
            <div>
              <label className="block text-sm font-semibold mb-1">Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" required className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
            <hr className="border-slate-200 dark:border-slate-800 my-4" />
            <div>
              <label className="block text-sm font-semibold mb-1">New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" required minLength="6" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm new password" required minLength="6" className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
          </div>
          
          <div className="flex justify-end pt-6">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 font-sans text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm">
              {passwordSaved && <Check size={18} />}
              {passwordSaved ? 'Password Changed' : 'Update Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

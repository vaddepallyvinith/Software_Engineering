import { Link, useLocation } from 'react-router-dom';
import { Users, Settings, LogOut, LayoutDashboard, MessageSquare, Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme, increaseTextSize, decreaseTextSize } = useTheme();
  
  const [userData, setUserData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Only attempt to fetch the profile if the token exists
    if (localStorage.getItem('token')) {
      api.get('/me').then(res => {
        setUserData(res.data.user);
      }).catch(err => console.error("Failed to load user for Sidebar", err));

      api.get('/messages/unread').then(res => {
        setUnreadCount(res.data.unread);
      }).catch(err => console.error("Failed to load unread count", err));

      const interval = setInterval(() => {
        api.get('/messages/unread').then(res => setUnreadCount(res.data.unread)).catch(() => {});
      }, 15000);

      return () => clearInterval(interval);
    }
  }, []);

  const menuItems = [
    { name: 'Me Space', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'We Space', path: '/we-space', icon: <Users size={18} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  if (userData?.role === 'admin') {
    menuItems.push({ name: 'Admin', path: '/admin', icon: <Shield size={18} /> });
  }

  const userName = userData?.name || "Student";
  const userInitial = userName.charAt(0).toUpperCase();
  const universityInfo = userData?.profile?.universityName || "University";

  return (
    <div className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 fixed left-0 top-0 h-screen transition-colors text-slate-800 dark:text-slate-200 z-50 font-sans">
      
      {/* Brand */}
      <div className="mb-8 px-2 mt-4 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
          CK
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Campus Kernel</h1>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Unified Ecosystem</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 px-2">Menu</div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-semibold ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              {item.name === 'Messages' && unreadCount > 0 ? (
                <div className="flex-1 flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                </div>
              ) : (
                <span>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tools / User */}
      <div className="mt-auto flex flex-col gap-4">
        
        {/* Controls */}
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex gap-1">
            <button onClick={decreaseTextSize} className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">A-</button>
            <button onClick={increaseTextSize} className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">A+</button>
          </div>
          <button onClick={toggleTheme} className="p-1.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span className="text-[10px] uppercase font-bold pr-1">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</h4>
            <p className="text-[10px] text-slate-500 truncate">{universityInfo}</p>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md text-sm font-bold text-red-600 dark:text-red-400 border border-transparent hover:border-red-200 hover:bg-red-50 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

    </div>
  );
}

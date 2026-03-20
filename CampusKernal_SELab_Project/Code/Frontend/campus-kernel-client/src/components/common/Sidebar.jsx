import { Link, useLocation } from 'react-router-dom';
import { Users, Settings, LogOut, LayoutDashboard, MessageSquare, Sun, Moon, Shield, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme, increaseTextSize, decreaseTextSize } = useTheme();
  
  const menuItems = [
    { name: 'Me Space', path: '/', icon: <LayoutDashboard size={20} />, activeColor: 'from-cyan-500 to-blue-500 shadow-cyan-500/30' },
    { name: 'We Space', path: '/we-space', icon: <Users size={20} />, activeColor: 'from-orange-500 to-amber-500 shadow-orange-500/30' },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} />, activeColor: 'from-fuchsia-500 to-pink-500 shadow-fuchsia-500/30' },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} />, activeColor: 'from-slate-500 to-slate-400 shadow-slate-500/30' },
  ];

  return (
    <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 flex flex-col p-5 fixed left-0 top-0 h-screen transition-colors shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none z-50">
      {/* Brand */}
      <div className="mb-8 pl-2 mt-2">
        <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">CK</div>
          CAMPUS KERNEL
        </h1>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mt-1">Unified Ecosystem</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 mt-4">
        <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-4 pl-2">Menu</div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? `bg-gradient-to-r ${item.activeColor} text-white shadow-lg transform scale-[1.02]` 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={isActive ? "animate-pulse" : "opacity-80"}>{item.icon}</div>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Tools / User */}
      <div className="mt-auto flex flex-col gap-4">
        
        {/* Controls */}
        <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5">
          <div className="flex gap-1">
            <button onClick={decreaseTextSize} className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all" title="Decrease size">A-</button>
            <button onClick={increaseTextSize} className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all" title="Increase size">A+</button>
          </div>
          <button onClick={toggleTheme} className="w-8 h-8 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform flex-1 ml-2">
            {theme === 'dark' ? <Sun size={14} className="text-yellow-500 mr-2" /> : <Moon size={14} className="text-slate-600 mr-2" />}
            <span className="text-[10px] uppercase font-bold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3 group hover:border-blue-500/50 transition-colors cursor-default">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shrink-0">
            V
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">Vinith K.</h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">UoH CS Dept</p>
          </div>
        </div>

        {/* Logout */}
        <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

    </div>
  );
}
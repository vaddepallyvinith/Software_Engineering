import { Link, useLocation } from 'react-router-dom';
import { User, Users, Settings, LogOut, LayoutDashboard, MessageSquare, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const menuItems = [
    { name: 'ME Space', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'WE Space', path: '/we-space', icon: <Users size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-slate-950 dark:from-slate-950 dark:to-slate-950 border-r-[6px] border-r-orange-500 text-white min-h-screen flex flex-col p-4 fixed left-0 top-0 transition-all shadow-2xl z-50">
      <div className="mb-10 px-2 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md">CAMPUS KERNEL</h1>
          <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest mt-1">Unified Ecosystem</p>
        </div>
        <button onClick={toggleTheme} className="p-2 -mt-1 rounded-full hover:bg-white/10 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none">
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-300" />}
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
              location.pathname === item.path 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-y-0.5'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-4 mt-auto">
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 cursor-pointer hover:border-cyan-500/50 dark:hover:border-cyan-500 transition-colors">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-white shadow-md shadow-teal-500/20">V</div>
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">Vinith K.</h4>
            <p className="text-[10px] text-slate-400">UoH Student</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 w-full rounded-lg transition-all text-sm font-medium">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Settings, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'ME Space', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'WE Space', path: '/we-space', icon: <Users size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> }, // Matches the Route path
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col p-4 fixed left-0 top-0">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black tracking-tighter text-blue-400">CAMPUS KERNEL</h1>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Unified Ecosystem</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-4 mt-auto">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">V</div>
          <div>
            <p className="text-sm font-bold">Vinith V.</p>
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
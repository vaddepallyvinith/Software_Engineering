import React, { useState } from 'react';
import { Globe, Users, Video, PlusCircle, Search, Filter, Zap } from 'lucide-react';
import PeerCard from '../components/we-space/PeerCard';
import ChatPopup from '../components/we-space/ChatPopup';
import StatsOverview from '../components/me-space/StatsOverview';

// --- (StudyRoomLive remains the same as your code) ---
const StudyRoomLive = ({ room, onLeave }) => (
  <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex flex-col animate-in fade-in duration-300">
    <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        <h2 className="text-white font-black tracking-tight">{room.topic}</h2>
      </div>
      <button onClick={onLeave} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95">
        Leave Room
      </button>
    </div>
    <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <Video size={64} className="text-slate-800 mb-4" />
        <p className="text-slate-500 font-bold italic">Waiting for participants to share screen...</p>
      </div>
      <div className="bg-slate-800/40 rounded-3xl border border-white/5 p-6 flex flex-col">
        <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
          <Users size={16} className="text-blue-400" /> Active Now (1/10)
        </h3>
        <div className="flex-1 space-y-3">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">V</div>
            <span className="text-white text-xs font-bold">Vinith (You)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function WeSpace() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const myTags = ['React', 'Python', 'Machine Learning', 'Tailwind'];

  const [peers, setPeers] = useState([
    { id: 1, name: 'Bhavani Shankar', tags: ['React', 'Node.js'], location: 'Hostel K', connectionStatus: 'none', status: 'Online' },
    { id: 2, name: 'Ananya Rao', tags: ['Python', 'ML'], location: 'Library', connectionStatus: 'received', status: 'Online' },
    { id: 3, name: 'Snehita P.', tags: ['Figma', 'UI/UX'], location: 'SCIS Dept', connectionStatus: 'connected', status: 'Away' }
  ]);

  const rooms = [
    { id: 101, topic: 'GATE 2026 CS Prep', participants: 4, max: 10, category: 'Exam Prep' },
    { id: 102, topic: 'SE Lab Project Discussion', participants: 2, max: 5, category: 'Project' }
  ];

  return (
    <div className="space-y-6 pb-12 pr-4 animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION (Styled like MeSpace) */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-blue-50 dark:bg-slate-900 rounded-[2rem] border-l-[8px] border-l-blue-600 dark:border-l-blue-500 shadow-sm transition-all duration-300">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Collaboration Hub</h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold text-base mt-1">Find peers at University of Hyderabad and collaborate.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all">
           <Globe className="text-blue-600 dark:text-blue-500 animate-pulse" size={18} />
           Global Networking • WE Space
        </div>
      </header>

      {/* 2. STATS SECTION (Using your StatsOverview) */}
      <StatsOverview 
        taskCount={peers.length} 
        overdueCount={rooms.length} 
        cgpa="94%" // Simulated Matching Average
      />

      {/* 3. THE 4-BLOCK GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8 Units) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* BLOCK 1: PEER DISCOVERY */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 p-6 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Users className="text-blue-600 dark:text-blue-500" /> Matched Peers
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search skills..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl text-xs dark:text-white outline-none border border-transparent dark:focus:border-slate-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peers.map(peer => (
                <PeerCard 
                  key={peer.id} 
                  peer={peer} 
                  myTags={myTags} 
                  onMessage={(p) => { setSelectedPeer(p); setIsChatOpen(true); }} 
                />
              ))}
            </div>
          </section>

          {/* BLOCK 2: STUDY ROOMS */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 p-6 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Video className="text-purple-600 dark:text-purple-500" /> Study Rooms
              </h2>
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95">
                <PlusCircle size={16} /> Create Room
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="group p-5 border border-slate-100 dark:border-slate-700/50 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-2">
                    <span>{room.category}</span>
                    <span>{room.participants}/{room.max}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{room.topic}</h3>
                  <button 
                    onClick={() => setActiveRoom(room)}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800/50 text-orange-600 dark:text-orange-400 rounded-xl text-xs font-bold hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 Units) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* BLOCK 3: CONNECTION REQUESTS */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 p-6 transition-all duration-500">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="text-blue-600 dark:text-blue-500" size={16} /> Connection Requests
            </h2>
            <div className="space-y-3">
              {peers.filter(p => p.connectionStatus === 'received').map(p => (
                <div key={p.id} className="p-3 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                  <button className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/20 text-white rounded-lg text-[10px] font-bold hover:shadow-orange-500/40 transition-shadow active:scale-95">Accept</button>
                </div>
              ))}
            </div>
          </section>

          {/* BLOCK 4: RECENT COLLABORATIONS / CHATS */}
          <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 p-6 transition-all duration-500">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Collaborators</h2>
            <div className="space-y-4">
              {peers.filter(p => p.connectionStatus === 'connected').map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* OVERLAYS */}
      {activeRoom && <StudyRoomLive room={activeRoom} onLeave={() => setActiveRoom(null)} />}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} peerName={selectedPeer?.name} />
    </div>
  );
}
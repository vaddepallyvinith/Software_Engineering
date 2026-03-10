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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Collaboration Hub</h1>
          <p className="text-slate-500 font-medium text-sm">Find peers at University of Hyderabad and collaborate.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
           <Globe className="text-indigo-600 animate-pulse" size={18} />
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
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-indigo-600" /> Matched Peers
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search skills..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs outline-none"
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
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Video className="text-purple-600" /> Study Rooms
              </h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <PlusCircle size={16} /> Create Room
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="p-5 border border-slate-50 rounded-2xl bg-slate-50/30">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-2">
                    <span>{room.category}</span>
                    <span>{room.participants}/{room.max}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-4">{room.topic}</h3>
                  <button 
                    onClick={() => setActiveRoom(room)}
                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
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
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="text-indigo-600" size={16} /> Connection Requests
            </h2>
            <div className="space-y-3">
              {peers.filter(p => p.connectionStatus === 'received').map(p => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{p.name}</span>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">Accept</button>
                </div>
              ))}
            </div>
          </section>

          {/* BLOCK 4: RECENT COLLABORATIONS / CHATS */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Collaborators</h2>
            <div className="space-y-4">
              {peers.filter(p => p.connectionStatus === 'connected').map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">{p.name}</p>
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
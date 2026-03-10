import React, { useState } from 'react';
import { Globe, Users, Video, PlusCircle, Search, Filter, Zap } from 'lucide-react';
import PeerCard from '../components/we-space/PeerCard';
import ChatPopup from '../components/we-space/ChatPopup';

// --- SUB-COMPONENT: LIVE STUDY ROOM OVERLAY ---
const StudyRoomLive = ({ room, onLeave }) => (
  <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex flex-col animate-in fade-in duration-300">
    <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        <h2 className="text-white font-black tracking-tight">{room.topic}</h2>
      </div>
      <button 
        onClick={onLeave}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
      >
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



// --- MAIN PAGE COMPONENT ---
export default function WeSpace() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const myTags = ['React', 'Python', 'Machine Learning', 'Tailwind'];

  const [peers] = useState([
    { id: 1, name: 'Bhavani Shankar', tags: ['React', 'PostgreSQL', 'Node.js'], location: 'Hostel K', status: 'Online' },
    { id: 2, name: 'Ananya Rao', tags: ['Python', 'Django', 'ML'], location: 'Library', status: 'Online' },
    { id: 3, name: 'Snehita P.', tags: ['Figma', 'UI/UX', 'Tailwind'], location: 'SCIS Dept', status: 'Away' },
    { id: 4, name: 'Rahul Kumar', tags: ['Java', 'Spring Boot', 'DBMS'], location: 'Hostel L', status: 'Online' }
  ]);

  const [rooms] = useState([
    { id: 101, topic: 'GATE 2026 CS Preparation', participants: 4, max: 10, category: 'Exam Prep' },
    { id: 102, topic: 'Software Engineering Project', participants: 2, max: 5, category: 'Project' },
    { id: 103, topic: 'ML Model Discussion', participants: 8, max: 10, category: 'Research' }
  ]);

  return (
    <div className="space-y-8 pb-12 pr-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. COLLABORATION HEADER */}
      <header className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-10 rounded-[40px] shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <Globe className="text-white animate-pulse" size={28} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">WE Space</h1>
          </div>
          <p className="text-indigo-100 font-medium text-lg max-w-xl leading-relaxed">
            The Global Collaboration Hub. Connect with peers at University of Hyderabad based on your matching academic interests.
          </p>
        </div>
      </header>

      {/* 2. MAIN HUB CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: PEER DISCOVERY (Sub-Module 2.1) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap size={24} className="text-indigo-600" /> Matched Peers
            </h2>
            <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
              <Filter size={20} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by skill (e.g. React)..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {peers.map(peer => (
              <PeerCard 
                key={peer.id} 
                peer={peer} 
                myTags={myTags} 
                onMessage={(p) => { setSelectedPeer(p); setIsChatOpen(true); }} 
              />
            ))}
          </div>
        </div>

        {/* RIGHT: VIRTUAL STUDY ROOMS (Sub-Module 2.2) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Video size={24} className="text-purple-600" /> Study Rooms
            </h2>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
              <PlusCircle size={18} /> Create Room
            </button>
          </div>

          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {room.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                    <Users size={14} /> {room.participants}/{room.max}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-purple-600 transition-colors">
                  {room.topic}
                </h3>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    Quick Chat
                  </button>
                  <button 
                    onClick={() => setActiveRoom(room)}
                    className="flex-1 py-3 bg-purple-100 text-purple-700 rounded-2xl font-bold text-xs hover:bg-purple-600 hover:text-white transition-all active:scale-95"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* OVERLAY COMPONENTS */}
      {activeRoom && <StudyRoomLive room={activeRoom} onLeave={() => setActiveRoom(null)} />}
      <ChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        peerName={selectedPeer?.name} 
      />
    </div>
  );
}
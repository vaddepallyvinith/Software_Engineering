import React, { useState } from 'react';
import { Globe, Users, Video, PlusCircle, Search, Sparkles, Zap, MapPin, ExternalLink, Activity, Hash, MessageCircle, ArrowUpRight } from 'lucide-react';
import ChatPopup from '../components/we-space/ChatPopup';

const StudyRoomLive = ({ room, onLeave }) => (
  <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[100] flex flex-col animate-in zoom-in-95 duration-500">
    <div className="absolute top-0 right-0 w-full h-[50vh] bg-blue-600/10 blur-[150px] pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-orange-600/10 blur-[150px] pointer-events-none"></div>
    
    <div className="relative p-6 bg-transparent flex justify-between items-center z-10 border-b border-white/5 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)] border border-red-500/30">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
        </div>
        <div>
          <h2 className="text-white text-2xl font-black tracking-tighter drop-shadow-md bg-gradient-to-r from-red-200 to-white bg-clip-text text-transparent">{room.topic}</h2>
          <p className="text-red-400 text-xs font-bold tracking-widest uppercase mt-1">Live Study Session</p>
        </div>
      </div>
      <button onClick={onLeave} className="bg-white/10 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 border border-white/10 hover:border-red-400">
        Leave Room
      </button>
    </div>
    
    <div className="flex-1 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
      <div className="lg:col-span-3 bg-black/60 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.5)_2px,transparent_4px)] [background-size:30px_30px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <Video size={72} className="text-blue-500 mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-bounce" style={{ animationDuration: '3s' }} />
        <p className="text-slate-300 font-medium text-lg tracking-wide z-10 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">Waiting for participants to initiate screen share...</p>
      </div>

      <div className="bg-slate-900/60 rounded-[3rem] border border-white/5 p-8 flex flex-col backdrop-blur-md shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <h3 className="text-white font-black text-xl tracking-tight">Participants</h3>
          <span className="bg-blue-500/20 text-blue-400 text-xs font-black px-3 py-1 rounded-full border border-blue-500/30">1 / {room.max}</span>
        </div>
        <div className="flex-1 space-y-4">
          <div className="bg-gradient-to-r from-blue-600/20 to-transparent p-4 rounded-2xl border-l-4 border-l-blue-500 flex items-center gap-4 transition-all hover:bg-blue-500/20">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50">V</div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold">Vinith K.</span>
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Host (You)</span>
            </div>
          </div>
          {/* Skeletons for other participants */}
          {[...Array(room.participants - 1)].map((_, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 opacity-50">
              <div className="w-10 h-10 bg-slate-800 rounded-xl animate-pulse"></div>
              <div className="flex flex-col gap-2">
                <div className="w-24 h-3 bg-slate-800 rounded-full animate-pulse"></div>
                <div className="w-12 h-2 bg-slate-800 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
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

  const [peers] = useState([
    { id: 1, name: 'Bhavani Shankar', tags: ['React', 'Node.js', 'Express'], location: 'Hostel K', connectionStatus: 'none', status: 'Online', match: 94, avatar: 'from-orange-500 to-red-500' },
    { id: 2, name: 'Ananya Rao', tags: ['Python', 'ML', 'TensorFlow'], location: 'Library', connectionStatus: 'received', status: 'Online', match: 88, avatar: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Snehita P.', tags: ['Figma', 'UI/UX', 'Tailwind'], location: 'SCIS Dept', connectionStatus: 'connected', status: 'Away', match: 76, avatar: 'from-fuchsia-500 to-pink-500' },
    { id: 4, name: 'Rahul M.', tags: ['Java', 'Spring', 'SQL'], location: 'Hostel L', connectionStatus: 'none', status: 'Offline', match: 42, avatar: 'from-emerald-500 to-teal-500' }
  ]);

  const rooms = [
    { id: 101, topic: 'GATE 2026 CS Prep', participants: 4, max: 10, category: 'Exam Prep', activity: 'High' },
    { id: 102, topic: 'SE Lab Project Discussion', participants: 2, max: 5, category: 'Project', activity: 'Medium' },
    { id: 103, topic: 'AI Hackathon Brainstorming', participants: 6, max: 15, category: 'Competition', activity: 'Very High' }
  ];

  const filteredPeers = peers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-12 pr-4 animate-in fade-in duration-700 font-sans min-h-[calc(100vh-80px)]">
      
      {/* 1. HERO BANNER - Completely Redesigned */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-12 mb-10 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] group-hover:bg-orange-500/30 transition-colors duration-1000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6">
              <Globe size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Global Collaboration Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
              Connect. Collaborate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Create.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md leading-relaxed">
              Find peers with complementary skills, join live study sessions, and build the future together at UoH.
            </p>
          </div>
          
          <div className="w-full md:w-96 bg-white/10 backdrop-blur-xl p-2 rounded-[2rem] border border-white/20 shadow-2xl flex items-center relative z-20">
            <div className="p-3 text-slate-400"><Search size={24} /></div>
            <input 
              type="text" 
              placeholder="Search by skill, name, or project..." 
              className="bg-transparent border-none outline-none text-white w-full px-2 font-medium placeholder:text-slate-500"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 transition-transform text-white p-4 rounded-full shadow-lg shadow-orange-500/30 ml-2">
              <Sparkles size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Peers & Study Rooms */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* SECTION: AI Matched Peers */}
          <section>
            <div className="flex items-end justify-between mb-6 px-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-500">
                    <Users size={20} />
                  </div>
                  Synergy Matches
                </h2>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">AI-driven peer recommendations based on your tech stack.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 z-10 relative">
              {filteredPeers.filter(p => p.connectionStatus !== 'received' && p.connectionStatus !== 'connected').map(peer => (
                <div key={peer.id} className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-orange-400 to-amber-600 h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-[1.5rem] bg-gradient-to-br ${peer.avatar} flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {peer.name[0]}
                        </div>
                        {peer.status === 'Online' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">{peer.name}</h3>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          <MapPin size={12} className="text-orange-500" /> {peer.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 relative shadow-inner">
                      {/* Fake Circular Progress for Match % */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="20" cy="20" r="18" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-transparent" />
                        <circle cx="20" cy="20" r="18" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (113 * peer.match) / 100} className={`${peer.match > 80 ? 'text-green-500' : 'text-amber-500'} drop-shadow-md`} strokeLinecap="round" />
                      </svg>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{peer.match}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {peer.tags.map((tag, i) => (
                      <span key={i} className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                        <Hash size={12} className="text-orange-400" /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                      <Zap size={16} className="text-yellow-400 dark:text-yellow-600" /> Connect
                    </button>
                    <button 
                      onClick={() => { setSelectedPeer(peer); setIsChatOpen(true); }}
                      className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors active:scale-95"
                    >
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Live Study Rooms */}
          <section>
            <div className="flex items-end justify-between mb-6 px-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-500">
                    <Video size={20} />
                  </div>
                  Live Study Rooms
                </h2>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">Drop in and collaborate with peers instantly.</p>
              </div>
              <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex items-center gap-2 group text-slate-700 dark:text-slate-200">
                <PlusCircle size={18} className="text-blue-500 group-hover:rotate-90 transition-transform duration-300" /> New Room
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {rooms.map(room => (
                <div key={room.id} className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-500/20">
                      {room.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <Activity size={12} className={room.activity === 'Very High' ? 'text-red-500' : 'text-green-500'} />
                      {room.activity}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{room.topic}</h3>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, room.participants))].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${room.id}${i}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {room.participants > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                          +{room.participants - 3}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setActiveRoom(room)}
                      className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Interactive Sidebar Widgets */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Incoming Connections Widget */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping absolute"></span>
              <span className="w-2 h-2 rounded-full bg-orange-500 relative"></span>
              Requests <span className="text-orange-500 ml-auto">1 New</span>
            </h3>
            
            <div className="space-y-4">
              {peers.filter(p => p.connectionStatus === 'received').map(p => (
                <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between group hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-black flex items-center justify-center shadow-sm">
                      {p.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{p.tags[0]} Designer</p>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white w-9 h-9 rounded-full shadow-md shadow-orange-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                    <Zap size={16} className="fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Collaborators Widget */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800">
             <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-widest">
              <Globe size={16} className="text-blue-500" />
              Network
            </h3>
            <div className="flex flex-col gap-1">
              {peers.filter(p => p.connectionStatus === 'connected').map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer" onClick={() => { setSelectedPeer(p); setIsChatOpen(true); }}>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm shadow-fuchsia-500/20">
                      {p.name[0]}
                    </div>
                    {p.status === 'Away' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Last active 2h ago</p>
                  </div>
                  <MessageCircle size={16} className="text-slate-300 dark:text-slate-600" />
                </div>
              ))}
              
              {/* Fake empty slot to show premium UI structure */}
              <div className="flex items-center gap-4 p-3 border border-dashed border-slate-200 dark:border-slate-700/50 rounded-2xl mt-2 opacity-60">
                <div className="w-10 h-10 border border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center text-slate-400 border-dashed">
                  <PlusCircle size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">Grow Network</p>
                  <p className="text-[10px] text-slate-400">Discover more peers</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* OVERLAYS */}
      {activeRoom && <StudyRoomLive room={activeRoom} onLeave={() => setActiveRoom(null)} />}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} peerName={selectedPeer?.name} />
    </div>
  );
}
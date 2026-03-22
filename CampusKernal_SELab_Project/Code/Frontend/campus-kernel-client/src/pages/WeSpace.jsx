import React, { useState } from 'react';
import { Globe, Users, Video, PlusCircle, Search, MapPin, Activity, Hash, MessageCircle, ArrowUpRight } from 'lucide-react';
import ChatPopup from '../components/we-space/ChatPopup';

const StudyRoomLive = ({ room, onLeave }) => (
  <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4 md:p-8">
    <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[800px] rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            {room.topic}
          </h2>
          <p className="text-slate-500 text-xs mt-1">Live Study Session</p>
        </div>
        <button onClick={onLeave} className="bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors">
          Leave Room
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 bg-slate-100 dark:bg-slate-950">
        <div className="lg:flex-[3] bg-black rounded-lg flex items-center justify-center flex-col relative overflow-hidden">
          <Video size={48} className="text-slate-600 mb-4" />
          <p className="text-slate-400 text-sm">Waiting for participants to initiate screen share...</p>
        </div>

        <div className="lg:flex-[1] bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Participants</h3>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-semibold">1 / {room.max}</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-md">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold text-sm">V</div>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Vinith K.</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Host (You)</p>
              </div>
            </div>
            {/* Mock slots */}
            {[...Array(room.participants - 1)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 opacity-50">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
            ))}
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

  const [peers] = useState([
    { id: 1, name: 'Bhavani Shankar', tags: ['React', 'Node.js', 'Express'], location: 'Hostel K', connectionStatus: 'none', status: 'Online', match: 94 },
    { id: 2, name: 'Ananya Rao', tags: ['Python', 'ML', 'TensorFlow'], location: 'Library', connectionStatus: 'received', status: 'Online', match: 88 },
    { id: 3, name: 'Snehita P.', tags: ['Figma', 'UI/UX', 'Tailwind'], location: 'SCIS Dept', connectionStatus: 'connected', status: 'Away', match: 76 },
    { id: 4, name: 'Rahul M.', tags: ['Java', 'Spring', 'SQL'], location: 'Hostel L', connectionStatus: 'none', status: 'Offline', match: 42 }
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
    <div className="max-w-7xl mx-auto pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200">
      
      {/* 1. HERO BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-8 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Connect. Collaborate. Create.</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find peers with complementary skills, join live study sessions, and build the future together.
            </p>
          </div>
          
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-md border border-slate-200 dark:border-slate-700 flex items-center focus-within:ring-2 focus-within:ring-blue-500">
            <div className="px-3 text-slate-400"><Search size={18} /></div>
            <input 
              type="text" 
              placeholder="Search by skill or name..." 
              className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Peers & Study Rooms (span 2) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* SECTION: AI Matched Peers */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={20} className="text-blue-500" /> Synergy Matches
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPeers.filter(p => p.connectionStatus !== 'received' && p.connectionStatus !== 'connected').map(peer => (
                <div key={peer.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg relative">
                        {peer.name[0]}
                        {peer.status === 'Online' && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-50 dark:border-slate-800 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-base">{peer.name}</h3>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {peer.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{peer.match}%</span>
                      <span className="text-[9px] text-slate-500 uppercase mt-0.5">Match</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                    {peer.tags.map((tag, i) => (
                      <span key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                        <Hash size={10} /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Connect
                    </button>
                    <button 
                      onClick={() => { setSelectedPeer(peer); setIsChatOpen(true); }}
                      className="px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded hover:text-blue-600 hover:border-blue-500 transition-colors flex items-center justify-center"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Live Study Rooms */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video size={20} className="text-red-500" /> Live Study Rooms
              </h2>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5">
                <PlusCircle size={14} /> New Room
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded">
                      {room.category}
                    </span>
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${room.activity === 'Very High' ? 'text-red-600 bg-red-100 dark:bg-red-900/20' : 'text-green-600 bg-green-100 dark:bg-green-900/20'}`}>
                      <Activity size={10} /> {room.activity}
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{room.topic}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-semibold">
                      {room.participants} / {room.max} Participants
                    </div>
                    
                    <button 
                      onClick={() => setActiveRoom(room)}
                      className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 border border-blue-200 dark:border-blue-800/50 transition-colors"
                    >
                      Join <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Interactive Sidebar Widgets (span 1) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Incoming Connections Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Requests
            </h3>
            
            <div className="space-y-3">
              {peers.filter(p => p.connectionStatus === 'received').map(p => (
                <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-sm">
                      {p.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-500">{p.tags[0]}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors">
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Collaborators Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Globe size={16} className="text-blue-500" /> Network
            </h3>
            <div className="flex flex-col gap-2">
              {peers.filter(p => p.connectionStatus === 'connected').map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700" onClick={() => { setSelectedPeer(p); setIsChatOpen(true); }}>
                  <div className="relative">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                      {p.name[0]}
                    </div>
                    {p.status === 'Away' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500">Last active 2h ago</p>
                  </div>
                  <MessageCircle size={14} className="text-slate-400" />
                </div>
              ))}
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
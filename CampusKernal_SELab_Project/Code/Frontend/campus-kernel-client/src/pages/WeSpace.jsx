import { useState } from 'react';
import { Users, Video, MessageSquare, PlusCircle, Zap, Globe, Mic, ScreenShare, LogOut, X, Send, Paperclip } from 'lucide-react';

// --- SUB-COMPONENT: LIVE STUDY ROOM ---
const StudyRoomLive = ({ room, onLeave }) => (
  <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col">
    <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
      <div className="flex items-center gap-3">
        <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
        <h2 className="text-white font-bold">{room.topic}</h2>
      </div>
      <button onClick={onLeave} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
        <LogOut size={18} /> Leave Session
      </button>
    </div>
    <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
      <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-slate-500">
         <ScreenShare size={48} className="mb-4 opacity-20" />
         <p className="font-medium italic text-sm">Collaborative Workspace (Simulated Screen Share)</p>
      </div>
      <div className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700 text-white text-sm font-bold flex items-center gap-2">
          <Users size={16} className="text-blue-400" /> Participants ({room.participants}/{room.max})
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-white font-bold border border-blue-500/50">You</div>
          <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">Bhavani S.</div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto text-xs space-y-3 bg-slate-900/50">
          <p className="text-slate-400"><span className="text-blue-400 font-bold">Bhavani:</span> Ready to start the SE discussion?</p>
        </div>
      </div>
    </div>
    <div className="p-4 flex justify-center gap-4 bg-slate-800 border-t border-slate-700">
      <button className="p-3 bg-slate-700 rounded-full text-white"><Mic size={20}/></button>
      <button className="p-3 bg-slate-700 rounded-full text-white"><Video size={20}/></button>
      <button className="p-3 bg-blue-600 rounded-full text-white"><ScreenShare size={20}/></button>
    </div>
  </div>
);

// --- SUB-COMPONENT: CHAT POPUP ---
const ChatPopup = ({ isOpen, onClose, peerName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
        <span className="font-bold text-sm">Chat: {peerName}</span>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <div className="h-64 p-4 bg-gray-50 overflow-y-auto text-sm space-y-2">
        <div className="bg-white p-2 rounded shadow-sm inline-block">Hi! I saw we both like React.</div>
      </div>
      <div className="p-3 border-t flex gap-2">
        <input type="text" placeholder="Type..." className="flex-1 bg-gray-100 rounded-full px-3 py-1 outline-none text-sm" />
        <button className="text-blue-600"><Send size={18}/></button>
      </div>
    </div>
  );
};

// --- MAIN WE SPACE PAGE ---
export default function WeSpace() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [peers] = useState([
    { id: 1, name: 'Bhavani Shankar', tags: ['React', 'PostgreSQL'], match: '95%' },
    { id: 2, name: 'Ananya Rao', tags: ['Machine Learning', 'Python'], match: '88%' }
  ]);

  const [rooms] = useState([
    { id: 101, topic: 'GATE 2026 Preparation', participants: 4, max: 10, category: 'Exam Prep' },
    { id: 102, topic: 'SE Lab Project Discussion', participants: 2, max: 5, category: 'Project' }
  ]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="animate-pulse" />
          <h1 className="text-3xl font-bold">Global Collaboration Hub</h1>
        </div>
        <p className="text-indigo-100 opacity-90">Collaborate with peers at University of Hyderabad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Peer Discovery (Sub-Module 2.1) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-indigo-600" /> Matched Peers
          </h2>
          <div className="space-y-4">
            {peers.map(peer => (
              <div key={peer.id} className="p-4 border rounded-lg hover:border-indigo-300 group transition-all">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{peer.name}</span>
                  <span className="text-xs font-bold text-green-500 flex items-center gap-1"><Zap size={12}/>{peer.match}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {peer.tags.map(t => <span key={t} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{t}</span>)}
                </div>
                <button onClick={() => { setSelectedPeer(peer); setIsChatOpen(true); }} className="w-full mt-3 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition-all">
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Study Rooms (Sub-Module 2.2) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Video className="text-purple-600" /> Active Study Rooms
            </h2>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><PlusCircle size={18}/> Create</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map(room => (
              <div key={room.id} className="border-2 border-dashed border-gray-200 p-5 rounded-xl hover:border-purple-400">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-purple-500 uppercase">{room.category}</span>
                  <span className="text-gray-400">{room.participants}/{room.max} Joined</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-4">{room.topic}</h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-bold">Chat</button>
                  <button onClick={() => setActiveRoom(room)} className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-bold">Join Room</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay Components */}
      {activeRoom && <StudyRoomLive room={activeRoom} onLeave={() => setActiveRoom(null)} />}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} peerName={selectedPeer?.name} />
    </div>
  );
}
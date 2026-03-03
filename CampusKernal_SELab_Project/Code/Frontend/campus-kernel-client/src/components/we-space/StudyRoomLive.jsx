import { Video, Mic, ScreenShare, MessageSquare, Users, LogOut } from 'lucide-react';

export default function StudyRoomLive({ roomTopic, onLeave }) {
  return (
    <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col">
      {/* Room Header */}
      <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse"></div>
          <h2 className="text-white font-bold">{roomTopic}</h2>
        </div>
        <button 
          onClick={onLeave}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut size={18} /> Leave Session
        </button>
      </div>

      {/* Main Grid: Video/Collaboration Area */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        
        {/* Main Workspace (e.g., Shared Code or Document) */}
        <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-slate-500">
           <ScreenShare size={48} className="mb-4 opacity-20" />
           <p className="font-medium italic">Shared Workspace (Simulated Screen Share)</p>
        </div>

        {/* Participants & Chat Sidebar */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <Users size={16} className="text-blue-400" /> Participants (3/10)
            </h3>
          </div>
          
          {/* Mock Video Feeds */}
          <div className="p-4 grid grid-cols-2 gap-2">
            <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-white font-bold border border-blue-500/50">You</div>
            <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">Bhavani S.</div>
            <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">Ananya R.</div>
          </div>

          {/* Room Chat */}
          <div className="flex-1 p-4 overflow-y-auto text-xs space-y-3 bg-slate-900/50">
            <p className="text-slate-400"><span className="text-blue-400 font-bold">Bhavani:</span> Let's check the ER diagram.</p>
            <p className="text-slate-400"><span className="text-purple-400 font-bold">Ananya:</span> I'm uploading the schema now.</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-6 flex justify-center gap-4 bg-slate-800 border-t border-slate-700">
        <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all"><Mic /></button>
        <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all"><Video /></button>
        <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-all"><ScreenShare /></button>
        <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all"><MessageSquare /></button>
      </div>
    </div>
  );
}
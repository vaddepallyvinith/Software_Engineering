import React from 'react';
import { Zap, MessageSquare, MapPin } from 'lucide-react';

export default function PeerCard({ peer, myTags, onMessage }) {
  // Logic: Calculate overlap with current user's skills
  const commonTags = peer.tags.filter(tag => myTags.includes(tag));
  const matchScore = Math.round((commonTags.length / myTags.length) * 100);

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-200">
              {peer.name[0]}
            </div>
            {peer.status === 'Online' && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
              {peer.name}
            </h4>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <MapPin size={10} /> {peer.location}
            </p>
          </div>
        </div>

        <div className={`px-2 py-1 rounded-lg flex items-center gap-1 border ${
          matchScore > 50 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-500'
        }`}>
          <Zap size={10} fill="currentColor" />
          <span className="text-[10px] font-black">{matchScore}%</span>
        </div>
      </div>

      {/* Skills / Tags Section */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {peer.tags.map(tag => {
          const isMatch = myTags.includes(tag);
          return (
            <span 
              key={tag} 
              className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                isMatch 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
              }`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* Action Button */}
      <button 
        onClick={() => onMessage(peer)}
        className="w-full py-2.5 bg-slate-50 text-indigo-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all active:scale-95"
      >
        <MessageSquare size={14} />
        Send Message
      </button>
    </div>
  );
}
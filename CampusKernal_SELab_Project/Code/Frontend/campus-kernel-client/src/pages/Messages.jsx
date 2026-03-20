import { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck, Smile, Paperclip, Mic, MessageSquare, PlusCircle } from 'lucide-react';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [contacts] = useState([
    { id: 1, name: 'Bhavani Shankar', lastMsg: 'The SE Lab report is ready!', time: '10:45 AM', online: true, unread: 2, avatar: 'from-orange-500 to-red-500' },
    { id: 2, name: 'Ananya Rao', lastMsg: 'Did you check the ML notes?', time: 'Yesterday', online: true, unread: 0, avatar: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Rahul K.', lastMsg: 'See you at the study room.', time: 'Monday', online: false, unread: 0, avatar: 'from-emerald-500 to-teal-500' },
    { id: 4, name: 'Snehita P.', lastMsg: 'Can we use Tailwind for the project?', time: 'Friday', online: false, unread: 0, avatar: 'from-fuchsia-500 to-pink-500' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Are we meeting today?", time: "10:30 AM", sender: "them" },
    { id: 2, text: "Yes, after the 2 PM lecture.", time: "10:32 AM", sender: "me" },
    { id: 3, text: "The SE Lab report is ready!", time: "10:45 AM", sender: "them" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      text: newMessage, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      sender: "me" 
    }]);
    setNewMessage('');
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <div className="pb-12 pr-4 animate-in fade-in duration-700 font-sans min-h-[calc(100vh-80px)]">
      
      {/* 1. HERO BANNER - WeSpace/MeSpace Premium Style */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-12 mb-10 border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[100px] group-hover:bg-pink-500/30 transition-colors duration-1000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6 shadow-sm shadow-fuchsia-500/10">
              <MessageSquare size={14} className="text-fuchsia-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Direct Communications</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
              Network & <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500">Connect.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md leading-relaxed">
              Message your peers, coordinate study sessions, and stay in touch instantly.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-center justify-center py-6 px-10 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl relative z-20 hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-0 rounded-[2rem] border border-fuchsia-500/30 animate-pulse" style={{ animationDuration: '3s' }}></div>
             <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-pink-500 mb-2 drop-shadow-lg">{messages.filter(m=>m.sender==='them').length}</div>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <MessageSquare size={14} className="text-fuchsia-500" /> New Messages
             </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CHAT INTERFACE - Glassmorphic Layout */}
      <div className="flex flex-col xl:flex-row gap-8 h-[70vh] min-h-[600px]">
        
        {/* LEFT SIDEBAR: Contacts */}
        <div className="w-full xl:w-[380px] shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-fuchsia-500/5 border border-white/80 dark:border-slate-800/80 flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>

          <div className="p-6 pb-2 relative z-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Inbox</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm dark:text-white outline-none border border-white/40 dark:border-slate-700/50 focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 mt-2 space-y-1 custom-scrollbar relative z-10">
            {filteredContacts.length > 0 ? filteredContacts.map(contact => (
              <button 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`w-full p-3.5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                  activeChat === contact.id 
                    ? 'bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 dark:from-fuchsia-500/20 dark:to-pink-500/5 shadow-inner border border-fuchsia-500/20' 
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white font-bold text-lg shadow-md bg-gradient-to-br ${contact.avatar} transition-transform ${activeChat === contact.id ? 'scale-105 ring-2 ring-fuchsia-500/20' : ''}`}>
                    {contact.name[0]}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                  )}
                </div>
                
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className={`font-bold text-sm truncate transition-colors ${activeChat === contact.id ? 'text-fuchsia-700 dark:text-fuchsia-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {contact.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-xs truncate transition-colors ${activeChat === contact.id ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                      {contact.lastMsg}
                    </p>
                    {contact.unread > 0 && (
                      <span className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md shadow-fuchsia-500/30 shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )) : (
              <div className="text-center font-medium text-slate-400 dark:text-slate-600 mt-10 text-sm">No chats found.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Active Chat Thread */}
        <div className="flex-1 flex flex-col bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-slate-300/30 dark:shadow-none border border-white/80 dark:border-slate-800 overflow-hidden relative">
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/5 rounded-full blur-[100px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.4] mix-blend-overlay dark:opacity-[0.2]"></div>
          </div>

          {/* Chat Header */}
          <div className="px-6 py-5 border-b border-white/60 dark:border-slate-800/60 flex justify-between items-center bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white font-black text-lg shadow-md bg-gradient-to-br ${activeContact?.avatar}`}>
                  {activeContact?.name[0]}
                </div>
                {activeContact?.online && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{activeContact?.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  {activeContact?.online ? (
                    <>
                      <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase mb-0">Online Now</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="text-[10px] font-bold text-slate-500">UoH Network</span>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Offline</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 p-1 rounded-2xl border border-white/50 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <button className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-slate-500 hover:text-fuchsia-500 hover:bg-white dark:hover:bg-slate-800 transition-all">
                <Search size={18} />
              </button>
              <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
              <button className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 z-10 custom-scrollbar flex flex-col">
            <div className="text-center my-4">
              <span className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700/50 inline-block">
                Today
              </span>
            </div>

            {messages.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {!isMe && (
                      <div className={`w-8 h-8 rounded-[0.8rem] flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-auto mb-1 bg-gradient-to-br ${activeContact?.avatar} shadow-sm`}>
                        {activeContact?.name[0]}
                      </div>
                    )}

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-3.5 shadow-sm transition-all hover:shadow-md ${
                        isMe 
                          ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-[1.5rem] rounded-br-sm shadow-fuchsia-500/20' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-[1.5rem] rounded-bl-sm border border-slate-100 dark:border-slate-700'
                      }`}>
                        <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 mt-1.5 px-2 text-[10px] font-bold tracking-wide ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                        {msg.time}
                        {isMe && <CheckCheck size={14} className="text-fuchsia-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-t border-white/60 dark:border-slate-800/60 z-10">
            <form onSubmit={handleSend} className="relative flex items-center gap-3 bg-white dark:bg-slate-900 rounded-[2rem] p-2 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-fuchsia-500/30 transition-colors focus-within:border-fuchsia-500/50 focus-within:ring-4 focus-within:ring-fuchsia-500/10">
              
              <button type="button" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-fuchsia-500 transition-colors shrink-0 m-1">
                <PlusCircle size={20} />
              </button>

              <div className="flex-1 py-1 px-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-200 text-base outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-400">
                <button type="button" className="p-2.5 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden sm:block">
                  <Smile size={20} />
                </button>
                <button type="button" className="p-2.5 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden sm:block">
                  <Paperclip size={20} />
                </button>
              </div>

              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 m-1 ${
                  newMessage.trim() 
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 hover:scale-105 active:scale-95' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
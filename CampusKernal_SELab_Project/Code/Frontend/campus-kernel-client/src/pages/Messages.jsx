import { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck, PlusCircle, Smile, Image as ImageIcon } from 'lucide-react';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  // Contacts
  const [contacts] = useState([
    { id: 1, name: 'Bhavani Shankar', lastMsg: 'The SE Lab report is ready!', time: '10:45 AM', online: true, unread: 2, avatar: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { id: 2, name: 'Ananya Rao', lastMsg: 'Did you check the ML notes?', time: 'Yesterday', online: true, unread: 0, avatar: 'bg-gradient-to-br from-blue-400 to-indigo-500' },
    { id: 3, name: 'Rahul K.', lastMsg: 'See you at the study room.', time: 'Monday', online: false, unread: 0, avatar: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { id: 4, name: 'Snehita P.', lastMsg: 'Can we use Tailwind for the project?', time: 'Friday', online: false, unread: 0, avatar: 'bg-gradient-to-br from-purple-400 to-pink-500' },
  ]);

  // Messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Are we meeting today?", time: "10:30 AM", sender: "them" },
    { id: 2, text: "Yes, after the 2 PM lecture.", time: "10:32 AM", sender: "me" },
    { id: 3, text: "The SE Lab report is ready, let me know when you want to review it together.", time: "10:45 AM", sender: "them" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: "me" 
    }]);
    setNewMessage('');
  };

  const activeContact = contacts.find(c => c.id === activeChat);

  return (
    <div className="h-[calc(100vh-80px)] w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 pr-4">
      
      {/* SIDEBAR - CONTACTS */}
      <div className="w-full md:w-80 flex flex-col gap-6 shrink-0 h-[40vh] md:h-full">
        {/* Header Options */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl shadow-indigo-500/5 border border-white/50 dark:border-slate-800/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 relative z-10">Chat</h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 relative z-10">You have <span className="text-orange-600 dark:text-orange-400">2 new</span> messages</p>
          
          <div className="mt-6 relative z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl text-sm dark:text-white outline-none border border-white/40 dark:border-slate-800 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-indigo-500/5 border border-white/50 dark:border-slate-800/50 overflow-hidden flex flex-col relative">
          <div className="p-3 overflow-y-auto flex-1 space-y-1 z-10 custom-scrollbar">
            {contacts.map(contact => (
              <button 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`w-full p-3.5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                  activeChat === contact.id 
                    ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/5 shadow-inner' 
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${contact.avatar} transition-transform ${activeChat === contact.id ? 'scale-105 ring-4 ring-orange-500/20' : ''}`}>
                    {contact.name[0]}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                  )}
                </div>
                
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className={`font-bold text-sm truncate transition-colors ${activeChat === contact.id ? 'text-orange-700 dark:text-orange-400' : 'text-slate-900 dark:text-slate-100'}`}>
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
                      <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md shadow-orange-500/30 shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-slate-300/30 dark:shadow-none border border-white/80 dark:border-slate-800 overflow-hidden relative min-h-[500px]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.4] mix-blend-overlay dark:opacity-[0.2]"></div>
        </div>

        {/* Chat Header */}
        <div className="px-6 py-5 border-b border-white/60 dark:border-slate-800/60 flex justify-between items-center bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${activeContact?.avatar}`}>
                {activeContact?.name[0]}
              </div>
              {activeContact?.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{activeContact?.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {activeContact?.online ? (
                  <>
                    <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">Online Now</span>
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
            <button className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-slate-500 hover:text-orange-500 hover:bg-white dark:hover:bg-slate-800 transition-all">
              <Phone size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-slate-500 hover:text-orange-500 hover:bg-white dark:hover:bg-slate-800 transition-all">
              <Video size={18} />
            </button>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 z-10 custom-scrollbar flex flex-col">
          <div className="text-center my-4">
            <span className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700/50 inline-block">
              Today
            </span>
          </div>

          {messages.map((msg, idx) => {
            const isMe = msg.sender === 'me';
            return (
               // Added specific animation delay to each message for staggered loading feel
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {!isMe && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-auto mb-1 ${activeContact?.avatar} shadow-sm`}>
                      {activeContact?.name[0]}
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Distinct message bubbles with elegant typography and shapes */}
                    <div className={`px-5 py-3.5 shadow-sm transition-all hover:shadow-md ${
                      isMe 
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-[1.5rem] rounded-br-sm shadow-orange-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-[1.5rem] rounded-bl-sm border border-slate-100 dark:border-slate-700'
                    }`}>
                      <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                    </div>
                    
                    <div className={`flex items-center gap-1.5 mt-1.5 px-2 text-[10px] font-bold tracking-wide ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.time}
                      {isMe && <CheckCheck size={14} className="text-orange-500" />}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-t border-white/60 dark:border-slate-800/60 z-10">
          <form onSubmit={handleSend} className="relative flex items-center gap-3 bg-white dark:bg-slate-900 rounded-[2rem] p-2 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-orange-500/30 transition-colors focus-within:border-orange-500/50 focus-within:ring-4 focus-within:ring-orange-500/10">
            
            <button type="button" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-orange-500 transition-colors shrink-0 m-1">
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
                <ImageIcon size={20} />
              </button>
            </div>

            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 m-1 ${
                newMessage.trim() 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
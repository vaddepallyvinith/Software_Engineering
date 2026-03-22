import { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck, PlusCircle } from 'lucide-react';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  // Dummy Data for Contacts (Sub-Module 2.3)
  const [contacts] = useState([
    { id: 1, name: 'Bhavani Shankar', lastMsg: 'The SE Lab report is ready!', time: '10:45 AM', online: true, unread: 2 },
    { id: 2, name: 'Ananya Rao', lastMsg: 'Did you check the ML notes?', time: 'Yesterday', online: true, unread: 0 },
    { id: 3, name: 'Rahul K.', lastMsg: 'See you at the study room.', time: 'Monday', online: false, unread: 0 },
  ]);

  // Dummy Data for Message History
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Are we meeting today?", time: "10:30 AM", sender: "them" },
    { id: 2, text: "Yes, after the 2 PM lecture.", time: "10:32 AM", sender: "me" },
    { id: 3, text: "The SE Lab report is ready!", time: "10:45 AM", sender: "them" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add new message to the local state
    setMessages([...messages, { 
      id: Date.now(), 
      text: newMessage, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      sender: "me" 
    }]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/50 dark:border-slate-800 overflow-hidden flex transition-all duration-500">
      
      {/* --- CONTACT LIST SIDEBAR --- */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white/50 dark:bg-slate-900/50">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl text-xs dark:text-white outline-none border border-transparent dark:focus:border-slate-700 focus:ring-2 focus:ring-blue-500/50 transition-all" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <button 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 ${
                activeChat === contact.id ? 'bg-blue-50/50 dark:bg-slate-800 border-l-4 border-l-blue-600 dark:border-l-blue-500' : 'border-l-4 border-l-transparent'
              }`}
              >
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                  {contact.name[0]}
                </div>
                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{contact.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{contact.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- ACTIVE CHAT WINDOW --- */}
      <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-900/30">
        {/* Chat Header */}
        <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/20 rounded-full flex items-center justify-center font-bold text-white">
              {contacts.find(c => c.id === activeChat)?.name[0]}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{contacts.find(c => c.id === activeChat)?.name}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <Phone size={18} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" />
            <Video size={18} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" />
            <MoreVertical size={18} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-2 rounded-2xl text-sm ${
                  msg.sender === 'me' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md shadow-blue-500/20 rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  {msg.time} {msg.sender === 'me' && <CheckCheck size={12} className="text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 backdrop-blur-md flex items-center gap-4">
          <button type="button" className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <PlusCircle size={24} />
          </button>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 dark:text-white rounded-xl px-4 py-3 text-sm outline-none border border-transparent dark:focus:border-slate-700 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 p-3 rounded-xl text-white transition-all active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
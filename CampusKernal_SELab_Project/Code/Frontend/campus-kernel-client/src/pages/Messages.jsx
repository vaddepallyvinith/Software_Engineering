import { useState } from 'react';
import { Send, Search, MoreVertical, CheckCheck, Smile, Paperclip, PlusCircle, MessageSquare } from 'lucide-react';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [contacts] = useState([
    { id: 1, name: 'Bhavani Shankar', lastMsg: 'The SE Lab report is ready!', time: '10:45 AM', online: true, unread: 2 },
    { id: 2, name: 'Ananya Rao', lastMsg: 'Did you check the ML notes?', time: 'Yesterday', online: true, unread: 0 },
    { id: 3, name: 'Rahul K.', lastMsg: 'See you at the study room.', time: 'Monday', online: false, unread: 0 },
    { id: 4, name: 'Snehita P.', lastMsg: 'Can we use Tailwind for the project?', time: 'Friday', online: false, unread: 0 },
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
    <div className="max-w-7xl mx-auto pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200">
      
      {/* 1. HERO BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded mb-4 text-slate-700 dark:text-slate-300">
              <MessageSquare size={16} className="text-blue-500" />
              <span className="text-sm font-semibold">Direct Communications</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Network & Connect</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Message your peers, coordinate study sessions, and stay in touch instantly.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
             <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{messages.filter(m=>m.sender==='them').length}</div>
             <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
               <MessageSquare size={16} /> New Messages
             </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CHAT INTERFACE */}
      <div className="flex flex-col xl:flex-row gap-6 h-[70vh] min-h-[600px]">
        
        {/* LEFT SIDEBAR: Contacts */}
        <div className="w-full xl:w-[320px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Inbox</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filteredContacts.length > 0 ? filteredContacts.map(contact => (
              <button 
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`w-full p-3 rounded-md flex items-center gap-3 transition-colors mb-1 border outline-none ${
                  activeChat === contact.id 
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {contact.name[0]}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`font-semibold text-sm truncate ${activeChat === contact.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      {contact.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${activeChat === contact.id ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'} font-medium`}>
                      {contact.lastMsg}
                    </p>
                    {contact.unread > 0 && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )) : (
              <div className="text-center text-slate-500 mt-6 text-sm">No chats found.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Active Chat Thread */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">
                {activeContact?.name[0]}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{activeContact?.name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {activeContact?.online ? (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">Offline</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Search size={16} />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
            <div className="text-center my-4">
              <span className="text-xs font-semibold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded">
                Today
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <div className={`px-4 py-2.5 shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-lg rounded-tr-none border border-blue-700' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-500 font-semibold">
                      {msg.time}
                      {isMe && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              
              <button type="button" className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors bg-slate-100 dark:bg-slate-800 rounded">
                <PlusCircle size={18} />
              </button>

              <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-3">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-transparent text-slate-900 dark:text-white text-sm outline-none py-2"
                />
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Smile size={16} />
                </button>
                <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Paperclip size={16} />
               </button>
              </div>

              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-md transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck } from 'lucide-react';

export default function Messages() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const [contacts] = useState([
    { id: 1, name: 'Bhavani Shankar', lastMsg: 'The SE Lab report is ready!', time: '10:45 AM', online: true, unread: 2 },
    { id: 2, name: 'Ananya Rao', lastMsg: 'Did you check the ML notes?', time: 'Yesterday', online: true, unread: 0 },
    { id: 3, name: 'Rahul K.', lastMsg: 'See you at the study room.', time: 'Monday', online: false, unread: 0 },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Are we meeting today?", time: "10:30 AM", sender: "them" },
    { id: 2, text: "Yes, after the 2 PM lecture.", time: "10:32 AM", sender: "me" },
    { id: 3, text: "The SE Lab report is ready!", time: "10:45 AM", sender: "them" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, time: "Just now", sender: "me" }]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
      
      {/* 1. CONTACT LIST SIDEBAR */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <button 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeChat === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                  {contact.name[0]}
                </div>
                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-gray-900">{contact.name}</span>
                  <span className="text-[10px] text-gray-400">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE CHAT AREA */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">B</div>
            <div>
              <p className="font-bold text-sm text-gray-900">Bhavani Shankar</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Phone size={20} className="hover:text-blue-600 cursor-pointer" />
            <Video size={20} className="hover:text-blue-600 cursor-pointer" />
            <MoreVertical size={20} className="hover:text-blue-600 cursor-pointer" />
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.time} {msg.sender === 'me' && <CheckCheck size={12} className="text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t flex items-center gap-4">
          <button type="button" className="text-gray-400 hover:text-blue-600"><PlusCircle size={24} /></button>
          <input 
            type="text" 
            placeholder="Write a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button type="submit" className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 transition-colors">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
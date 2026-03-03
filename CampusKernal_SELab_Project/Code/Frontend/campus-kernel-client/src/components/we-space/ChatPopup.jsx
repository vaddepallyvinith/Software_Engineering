import { useState } from 'react';
import { Send, X, Smile, Paperclip } from 'lucide-react';

export default function ChatPopup({ isOpen, onClose, peerName }) {
  if (!isOpen) return null;

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hey Vinith, want to study for the SE Lab?", sender: "peer" },
    { id: 2, text: "Sure! I just finished the Task Tracker module.", sender: "me" }
  ]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { id: Date.now(), text: message, sender: "me" }]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm">{peerName}</span>
        </div>
        <button onClick={onClose} className="hover:text-red-400"><X size={18} /></button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {chatHistory.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
              msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t flex items-center gap-2">
        <button type="button" className="text-gray-400 hover:text-gray-600"><Paperclip size={18} /></button>
        <input 
          type="text" placeholder="Type a message..." value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button type="submit" className="text-blue-600 hover:text-blue-800"><Send size={18} /></button>
      </form>
    </div>
  );
}
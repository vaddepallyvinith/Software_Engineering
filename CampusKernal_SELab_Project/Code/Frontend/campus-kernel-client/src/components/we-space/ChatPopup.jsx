import { useState } from 'react';
import { Send, X, Paperclip } from 'lucide-react';

export default function ChatPopup({ isOpen, onClose, peerName }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hey Vinith, want to study for the SE Lab?", sender: "peer" },
    { id: 2, text: "Sure! I just finished the Task Tracker module.", sender: "me" }
  ]);

  if (!isOpen) return null;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { id: Date.now(), text: message, sender: "me" }]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-slate-900 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden z-50 font-sans">
      {/* Header */}
      <div className="bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-sm">{peerName}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X size={16} /></button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-white dark:bg-slate-950">
        {chatHistory.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-md text-sm shadow-sm ${
              msg.sender === 'me' 
                ? 'bg-blue-600 text-white border border-blue-700' 
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 bg-slate-50 dark:bg-slate-900">
        <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><Paperclip size={16} /></button>
        <input 
          type="text" placeholder="Type a message..." value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-white dark:bg-slate-950 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
        <button type="submit" className="text-blue-600 hover:text-blue-700 transition-colors"><Send size={16} /></button>
      </form>
    </div>
  );
}
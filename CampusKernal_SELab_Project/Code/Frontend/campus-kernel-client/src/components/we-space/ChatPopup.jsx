import { useEffect, useRef, useState } from 'react';
import { Send, X, Paperclip } from 'lucide-react';
import io from 'socket.io-client';
import api from '../../services/api';

export default function ChatPopup({ isOpen, onClose, peer }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const socketRef = useRef(null);

  const appendUniqueMessage = (incomingMessage) => {
    setChatHistory((prev) => {
      const incomingSenderId = incomingMessage.sender?._id || incomingMessage.sender;
      const incomingReceiverId = incomingMessage.receiver?._id || incomingMessage.receiver;

      const exists = prev.some((existingMessage) => {
        const existingSenderId = existingMessage.sender?._id || existingMessage.sender;
        const existingReceiverId = existingMessage.receiver?._id || existingMessage.receiver;

        if (incomingMessage._id && existingMessage._id === incomingMessage._id) return true;

        return (
          existingSenderId === incomingSenderId &&
          existingReceiverId === incomingReceiverId &&
          existingMessage.text === incomingMessage.text &&
          existingMessage.createdAt === incomingMessage.createdAt
        );
      });

      return exists ? prev : [...prev, incomingMessage];
    });
  };

  useEffect(() => {
    if (!isOpen || !peer?.id) return;

    const init = async () => {
      const [meRes, messagesRes] = await Promise.all([
        api.get('/me'),
        api.get(`/messages/${peer.id}`)
      ]);
      setCurrentUser(meRes.data.user);
      setChatHistory(messagesRes.data);

      const socket = io('http://localhost:5001');
      socketRef.current = socket;
      socket.emit('join', meRes.data.user._id);
      socket.on('receive_message', (incoming) => {
        const senderId = incoming.sender?._id || incoming.sender;
        const receiverId = incoming.receiver?._id || incoming.receiver;
        if (senderId === peer.id || receiverId === peer.id) {
          appendUniqueMessage(incoming);
        }
      });
    };

    init().catch((error) => console.error('Chat popup init failed', error));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isOpen, peer?.id]);

  if (!isOpen) return null;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !peer?.id) return;
    socketRef.current?.emit('send_message', {
      sender: currentUser._id,
      receiver: peer.id,
      text: message,
    });
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-slate-900 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden z-50 font-sans">
      {/* Header */}
      <div className="bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-sm">{peer?.name || 'Peer'}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><X size={16} /></button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-white dark:bg-slate-950">
        {chatHistory.map(msg => {
          const senderId = msg.sender?._id || msg.sender;
          const isMe = senderId === currentUser?._id;
          return (
          <div key={msg._id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-md text-sm shadow-sm ${
              isMe
                ? 'bg-blue-600 text-white border border-blue-700' 
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        )})}
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

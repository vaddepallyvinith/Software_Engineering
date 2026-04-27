import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, CheckCheck, Smile, Paperclip, PlusCircle, MessageSquare } from 'lucide-react';
import io from 'socket.io-client';
import api from '../services/api';

export default function Messages() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  
  const socketRef = useRef(null);
  const activeChatRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Connect socket and fetch initial data
  useEffect(() => {
    socketRef.current = io(`http://${window.location.hostname}:5001`);

    const initialize = async () => {
      try {
        const userRes = await api.get('/me');
        const myId = userRes.data.user._id;
        setCurrentUser(userRes.data.user);
        
        socketRef.current.emit('join', myId);

        const contactRes = await api.get('/messages/contacts');
        setContacts(contactRes.data);

        // Fetch suggested synergy matches for the new UI component
        const matchRes = await api.get('/synergy/matches');
        setSuggestedMatches(matchRes.data);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    initialize();

    const handleMessage = (newMsg) => {
      const peerId = activeChatRef.current;
      
      const sId = newMsg.sender?._id || newMsg.sender?.toString() || newMsg.sender;
      const rId = newMsg.receiver?._id || newMsg.receiver?.toString() || newMsg.receiver;
      
      if (sId === peerId || rId === peerId) {
        setMessages(prev => {
           // Prevent duplicates if we already added it optimistically
           if (prev.some(m => m._id === newMsg._id || m.text === newMsg.text)) return prev;
           return [...prev, newMsg];
        });
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        
        // If we are actively reading a message sent by them, mark as read
        if (sId === peerId) {
            socketRef.current?.emit('mark_read', { sender: sId, receiver: rId });
        }
      }
      
      setContacts(prev => prev.map(c => {
        if (c.id === sId || c.id === rId) {
          const isUnread = (sId === c.id && c.id !== peerId) ? 1 : 0;
          return { ...c, lastMsg: newMsg.text, time: newMsg.createdAt, unread: (c.unread || 0) + isUnread };
        }
        return c;
      }));
    };

    socketRef.current.on('receive_message', handleMessage);
    
    socketRef.current.on('messages_read', (readerId) => {
      if (activeChatRef.current === readerId) {
         setMessages(prev => prev.map(m => m.receiver === readerId ? { ...m, read: true } : m));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Fetch history when clicking a contact
  useEffect(() => {
    if (!activeChat) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${activeChat}`);
        setMessages(res.data);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } catch(err) {
        console.error("History fetch error:", err);
      }
    };
    fetchHistory();
    
    if (currentUser) {
       socketRef.current?.emit('mark_read', { sender: activeChat, receiver: currentUser._id });
       setMessages(prev => prev.map(m => m.sender === activeChat ? { ...m, read: true } : m));
       setContacts(prev => prev.map(c => c.id === activeChat ? { ...c, unread: 0 } : c));
    }
  }, [activeChat, currentUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    const payload = {
      _id: Date.now().toString(), // temporary ID
      sender: currentUser._id,
      receiver: activeChat,
      text: newMessage,
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setMessages(prev => [...prev, payload]);
    setContacts(prev => prev.map(c => {
      if (c.id === activeChat) {
        return { ...c, lastMsg: newMessage, time: payload.createdAt };
      }
      return c;
    }));
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    // Emit to backend socket
    socketRef.current.emit('send_message', payload);
    setNewMessage('');
  };

  const filteredContacts = contacts.filter(c => {
    const matchName = c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery.trim().length > 0) {
      return matchName;
    }
    return c.lastMsg !== 'No messages yet';
  });
  
  const handleConnect = async (peerId) => {
    try {
      await api.post(`/synergy/connect/${peerId}`);
      // Optimistically update the suggested peer's connectionStatus
      setSuggestedMatches(prev => prev.map(p => 
        p.id === peerId ? { ...p, connectionStatus: 'sent' } : p
      ));
    } catch(e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to send request.");
    }
  };
  
  const activeContact = contacts.find(c => c.id === activeChat);

  // Helper to format time
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

          {/* Suggested Connections Section */}
          {suggestedMatches.length > 0 && !searchQuery.trim() && (
            <div className="border-b border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Suggested Connections</h3>
              <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {suggestedMatches.map(peer => (
                   <div key={peer.id} className="min-w-[130px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shrink-0 snap-start shadow-sm flex flex-col items-center text-center group transition-all hover:border-slate-300 dark:hover:border-slate-600">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300 mb-2 relative border border-white dark:border-slate-600 shadow-inner">
                        {peer.name?.[0] || '?'}
                        {peer.status === 'Online' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white dark:border-slate-800 rounded-full"></div>}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate w-full">{peer.name}</h4>
                      <p className="text-[10px] text-slate-500 mb-3">{peer.match}% Match</p>
                      <button 
                        onClick={() => handleConnect(peer.id)}
                        disabled={peer.connectionStatus === 'sent'}
                        className={`w-full py-1.5 rounded text-[10px] font-bold transition-all ${
                          peer.connectionStatus === 'sent' 
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20'
                        }`}
                      >
                         {peer.connectionStatus === 'sent' ? 'Pending' : 'Connect'}
                      </button>
                   </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
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
                      {contact.name ? contact.name[0] : '?'}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-left overflow-hidden w-full">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={`font-semibold text-sm truncate ${activeChat === contact.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {contact.name || 'Unknown User'}
                      </span>
                      <div className="flex flex-col items-end shrink-0 pl-2">
                        <span className={`text-[10px] sm:text-xs font-semibold mb-1 ${contact.unread > 0 ? 'text-green-500' : 'text-slate-400'}`}>
                          {formatTime(contact.time)}
                        </span>
                        {contact.unread > 0 && (
                          <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center -mt-2">
                      <p className={`text-xs truncate pr-4 ${activeChat === contact.id ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'} ${contact.unread > 0 ? 'font-bold text-slate-800 dark:text-slate-200' : 'font-medium'}`}>
                        {contact.lastMsg}
                      </p>
                    </div>
                  </div>
                </button>
              ))
             ) : (
                <div className="text-center text-slate-500 mt-6 text-sm">No chats found.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Active Chat Thread */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">
                    {activeContact?.name ? activeContact.name[0] : '?'}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{activeContact?.name || 'User'}</h2>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
                {messages.length === 0 && (
                   <div className="text-center text-slate-400 mt-10">Start the conversation!</div>
                )}
                {messages.map((msg, idx) => {
                  const messageSenderId = msg.sender?._id || msg.sender?.toString?.() || msg.sender;
                  const isMe = messageSenderId === currentUser?._id;
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div className={`px-4 py-2.5 shadow-sm ${
                          isMe 
                            ? 'bg-blue-600 text-white rounded-lg rounded-tr-none border border-blue-700' 
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-500 font-semibold">
                          {formatTime(msg.createdAt)}
                          {isMe && <CheckCheck size={12} className={msg.read ? "text-blue-500" : "text-slate-400"} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-950">
               Select a conversation to start chatting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

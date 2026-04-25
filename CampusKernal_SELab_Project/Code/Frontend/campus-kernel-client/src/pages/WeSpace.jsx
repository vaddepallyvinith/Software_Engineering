import React, { useState, useEffect, useRef } from 'react';
import { Globe, Users, Video, PlusCircle, Search, MapPin, Activity, Hash, MessageCircle, ArrowUpRight, VideoOff, Mic, MicOff, MonitorUp, PhoneOff, Send, Pencil, Trash2 } from 'lucide-react';
import ChatPopup from '../components/we-space/ChatPopup';
import io from 'socket.io-client';
import { useWebRTC } from '../hooks/useWebRTC';
import api from '../services/api';

const PeerVideoBox = ({ stream, name }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="relative w-full h-full bg-slate-800 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]"></video>
      <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white font-semibold text-[10px] px-2 py-1 rounded backdrop-blur">{name || "Peer"}</div>
    </div>
  );
};

const StudyRoomLive = ({ room, onLeave, currentUser, socket }) => {
  const [activeTab, setActiveTab] = useState('participants');
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const videoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  
  // Real WebRTC hook mapped natively to our Socket interface!
  const { peers, replaceVideoTrack } = useWebRTC(socket, room._id, localStream);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareOwner, setScreenShareOwner] = useState(null);

  useEffect(() => {
    let streamRef = null;
    const initMedia = async () => {
      try {
        let stream;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
           stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } else {
           stream = new MediaStream(); 
        }
        streamRef = stream;
        setLocalStream(stream);
        
        if (videoRef.current && stream.getVideoTracks().length > 0) {
          videoRef.current.srcObject = stream;
        }

        // Only explicitly join the room signaling channel once stream states are fully resolved
        if (socket && currentUser) {
            socket.emit('join_study_room', { roomId: room._id, userId: currentUser._id });
        }
      } catch (err) {
        console.error("Media permission denied or unavailable", err);
        const fallbackStream = new MediaStream();
        setLocalStream(fallbackStream);
        if (socket && currentUser) {
            socket.emit('join_study_room', { roomId: room._id, userId: currentUser._id });
        }
      }
    };
    initMedia();
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => t.enabled = videoOn);
      localStream.getAudioTracks().forEach(t => t.enabled = micOn);
    }
  }, [videoOn, micOn, localStream]);

  useEffect(() => {
    if (!socket) return;
    
    const handleStatus = ({ isActive, socketId }) => {
       if (isActive) setScreenShareOwner(socketId);
       else setScreenShareOwner(prev => prev === socketId ? null : prev);
    };
    
    const handleLeave = ({ socketId }) => {
       setScreenShareOwner(prev => prev === socketId ? null : prev);
    };

    socket.on('screen_share_status', handleStatus);
    socket.on('user_left_webrtc', handleLeave);
    
    return () => {
       socket.off('screen_share_status', handleStatus);
       socket.off('user_left_webrtc', handleLeave);
    };
  }, [socket]);

  const handleToggleScreenShare = async () => {
    if (screenShareOwner && screenShareOwner !== socket.id) {
       alert("Someone else is currently sharing their screen!");
       return;
    }

    if (!isScreenSharing) {
       try {
         const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
         const screenTrack = screenStream.getVideoTracks()[0];
         
         screenTrack.onended = () => {
            const camTrack = localStream.getVideoTracks()[0];
            if (videoRef.current) {
              videoRef.current.classList.add('scale-x-[-1]');
              videoRef.current.srcObject = localStream;
            }
            replaceVideoTrack(camTrack);
            setIsScreenSharing(false);
            socket.emit('screen_share_status', { roomId: room._id, isActive: false, socketId: socket.id });
         };

         if (videoRef.current) {
            const newStream = new MediaStream([screenTrack, localStream.getAudioTracks()[0]]);
            videoRef.current.classList.remove('scale-x-[-1]');
            videoRef.current.srcObject = newStream;
         }
         replaceVideoTrack(screenTrack);
         setIsScreenSharing(true);
         socket.emit('screen_share_status', { roomId: room._id, isActive: true, socketId: socket.id });
       } catch(e) { console.error("Screen share err:", e); }
    } else {
       const camTrack = localStream.getVideoTracks()[0];
       if (videoRef.current) {
         videoRef.current.classList.add('scale-x-[-1]');
         videoRef.current.srcObject = localStream;
       }
       replaceVideoTrack(camTrack);
       setIsScreenSharing(false);
       socket.emit('screen_share_status', { roomId: room._id, isActive: false, socketId: socket.id });
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleMsg = (data) => setMessages(prev => [...prev, data]);
    socket.on('room_message', handleMsg);
    return () => socket.off('room_message', handleMsg);
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    socket.emit('room_message', {
      id: Date.now(),
      roomId: room._id,
      senderName: currentUser?.name || 'User',
      text: newMessage,
      time: new Date().toISOString()
    });
    setNewMessage('');
  };

  return (
  <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[800px] rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            {room.topic}
          </h2>
          <p className="text-slate-500 text-xs mt-1">Live Study Session</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 bg-slate-100 dark:bg-slate-950 overflow-hidden">
        
        {/* Left Side: Video Canvas */}
        <div className="lg:flex-[3] bg-black rounded-lg relative overflow-hidden group shadow-inner min-h-[400px]">
          
          {/* DYNAMIC SPATIAL GRID RENDERING ALL PEOPLE CAMERA */}
          <div className={`w-full h-full p-2 grid gap-2 ${Object.keys(peers).length === 0 ? 'grid-cols-1' : Object.keys(peers).length <= 3 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            
            {/* LOCAL FEED */}
            <div className="relative w-full h-full bg-slate-800 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]"></video>
              <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white font-semibold text-[10px] px-2 py-1 rounded backdrop-blur">You</div>
              {!videoOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                   <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center text-slate-500 shadow-lg border border-slate-700">
                     <VideoOff size={32} />
                   </div>
                </div>
              )}
            </div>

            {/* PEER FEEDS (Rendered dynamically as WebRTC mesh populates) */}
            {Object.entries(peers).map(([socketId, stream]) => (
                <PeerVideoBox key={socketId} stream={stream} name={"Peer Member"} />
            ))}

          </div>
          
          {/* Floating Action Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-2xl flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all shadow-xl z-50">
             <button onClick={() => setMicOn(!micOn)} className={`p-4 rounded-full transition-transform hover:scale-105 active:scale-95 ${micOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {micOn ? <Mic size={22} /> : <MicOff size={22} />}
             </button>
             <button onClick={() => setVideoOn(!videoOn)} className={`p-4 rounded-full transition-transform hover:scale-105 active:scale-95 ${videoOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
             </button>
             <button onClick={handleToggleScreenShare} className={`p-4 rounded-full transition-transform hover:scale-105 active:scale-95 ${isScreenSharing ? 'bg-blue-600 text-white' : (screenShareOwner ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-slate-700 text-white hover:bg-slate-600')}`}>
                <MonitorUp size={22} />
             </button>
             <button onClick={onLeave} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 ml-6 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-red-500/20">
                <PhoneOff size={22} />
             </button>
          </div>
        </div>

        {/* Right Side: Tabbed Interface */}
        <div className="lg:flex-[1] bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[800px] shadow-sm">
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <button onClick={() => setActiveTab('participants')} className={`flex-1 p-3.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'participants' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
               Participants ({room.participants?.length || 0})
            </button>
            <button onClick={() => setActiveTab('chat')} className={`flex-1 p-3.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'chat' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
               Room Chat
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-3 relative bg-slate-50 dark:bg-slate-900/50">
            
            {/* TAB: Participants */}
            {activeTab === 'participants' && (
              <>
                {/* Live syncing slots */}
                {room.participants && room.participants.map((person, i) => (
                  <div key={person._id || i} className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600">
                    <div className="w-9 h-9 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold text-sm shadow-inner">
                      {person.name?.[0] || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{person.name} {person._id === currentUser?._id && <span className="text-[10px] text-blue-500 ml-1 font-bold">(You)</span>}</p>
                    </div>
                  </div>
                ))}
                {/* Empty placeholders */}
                {[...Array(Math.max(0, room.maxParticipants - (room.participants?.length || 0)))].map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center gap-3 p-2 opacity-50 border border-transparent">
                    <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* TAB: Chat */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full inset-0 absolute p-4">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                   {messages.map(msg => {
                     const isMe = msg.senderName === currentUser?.name;
                     return (
                       <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                         <p className="text-[10px] font-bold text-slate-500 mb-1 px-1">
                           {isMe ? 'You' : msg.senderName} • {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <div className={`px-3 py-2 rounded-lg text-sm shadow-sm border ${isMe ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                           {msg.text}
                         </div>
                       </div>
                     );
                   })}
                   {messages.length === 0 && (
                     <div className="text-center text-slate-400 text-sm mt-10">No messages yet. Say hello!</div>
                   )}
                </div>
                <form onSubmit={handleSend} className="flex gap-2">
                  <div className="flex-1 relative">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Message room..." className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-md pl-3 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors shadow-sm" />
                  </div>
                  <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 text-white px-3 py-2.5 rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors shadow-sm">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const CreateRoomModal = ({ onClose, onCreated, editingRoom }) => {
  const [topic, setTopic] = useState(editingRoom ? editingRoom.topic : '');
  const [category, setCategory] = useState(editingRoom ? editingRoom.category : 'Study');
  const [max, setMax] = useState(editingRoom ? editingRoom.maxParticipants : 4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRoom) {
         const res = await api.put(`/rooms/${editingRoom._id}`, { topic, category, maxParticipants: Number(max) });
         onCreated(res.data, true); // true = isEdit
      } else {
         const res = await api.post('/rooms', { topic, category, maxParticipants: Number(max) });
         onCreated(res.data, false);
      }
    } catch(err) {
      console.error(err);
    } finally { setIsSubmitting(false) }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{editingRoom ? 'Edit Study Room' : 'Create New Study Room'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic</label>
             <input required value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
             <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700">
               <option>Study</option>
               <option>Coding</option>
               <option>Design</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Participants</label>
             <input type="number" min="2" max="20" value={max} onChange={e => setMax(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" />
           </div>
           <div className="flex gap-2 pt-4">
             <button type="button" onClick={onClose} className="flex-1 py-2 border rounded hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isSubmitting ? 'Saving...' : 'Save Room'}</button>
           </div>
        </form>
      </div>
    </div>
  );
};

const EditSynergyModal = ({ onClose, onSaved, currentUser }) => {
  const [skills, setSkills] = useState(currentUser?.profile?.skills?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
       const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
       const res = await api.put('/me/update', { skills: skillArray });
       onSaved(res.data.user);
    } catch(err) {
       console.error("Error saving skills", err);
    } finally { setIsSubmitting(false) }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Edit Synergy Tags</h2>
        <p className="text-sm text-slate-500 mb-4">Update your skills to discover new dynamic matches!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma-separated)</label>
             <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Python, UI/UX" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="flex gap-2 pt-4">
             <button type="button" onClick={onClose} className="flex-1 py-2 border rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">{isSubmitting ? 'Saving...' : 'Update Matching'}</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default function WeSpace() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSynergyOpen, setIsSynergyOpen] = useState(false);
  
  const [matchPeers, setMatchPeers] = useState([]);
  const [networkPeers, setNetworkPeers] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const roomRes = await api.get('/rooms');
         setRooms(roomRes.data);
         
         if (localStorage.getItem('token')) {
            const [matchesRes, networkRes] = await Promise.all([
               api.get('/synergy/matches'),
               api.get('/synergy/network')
            ]);
            setMatchPeers(matchesRes.data);
            setNetworkPeers(networkRes.data);
         }
      } catch(e) { console.error(e) }
    };
    
    // Attempt load user automatically if null (failsafe if coming from direct navigation)
    if (!currentUser) {
       api.get('/me')
         .then(res => setCurrentUser(res.data.user)).catch(e => console.error(e));
    }
    
    fetchData();

    const newSocket = io('http://localhost:5001');
    socketRef.current = newSocket;

    newSocket.on('room_updated', (updatedRoom) => {
      setRooms(prev => prev.map(r => r._id === updatedRoom._id ? updatedRoom : r));
      setActiveRoom(prev => {
        if (prev && prev._id === updatedRoom._id) return updatedRoom;
        return prev;
      });
    });

    newSocket.on('room_destroyed', ({ roomId }) => {
      setRooms(prev => prev.filter(r => r._id !== roomId));
      setActiveRoom(prev => {
         if (prev && prev._id === roomId) {
            alert("The room creator has ended this study session.");
            return null;
         }
         return prev;
      });
    });

    return () => newSocket.disconnect();
  }, []);

  const handleJoinRoom = (room) => {
    setActiveRoom(room);
  };

  const handleLeaveRoom = () => {
    if (activeRoom && socketRef.current && currentUser) {
       socketRef.current.emit('leave_study_room', { roomId: activeRoom._id, userId: currentUser._id });
    }
    setActiveRoom(null);
  };

  const handleSynergyUpdated = async (updatedUser) => {
     setIsSynergyOpen(false);
     setCurrentUser(updatedUser);
     // Re-trigger the synergy engine based on the new tags
     try {
        const matchesRes = await api.get('/synergy/matches');
        setMatchPeers(matchesRes.data);
     } catch(e) { console.error(e) }
  };

  const handleRoomCreatedOrEdited = (roomData, isEdit) => {
    setIsCreateOpen(false);
    setEditingRoom(null);
    if (isEdit) {
       setRooms(prev => prev.map(r => r._id === roomData._id ? roomData : r));
       setActiveRoom(prev => (prev && prev._id === roomData._id) ? roomData : prev);
    } else {
       setRooms(prev => [roomData, ...prev]);
       setActiveRoom(roomData);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to completely end and delete this study room?")) return;
    try {
      if (socketRef.current) socketRef.current.emit('admin_deleted_room', { roomId });
      await api.delete(`/rooms/${roomId}`);
      setRooms(prev => prev.filter(r => r._id !== roomId));
      setActiveRoom(prev => prev?._id === roomId ? null : prev);
    } catch(e) { console.error("Error deleting", e); }
  };

  const handleConnect = async (peerId) => {
     try {
        await api.post(`/synergy/connect/${peerId}`);
        // Remove from matchPeers, and add to networkPeers as 'sent'
        const connectedPeer = matchPeers.find(p => p.id === peerId);
        setMatchPeers(prev => prev.filter(p => p.id !== peerId));
        if (connectedPeer) {
           setNetworkPeers(prev => [...prev, { ...connectedPeer, connectionStatus: 'sent' }]);
        }
     } catch(e) {
        console.error(e);
        alert(e?.response?.data?.message || "Failed to send request.");
     }
  };

  const handleAccept = async (peerId) => {
     try {
        await api.put(`/synergy/accept/${peerId}`);
        const networkRes = await api.get('/synergy/network');
        setNetworkPeers(networkRes.data);
     } catch(e) {
        console.error(e);
        alert(e?.response?.data?.message || "Failed to accept request.");
     }
  };

  const filteredMatchPeers = matchPeers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200">
      
      {/* 1. HERO BANNER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-8 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Connect. Collaborate. Create.</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find peers with complementary skills, join live study sessions, and build the future together.
            </p>
          </div>
          
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-md border border-slate-200 dark:border-slate-700 flex items-center focus-within:ring-2 focus-within:ring-blue-500">
            <div className="px-3 text-slate-400"><Search size={18} /></div>
            <input 
              type="text" 
              placeholder="Search by skill or name..." 
              className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Peers & Study Rooms (span 2) */}
        <div className="xl:col-span-2 space-y-8">
                   {/* SECTION: AI Matched Peers */}
          <section className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl relative overflow-hidden">
             {/* Decorative Background Accents */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-center relative z-10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-600 rounded-lg shadow-lg shadow-orange-500/20">
                   <Users size={20} className="text-white" />
                </div>
                Synergy Matches
              </h2>
              <button 
                 onClick={() => setIsSynergyOpen(true)} 
                 className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5"
              >
                 <Pencil size={14} /> Edit Alignment Tags
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              {filteredMatchPeers.length === 0 && (
                 <div className="col-span-2 flex flex-col items-center justify-center text-slate-400 py-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <Users size={32} className="mb-3 opacity-20" />
                    <p className="font-medium text-sm">No new synergy matches right now.</p>
                    <p className="text-xs mt-1">Try tweaking your Edit Alignment Tags to cast a wider net!</p>
                 </div>
              )}
              {filteredMatchPeers.map(peer => (
                <div key={peer.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                  
                  {/* Glowing match bar top accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex items-center gap-4 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-white dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-extrabold text-xl shadow-inner relative">
                        {peer.name && peer.name.length > 0 ? peer.name[0] : '?'}
                        {peer.status === 'Online' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">{peer.name}</h3>
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mt-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-full inline-flex">
                          <MapPin size={10} className="text-orange-500" /> {peer.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-1 rounded-md shadow-md shadow-orange-500/20">{peer.match}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Synergy</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-5">
                    {peer.tags && peer.tags.map((tag, i) => (
                      <span key={i} className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-default">
                        <Hash size={12} className="text-orange-400" /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-auto relative z-10">
                    <button 
                       onClick={() => handleConnect(peer.id)} 
                       disabled={peer.connectionStatus === 'sent'}
                       className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${peer.connectionStatus === 'sent' ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5'}`}
                    >
                      {peer.connectionStatus === 'sent' ? 'Pending Request' : 'Connect'}
                    </button>
                    <button 
                      onClick={() => { setSelectedPeer(peer); setIsChatOpen(true); }}
                      className="px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all flex items-center justify-center shadow-sm hover:-translate-y-0.5"
                    >
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Live Study Rooms */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video size={20} className="text-red-500" /> Live Study Rooms
              </h2>
                <button onClick={() => { setEditingRoom(null); setIsCreateOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-500/20">
                  <PlusCircle size={18} />
                  New Room
                </button>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {rooms.length === 0 && (
                <div className="col-span-2 text-center text-slate-400 py-4">No active rooms right now. Create one to get started!</div>
              )}
              {rooms.map(room => {
                  const isOwner = currentUser && room.createdBy === currentUser._id;
                  return (
                  <div key={room._id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Activity className="text-blue-500" size={18} />
                          <span className="text-xs font-bold text-blue-500 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-1 rounded">
                            {room.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">{room.topic}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {isOwner && (
                           <div className="flex gap-1.5 opacity-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingRoom(room)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-800 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteRoom(room._id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        )}
                        <div className="flex -space-x-2">
                          {room.participants?.map((p, i) => (
                            <div key={p._id || i} title={p.name} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex justify-center items-center font-bold text-xs text-slate-600 relative z-10 hover:z-20 transition-transform hover:scale-110">
                              {p.name?.[0]}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-500 font-semibold">
                        {room.participants?.length || 0} / {room.maxParticipants} Participants
                      </div>
                      <button 
                        onClick={() => handleJoinRoom(room)}
                        className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 border border-blue-200 dark:border-blue-800/50 transition-colors"
                      >
                        Join <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                  );
                })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Interactive Sidebar Widgets (span 1) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Incoming Connections Widget */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span> Connection Requests
            </h3>
            
            <div className="space-y-3">
              {networkPeers.filter(p => p.connectionStatus === 'received').length === 0 && (
                <div className="text-center text-slate-400 py-6 text-xs bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No pending requests</div>
              )}
              {networkPeers.filter(p => p.connectionStatus === 'received').map(p => (
                <div key={p.id} className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 font-extrabold flex items-center justify-center text-sm shadow-inner relative border border-white dark:border-slate-600">
                      {p.name && p.name.length > 0 ? p.name[0] : '?'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{p.name}</h4>
                      <p className="text-[10px] font-semibold text-slate-500">{p.tags?.[0] || 'Peer'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleAccept(p.id)} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all active:scale-95">
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sent Requests Widget */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span> Sent Requests
            </h3>
            
            <div className="space-y-3">
              {networkPeers.filter(p => p.connectionStatus === 'sent').length === 0 && (
                <div className="text-center text-slate-400 py-6 text-xs bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No sent requests</div>
              )}
              {networkPeers.filter(p => p.connectionStatus === 'sent').map(p => (
                <div key={p.id} className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 font-extrabold flex items-center justify-center text-sm shadow-inner relative border border-white dark:border-slate-600">
                      {p.name && p.name.length > 0 ? p.name[0] : '?'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{p.name}</h4>
                      <p className="text-[10px] font-semibold text-slate-500">{p.tags?.[0] || 'Peer'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Pending</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Collaborators Widget */}
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-xl relative overflow-hidden">
             <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Globe size={18} className="text-orange-500" /> Active Network
            </h3>
            <div className="flex flex-col gap-1.5">
              {networkPeers.filter(p => p.connectionStatus === 'connected').length === 0 && (
                <div className="text-center text-slate-400 py-6 text-xs bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">You haven't connected with anyone yet.</div>
              )}
              {networkPeers.filter(p => p.connectionStatus === 'connected').map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm group" onClick={() => { setSelectedPeer(p); setIsChatOpen(true); }}>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 font-extrabold text-sm shadow-inner border border-white dark:border-slate-600">
                      {p.name && p.name.length > 0 ? p.name[0] : '?'}
                    </div>
                    {p.status === 'Away' ? (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{p.name}</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-0.5"><Users size={10} /> Connected</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors shadow-inner">
                    <MessageCircle size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* OVERLAYS */}
      {activeRoom && <StudyRoomLive room={activeRoom} onLeave={handleLeaveRoom} currentUser={currentUser} socket={socketRef.current} />}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} peer={selectedPeer} />
      {isCreateOpen && <CreateRoomModal onClose={() => setIsCreateOpen(false)} onCreated={handleRoomCreatedOrEdited} editingRoom={null} />}
      {editingRoom && <CreateRoomModal onClose={() => setEditingRoom(null)} onCreated={handleRoomCreatedOrEdited} editingRoom={editingRoom} />}
      {isSynergyOpen && <EditSynergyModal onClose={() => setIsSynergyOpen(false)} onSaved={handleSynergyUpdated} currentUser={currentUser} />}
    </div>
  );
}

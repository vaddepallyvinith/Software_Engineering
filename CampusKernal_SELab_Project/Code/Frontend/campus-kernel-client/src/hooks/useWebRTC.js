import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebRTC = (socket, roomId, localStream) => {
  const [peers, setPeers] = useState({});
  const peerConnections = useRef({});
  const currentVideoTrack = useRef(null);

  useEffect(() => {
    if (localStream && !currentVideoTrack.current) {
       currentVideoTrack.current = localStream.getVideoTracks()[0];
    }
  }, [localStream]);

  useEffect(() => {
    if (!socket || !localStream) return;

    const createPeerConnection = (partnerSocketId) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      });

      const activeVideo = currentVideoTrack.current || localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      
      if (activeVideo) pc.addTrack(activeVideo, localStream);
      if (audioTrack && !peerConnections.current[partnerSocketId]) pc.addTrack(audioTrack, localStream);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
           socket.emit('webrtc_signal', { targetSocketId: partnerSocketId, signal: { type: 'ice', candidate: event.candidate } });
        }
      };

      pc.ontrack = (event) => {
         setPeers(prev => ({ ...prev, [partnerSocketId]: event.streams[0] }));
      };

      peerConnections.current[partnerSocketId] = pc;
      return pc;
    };

    const handleUserJoined = async ({ socketId }) => {
      // Create offer for the new peer who just joined
      const pc = createPeerConnection(socketId);
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      socket.emit('webrtc_signal', { targetSocketId: socketId, signal: offer });
    };

    const handleSignal = async (payload) => {
       const { callerSocketId, signal } = payload;
       let pc = peerConnections.current[callerSocketId];

       if (signal.type === 'offer') {
          if (!pc) pc = createPeerConnection(callerSocketId);
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc_signal', { targetSocketId: callerSocketId, signal: answer });
       } else if (signal.type === 'answer') {
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal));
       } else if (signal.type === 'ice') {
          if (pc && signal.candidate) await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
       }
    };

    const handleUserLeft = ({ socketId }) => {
       if (peerConnections.current[socketId]) {
         peerConnections.current[socketId].close();
         delete peerConnections.current[socketId];
       }
       setPeers(prev => {
         const snap = { ...prev };
         delete snap[socketId];
         return snap;
       });
    };

    socket.on('user_joined_webrtc', handleUserJoined);
    socket.on('webrtc_signal', handleSignal);
    socket.on('user_left_webrtc', handleUserLeft);

    return () => {
       socket.off('user_joined_webrtc', handleUserJoined);
       socket.off('webrtc_signal', handleSignal);
       socket.off('user_left_webrtc', handleUserLeft);
    };
  }, [socket, localStream]);

  // Allows injecting Screen Share safely over live peer pipelines
  const replaceVideoTrack = useCallback(async (newVideoTrack) => {
    currentVideoTrack.current = newVideoTrack;
    Object.values(peerConnections.current).forEach(pc => {
       const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
       if (sender) sender.replaceTrack(newVideoTrack);
    });
  }, []);

  return { peers, replaceVideoTrack };
};

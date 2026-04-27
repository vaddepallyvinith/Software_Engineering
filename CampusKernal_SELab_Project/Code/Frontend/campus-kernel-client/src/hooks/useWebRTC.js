import { useEffect, useRef, useState } from 'react';

export const useWebRTC = (socket, roomId, localStream) => {
  const [peers, setPeers] = useState({});
  const peerConnections = useRef({});

  useEffect(() => {
    if (!socket || !localStream) return;

    const createPeer = (targetSocketId, caller) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
      });

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc_signal', {
            targetSocketId,
            signal: { type: 'candidate', candidate: event.candidate },
          });
        }
      };

      pc.ontrack = (event) => {
        setPeers((prev) => ({
          ...prev,
          [targetSocketId]: event.streams[0],
        }));
      };

      pc.onnegotiationneeded = async () => {
        try {
          if (pc.signalingState !== "stable") return;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc_signal', {
            targetSocketId,
            signal: pc.localDescription,
          });
        } catch (err) {
          console.error('Error creating offer', err);
        }
      };

      peerConnections.current[targetSocketId] = pc;
      return pc;
    };

    const handleUserJoined = ({ socketId }) => {
      createPeer(socketId, true);
    };

    const handleSignal = async ({ callerSocketId, signal }) => {
      let pc = peerConnections.current[callerSocketId];
      if (!pc) {
        pc = createPeer(callerSocketId, false);
      }

      try {
        if (signal.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc_signal', {
            targetSocketId: callerSocketId,
            signal: pc.localDescription,
          });
        } else if (signal.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (signal.type === 'candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      } catch (err) {
        console.error('Error handling signal', err);
      }
    };

    const handleUserLeft = ({ socketId }) => {
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
      }
      setPeers((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
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

  const replaceVideoTrack = (newVideoTrack) => {
    Object.values(peerConnections.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
      if (sender) {
        if (newVideoTrack) {
          sender.replaceTrack(newVideoTrack);
        } else {
          pc.removeTrack(sender);
        }
      } else if (newVideoTrack) {
        pc.addTrack(newVideoTrack, localStream);
      }
    });
  };

  return { peers, replaceVideoTrack };
};

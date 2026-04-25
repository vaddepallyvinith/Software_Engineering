import { Server } from 'socket.io';
import { createDirectMessage, markMessagesRead } from './services/messageService.js';
import { joinRoom, leaveRoom } from './services/roomService.js';

export const attachSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('send_message', async (payload) => {
      try {
        const message = await createDirectMessage({
          senderId: payload.sender,
          receiverId: payload.receiver,
          text: payload.text,
        });
        io.to(payload.receiver).emit('receive_message', message);
        socket.emit('receive_message', message);
      } catch (error) {
        console.error('send_message error', error);
      }
    });

    socket.on('mark_read', async (payload) => {
      try {
        await markMessagesRead({ senderId: payload.sender, receiverId: payload.receiver });
        io.to(payload.sender).emit('messages_read', payload.receiver);
      } catch (error) {
        console.error('mark_read error', error);
      }
    });

    socket.on('join_study_room', async ({ roomId, userId }) => {
      const room = await joinRoom(roomId, userId);
      if (!room) return;
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      io.to(roomId).emit('room_updated', room);
      socket.broadcast.to(roomId).emit('user_joined_webrtc', { socketId: socket.id, userId });
    });

    socket.on('leave_study_room', async ({ roomId, userId }) => {
      const room = await leaveRoom(roomId, userId);
      socket.leave(roomId);
      socket.broadcast.to(roomId).emit('user_left_webrtc', { socketId: socket.id });
      socket.data.roomId = null;
      if (room) {
        io.to(roomId).emit('room_updated', room);
      }
    });

    socket.on('room_message', (payload) => {
      io.to(payload.roomId).emit('room_message', payload);
    });

    socket.on('webrtc_signal', (payload) => {
      io.to(payload.targetSocketId).emit('webrtc_signal', {
        callerSocketId: socket.id,
        signal: payload.signal,
      });
    });

    socket.on('screen_share_status', (payload) => {
      io.to(payload.roomId).emit('screen_share_status', payload);
    });

    socket.on('admin_deleted_room', ({ roomId }) => {
      io.to(roomId).emit('room_destroyed', { roomId });
    });

    socket.on('disconnect', async () => {
      if (socket.data.roomId && socket.data.userId) {
        const room = await leaveRoom(socket.data.roomId, socket.data.userId);
        socket.broadcast.to(socket.data.roomId).emit('user_left_webrtc', { socketId: socket.id });
        if (room) {
          io.to(socket.data.roomId).emit('room_updated', room);
        }
      }
    });
  });

  return io;
};

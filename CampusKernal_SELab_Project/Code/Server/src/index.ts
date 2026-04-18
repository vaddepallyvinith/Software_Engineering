import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import meRoutes from './routes/meRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import synergyRoutes from './routes/synergyRoutes.js';
import Message from './models/Message.js';
import Room from './models/Room.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// ── Load .env variables ───────────────────────────────────────────────────────
// Must be called before reading process.env anywhere in this file.
dotenv.config();

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());          // Allow cross-origin requests (React frontend on a different port)
app.use(express.json());  // Parse incoming JSON request bodies (req.body)

// ── Routes ────────────────────────────────────────────────────────────────────
// All auth endpoints live under /api/auth  (public — no login needed)
app.use('/api/auth', authRoutes);

// All "Me Space" endpoints live under /api/me  (protected — JWT required)
app.use('/api/me', meRoutes);

// Messaging API
app.use('/api/messages', messageRoutes);

// Rooms API
app.use('/api/rooms', roomRoutes);

// Synergy API
app.use('/api/synergy', synergyRoutes);

// Root health-check — useful to confirm the server is alive
app.get('/', (_req, res) => {
  res.send('Campus Kernel API is running ');
});

// ── Startup Checks ────────────────────────────────────────────────────────────
const mongoURI = process.env.MONGO_URI || '';
if (!mongoURI) {
  console.error(' MONGO_URI is missing from .env — cannot start server.');
  process.exit(1); // Exit with error code 1 (non-zero = failure)
}

const jwtSecret = process.env.JWT_SECRET || '';
if (!jwtSecret) {
  console.error(' JWT_SECRET is missing from .env — cannot start server.');
  process.exit(1);
}

// ── Connect to MongoDB Atlas ──────────────────────────────────────────────────
// mongoose.connect() returns a Promise.
// .then() runs when connection succeeds; .catch() runs on failure.
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(' Connected to MongoDB Atlas');

    // Only start the HTTP server AFTER the DB is connected.
    const PORT = process.env.PORT || 5001;
    
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
      // User joins their personal room ID to receive messages
      socket.on('join', (userId) => {
        socket.join(userId);
      });
      
      socket.on('send_message', async (data) => {
         try {
             const newMsg = new Message({
                 sender: data.sender,
                 receiver: data.receiver,
                 text: data.text
             });
             await newMsg.save();
             
             // Emit to receiver directly
             io.to(data.receiver).emit('receive_message', newMsg);
             // Emit back to sender to update UI reliably via socket
             socket.emit('receive_message', newMsg);
         } catch(e) {
             console.error("Socket emit error:", e);
         }
      });
      
      socket.on('mark_read', async (data) => {
         try {
             await Message.updateMany(
                 { sender: data.sender, receiver: data.receiver, read: false },
                 { read: true }
             );
             io.to(data.sender).emit('messages_read', data.receiver);
         } catch(e) {
             console.error("Socket mark_read error:", e);
         }
      });
      
      // Study Room Presence Events
      socket.on('join_study_room', async (data) => {
         try {
             socket.join(data.roomId.toString()); 
             await Room.findByIdAndUpdate(data.roomId, { $addToSet: { participants: data.userId } });
             const updatedRoom = await Room.findById(data.roomId).populate('participants', 'name profile');
             io.to(data.roomId.toString()).emit('room_updated', updatedRoom);
             
             socket.broadcast.to(data.roomId.toString()).emit('user_joined_webrtc', { socketId: socket.id, userId: data.userId });

             socket.data.userId = data.userId;
             socket.data.roomId = data.roomId;
         } catch(e) { console.error("join_study_room err:", e); }
      });

      socket.on('room_message', (data) => {
         io.to(data.roomId.toString()).emit('room_message', data);
      });

      socket.on('webrtc_signal', (data) => {
          io.to(data.targetSocketId).emit('webrtc_signal', {
             callerSocketId: socket.id,
             signal: data.signal
          });
      });

      socket.on('screen_share_status', (data) => {
         io.to(data.roomId.toString()).emit('screen_share_status', data);
      });

      socket.on('admin_deleted_room', (data) => {
         io.to(data.roomId.toString()).emit('room_destroyed', { roomId: data.roomId });
      });

      socket.on('leave_study_room', async (data) => {
         try {
             socket.leave(data.roomId.toString());
             await Room.findByIdAndUpdate(data.roomId, { $pull: { participants: data.userId } });
             const updatedRoom = await Room.findById(data.roomId).populate('participants', 'name profile');
             io.to(data.roomId.toString()).emit('room_updated', updatedRoom);
             
             socket.broadcast.to(data.roomId.toString()).emit('user_left_webrtc', { socketId: socket.id });
             socket.data.roomId = null;
         } catch(e) { console.error("leave_study_room err:", e); }
      });

      socket.on('disconnect', async () => {
         if (socket.data.roomId && socket.data.userId) {
             try {
                 await Room.findByIdAndUpdate(socket.data.roomId, { $pull: { participants: socket.data.userId } });
                 const updatedRoom = await Room.findById(socket.data.roomId).populate('participants', 'name profile');
                 io.to(socket.data.roomId.toString()).emit('room_updated', updatedRoom);
                 socket.broadcast.to(socket.data.roomId.toString()).emit('user_left_webrtc', { socketId: socket.id });
             } catch(e) { console.error("Disconnect room cleanup err:", e); }
         }
      });
    });

    httpServer.listen(PORT, () => {
      console.log(` Server & WebSockets running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  });
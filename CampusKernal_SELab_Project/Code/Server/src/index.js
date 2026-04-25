import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { config } from './config.js';
import authRoutes from './routes/authRoutes.js';
import meRoutes from './routes/meRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import synergyRoutes from './routes/synergyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { attachSocketServer } from './socket.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Campus Kernel API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/synergy', synergyRoutes);
app.use('/api/admin', adminRoutes);

const httpServer = createServer(app);
attachSocketServer(httpServer);

if (config.mongoUri) {
  mongoose.connect(config.mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));
} else {
  console.log('No MONGO_URI provided. Skipping MongoDB connection.');
}

httpServer.listen(config.port, () => {
  console.log(`Campus Kernel server running on http://localhost:${config.port}`);
});

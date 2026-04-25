import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { config } from './config.js';
import authRoutes from './routes/authRoutes.js';
import meRoutes from './routes/meRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import synergyRoutes from './routes/synergyRoutes.js';
import { attachSocketServer } from './socket.js';
import { readDb } from './data/db.js';

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

const httpServer = createServer(app);
attachSocketServer(httpServer);

await readDb();

httpServer.listen(config.port, () => {
  console.log(`Campus Kernel server running on http://localhost:${config.port}`);
});

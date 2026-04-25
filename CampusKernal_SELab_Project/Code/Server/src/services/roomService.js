import { readDb, writeDb } from '../data/db.js';
import { createId } from '../utils/ids.js';
import { nowIso } from '../utils/time.js';

const populateParticipants = (room, users) => ({
  _id: room.id,
  id: room.id,
  topic: room.topic,
  category: room.category,
  maxParticipants: room.maxParticipants,
  createdBy: room.createdBy,
  participants: room.participantIds
    .map((participantId) => users.find((user) => user.id === participantId))
    .filter(Boolean)
    .map((user) => ({
      _id: user.id,
      id: user.id,
      name: user.name,
      profile: user.profile,
    })),
  messages: room.messages || [],
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
});

export const getRooms = async () => {
  const db = await readDb();
  return db.rooms
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((room) => populateParticipants(room, db.users));
};

export const createRoom = async ({ topic, category, maxParticipants, createdBy }) => {
  const db = await readDb();
  const now = nowIso();
  const room = {
    id: createId(),
    topic: String(topic || '').trim(),
    category: String(category || 'Study').trim(),
    maxParticipants: Number(maxParticipants || 4),
    createdBy,
    participantIds: [],
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  db.rooms.unshift(room);
  await writeDb(db);
  return populateParticipants(room, db.users);
};

export const updateRoom = async (roomId, userId, updates) => {
  const db = await readDb();
  const room = db.rooms.find((item) => item.id === roomId);
  if (!room) return { status: 404 };
  if (room.createdBy !== userId) return { status: 403 };

  if (updates.topic) room.topic = String(updates.topic).trim();
  if (updates.category) room.category = String(updates.category).trim();
  if (updates.maxParticipants) room.maxParticipants = Number(updates.maxParticipants);
  room.updatedAt = nowIso();

  await writeDb(db);
  return { status: 200, room: populateParticipants(room, db.users) };
};

export const deleteRoom = async (roomId, userId) => {
  const db = await readDb();
  const room = db.rooms.find((item) => item.id === roomId);
  if (!room) return { status: 404 };
  if (room.createdBy !== userId) return { status: 403 };

  db.rooms = db.rooms.filter((item) => item.id !== roomId);
  await writeDb(db);
  return { status: 200 };
};

export const joinRoom = async (roomId, userId) => {
  const db = await readDb();
  const room = db.rooms.find((item) => item.id === roomId);
  if (!room) return null;
  if (!room.participantIds.includes(userId) && room.participantIds.length < room.maxParticipants) {
    room.participantIds.push(userId);
    room.updatedAt = nowIso();
    await writeDb(db);
  }
  return populateParticipants(room, db.users);
};

export const leaveRoom = async (roomId, userId) => {
  const db = await readDb();
  const room = db.rooms.find((item) => item.id === roomId);
  if (!room) return null;
  room.participantIds = room.participantIds.filter((participantId) => participantId !== userId);
  room.updatedAt = nowIso();
  await writeDb(db);
  return populateParticipants(room, db.users);
};

import { Room } from '../models/Room.js';

const populateParticipants = (roomDoc) => {
  const room = roomDoc.toJSON ? roomDoc.toJSON() : roomDoc;
  return {
    _id: room.id,
    id: room.id,
    topic: room.topic,
    category: room.category,
    maxParticipants: room.maxParticipants,
    createdBy: room.createdBy,
    participants: (room.participantIds || []).map((user) => ({
      _id: user.id || user._id,
      id: user.id || user._id,
      name: user.name,
      profile: user.profile,
    })),
    messages: room.messages || [],
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
};

export const getRooms = async () => {
  const rooms = await Room.find().sort({ createdAt: -1 }).populate('participantIds', 'name profile');
  return rooms.map(populateParticipants);
};

export const createRoom = async ({ topic, category, maxParticipants, createdBy }) => {
  const room = new Room({
    topic: String(topic || '').trim(),
    category: String(category || 'Study').trim(),
    maxParticipants: Number(maxParticipants || 4),
    createdBy,
    participantIds: [],
    messages: [],
  });
  await room.save();
  await room.populate('participantIds', 'name profile');
  return populateParticipants(room);
};

export const updateRoom = async (roomId, userId, updates) => {
  const room = await Room.findById(roomId).populate('participantIds', 'name profile');
  if (!room) return { status: 404 };
  
  const reqUser = await import('../models/User.js').then(m => m.User.findById(userId));
  const isAdmin = reqUser && reqUser.role === 'admin';
  
  if (!isAdmin && room.createdBy.toString() !== userId.toString()) return { status: 403 };

  if (updates.topic) room.topic = String(updates.topic).trim();
  if (updates.category) room.category = String(updates.category).trim();
  if (updates.maxParticipants) room.maxParticipants = Number(updates.maxParticipants);
  
  await room.save();
  return { status: 200, room: populateParticipants(room) };
};

export const deleteRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) return { status: 404 };
  
  const reqUser = await import('../models/User.js').then(m => m.User.findById(userId));
  const isAdmin = reqUser && reqUser.role === 'admin';
  
  if (!isAdmin && room.createdBy.toString() !== userId.toString()) return { status: 403 };

  await Room.deleteOne({ _id: roomId });
  return { status: 200 };
};

export const joinRoom = async (roomId, userId) => {
  // Use $addToSet to atomically prevent duplicate participants even under race conditions
  const room = await Room.findOneAndUpdate(
    { 
      _id: roomId,
      $expr: { $lt: [{ $size: '$participantIds' }, '$maxParticipants'] }
    },
    { $addToSet: { participantIds: userId } },
    { new: true }
  );
  
  // If room was full or not found, try just fetching it (user might already be in it)
  const finalRoom = room || await Room.findById(roomId);
  if (!finalRoom) return null;
  
  await finalRoom.populate('participantIds', 'name profile');
  return populateParticipants(finalRoom);
};

export const leaveRoom = async (roomId, userId) => {
  const room = await Room.findById(roomId);
  if (!room) return null;
  
  room.participantIds = room.participantIds.filter((pid) => pid.toString() !== userId.toString());
  await room.save();
  
  await room.populate('participantIds', 'name profile');
  return populateParticipants(room);
};

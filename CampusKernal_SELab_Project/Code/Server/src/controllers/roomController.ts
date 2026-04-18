import { Request, Response } from 'express';
import Room from '../models/Room.js';

interface AuthRequest extends Request {
  user?: any;
}

export const getRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find().populate('participants', 'name profile').sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, category, maxParticipants } = req.body;
    const newRoom = new Room({
      topic,
      category,
      maxParticipants: maxParticipants || 10,
      createdBy: req.user?.id,
      participants: [] // Users join via socket natively
    });
    await newRoom.save();
    
    // Automatically populate immediately so frontend renders smoothly
    const populated = await Room.findById(newRoom._id).populate('participants', 'name profile');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room' });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, category, maxParticipants } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) { res.status(404).json({ message: 'Room not found' }); return; }
    if (room.createdBy.toString() !== req.user?.id) { res.status(403).json({ message: 'Not authorized' }); return; }
    
    room.topic = topic || room.topic;
    room.category = category || room.category;
    room.maxParticipants = maxParticipants || room.maxParticipants;
    
    await room.save();
    const populated = await Room.findById(room._id).populate('participants', 'name profile');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating room' });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) { res.status(404).json({ message: 'Room not found' }); return; }
    if (room.createdBy.toString() !== req.user?.id) { res.status(403).json({ message: 'Not authorized' }); return; }
    
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room' });
  }
};

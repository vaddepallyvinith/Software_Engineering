import mongoose from 'mongoose';

const RoomMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

RoomMessageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const RoomSchema = new mongoose.Schema({
  topic: { type: String, default: '' },
  category: { type: String, default: 'Study' },
  maxParticipants: { type: Number, default: 4 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [RoomMessageSchema],
}, { timestamps: true });

RoomSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

export const Room = mongoose.model('Room', RoomSchema);

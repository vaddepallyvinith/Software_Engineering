import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  topic: string;
  category: string;
  maxParticipants: number;
  participants: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  activity: 'Low' | 'Medium' | 'High' | 'Very High';
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    topic: { type: String, required: true },
    category: { type: String, required: true },
    maxParticipants: { type: Number, required: true, default: 10 },
    activity: { type: String, enum: ['Low', 'Medium', 'High', 'Very High'], default: 'Medium' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>('Room', RoomSchema);

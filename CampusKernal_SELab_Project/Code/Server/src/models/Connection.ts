import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConnection extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted';
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema<IConnection> = new Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  },
  { timestamps: true }
);

// Ensure we don't have duplicate friend requests pending
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Connection: Model<IConnection> = mongoose.model<IConnection>('Connection', ConnectionSchema);
export default Connection;

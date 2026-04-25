import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Message } from '../models/Message.js';
import { Room } from '../models/Room.js';
import { Connection } from '../models/Connection.js';

const toAdminUser = (userDoc) => {
  const user = userDoc.toJSON ? userDoc.toJSON() : userDoc;
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: Boolean(user.isVerified),
    profile: user.profile || {},
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const listUsersForAdmin = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(toAdminUser);
};

export const updateUserRole = async (userId, role) => {
  if (!['student', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  const user = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true });
  if (!user) return null;
  return toAdminUser(user);
};

export const deleteUserAndReferences = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user id');
  }

  await Message.deleteMany({
    $or: [{ senderId: userId }, { receiverId: userId }]
  });

  await Connection.deleteMany({
    $or: [
      { requesterId: userId },
      { recipientId: userId },
      { requester: userId },
      { recipient: userId },
    ]
  });

  await Room.updateMany(
    {},
    {
      $pull: {
        participantIds: userId,
        participants: userId,
        messages: { senderId: userId },
      }
    }
  );

  await Room.deleteMany({ createdBy: userId });
  await User.deleteOne({ _id: userId });
};

export const getDuplicateEmailReport = async () => {
  const duplicates = await User.aggregate([
    {
      $group: {
        _id: { $toLower: '$email' },
        count: { $sum: 1 },
        users: {
          $push: {
            _id: '$_id',
            email: '$email',
            name: '$name',
            role: '$role',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
          }
        }
      }
    },
    {
      $match: {
        _id: { $ne: null },
        count: { $gt: 1 },
      }
    },
    { $sort: { count: -1, _id: 1 } }
  ]);

  return duplicates.map((group) => ({
    email: group._id,
    count: group.count,
    users: group.users,
  }));
};

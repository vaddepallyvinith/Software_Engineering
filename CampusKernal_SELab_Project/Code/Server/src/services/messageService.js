import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { Connection } from '../models/Connection.js';

const enrichMessage = (messageDoc) => {
  const message = messageDoc.toJSON ? messageDoc.toJSON() : messageDoc;
  return {
    _id: message.id,
    id: message.id,
    sender: message.senderId,
    receiver: message.receiverId,
    text: message.text,
    read: Boolean(message.read),
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};

export const getMessagesBetweenUsers = async (userId, peerId) => {
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: peerId },
      { senderId: peerId, receiverId: userId },
    ]
  }).sort({ createdAt: 1 });
  
  return messages.map(enrichMessage);
};

export const createDirectMessage = async ({ senderId, receiverId, text }) => {
  const connection = await Connection.findOne({
    status: 'accepted',
    $or: [
      { requesterId: senderId, recipientId: receiverId },
      { requesterId: receiverId, recipientId: senderId },
      { requester: senderId, recipient: receiverId },
      { requester: receiverId, recipient: senderId },
    ]
  });

  if (!connection) {
    throw new Error('You can only message connected people.');
  }

  const message = new Message({
    senderId,
    receiverId,
    text: String(text || '').trim(),
    read: false,
  });
  await message.save();
  return enrichMessage(message);
};

export const markMessagesRead = async ({ senderId, receiverId }) => {
  await Message.updateMany(
    { senderId, receiverId, read: false },
    { $set: { read: true } }
  );
};

export const getContactsForUser = async (userId) => {
  const connections = await Connection.find({
    status: 'accepted',
    $or: [
      { requesterId: userId },
      { recipientId: userId },
      { requester: userId },
      { recipient: userId }
    ]
  }).populate('requesterId').populate('recipientId').populate('requester').populate('recipient');

  const connectedUsers = connections.map(c => {
     const requester = c.requesterId || c.requester;
     const recipient = c.recipientId || c.recipient;
     if (!requester || !recipient) return null;
     const reqId = requester._id?.toString() || requester.toString();
     return reqId === userId.toString() ? recipient : requester;
  }).filter(Boolean);

  const uniqueUsersMap = new Map();
  connectedUsers.forEach(u => uniqueUsersMap.set(u._id?.toString() || u.id?.toString(), u));
  const allUsers = Array.from(uniqueUsersMap.values());
  
  const messages = await Message.find({
    $or: [
      { senderId: userId },
      { receiverId: userId }
    ]
  }).sort({ createdAt: -1 });

  return allUsers.map((user) => {
    const conversation = messages.filter(
      (m) => m.senderId.toString() === user._id.toString() || m.receiverId.toString() === user._id.toString()
    );

    const latest = conversation[0];
    const unread = conversation.filter(
      (m) => m.senderId.toString() === user._id.toString() && m.receiverId.toString() === userId.toString() && !m.read
    ).length;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      lastMsg: latest ? latest.text : 'No messages yet',
      time: latest ? latest.createdAt : null,
      unread,
      online: false,
    };
  });
};

export const getUnreadCount = async (userId) => {
  return await Message.countDocuments({ receiverId: userId, read: false });
};

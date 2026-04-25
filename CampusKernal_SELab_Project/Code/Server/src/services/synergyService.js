import mongoose from 'mongoose';
import { Connection } from '../models/Connection.js';
import { User } from '../models/User.js';

const buildConnectionPairQuery = (leftId, rightId) => ({
  $or: [
    { requesterId: leftId, recipientId: rightId },
    { requesterId: rightId, recipientId: leftId },
    { requester: leftId, recipient: rightId },
    { requester: rightId, recipient: leftId },
  ]
});

const getConnectionRequester = (connection) => connection.requesterId || connection.requester;
const getConnectionRecipient = (connection) => connection.recipientId || connection.recipient;

const calculateMatch = (me, peer) => {
  let score = 20;
  if (me.profile.universityName === peer.profile.universityName) score += 20;
  if (me.profile.course === peer.profile.course) score += 30;

  const mySkills = me.profile.skills || [];
  const peerSkills = peer.profile.skills || [];
  if (mySkills.length > 0) {
    const shared = mySkills.filter((skill) => peerSkills.includes(skill));
    score += Math.floor((shared.length / mySkills.length) * 30);
  }

  return Math.min(score, 100);
};

const toPeerCard = (peer, match, connectionStatus = 'none') => ({
  id: peer.id || peer._id,
  name: peer.name,
  location: peer.profile.location || 'Campus',
  tags: peer.profile.skills || [],
  match,
  connectionStatus,
  status: 'Online',
});

export const getMatches = async (userId) => {
  const me = await User.findById(userId);
  if (!me) return null;

  const connections = await Connection.find({
    $or: [
      { requesterId: userId },
      { recipientId: userId },
      { requester: userId },
      { recipient: userId },
    ]
  });

  const existingIds = new Set([userId.toString()]);
  connections.forEach((conn) => {
    const requester = getConnectionRequester(conn);
    const recipient = getConnectionRecipient(conn);
    if (!requester || !recipient) return;

    if (requester.toString() === userId.toString()) existingIds.add(recipient.toString());
    if (recipient.toString() === userId.toString()) existingIds.add(requester.toString());
  });

  const allUsers = await User.find({ _id: { $nin: Array.from(existingIds) } });

  return allUsers
    .map((peer) => toPeerCard(peer, calculateMatch(me, peer)))
    .sort((a, b) => b.match - a.match)
    .slice(0, 10);
};

export const getNetwork = async (userId) => {
  const connections = await Connection.find({
    $or: [
      { requesterId: userId },
      { recipientId: userId },
      { requester: userId },
      { recipient: userId },
    ]
  })
    .populate('requesterId')
    .populate('recipientId')
    .populate('requester')
    .populate('recipient');

  return connections
    .map((connection) => {
      const requester = getConnectionRequester(connection);
      const recipient = getConnectionRecipient(connection);
      if (!requester || !recipient) return null;

      const requesterId = requester._id?.toString?.() || requester.toString();
      const isRequester = requesterId === userId.toString();
      const peer = isRequester ? recipient : requester;
      
      if (!peer) return null;

      let connectionStatus = 'connected';
      if (connection.status === 'pending') {
        connectionStatus = isRequester ? 'sent' : 'received';
      }

      return {
        id: peer._id || peer.id,
        name: peer.name,
        location: peer.profile.location || 'Campus',
        tags: peer.profile.skills || [],
        status: 'Online',
        connectionStatus,
      };
    })
    .filter(Boolean);
};

export const sendRequest = async (requesterId, recipientId) => {
  if (!mongoose.Types.ObjectId.isValid(requesterId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
    return { status: 400, message: 'Invalid user id' };
  }

  if (requesterId.toString() === recipientId.toString()) return { status: 400, message: 'Cannot connect to yourself' };

  const recipient = await User.findById(recipientId).select('_id');
  if (!recipient) {
    return { status: 404, message: 'User not found' };
  }

  const exists = await Connection.findOne({
    ...buildConnectionPairQuery(requesterId, recipientId)
  });

  if (exists) return { status: 400, message: 'Connection request already exists' };

  const connection = new Connection({
    requester: requesterId,
    recipient: recipientId,
    requesterId,
    recipientId,
    status: 'pending',
  });
  
  await connection.save();
  return { status: 201, connection };
};

export const acceptRequest = async (currentUserId, requesterId) => {
  if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(requesterId)) {
    return { status: 400, message: 'Invalid user id' };
  }

  const connection = await Connection.findOne({
    status: 'pending',
    ...buildConnectionPairQuery(requesterId, currentUserId),
  });
  
  if (!connection) return { status: 404, message: 'Pending request not found' };

  connection.requester = requesterId;
  connection.recipient = currentUserId;
  connection.requesterId = requesterId;
  connection.recipientId = currentUserId;
  
  connection.status = 'accepted';
  await connection.save();
  return { status: 200, connection };
};

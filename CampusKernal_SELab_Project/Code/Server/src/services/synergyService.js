import { readDb, writeDb } from '../data/db.js';
import { createId } from '../utils/ids.js';
import { nowIso } from '../utils/time.js';

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
  id: peer.id,
  name: peer.name,
  location: peer.profile.location || 'Campus',
  tags: peer.profile.skills || [],
  match,
  connectionStatus,
  status: 'Online',
});

export const getMatches = async (userId) => {
  const db = await readDb();
  const me = db.users.find((user) => user.id === userId);
  if (!me) return null;

  const existingIds = new Set([userId]);
  db.connections.forEach((connection) => {
    if (connection.requesterId === userId) existingIds.add(connection.recipientId);
    if (connection.recipientId === userId) existingIds.add(connection.requesterId);
  });

  return db.users
    .filter((user) => !existingIds.has(user.id))
    .map((peer) => toPeerCard(peer, calculateMatch(me, peer)))
    .sort((a, b) => b.match - a.match)
    .slice(0, 10);
};

export const getNetwork = async (userId) => {
  const db = await readDb();

  return db.connections
    .filter((connection) => connection.requesterId === userId || connection.recipientId === userId)
    .map((connection) => {
      const isRequester = connection.requesterId === userId;
      const peerId = isRequester ? connection.recipientId : connection.requesterId;
      const peer = db.users.find((user) => user.id === peerId);
      if (!peer) return null;

      let connectionStatus = 'connected';
      if (connection.status === 'pending') {
        connectionStatus = isRequester ? 'sent' : 'received';
      }

      return {
        id: peer.id,
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
  const db = await readDb();
  if (requesterId === recipientId) return { status: 400, message: 'Cannot connect to yourself' };

  const exists = db.connections.find((connection) => (
    (connection.requesterId === requesterId && connection.recipientId === recipientId) ||
    (connection.requesterId === recipientId && connection.recipientId === requesterId)
  ));

  if (exists) return { status: 400, message: 'Connection request already exists' };

  const now = nowIso();
  const connection = {
    id: createId(),
    requesterId,
    recipientId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  db.connections.push(connection);
  await writeDb(db);
  return { status: 201, connection };
};

export const acceptRequest = async (currentUserId, requesterId) => {
  const db = await readDb();
  const connection = db.connections.find((item) => item.requesterId === requesterId && item.recipientId === currentUserId && item.status === 'pending');
  if (!connection) return { status: 404, message: 'Pending request not found' };
  connection.status = 'accepted';
  connection.updatedAt = nowIso();
  await writeDb(db);
  return { status: 200, connection };
};

import { readDb, writeDb } from '../data/db.js';
import { createId } from '../utils/ids.js';
import { nowIso } from '../utils/time.js';

const enrichMessage = (message) => ({
  _id: message.id,
  id: message.id,
  sender: message.senderId,
  receiver: message.receiverId,
  text: message.text,
  read: Boolean(message.read),
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

export const getMessagesBetweenUsers = async (userId, peerId) => {
  const db = await readDb();
  return db.messages
    .filter((message) => (
      (message.senderId === userId && message.receiverId === peerId) ||
      (message.senderId === peerId && message.receiverId === userId)
    ))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(enrichMessage);
};

export const createDirectMessage = async ({ senderId, receiverId, text }) => {
  const db = await readDb();
  const now = nowIso();
  const message = {
    id: createId(),
    senderId,
    receiverId,
    text: String(text || '').trim(),
    read: false,
    createdAt: now,
    updatedAt: now,
  };
  db.messages.push(message);
  await writeDb(db);
  return enrichMessage(message);
};

export const markMessagesRead = async ({ senderId, receiverId }) => {
  const db = await readDb();
  let updated = false;

  db.messages.forEach((message) => {
    if (message.senderId === senderId && message.receiverId === receiverId && !message.read) {
      message.read = true;
      message.updatedAt = nowIso();
      updated = true;
    }
  });

  if (updated) {
    await writeDb(db);
  }
};

export const getContactsForUser = async (userId) => {
  const db = await readDb();

  return db.users
    .filter((user) => user.id !== userId)
    .map((user) => {
      const conversation = db.messages
        .filter((message) => (
          (message.senderId === userId && message.receiverId === user.id) ||
          (message.senderId === user.id && message.receiverId === userId)
        ))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const latest = conversation[0];
      const unread = conversation.filter((message) => message.senderId === user.id && message.receiverId === userId && !message.read).length;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        lastMsg: latest?.text || 'No messages yet',
        time: latest?.createdAt || null,
        unread,
        online: false,
      };
    });
};

export const getUnreadCount = async (userId) => {
  const db = await readDb();
  return db.messages.filter((message) => message.receiverId === userId && !message.read).length;
};

import mongoose from 'mongoose';
import { config } from '../src/config.js';
import { User } from '../src/models/User.js';
import { Message } from '../src/models/Message.js';
import { Room } from '../src/models/Room.js';
import { Connection } from '../src/models/Connection.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const pickPrimaryUser = (users) => {
  return [...users].sort((left, right) => {
    if (left.role === 'admin' && right.role !== 'admin') return -1;
    if (left.role !== 'admin' && right.role === 'admin') return 1;
    return new Date(left.createdAt) - new Date(right.createdAt);
  })[0];
};

const remapUserReferences = async (fromUserId, toUserId) => {
  await Message.updateMany({ senderId: fromUserId }, { $set: { senderId: toUserId } });
  await Message.updateMany({ receiverId: fromUserId }, { $set: { receiverId: toUserId } });

  await Connection.updateMany(
    { requesterId: fromUserId },
    { $set: { requesterId: toUserId, requester: toUserId } }
  );
  await Connection.updateMany(
    { recipientId: fromUserId },
    { $set: { recipientId: toUserId, recipient: toUserId } }
  );
  await Connection.updateMany(
    { requester: fromUserId },
    { $set: { requesterId: toUserId, requester: toUserId } }
  );
  await Connection.updateMany(
    { recipient: fromUserId },
    { $set: { recipientId: toUserId, recipient: toUserId } }
  );

  await Room.updateMany({ createdBy: fromUserId }, { $set: { createdBy: toUserId } });
  await Room.updateMany(
    { participantIds: fromUserId },
    { $addToSet: { participantIds: toUserId }, $pull: { participantIds: fromUserId } }
  );
  await Room.updateMany(
    { 'messages.senderId': fromUserId },
    { $set: { 'messages.$[entry].senderId': toUserId } },
    { arrayFilters: [{ 'entry.senderId': fromUserId }] }
  );
};

const removeDuplicateConnections = async () => {
  const connections = await Connection.find().sort({ createdAt: 1 });
  const seen = new Map();
  const idsToDelete = [];

  for (const connection of connections) {
    const requester = connection.requesterId || connection.requester;
    const recipient = connection.recipientId || connection.recipient;
    if (!requester || !recipient) {
      idsToDelete.push(connection._id);
      continue;
    }

    const pair = [requester.toString(), recipient.toString()].sort().join(':');
    if (seen.has(pair)) {
      idsToDelete.push(connection._id);
      continue;
    }

    seen.set(pair, connection._id);
  }

  if (idsToDelete.length > 0) {
    await Connection.deleteMany({ _id: { $in: idsToDelete } });
  }

  return idsToDelete.length;
};

const ensureEmailUniqueness = async () => {
  await User.collection.dropIndex('email_1').catch(() => {});
  await User.collection.createIndex({ email: 1 }, { unique: true });
};

const main = async () => {
  if (!config.mongoUri) {
    throw new Error('MONGO_URI is required to run cleanupDatabase.js');
  }

  await mongoose.connect(config.mongoUri);

  const users = await User.find().sort({ createdAt: 1 });
  const groups = new Map();

  for (const user of users) {
    const normalizedEmail = normalizeEmail(user.email);
    user.email = normalizedEmail;
    await user.save();

    if (!groups.has(normalizedEmail)) groups.set(normalizedEmail, []);
    groups.get(normalizedEmail).push(user);
  }

  let removedUsers = 0;
  for (const [, groupedUsers] of groups.entries()) {
    if (groupedUsers.length < 2) continue;

    const primaryUser = pickPrimaryUser(groupedUsers);
    const duplicates = groupedUsers.filter((user) => user._id.toString() !== primaryUser._id.toString());

    for (const duplicate of duplicates) {
      await remapUserReferences(duplicate._id, primaryUser._id);
      await User.deleteOne({ _id: duplicate._id });
      removedUsers += 1;
    }
  }

  const removedConnections = await removeDuplicateConnections();
  await ensureEmailUniqueness();

  console.log(`Cleanup complete. Removed ${removedUsers} duplicate users and ${removedConnections} duplicate connections.`);
  await mongoose.disconnect();
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

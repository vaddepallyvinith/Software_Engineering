import mongoose from 'mongoose';
import { config } from '../src/config.js';
import { User } from '../src/models/User.js';

const email = String(process.argv[2] || '').trim().toLowerCase();

const main = async () => {
  if (!config.mongoUri) {
    throw new Error('MONGO_URI is required to run grantAdmin.js');
  }

  if (!email) {
    throw new Error('Usage: node scripts/grantAdmin.js <email>');
  }

  await mongoose.connect(config.mongoUri);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { role: 'admin' } },
    { new: true }
  );

  if (!user) {
    throw new Error(`User not found for email: ${email}`);
  }

  console.log(`Granted admin role to ${user.email}`);
  await mongoose.disconnect();
};

main().catch(async (error) => {
  console.error(error.message || error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

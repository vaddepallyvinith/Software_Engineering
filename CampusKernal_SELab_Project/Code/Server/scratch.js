import mongoose from 'mongoose';
import { config } from './src/config.js';
import { User } from './src/models/User.js';

async function check() {
  await mongoose.connect(config.mongoUri);
  const users = await User.find({}).lean();
  console.log("Users:", users.map(u => Object.keys(u)));
  if (users.length > 0) {
    console.log("First user:", users[0]);
  }
  process.exit(0);
}
check();

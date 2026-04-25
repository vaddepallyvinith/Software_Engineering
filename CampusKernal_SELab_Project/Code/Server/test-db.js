import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campuskernel')
  .then(async () => {
    const db = mongoose.connection.useDb('campuskernel'); // or whatever DB is named
    const users = await db.collection('users').find({}).toArray();
    console.log("Users in DB:", users.map(u => u.email));
    process.exit(0);
  }).catch(console.error);

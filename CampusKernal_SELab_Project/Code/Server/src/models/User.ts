import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the TypeScript Interface 
// This ensures that 'user.name' or 'user.profile.department' are recognized by TS
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because 'select: false' might exclude it
  role: 'student' | 'admin' | 'moderator';
  profile: {
    enrollmentNo?: string;
    department: string;
    avatar?: string;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the Mongoose Schema
const UserSchema: Schema<IUser> = new Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'], 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password'], 
    select: false 
  },
  
  // Role-Based Access Control (RBAC)
  role: { 
    type: String, 
    enum: ['student', 'admin', 'moderator'], 
    default: 'student' 
  },

  // Profile Details (Nested Object)
  profile: {
    enrollmentNo: { type: String },
    department: { type: String, default: 'SCIS' }, 
    avatar: { type: String }, 
  },

  // Account Status
  isVerified: { 
    type: Boolean, 
    default: false 
  },
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

// 3. Export the Model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;
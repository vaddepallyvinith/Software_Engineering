import mongoose, { Schema, Document, Model } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TypeScript Interface
//    This is the "blueprint" for what a User object looks like inside TypeScript.
//    By extending 'Document', Mongoose knows this interface maps to a MongoDB doc.
// ─────────────────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  // Basic identity
  name: string;
  email: string;
  password?: string;         // '?' means optional — excluded from queries by default (select:false)

  // Role-Based Access (future-proofing)
  role: 'student' | 'admin' | 'moderator';

  // Nested academic profile — all the new fields for global students
  profile: {
    universityName: string;  // e.g. "MIT", "VIT University", "University of Oxford"
    country: string;         // e.g. "India", "USA", "UK"
    course: string;          // e.g. "B.Tech Computer Science", "MSc Data Science"
    currentYear: number;     // Which year they are currently in  → 1, 2, 3, 4...
    yearOfGraduation: number;// e.g. 2027  (the calendar year they graduate)
    enrollmentNo?: string;   // Optional — some universities don't use enrolment numbers
    avatar?: string;         // URL to profile picture (set later via upload)
  };

  // Account status — used to gate features until email is verified (future sprint)
  isVerified: boolean;

  // Mongoose auto-manages these with { timestamps: true }
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Mongoose Schema
//    This is what actually talks to MongoDB.
//    Every field here maps directly to a column in the MongoDB collection.
// ─────────────────────────────────────────────────────────────────────────────
const UserSchema: Schema<IUser> = new Schema(
  {
    // ── Basic Identity ──────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,            // removes accidental spaces at start/end
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,          // ensures no two users share the same email
      lowercase: true,       // stores email as lowercase (john@gmail.com, not John@gmail.com)
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,         // NEVER returned in queries by default — must opt-in with '+password'
                             // This is a critical security measure
    },

    // ── Role ────────────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ['student', 'admin', 'moderator'], // only these 3 values are allowed
      default: 'student',    // every new user starts as a student
    },

    // ── Academic Profile (Nested Object) ────────────────────────────────────
    // MongoDB stores this as a nested sub-document inside the User document
    profile: {
      universityName: {
        type: String,
        required: [true, 'Please provide your university name'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Please provide your country'],
        trim: true,
      },
      course: {
        type: String,
        required: [true, 'Please provide your course/degree name'],
        trim: true,          // e.g. "B.Tech Computer Science", "MBA", "BSc Physics"
      },
      currentYear: {
        type: Number,
        required: [true, 'Please provide your current year of study'],
        min: [1, 'Year of study must be at least 1'],
        max: [10, 'Year of study cannot exceed 10'], // covers even long programs like MBBS
      },
      yearOfGraduation: {
        type: Number,
        required: [true, 'Please provide your expected year of graduation'],
        min: [2000, 'Graduation year seems too far in the past'],
        max: [2100, 'Graduation year seems too far in the future'],
      },
      enrollmentNo: {
        type: String,        // Optional — not all universities assign enrolment numbers
      },
      avatar: {
        type: String,        // Will store a URL (e.g. from Cloudinary) set after registration
      },
    },

    // ── Account Status ──────────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,        // users start as unverified; email verification in a future sprint
    },
  },
  {
    timestamps: true,        // Mongoose auto-adds 'createdAt' and 'updatedAt' fields
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Export the Model
//    mongoose.model('User', UserSchema) does two things:
//      a) Creates (or reuses) a MongoDB collection called 'users' (lowercase plural)
//      b) Returns a Model class you can use to run .find(), .save(), etc.
// ─────────────────────────────────────────────────────────────────────────────
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;
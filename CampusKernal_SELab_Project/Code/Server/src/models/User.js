import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subject: { type: String, default: '' },
  deadline: { type: String },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'Not Started' },
});

TaskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const EventSchema = new mongoose.Schema({
  date: String,
  title: { type: String, default: '' },
  time: String,
  room: { type: String, default: '' },
});

EventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const RecordSchema = new mongoose.Schema({
  subject: { type: String, default: '' },
  credits: { type: Number, default: 0 },
  grade: String,
  semester: { type: Number, default: 1 },
  finalized: { type: Boolean, default: false },
});

RecordSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const ProfileSchema = new mongoose.Schema({
  universityName: { type: String, default: '' },
  country: { type: String, default: '' },
  course: { type: String, default: '' },
  currentYear: { type: Number, default: 1 },
  yearOfGraduation: { type: Number },
  enrollmentNo: { type: String, default: '' },
  skills: [{ type: String }],
  location: { type: String, default: '' },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, default: null },
  password: { type: String, default: null },
  role: { type: String, default: 'student' },
  isVerified: { type: Boolean, default: true },
  profile: { type: ProfileSchema, default: () => ({}) },
  cgpa: { type: Number, default: 0 },
  tasks: [TaskSchema],
  events: [EventSchema],
  records: [RecordSchema],
  resetToken: { type: String, default: null },
  resetTokenExpiresAt: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: String, default: null },
}, { timestamps: true });

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

export const User = mongoose.model('User', UserSchema);

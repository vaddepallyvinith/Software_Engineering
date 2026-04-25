import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toPublicUser = (userDoc) => {
  const user = userDoc.toJSON ? userDoc.toJSON() : userDoc;
  return {
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    profile: user.profile,
    cgpa: user.cgpa,
    tasks: (user.tasks || []).map((task) => ({ ...task, _id: task.id })),
    events: (user.events || []).map((event) => ({ ...event, _id: event.id })),
    records: (user.records || []).map((record) => ({ ...record, _id: record.id })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const getPublicUserById = async (userId) => {
  const user = await User.findById(userId);
  return user ? toPublicUser(user) : null;
};

export const getUserByEmail = async (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  return await User.findOne({ email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i') });
};

export const createUser = async (payload) => {
  const email = String(payload.email || '').trim().toLowerCase();

  const existing = await User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, 'i') });
  if (existing) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = new User({
    name: String(payload.name || '').trim(),
    email,
    passwordHash,
    role: 'student',
    isVerified: true,
    profile: {
      universityName: String(payload.universityName || '').trim(),
      country: String(payload.country || '').trim(),
      course: String(payload.course || '').trim(),
      currentYear: Number(payload.currentYear || 1),
      yearOfGraduation: Number(payload.yearOfGraduation || new Date().getFullYear()),
      enrollmentNo: String(payload.enrollmentNo || '').trim(),
      skills: Array.isArray(payload.skills) ? payload.skills.filter(Boolean) : [],
      location: String(payload.location || '').trim(),
    },
    cgpa: 0,
    tasks: [],
    events: [],
    records: [],
  });

  await user.save();
  return toPublicUser(user);
};

export const verifyUserPassword = async (user, password) => {
  const storedHash = user.passwordHash || user.password;
  if (!storedHash) return false;
  return bcrypt.compare(password, storedHash);
};

export const updateUser = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (typeof updates.name === 'string') user.name = updates.name.trim();
  if (typeof updates.course === 'string') user.profile.course = updates.course.trim();
  if (typeof updates.universityName === 'string') user.profile.universityName = updates.universityName.trim();
  if (typeof updates.country === 'string') user.profile.country = updates.country.trim();
  if (typeof updates.location === 'string') user.profile.location = updates.location.trim();
  if (Array.isArray(updates.skills)) user.profile.skills = updates.skills.filter(Boolean);
  if (typeof updates.cgpa !== 'undefined') user.cgpa = Number(updates.cgpa || 0);
  
  if (Array.isArray(updates.tasks)) {
    user.tasks = updates.tasks;
  }
  if (Array.isArray(updates.events)) {
    user.events = updates.events;
  }
  if (Array.isArray(updates.records)) {
    user.records = updates.records;
  }

  await user.save();
  return toPublicUser(user);
};

export const setResetToken = async (email, token, expiresAt) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i') });
  if (!user) return null;
  user.resetToken = token;
  user.resetTokenExpiresAt = expiresAt;
  user.resetPasswordToken = token;
  user.resetPasswordExpire = expiresAt;
  await user.save();
  return user;
};

export const resetPasswordWithToken = async (token, password) => {
  const user = await User.findOne({ 
    $or: [
      {
        resetToken: token,
        resetTokenExpiresAt: { $gt: new Date().toISOString() }
      },
      {
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: new Date().toISOString() }
      }
    ]
  });
  if (!user) return null;
  const newHash = await bcrypt.hash(password, 10);
  user.passwordHash = newHash;
  user.password = newHash;
  user.resetToken = null;
  user.resetTokenExpiresAt = null;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();
  return toPublicUser(user);
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  const storedHash = user.passwordHash || user.password;
  if (!storedHash) {
    throw new Error('Password is not set for this account');
  }

  const isValid = await bcrypt.compare(currentPassword, storedHash);
  if (!isValid) {
    throw new Error('Incorrect current password');
  }
  
  const newHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newHash;
  user.password = newHash;
  await user.save();
  return true;
};

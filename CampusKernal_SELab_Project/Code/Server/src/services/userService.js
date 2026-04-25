import bcrypt from 'bcryptjs';
import { readDb, writeDb } from '../data/db.js';
import { createId } from '../utils/ids.js';
import { nowIso } from '../utils/time.js';

const sanitizeTask = (task) => ({
  id: task.id || createId(),
  title: String(task.title || '').trim(),
  subject: String(task.subject || '').trim(),
  deadline: task.deadline,
  priority: task.priority || 'Medium',
  status: task.status || 'Not Started',
});

const sanitizeEvent = (event) => ({
  id: event.id || createId(),
  date: event.date,
  title: String(event.title || '').trim(),
  time: event.time,
  room: String(event.room || '').trim(),
});

const sanitizeRecord = (record) => ({
  id: record.id || createId(),
  subject: String(record.subject || '').trim(),
  credits: Number(record.credits || 0),
  grade: record.grade,
  semester: Number(record.semester || 1),
  finalized: Boolean(record.finalized),
});

const toPublicUser = (user) => ({
  _id: user.id,
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  profile: user.profile,
  cgpa: user.cgpa,
  tasks: user.tasks.map((task) => ({ ...task, _id: task.id })),
  events: user.events.map((event) => ({ ...event, _id: event.id })),
  records: user.records.map((record) => ({ ...record, _id: record.id })),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getPublicUserById = async (userId) => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  return user ? toPublicUser(user) : null;
};

export const getUserByEmail = async (email) => {
  const db = await readDb();
  return db.users.find((user) => user.email.toLowerCase() === String(email || '').toLowerCase()) || null;
};

export const createUser = async (payload) => {
  const db = await readDb();
  const email = String(payload.email || '').trim().toLowerCase();

  if (db.users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const now = nowIso();
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = {
    id: createId(),
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
    resetToken: null,
    resetTokenExpiresAt: null,
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(user);
  await writeDb(db);
  return toPublicUser(user);
};

export const verifyUserPassword = async (user, password) => bcrypt.compare(password, user.passwordHash);

export const updateUser = async (userId, updates) => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) return null;

  if (typeof updates.name === 'string') user.name = updates.name.trim();
  if (typeof updates.course === 'string') user.profile.course = updates.course.trim();
  if (typeof updates.universityName === 'string') user.profile.universityName = updates.universityName.trim();
  if (typeof updates.country === 'string') user.profile.country = updates.country.trim();
  if (typeof updates.location === 'string') user.profile.location = updates.location.trim();
  if (Array.isArray(updates.skills)) user.profile.skills = updates.skills.filter(Boolean);
  if (typeof updates.cgpa !== 'undefined') user.cgpa = Number(updates.cgpa || 0);
  if (Array.isArray(updates.tasks)) user.tasks = updates.tasks.map(sanitizeTask);
  if (Array.isArray(updates.events)) user.events = updates.events.map(sanitizeEvent);
  if (Array.isArray(updates.records)) user.records = updates.records.map(sanitizeRecord);
  user.updatedAt = nowIso();

  await writeDb(db);
  return toPublicUser(user);
};

export const setResetToken = async (email, token, expiresAt) => {
  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user) return null;
  user.resetToken = token;
  user.resetTokenExpiresAt = expiresAt;
  user.updatedAt = nowIso();
  await writeDb(db);
  return user;
};

export const resetPasswordWithToken = async (token, password) => {
  const db = await readDb();
  const user = db.users.find((item) => item.resetToken === token && item.resetTokenExpiresAt && new Date(item.resetTokenExpiresAt) > new Date());
  if (!user) return null;
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExpiresAt = null;
  user.updatedAt = nowIso();
  await writeDb(db);
  return toPublicUser(user);
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) throw new Error('User not found');
  
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error('Incorrect current password');
  }
  
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.updatedAt = nowIso();
  await writeDb(db);
  return true;
};


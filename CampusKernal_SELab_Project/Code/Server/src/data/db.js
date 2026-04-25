import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { createId } from '../utils/ids.js';
import { nowIso } from '../utils/time.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.json');

const makeTask = (task) => ({
  id: task.id || createId(),
  title: task.title,
  subject: task.subject,
  deadline: task.deadline,
  priority: task.priority || 'Medium',
  status: task.status || 'Not Started',
});

const makeEvent = (event) => ({
  id: event.id || createId(),
  date: event.date,
  title: event.title,
  time: event.time,
  room: event.room || '',
});

const makeRecord = (record) => ({
  id: record.id || createId(),
  subject: record.subject,
  credits: Number(record.credits || 0),
  grade: record.grade,
  semester: Number(record.semester || 1),
  finalized: Boolean(record.finalized),
});

const seedUsers = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1Id = createId();
  const user2Id = createId();
  const user3Id = createId();
  const roomId = createId();
  const connectionId = createId();
  const messageId = createId();
  const now = nowIso();

  return {
    users: [
      {
        id: user1Id,
        name: 'Aarav Sharma',
        email: 'aarav@campuskernel.dev',
        passwordHash,
        role: 'student',
        isVerified: true,
        profile: {
          universityName: 'University of Hyderabad',
          country: 'India',
          course: 'B.Tech Computer Science',
          currentYear: 3,
          yearOfGraduation: 2027,
          enrollmentNo: 'UOH-CS-2023-014',
          skills: ['React', 'Node.js', 'UI/UX'],
          location: 'North Hostel',
        },
        cgpa: 8.72,
        tasks: [
          makeTask({
            title: 'Database Design Review',
            subject: 'Software Engineering',
            deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
            priority: 'High',
            status: 'In Progress',
          }),
        ],
        events: [
          makeEvent({
            date: new Date().toISOString().split('T')[0],
            title: 'SE Lab Standup',
            time: '14:00',
            room: 'Lab 204',
          }),
        ],
        records: [
          makeRecord({ subject: 'Algorithms', credits: 4, grade: 'A+', semester: 4, finalized: false }),
          makeRecord({ subject: 'Operating Systems', credits: 4, grade: 'A', semester: 4, finalized: false }),
        ],
        resetToken: null,
        resetTokenExpiresAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: user2Id,
        name: 'Bhavani Singh',
        email: 'bhavani@campuskernel.dev',
        passwordHash,
        role: 'student',
        isVerified: true,
        profile: {
          universityName: 'University of Hyderabad',
          country: 'India',
          course: 'B.Tech Computer Science',
          currentYear: 3,
          yearOfGraduation: 2027,
          enrollmentNo: 'UOH-CS-2023-021',
          skills: ['Node.js', 'MongoDB', 'System Design'],
          location: 'Library Block',
        },
        cgpa: 8.56,
        tasks: [],
        events: [],
        records: [],
        resetToken: null,
        resetTokenExpiresAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: user3Id,
        name: 'Ananya Rao',
        email: 'ananya@campuskernel.dev',
        passwordHash,
        role: 'student',
        isVerified: true,
        profile: {
          universityName: 'University of Hyderabad',
          country: 'India',
          course: 'B.Des Interaction Design',
          currentYear: 2,
          yearOfGraduation: 2028,
          enrollmentNo: 'UOH-DES-2024-006',
          skills: ['UI/UX', 'Figma', 'Research'],
          location: 'Design Studio',
        },
        cgpa: 8.91,
        tasks: [],
        events: [],
        records: [],
        resetToken: null,
        resetTokenExpiresAt: null,
        createdAt: now,
        updatedAt: now,
      },
    ],
    connections: [
      {
        id: connectionId,
        requesterId: user2Id,
        recipientId: user1Id,
        status: 'accepted',
        createdAt: now,
        updatedAt: now,
      },
    ],
    messages: [
      {
        id: messageId,
        senderId: user2Id,
        receiverId: user1Id,
        text: 'Ready for the SE lab sync later?',
        read: false,
        createdAt: now,
        updatedAt: now,
      },
    ],
    rooms: [
      {
        id: roomId,
        topic: 'SE Lab Architecture Review',
        category: 'Study',
        maxParticipants: 6,
        createdBy: user1Id,
        participantIds: [user1Id],
        messages: [],
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
};

let cache = null;

const ensureDb = async () => {
  try {
    await fs.access(dbPath);
    const raw = await fs.readFile(dbPath, 'utf8');
    const parsed = raw.trim() ? JSON.parse(raw) : {};
    if (!Array.isArray(parsed.users)) {
      const seeded = await seedUsers();
      await fs.writeFile(dbPath, JSON.stringify(seeded, null, 2));
    }
  } catch {
    const seeded = await seedUsers();
    await fs.writeFile(dbPath, JSON.stringify(seeded, null, 2));
  }
};

export const readDb = async () => {
  if (cache) return cache;
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  cache = JSON.parse(raw);
  return cache;
};

export const writeDb = async (db) => {
  cache = db;
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  return db;
};

# Campus Kernel

Campus Kernel is a full-stack student collaboration platform with:

- `Me Space` for profile, tasks, records, and events
- `Synergy Space` for peer discovery and connection requests
- `We Space` for study rooms, live presence, chat, and WebRTC signaling
- JWT-based authentication and password reset email support

The backend now uses `MongoDB Atlas` through `mongoose`. Local JSON-file storage is no longer part of the runtime architecture.

## Project Structure

```text
Code/
├── Frontend/
│   └── campus-kernel-client/
└── Server/
    ├── package.json
    ├── .env
    └── src/
        ├── index.js
        ├── config.js
        ├── auth.js
        ├── mailer.js
        ├── socket.js
        ├── models/
        ├── routes/
        ├── services/
        └── utils/
```

## Tech Stack

### Frontend

- `React`
- `Vite`
- `React Router`
- `Axios`
- `socket.io-client`

### Backend

- `Node.js`
- `Express`
- `Socket.IO`
- `mongoose`
- `jsonwebtoken`
- `bcryptjs`
- `nodemailer`
- `dotenv`

## Backend Architecture

The backend is organized in a standard API flow:

- `routes/` exposes HTTP endpoints
- `services/` contains business logic
- `models/` defines MongoDB collections and embedded schemas
- `auth.js` validates JWTs
- `socket.js` handles real-time messaging, room presence, and WebRTC signaling
- `config.js` centralizes environment variables

### MongoDB Models

- `User`: authentication, profile, tasks, events, academic records, password reset token
- `Message`: direct messages between users
- `Room`: study room metadata, participants, and embedded room messages
- `Connection`: connection requests between users

## Environment Variables

Create `Server/.env` with values like:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-this-with-a-strong-secret
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user@example.com
SMTP_PASS=your-password
SMTP_FROM=Campus Kernel <no-reply@example.com>
```

Notes:

- `MONGO_URI` is required for persistent app data.
- If `MONGO_URI` is missing, the server still starts but database-backed features will fail at runtime.
- SMTP is optional. If it is not configured, forgot-password email sending will return an error message.

## Installation

### Backend

```bash
cd Server
npm install
```

### Frontend

```bash
cd Frontend/campus-kernel-client
npm install
```

## Running Locally

Start the backend:

```bash
cd Server
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend/campus-kernel-client
npm run dev
```

Default local URLs:

- frontend: `http://localhost:5173`
- backend API: `http://localhost:5001`

The frontend uses `VITE_API_URL` if provided; otherwise it defaults to `http://localhost:5001/api`.

## Main API Areas

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

### Me Space

- `GET /api/me`
- `PUT /api/me/update`
- `PUT /api/me/password`

### Messages

- `GET /api/messages/contacts`
- `GET /api/messages/unread`
- `GET /api/messages/:peerId`

### Study Rooms

- `GET /api/rooms`
- `POST /api/rooms`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`

### Synergy

- `GET /api/synergy/matches`
- `GET /api/synergy/network`
- `POST /api/synergy/connect/:userId`
- `PUT /api/synergy/accept/:userId`

## Socket Events

Implemented in [src/socket.js](/Users/shankar/Documents/CampusKernal/Software_Engineering/CampusKernal_SELab_Project/Code/Server/src/socket.js):

- `join`
- `send_message`
- `receive_message`
- `mark_read`
- `messages_read`
- `join_study_room`
- `leave_study_room`
- `room_updated`
- `room_message`
- `webrtc_signal`
- `screen_share_status`
- `admin_deleted_room`

## Atlas Migration Notes

The current codebase is already using MongoDB-backed services and Mongoose models. The main migration-sensitive points are:

- user, room, message, and connection data now rely on Mongo document IDs
- user profile data, tasks, events, and records are stored on the `User` document
- direct messages are stored in the `Message` collection
- study room participants are stored as `ObjectId` references to `User`
- room membership checks must compare `ObjectId` values correctly, not with plain array equality

## Current Review Result

The MongoDB Atlas migration is mostly wired correctly:

- `mongoose` is installed and imported
- `MONGO_URI` is read from environment config
- models and services use MongoDB instead of local JSON files
- the previous README content was outdated and referenced removed `data/db.js` and `database.json`

One concrete issue was fixed:

- room participant membership in `joinRoom()` was using `includes(userId)`, which does not work reliably with Mongo `ObjectId` values and could allow duplicate joins

## Known Operational Notes

- The server currently starts listening even if MongoDB is not connected. That is acceptable for development, but production startup would be safer if it failed fast on database connection errors.
- Room chat socket events are broadcast live, but they are not currently persisted into the `Room.messages` array.
- The repository contains a real `Server/.env` file. If it contains actual credentials, rotate them and avoid committing secrets.

## Important Files

- [Server/src/index.js](/Users/shankar/Documents/CampusKernal/Software_Engineering/CampusKernal_SELab_Project/Code/Server/src/index.js)
- [Server/src/config.js](/Users/shankar/Documents/CampusKernal/Software_Engineering/CampusKernal_SELab_Project/Code/Server/src/config.js)
- [Server/src/models/User.js](/Users/shankar/Documents/CampusKernal/Software_Engineering/CampusKernal_SELab_Project/Code/Server/src/models/User.js)

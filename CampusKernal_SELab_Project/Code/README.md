# Campus Kernel

Campus Kernel is a student collaboration app with three main areas:

- `Me Space`: personal dashboard for tasks, timetable events, grades, and CGPA.
- `We Space`: peer matching, connection requests, live study rooms, and quick chat.
- `Messages`: direct real-time messaging between users.

This version was simplified on purpose:

- The backend is plain JavaScript.
- The database is a single JSON file.
- The code is split into small routes and services instead of TypeScript models/controllers.

## Project Structure

```text
Code/
├── Frontend/campus-kernel-client
│   ├── src/pages
│   ├── src/components
│   └── src/services/api.js
└── Server
    ├── src/index.js
    ├── src/auth.js
    ├── src/socket.js
    ├── src/data/database.json
    ├── src/data/db.js
    ├── src/routes
    └── src/services
```

## Backend Design

The backend uses `Express + Socket.IO + JWT`.

### 1. Data storage

All persistent data lives in:

- `Server/src/data/database.json`

The file stores four main collections:

- `users`
- `connections`
- `messages`
- `rooms`

On first run, the server seeds demo users, messages, a room, and one accepted connection.

### 2. Services

Business logic is kept in small service files:

- `src/services/userService.js`
- `src/services/messageService.js`
- `src/services/roomService.js`
- `src/services/synergyService.js`

These files read and write the JSON database and keep route handlers small.

### 3. Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/me`
- `PUT /api/me/update`
- `GET /api/messages/contacts`
- `GET /api/messages/unread`
- `GET /api/messages/:peerId`
- `GET /api/rooms`
- `POST /api/rooms`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`
- `GET /api/synergy/matches`
- `GET /api/synergy/network`
- `POST /api/synergy/connect/:userId`
- `PUT /api/synergy/accept/:userId`

### 4. Authentication

- JWT tokens are created in `src/auth.js`.
- Protected routes use `requireAuth`.
- The frontend stores the token in `localStorage`.
- `src/services/api.js` automatically adds `Authorization: Bearer <token>`.

### 5. Real-time features

`src/socket.js` handles:

- direct chat messages
- message read receipts
- study room presence
- room live chat
- WebRTC signaling
- screen share status

## Frontend Design

The frontend is React + Vite.

### Main pages

- `Login` and `Register`: authentication.
- `ForgotPassword` and `ResetPassword`: password reset by email.
- `MeSpace`: personal academic dashboard.
- `WeSpace`: peer matching, study rooms, and quick popup chat.
- `Messages`: full direct messaging screen.
- `Settings`: profile editing.

### How the main features work

#### Me Space

- Tasks are edited in `TaskList.jsx`.
- Calendar events are edited in `EventsCalendar.jsx`.
- Academic records and CGPA are edited in `PerformanceTracker.jsx`.
- All of them save through `PUT /api/me/update`.

#### We Space

- Synergy cards come from `GET /api/synergy/matches`.
- Connection requests and accepted peers come from `GET /api/synergy/network`.
- Study rooms come from `GET /api/rooms`.
- Room create/edit/delete uses the room endpoints.
- Live room state updates come through Socket.IO.

#### Messages

- Contacts come from `GET /api/messages/contacts`.
- Message history comes from `GET /api/messages/:peerId`.
- New messages are sent with Socket.IO.
- Read status is updated with the `mark_read` socket event.

## Setup

### Backend

From `Code/Server`:

```bash
npm install
npm run dev
```

The backend starts on `http://localhost:5001`.

Important files:

- `.env`
- `src/data/database.json`

Current `.env` values:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=campus-kernel-dev-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM="Campus Kernel <your-email@example.com>"
```

For Gmail, use an app password instead of your normal account password.

### Frontend

From `Code/Frontend/campus-kernel-client`:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

Optional frontend env:

```env
VITE_API_URL=http://localhost:5001/api
```

## Demo Accounts

All seeded users use the same password:

- `aarav@campuskernel.dev`
- `bhavani@campuskernel.dev`
- `ananya@campuskernel.dev`

Password:

```text
password123
```

## Simplifications Made

- Removed MongoDB and Mongoose.
- Removed TypeScript backend code.
- Replaced complex backend layers with simple JavaScript services.
- Password reset now sends a real email through SMTP.
- Settings save now updates the backend.
- Quick chat popup now uses real API/socket data instead of static mock messages.

## Verification

Checked successfully:

- backend JavaScript syntax with `node --check`
- frontend production build with `npm run build`

Note:

- Starting the backend listener inside this sandbox was blocked by port permissions (`EPERM`), so runtime socket testing could not be completed inside the sandbox itself.

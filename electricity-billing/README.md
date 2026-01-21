IMTECH ELECTRICITY BILLING SYSTEM
HOW TO RUN THE PROJECT
===============================

PREREQUISITES
-------------
1. Node.js (v18 or above)
2. MongoDB (running locally)
3. Web Browser (Chrome / Firefox)
4. VS Code (recommended)

--------------------------------

PROJECT STRUCTURE
-----------------
electricity-billing/
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── index.html
│   ├── App.js
│
--------------------------------

STEP 1: START MONGODB
--------------------
Open a terminal and run:

mongod

(Leave this terminal running)

--------------------------------

STEP 2: START BACKEND SERVER
----------------------------
Open a new terminal.

cd backend
npm install
node server.js

You should see:
"MongoDB Connected"
"Server running on http://localhost:5000"

--------------------------------

STEP 3: SEED ADMIN & EMPLOYEES
------------------------------
Open a browser and go to:

http://localhost:5000/seed

You should see:
"Seed completed"

This creates:
- 1 Admin
- 4 Employees (North, South, East, West)

--------------------------------

STEP 4: RUN FRONTEND
--------------------
Open the frontend folder.

Open index.html using:
- Live Server (recommended)
OR
- Double click index.html

--------------------------------

DEFAULT LOGIN CREDENTIALS
-------------------------

ADMIN:
Email: admin@test.com
Password: admin

EMPLOYEES:
North  → north@test.com / emp
South  → south@test.com / emp
East   → east@test.com / emp
West   → west@test.com / emp

CONSUMER:
- Register using the "Register Consumer" option
- Service Number is auto-generated
- Login using registered email & password

--------------------------------

PROJECT FLOW
------------
1. Admin can view consumers & employees
2. Employee generates bills (zone restricted)
3. Consumer views bills & pays dues
4. Partial payments are supported
5. Due date is 15 days from bill generation

--------------------------------

IMPORTANT NOTES
---------------
- MongoDB must be running before backend
- Seed must be executed at least once
- Use correct employee zone while generating bill
- Only latest unpaid bill can be paid

--------------------------------

END OF FILE

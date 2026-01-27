const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Bill = require("./models/Bill");
const { calculateBill } = require("./utils/billCalculator");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body-parser

const JWT_SECRET = "your_jwt_secret_key_senior_dev"; // In prod, use .env

/* ================= DB CONNECTION ================= */
mongoose.connect("mongodb://127.0.0.1:27017/electricity-app") // Updated DB name as per requirements
  .then(() => {
    console.log("MongoDB Connected");
    initializeAdmin();
  })
  .catch(err => console.error(err));

async function initializeAdmin() {
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    // Need to create admin manually if schema requires hashing
    // This direct create might bypass pre-save hook in some Mongoose versions depending on how it's called, 
    // but 'create' usually triggers it.
    try {
      await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: "admin1",
        role: "admin",
        mobile: "0000000000"
      });
      console.log("Admin account created: admin@test.com / admin1");
    } catch (e) { console.log("Admin init error:", e.message); }
  }
}

/* ================= AUTH MIDDLEWARE ================= */
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access required" });
};

const employee = (req, res, next) => {
  if (req.user && (req.user.role === "employee" || req.user.role === "admin")) next();
  else res.status(403).json({ message: "Employee access required" });
};

/* ================= ROUTES ================= */

// AUTH: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (role && user.role !== role && !(role === 'consumer' && user.role === 'user')) {
        return res.status(401).json({ message: "Role mismatch" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        serviceNo: user.serviceNo,
        zone: user.zone,
        token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" })
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AUTH: Register (User/Consumer)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, mobile, email, address, pincode, password, category, zone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name, mobile, email, address, pincode, password,
      role: "user",
      category, zone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        serviceNo: user.serviceNo,
        token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" })
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Register Employee
app.post("/admin/register-employee", protect, admin, async (req, res) => {
  try {
    const { name, email, password, zone, mobile } = req.body;
    const user = await User.create({
      name, email, password, zone, mobile,
      role: "employee"
    });
    res.status(201).json({ message: "Employee Registered", serviceNo: user.serviceNo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// BILLS: Create (Employee)
app.post("/api/bills/create", protect, employee, async (req, res) => {
  const { serviceNo, currentReading, employeeZone } = req.body;

  const consumer = await User.findOne({ serviceNo });
  if (!consumer) return res.status(404).json({ message: "Consumer not found" });

  const curr = Number(currentReading);
  if (isNaN(curr) || curr < consumer.meterReading) {
    return res.status(400).json({ message: "Invalid Reading" });
  }

  const lastBill = await Bill.findOne({ user: consumer._id }).sort({ billDate: -1 });
  const units = curr - consumer.meterReading;

  const { billAmount, previousDue, fineAmount, totalAmount } = calculateBill(consumer.category, units, lastBill);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  const bill = await Bill.create({
    user: consumer._id,
    serviceNo: consumer.serviceNo,
    prevReading: consumer.meterReading,
    currentReading: curr,
    units,
    amount: billAmount,
    billAmount,
    previousDue,
    fineAmount,
    totalAmount,
    dueAmount: totalAmount,
    status: "Pending",
    dueDate
  });

  consumer.meterReading = curr;
  await consumer.save();

  res.status(201).json({ bill, consumer });
});

// BILLS: My Bills (User)
app.get("/api/bills/my-bills", protect, async (req, res) => {
  const bills = await Bill.find({ user: req.user._id }).sort({ billDate: -1 });
  res.json({ user: req.user, bills });
});

// ADMIN: Get All Users
app.get("/api/users", protect, admin, async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  // Aggregate due amounts
  const result = [];
  for (let u of users) {
    const bills = await Bill.find({ user: u._id, status: "Pending" });
    const totalDue = bills.reduce((acc, b) => acc + b.dueAmount, 0);
    result.push({ ...u.toObject(), totalDue });
  }
  res.json(result);
});

// ADMIN: Get Employees
app.get("/admin/employees", protect, admin, async (req, res) => {
  const emps = await User.find({ role: "employee" });
  res.json(emps);
});

// BILLS: Pay (User)
app.post("/pay-bill", protect, async (req, res) => {
  const { billId, transactionId, payAmount } = req.body;
  const bill = await Bill.findById(billId);

  if (!bill) return res.status(404).json({ message: "Bill not found" });
  if (req.user.role === 'user' && bill.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not your bill" });
  }

  bill.paidAmount += Number(payAmount);
  bill.dueAmount = bill.totalAmount - bill.paidAmount;
  bill.payments.push({ transactionId, amount: Number(payAmount), date: new Date() });

  if (bill.dueAmount <= 0) bill.status = "Paid";

  await bill.save();
  res.json({ message: "Paid", remaining: bill.dueAmount });
});

const PORT = 5200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

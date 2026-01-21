const express = require("express");
const mongoose = require("../../normal/node_modules/mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/electricityDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* ================= MODELS ================= */

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  address: String,
  pincode: String,
  password: String,

  role: String,           // admin | employee | consumer
  category: String,       // household | commercial | industry
  zone: String,           // North | South | East | West

  serviceNo: String,
  meterReading: { type: Number, default: 0 }
});

const CounterSchema = new mongoose.Schema({
  category: String,
  count: Number
});

const BillSchema = new mongoose.Schema({
  serviceNo: String,

  prevReading: Number,
  currentReading: Number,
  units: Number,

  billAmount: Number,
  previousDue: Number,
  totalAmount: Number,

  paidAmount: { type: Number, default: 0 },
  dueAmount: Number,

  billDate: { type: Date, default: Date.now },
  dueDate: Date,
  previousBillDate: Date,

  status: { type: String, default: "UNPAID" }
});

const User = mongoose.model("User", UserSchema);
const Counter = mongoose.model("Counter", CounterSchema);
const Bill = mongoose.model("Bill", BillSchema);

/* ================= SERVICE NUMBER ================= */

const prefix = {
  household: "HH",
  commercial: "CM",
  industry: "IN"
};

async function generateServiceNo(category) {
  let counter = await Counter.findOne({ category });
  if (!counter) counter = new Counter({ category, count: 1 });
  else counter.count++;
  await counter.save();

  return prefix[category] + String(counter.count).padStart(6, "0");
}

/* ================= SEED ================= */
app.get("/seed", async (req, res) => {
  await User.deleteMany({ role: { $in: ["admin", "employee"] } });

  await User.create([
    { name: "Admin", email: "admin@test.com", password: "admin", role: "admin" },
    { name: "Employee North", email: "north@test.com", password: "emp", role: "employee", zone: "North" },
    { name: "Employee South", email: "south@test.com", password: "emp", role: "employee", zone: "South" },
    { name: "Employee East", email: "east@test.com", password: "emp", role: "employee", zone: "East" },
    { name: "Employee North", email: "north@test.com", password: "emp", role: "employee", zone: "w" }
  ]);

  res.send("Seed completed");
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) return res.status(401).json({ message: "Invalid login" });

  res.json({
    role: user.role,
    name: user.name,
    serviceNo: user.serviceNo || null,
    zone: user.zone || null
  });
});

/* ================= REGISTER CONSUMER ================= */
app.post("/register-consumer", async (req, res) => {
  const { name, mobile, email, address, pincode, password, category, zone } = req.body;

  const serviceNo = await generateServiceNo(category);

  await User.create({
    name,
    mobile,
    email,
    address,
    pincode,
    password,
    role: "consumer",
    category,
    zone,
    serviceNo
  });

  res.json({ serviceNo });
});

/* ================= GENERATE BILL ================= */
app.post("/generate-bill", async (req, res) => {
  const { serviceNo, currentReading, employeeZone } = req.body;

  const user = await User.findOne({ serviceNo });
  if (!user) return res.status(404).json({ message: "Service not found" });
  if (user.zone !== employeeZone)
    return res.status(403).json({ message: "Zone mismatch" });

  const curr = Number(currentReading);
  if (isNaN(curr) || curr < user.meterReading)
    return res.status(400).json({ message: "Invalid meter reading" });

  const lastBill = await Bill.findOne({ serviceNo }).sort({ billDate: -1 });

  const units = curr - user.meterReading;
  const rate = { household: 2.5, commercial: 5, industry: 8 };

  const billAmount = units * rate[user.category];
  const previousDue = lastBill && lastBill.dueAmount > 0 ? lastBill.dueAmount : 0;
  const totalAmount = billAmount + previousDue;

  const billDate = new Date();
  const dueDate = new Date(billDate);
  dueDate.setDate(dueDate.getDate() + 15);

  await Bill.create({
    serviceNo,
    prevReading: user.meterReading,
    currentReading: curr,
    units,
    billAmount,
    previousDue,
    totalAmount,
    paidAmount: 0,
    dueAmount: totalAmount,
    billDate,
    dueDate,
    previousBillDate: lastBill ? lastBill.billDate : null
  });

  user.meterReading = curr;
  await user.save();

  res.json({ message: "Bill generated successfully" });
});

/* ================= PAY BILL ================= */
app.post("/pay-bill", async (req, res) => {
  const { serviceNo, payAmount } = req.body;

  const bill = await Bill.findOne({ serviceNo, status: "UNPAID" })
    .sort({ billDate: -1 });

  if (!bill) return res.status(404).json({ message: "No unpaid bill" });

  bill.paidAmount += Number(payAmount);
  bill.dueAmount = bill.totalAmount - bill.paidAmount;

  if (bill.dueAmount <= 0) {
    bill.status = "PAID";
    bill.dueAmount = 0;
  }

  await bill.save();
  res.json({ message: "Payment successful", remainingDue: bill.dueAmount });
});

/* ================= VIEW BILLS ================= */
app.get("/bills/:serviceNo", async (req, res) => {
  const user = await User.findOne({ serviceNo: req.params.serviceNo });
  const bills = await Bill.find({ serviceNo: req.params.serviceNo })
    .sort({ billDate: -1 });

  res.json({ user, bills });
});

/* ================= ADMIN ================= */
app.get("/admin/users", async (req, res) => {
  const consumers = await User.find({ role: "consumer" });
  const result = [];

  for (let u of consumers) {
    const bills = await Bill.find({ serviceNo: u.serviceNo });
    const totalDue = bills.reduce((sum, b) => sum + b.dueAmount, 0);

    result.push({
      name: u.name,
      serviceNo: u.serviceNo,
      category: u.category,
      zone: u.zone,
      totalDue
    });
  }

  res.json(result);
});

app.get("/admin/employees", async (req, res) => {
  res.json(await User.find({ role: "employee" }));
});

/* ================= ADMIN VIEW CONSUMER BILLS ================= */
app.get("/admin/bills/:serviceNo", async (req, res) => {
  try {
    const bills = await Bill.find({ serviceNo: req.params.serviceNo })
      .sort({ billDate: -1 });

    if (!bills.length)
      return res.status(404).json({ message: "No bills found" });

    res.json({ bills });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= START ================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

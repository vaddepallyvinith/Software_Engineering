const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* ================= CUSTOMER ID GENERATOR ================= */
const prefix = {
    household: "1",
    commercial: "2",
    industry: "3",
    employee: "EMP"
};

const CounterSchema = new mongoose.Schema({ category: String, count: Number });
const Counter = mongoose.model("Counter", CounterSchema);

async function generateServiceNo(category) {
    let counter = await Counter.findOne({ category });
    if (!counter) counter = new Counter({ category, count: 1 });
    else counter.count++;
    await counter.save();

    return prefix[category] + String(counter.count).padStart(6, "0");
}

/* ================= USER MODEL ================= */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "employee", "user"],
        default: "user"
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    address: String,
    pincode: String,
    category: {
        type: String,
        enum: ["household", "commercial", "industry"],
        required: function () { return this.role === 'user'; }
    },
    zone: String,
    serviceNo: { type: String, unique: true },
    meterReading: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save: Hash password and Generate Service No
UserSchema.pre("save", async function (next) {
    // Name Formatting
    if (this.isModified('name') && this.name) {
        this.name = this.name.split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
    }

    // Service No Generation
    if (!this.serviceNo) {
        if (this.role === "user") {
            this.serviceNo = await generateServiceNo(this.category);
        } else if (this.role === "employee") {
            this.serviceNo = await generateServiceNo("employee");
        }
    }

    // Password Hashing
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to check password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    serviceNo: String, // Kept for quick lookup/legacy
    units: {
        type: Number,
        required: true
    },
    amount: { // Base amount for calculation
        type: Number,
        required: true
    },
    billAmount: Number,
    fineAmount: { type: Number, default: 0 },
    previousDue: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    dueAmount: Number, // Remaining to pay
    paidAmount: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ["Paid", "Pending"],
        default: "Pending"
    },
    billDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    prevReading: Number,
    currentReading: Number,
    payments: [{
        transactionId: String,
        amount: Number,
        date: Date
    }]
}, { timestamps: true });

module.exports = mongoose.model("Bill", BillSchema);

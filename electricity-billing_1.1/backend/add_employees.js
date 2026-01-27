const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/electricity-app")
    .then(async () => {
        console.log("Connected to DB");
        await seedEmployees();
    })
    .catch(err => console.error(err));

async function seedEmployees() {
    const employees = [
        { name: "North Employee", email: "north@emp.com", zone: "North", mobile: "9000000001" },
        { name: "South Employee", email: "south@emp.com", zone: "South", mobile: "9000000002" },
        { name: "East Employee", email: "east@emp.com", zone: "East", mobile: "9000000003" },
        { name: "West Employee", email: "west@emp.com", zone: "West", mobile: "9000000004" }
    ];

    for (const emp of employees) {
        try {
            const exists = await User.findOne({ email: emp.email });
            if (!exists) {
                await User.create({
                    name: emp.name,
                    email: emp.email,
                    password: "password", // Default password
                    role: "employee",
                    zone: emp.zone,
                    mobile: emp.mobile
                });
                console.log(`Created: ${emp.email} (${emp.zone})`);
            } else {
                console.log(`Skipped: ${emp.email} (Already exists)`);
            }
        } catch (err) {
            console.error(`Error creating ${emp.email}:`, err.message);
        }
    }
    process.exit();
}

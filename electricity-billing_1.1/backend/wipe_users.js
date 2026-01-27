const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to the same DB
mongoose.connect("mongodb://127.0.0.1:27017/electricity-app")
    .then(async () => {
        console.log("Connected to DB");
        await User.deleteMany({});
        console.log("All users deleted. Restart server to regenerate Admin with hashed password.");
        process.exit();
    })
    .catch(err => console.error(err));

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: ".env" });

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;

//const mongoUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`;

const mongoUrl = "mongodb://localhost:27017/aphrodite";

const db = async () => {
    try {
        mongoose.set("strictQuery", false);

        await mongoose.connect(mongoUrl);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = db;

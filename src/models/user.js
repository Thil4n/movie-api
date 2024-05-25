const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        name: { type: String },
        password: { type: String },
        otp: { type: String },
        status: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

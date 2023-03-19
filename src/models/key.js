const mongoose = require("mongoose");

const keySchema = new mongoose.Schema(
    {
        key: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Key", keySchema);

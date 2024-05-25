const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: false },
        value: { type: Number, required: true },
        tokenCount: { type: Number, required: true },
        tokenIds: { type: Array, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);

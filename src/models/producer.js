const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        country: { type: Object },
        image: { type: Array },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Producer", producerSchema);

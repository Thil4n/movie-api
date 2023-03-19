const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        country: { type: Number, required: true },
        movies: { type: Array },
        image: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Actor", actorSchema);

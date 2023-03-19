const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        year: { type: Number },
        runtime: { type: Number },
        producer: { type: Array },
        actors: { type: Array },
        image: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);

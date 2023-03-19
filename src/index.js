const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const server = require("./config/server");
const db = require("./config/db");

const movieRouter = require("./router/movieRouter");
const actorRouter = require("./router/actorRouter");

const app = express();

const whitelist = ["http://localhost:19006", "http://localhost:3000"];
const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

app.use("/movie", movieRouter);
app.use("/actor", actorRouter);

app.use("/public", express.static(__dirname + "/public"));

app.use("/", (req, res) => {
    res.status(200).json({ message: "api end point" });
});

app.listen(server.port, () => {
    console.log(`Server listening on ${server.port}`);
});

db();

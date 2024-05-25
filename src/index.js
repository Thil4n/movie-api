const express = require("express");
const cors = require("cors");

const server = require("./config/server");
const db = require("./config/db");

const propertyRouter = require("./routers/propertyRouter");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");

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

app.use("/public", express.static(__dirname + "/public"));
app.use("/property", propertyRouter);

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.all("/", (req, res) => {
    res.status(200).send("api end point");
});

app.listen(server.port, () => {
    console.log(`Server listening on ${server.port}`);
});

db();

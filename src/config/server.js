const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const url = process.env.SERVER_URL;

module.exports = { url, port, host };

const express = require("express");
const adminController = require("../controllers/adminController");
const verify = require("../middleware/auth");

const router = express.Router();

router.post("/login", adminController.login);

module.exports = router;

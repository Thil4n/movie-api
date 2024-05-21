const express = require("express");
const todoController = require("../controllers/todoController");

const router = express.Router();

router.get("/", todoController.get);

module.exports = router;

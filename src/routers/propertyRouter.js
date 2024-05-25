const express = require("express");
const propertyController = require("../controllers/propertyController");

const router = express.Router();

router.get("/", propertyController.get);
router.get("/tokens/:id", propertyController.getTokens);
router.post("/", propertyController.submit);

module.exports = router;

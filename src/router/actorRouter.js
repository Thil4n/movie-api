const express = require("express");
const actorController = require("../controllers/actorController");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", validate, actorController.find);

router.post("/", validate, actorController.create);

router.delete("/:id", validate, actorController.drop);

router.patch("/", validate, actorController.update);

module.exports = router;

const express = require("express");
const movieController = require("../controllers/movieController");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", validate, movieController.find);

router.post("/", validate, movieController.create);

router.delete("/:id", validate, movieController.drop);

router.patch("/", validate, movieController.update);

module.exports = router;

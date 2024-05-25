const express = require("express");
const userController = require("../controllers/userController");
const verify = require("../middleware/auth");

const router = express.Router();

router.post("/login", userController.login);

router.post("/register/stage/1", userController.registerStageOne);
router.post("/register/stage/2", userController.registerStageTwo);
router.post("/register/stage/3", userController.registerStageThree);

router.post("/reset/stage/1", userController.resetStageOne);
router.post("/reset/stage/2", userController.resetStageTwo);
router.post("/reset/stage/3", userController.resetStageThree);

router.get("/", userController.get);

router.delete("/:id", userController.drop);

router.patch("/", userController.update);

//router.get("/authenticate", verify, userController.authenticate);

module.exports = router;

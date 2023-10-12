const router = require("express").Router();
const controller = require("../controller/usersController");

router.route("/").post(controller.handleCreateUser);

module.exports = router;

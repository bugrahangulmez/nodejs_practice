const router = require("express").Router();
const controller = require("../controller/usersController");

router.get("/", controller.handleLogout);

module.exports = router;

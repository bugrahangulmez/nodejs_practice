const router = require("express").Router();
const controller = require("../controller/logoutController");

router.get("/", controller.handleLogout);

module.exports = router;

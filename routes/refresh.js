const router = require("express").Router();
const controller = require("../controller/refreshTokenController");

router.get("/", controller.handleRefreshToken);

module.exports = router;

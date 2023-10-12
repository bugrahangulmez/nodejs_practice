const router = require("express").Router();
const controller = require("../controller/employeesController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(controller.getEmployee)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    controller.createEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    controller.editEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), controller.deleteEmployee);

module.exports = router;

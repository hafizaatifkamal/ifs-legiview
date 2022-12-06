var express = require("express");
var router = express.Router();

const { hasPermission } = require("../middleware/auth");
const {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", hasPermission("view_users"), getUserList);
router.get("/:id", hasPermission("view_users"), getUserDeatil);
router.post("/", hasPermission("create_Users"), addUser);
router.put("/:id", hasPermission("create_Users"), updateUser);
router.delete("/:id", hasPermission("create_Users"), deleteUser);

module.exports = router;

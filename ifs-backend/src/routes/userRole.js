var express = require("express");
var router = express.Router();
const { hasPermission } = require("../middleware/auth");
const { addUserRole } = require("../controllers/userRoleController");

router.post("/", hasPermission("attribute_Configuration"), addUserRole);

module.exports = router;

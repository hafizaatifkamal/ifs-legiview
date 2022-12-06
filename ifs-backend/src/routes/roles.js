var express = require("express");
var router = express.Router();
const { hasPermission } = require("../middleware/auth");
const { createRole, getRolesList } = require("../controllers/rolesController");

router.post("/", hasPermission("attribute_Configuration"), createRole);
router.get("/", hasPermission("view_roles"), getRolesList);

module.exports = router;

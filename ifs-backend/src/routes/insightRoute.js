var express = require("express");
var router = express.Router();
const { hasPermission } = require("../middleware/auth");
const {
  getInsight,
  getRolesInsight,
  getSelectedInsight,
} = require("../controllers/insight");

router.get(
  "/getrolesinsight",
  hasPermission("insight_Reports"),
  getRolesInsight
);
router.get(
  "/getselectedinsight",
  hasPermission("insight_Reports"),
  getSelectedInsight
);
router.get("/", hasPermission("insight_Reports"), getInsight);

module.exports = router;

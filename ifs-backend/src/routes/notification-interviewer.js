var express = require("express");
var router = express.Router();

// const { hasPermission } = require("../middleware/auth");

const {
  getNotifications,
} = require("../controllers/notify-InterviewerController");

router.get("/", getNotifications);

module.exports = router;

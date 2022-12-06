var express = require("express");
var router = express.Router();
const { hasPermission } = require("../middleware/auth");

const {
  getAllInterviews,
  getAllUpcomingMeetings,
  interviewerHistory,
} = require("../controllers/history");

router.get("/", hasPermission("view_History"), getAllInterviews);
router.get("/upcoming", hasPermission("view_History"), getAllUpcomingMeetings);
router.get("/:id", hasPermission("view_History"), interviewerHistory);

module.exports = router;

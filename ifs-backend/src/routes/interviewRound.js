var express = require("express");
var router = express.Router();
const { hasPermission } = require("../middleware/auth");

const {
  addInterviewRoundDetails,
  getInterviewRoundDetails,
  getCandidateInterviewRoundDetails,
  getInterviewRoundDetailsbyid,
  updatecandidateinterviewrounddetail,
} = require("../controllers/interviewRoundDetailController");

router.post(
  "/",
  hasPermission("add_meeting_details"),
  addInterviewRoundDetails
);

router.get("/", hasPermission("view_History"), getInterviewRoundDetails);

router.get("/:id", hasPermission("view_History"), getInterviewRoundDetailsbyid);

router.get(
  "/candidate/:id",
  hasPermission("view_History"),
  getCandidateInterviewRoundDetails
);

router.put(
  "/candidate/:id",
  hasPermission("add_meeting_details"),
  updatecandidateinterviewrounddetail
);

module.exports = router;

var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const moment = require("moment");

const { hasPermission } = require("../middleware/auth");

const {
  createInterview,
  getCandidatesList,
  getTodayCandidatesListbyinterviewerId,
  getCandidateInterview,
  resheduleRounds,
  sheduleRounds,
  getUpcomingMeetingsMonthly,
  getStates,
  updateCandidateStatus,
} = require("../controllers/candidatesController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext != ".pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  filename: function (req, file, cb) {
    cb(null, moment().format("MM-DD-YYYY") + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  hasPermission("create_Interviews"),
  upload.single("resume"),
  createInterview
);

router.get("/", hasPermission("view_Daily_Interviews"), getCandidatesList);
router.get("/getstates", getStates);

router.get(
  "/:id",
  hasPermission("view_Daily_Interviews"),
  getCandidateInterview
);

router.get(
  "/todayinterview/:id",
  hasPermission("view_Daily_Interviews"),
  getTodayCandidatesListbyinterviewerId
);

router.put(
  "/reshedule/:id",
  hasPermission("reschedule_Interviews"),
  resheduleRounds
);

router.put("/shedule/:id", hasPermission("create_Interviews"), sheduleRounds);

router.get(
  "/monthlyinterview/:id",
  hasPermission("view_Monthly_Interviews"),
  getUpcomingMeetingsMonthly
);

router.put(
  "/updatestatus/:id",
  hasPermission("view_Monthly_Interviews"),
  updateCandidateStatus
);

module.exports = router;

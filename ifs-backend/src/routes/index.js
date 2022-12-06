var express = require("express");
var router = express.Router();

const candidatesRoutes = require("./candidates");
const rolesRoutes = require("./roles");
const interviewRoundDetail = require("./interviewRound");
const tasksRoutes = require("./tasks");
const userRoleRoutes = require("./userRole");
const historyRoutes = require("./history");
const notifyInterviewerRoutes = require("./notification-interviewer");
const notifyHRRoutes = require("./notification-hr");

const insight = require("./insightRoute");
const userRoutes = require("./users");
const {
  auth,
  getAccount,
  setPassword,
  logout,
  refreshToken,
  addSuperAdmin,
} = require("../controllers/userController");
const { isAuthorized } = require("../middleware/auth");
const comapniesRoutes = require("./companies");

router.post("/login", auth);
router.get("/account", isAuthorized, getAccount);
router.use("/users", isAuthorized, userRoutes);
router.use("/user-role", isAuthorized, userRoleRoutes);

router.use("/history", isAuthorized, historyRoutes);
router.use("/candidates", isAuthorized, candidatesRoutes);
router.use("/roles", isAuthorized, rolesRoutes);
router.use("/interviewrounddetail", isAuthorized, interviewRoundDetail);
router.use("/requestreschedule", isAuthorized, tasksRoutes);
router.use("/companies", isAuthorized, comapniesRoutes);
router.use("/insight", isAuthorized, insight);
router.use("/notifications-interviewer", isAuthorized, notifyInterviewerRoutes);
router.use("/notifications-hr", isAuthorized, notifyHRRoutes);

router.post("/:id/setPassword", setPassword);
router.get("/logout", isAuthorized, logout);
router.get("/refresh-token", refreshToken);
router.post("/add-super-admin", addSuperAdmin);

module.exports = router;

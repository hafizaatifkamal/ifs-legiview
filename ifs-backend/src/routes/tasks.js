var express = require("express");
var router = express.Router();
const { hasPermission } = require("../middleware/auth");
const {
  getTasks,
  createTasks,
  getTaskById,
} = require("../controllers/tasksController");

router.get("/", getTasks);
router.post("/", hasPermission("request_Reschedule"), createTasks);
router.get("/:id", hasPermission("reschedule_Interviews"), getTaskById);

module.exports = router;

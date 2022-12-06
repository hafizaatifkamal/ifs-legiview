const mongoose = require("mongoose");

const NotificationInterviewerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    toWhom: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const notificationInterviewerModel = mongoose.model(
  "Notification-Interviewer",
  NotificationInterviewerSchema
);

module.exports = notificationInterviewerModel;

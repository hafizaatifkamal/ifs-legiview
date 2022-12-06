const mongoose = require("mongoose");

const NotificationHRSchema = new mongoose.Schema(
  {
    name: {
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

const notificationHRModel = mongoose.model(
  "Notification-HR",
  NotificationHRSchema
);

module.exports = notificationHRModel;

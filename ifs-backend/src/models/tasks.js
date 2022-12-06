const mongoose = require("mongoose");
const candidatesModel = require("./candidates");
const userModel = require("./user");

const TasksSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: candidatesModel,
      required: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    interviewDate: {
      type: String,
      required: false,
    },
    starttime: {
      type: String,
      required: false,
    },
    endtime: {
      type: String,
      required: false,
    },
    meetingLink: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const tasksModel = mongoose.model("Tasks", TasksSchema);

module.exports = tasksModel;

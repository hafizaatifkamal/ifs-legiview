const mongoose = require("mongoose");
const rolesModel = require("./roles");
const userModel = require("./user");
const CandidatesSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: rolesModel,
      required: true,
    },
    ratings: {
      type: Number,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    rounds: {
      type: [
        {
          level: {
            type: Number,
            required: true,
          },
          meetingLink: {
            type: String,
            required: true,
          },
          interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: userModel,
            required: true,
          },
          interviewDate: {
            type: String,
            required: true,
          },
          starttime: {
            type: String,
            required: true,
          },
          endtime: {
            type: String,
            required: true,
          },
          MeetingDetailsExist: {
            type: String,
            enum: ["Exist", "notExist"],
            default: "notExist",
          },
          resheduleRequested: {
            type: String,
            enum: ["requested", "notRequested", "resheduled"],
            default: "notRequested",
          },
        },
      ],
    },
    filePDF: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: [
        "-",
        "Reject",
        "On Hold",
        "Recommended for next level",
        "Selected",
        "Rescheduled",
      ],
      default: "-",
    },
    whoCreated: {
      type: String,
      required: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const candidatesModel = mongoose.model("Candidates", CandidatesSchema);

module.exports = candidatesModel;

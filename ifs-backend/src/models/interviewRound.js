const { number } = require("joi");
const mongoose = require("mongoose");
const candidatesModel = require("./candidates");
const userModel = require("./user");

const interviewRound = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: candidatesModel,
      required: true,
    },
    info: {
      type: [
        {
          level: {
            type: Number,
            required: true,
          },
          InterviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: userModel,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          meetingfeedback: {
            type: String,
            required: true,
          },
          data: [
            {
              question: String,
              answer: String,
              rating: Number,
            },
          ],
        },
      ],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const interviewRoundDetailModel = mongoose.model(
  "InterviewRoundDetails",
  interviewRound
);

module.exports = interviewRoundDetailModel;

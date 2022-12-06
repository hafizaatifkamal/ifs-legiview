const mongoose = require("mongoose");
const CandidatesModel = require("../models/candidates");
const { customResponse, customPagination } = require("../utility/helper");
const moment = require("moment");

// History - HR view
const getAllInterviews = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const allInterviews = await CandidatesModel.find({})
      .sort({
        "rounds.interviewDate": -1,
        "rounds.starttime": -1,
      })
      .populate("role", "role")
      .populate("rounds.interviewer", "name");
    message = "All interviews details";
    const resData = customResponse({ code, message, data: allInterviews });
    res.status(200).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

// History - Interviewer view
const interviewerHistory = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const id = req.params.id;
    // const date = "2022-03-16";
    // const date = moment().format("YYYY-MM-DD");
    const history = await CandidatesModel.find({
      "rounds.interviewer": id,
      // "rounds.interviewDate": date,
    })
      .sort({
        createdAt: -1,
      })
      .populate("role", "role")
      .populate("rounds.interviewer", { name: 1 });
    message = "History of candidates with an interviewer";
    const resData = customResponse({ code, message, data: history });
    res.status(200).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

const getAllUpcomingMeetings = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const today = moment().format("YYYY-MM-DD");
    const monthEnd = moment(today).add(30, "days").format("YYYY-MM-DD");
    const upcomingMeetings = await CandidatesModel.find({
      "rounds.interviewDate": {
        $gte: today,
        $lte: monthEnd,
      },
    })
      .sort({
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
      })
      .populate("role", "role")
      .populate("rounds.interviewer", "name");
    message = "All upcoming interview details";
    const resData = customResponse({ code, message, data: upcomingMeetings });
    res.status(200).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

module.exports = {
  getAllInterviews,
  getAllUpcomingMeetings,
  interviewerHistory,
};

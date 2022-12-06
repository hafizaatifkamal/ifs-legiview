const mongoose = require("mongoose");
const CandidatesModel = require("../models/candidates");
const { customResponse, customPagination } = require("../utility/helper");
const moment = require("moment");
const { State } = require("country-state-city");
const NotificationInterviewerModel = require("../models/notification-interviewer");
const NotificationHrModel = require("../models/notification-hr");

const createInterview = async (req, res) => {
  let code, message;
  try {
    code = 201;
    const data = await CandidatesModel.findOne({ email: req.body.email });
    if (data) {
      message = "candidate with this email is already exist";
      code = 409;
      const resData = customResponse({ code, message });
      return res.status(code).send(resData);
    }
    const candidate = await CandidatesModel({
      email: req.body.email,
      role: req.body.role,
      candidateName: req.body.candidateName,
      location: req.body.candidateLocations,
      rounds: {
        level: req.body.level,
        interviewer: req.body.interviewer,
        interviewDate: req.body.interviewDate,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
        meetingLink: req.body.link,
      },
      filePDF: req.file.path,
      whoCreated: req.body.whoCreated,
    });
    const note = await NotificationInterviewerModel({
      name: req.body.whoCreated,
      toWhom: req.body.interviewer,
      title: `has created your interview with candidate name ${req.body.candidateName}.`,
    });
    note.save();
    candidate.save();
    message = "candaidate added successfully";
    const resData = customResponse({ code, message, data: candidate });
    res.status(code).json(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(500).send(resData);
  }
};

const getCandidatesList = async (req, res) => {
  let code, message;
  try {
    const date = moment().format("YYYY-MM-DD");
    const candidatesList = await CandidatesModel.find({
      "rounds.interviewDate": date,
    })
      .sort({
        created_at: -1,
        updated_at: -1,
      })
      .populate("role")
      .populate("rounds.interviewer", { name: 1 });
    message = "all candidates details";
    const resData = customResponse({ code, message, data: candidatesList });
    res.status(200).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(500).send(resData);
  }
};

const getCandidateInterview = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const _id = req.params.id;
    const candidate = await CandidatesModel.findById({ _id })
      .populate("role")
      .populate("rounds.interviewer", { name: 1 });
    message = "candidates interview details";
    const resData = customResponse({ code, message, data: candidate });
    res.status(200).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(500).send(resData);
  }
};

// Upcoming meetings - Daily basis
const getTodayCandidatesListbyinterviewerId = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const id = req.params.id;
    // const date = "2022-03-16";
    const date = moment().format("YYYY-MM-DD");
    const candidatesList = await CandidatesModel.find({
      "rounds.interviewer": id,
      "rounds.interviewDate": date,
    })
      .sort({
        createdAt: -1,
      })
      .populate("role")
      .populate("rounds.interviewer", { name: 1 });
    message = "Upcoming meetings with candidates - Daily basis";
    const resData = customResponse({ code, message, data: candidatesList });
    res.status(200).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

// Upcoming meetings - Monthly basis
const getUpcomingMeetingsMonthly = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const id = req.params.id;
    const today = moment().format("YYYY-MM-DD");
    const monthEnd = moment(today).add(30, "days").format("YYYY-MM-DD");
    const upcomingMeetings = await CandidatesModel.find({
      "rounds.interviewer": id,
      "rounds.interviewDate": {
        $gte: today,
        $lte: monthEnd,
      },
    })
      .sort({
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
      })
      .populate("role")
      .populate("rounds.interviewer", { name: 1 });
    message = "Upcoming meetings with candidates - Monthly basis";
    const resData = customResponse({ code, message, data: upcomingMeetings });
    res.status(200).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

const resheduleRounds = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const _id = req.params.id;
    const candidateDetails = await CandidatesModel.find({
      _id: _id,
      "rounds.level": req.body.level,
    });
    if (candidateDetails.length === 0) {
      (code = 404),
        (message = `candidate Level ${req.body.level}  Detail Not found`);
      const resData = customResponse({ code, message });
      return res.status(code).send(resData);
    } else {
      const data = await CandidatesModel.findOneAndUpdate(
        { _id: _id },
        {
          "rounds.$[level].interviewDate": req.body.interviewDate,
          "rounds.$[level].starttime": req.body.starttime,
          "rounds.$[level].endtime": req.body.endtime,
          "rounds.$[level].meetingLink": req.body.meetingLink,
          "rounds.$[level].interviewer": req.body.interviewer,
          "rounds.$[level].resheduleRequested": "resheduled",
        },
        {
          arrayFilters: [
            {
              "level.level": req.body.level,
            },
          ],
          new: true,
        }
      );
      const note = await NotificationInterviewerModel({
        name: req.body.whoCreated,
        toWhom: req.body.interviewer,
        title: `has rescheduled your interview with candidate name ${req.body.candidateName}.`,
      });
      note.save();
      message = `candidate Level ${req.body.level} Resheduled `;
      const resData = customResponse({ code, message, data });
      return res.status(200).send(resData);
    }
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

const sheduleRounds = async (req, res) => {
  const level = req.body.level;
  let code, message;
  if (level < 2 || level > 3) {
    code = 404;
    message = "Invalid Level";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    code = 200;
    const _id = req.params.id;
    if (level == 3) {
      const candidateDetails = await CandidatesModel.find({
        _id: _id,
        "rounds.level": level - 1,
      });
      if (candidateDetails.length === 0) {
        (code = 404),
          (message = `Invalid Level ${level} schedule level 2 first`);
        const resData = customResponse({ code, message });
        return res.status(code).send(resData);
      }
    }
    const data = await CandidatesModel.findByIdAndUpdate(
      { _id },
      {
        $push: {
          rounds: req.body,
        },
      },
      {
        new: true,
      }
    );
    if(level >=1 && level < 3){
      const note = await NotificationInterviewerModel({
      name: req.body.whoCreated,
      toWhom: req.body.interviewer,
      title: `has scheduled your interview round ${level} with candidate name ${req.body.candidateName}.`,
    });
    note.save();
    }
     if(level === 3){
      const note = await NotificationHrModel({
      name: req.body.whoCreated,
      title: `has scheduled your interview round ${level} with candidate name ${req.body.candidateName}.`,
    });
    note.save();
    }
    message = `candidate Level ${level} Scheduled `;
    const resData = customResponse({ code, message, data });
    return res.status(200).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getStates = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const alllocation = State.getStatesOfCountry("IN");
    const location = [];
    alllocation.map((elem) => {
      location.push({ name: elem.name });
    });
    const resData = customResponse({ code, data: location });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const updateCandidateStatus = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const _id = req.params.id;
    const data = await CandidatesModel.findByIdAndUpdate(
      { _id },
      { status: req.body.status },
      {
        runValidators: true,
        new: true,
      }
    );
    message = "candidate status updated";
    const resData = customResponse({ code, data, message });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

module.exports = {
  createInterview,
  getCandidatesList,
  getCandidateInterview,
  getTodayCandidatesListbyinterviewerId,
  resheduleRounds,
  sheduleRounds,
  getUpcomingMeetingsMonthly,
  getStates,
  updateCandidateStatus,
};

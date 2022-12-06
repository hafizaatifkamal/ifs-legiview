const mongoose = require("mongoose");
const TasksModel = require("../models/tasks");
const CandidatesModel = require("../models/candidates");
const { customResponse, customPagination } = require("../utility/helper");
const NotificationHRModel = require("../models/notification-hr");

const getTasks = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const tasks = await TasksModel.find({})
      .populate("candidate", {
        candidateName: 1,
        "rounds.resheduleRequested": 1,
        "rounds.level": 1,
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
        "rounds.endtime": 1,
        status: 1,
      })
      .populate("interviewer", { name: 1 })
      .sort({ created_at: -1, updated_at: -1 });
    message = "all tasks details";
    const data = customPagination({ data: tasks });
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const createTasks = async (req, res) => {
  let code, message;

  try {
    code = 201;
    const prevtask = await TasksModel.findOne({
      candidate: req.body.candidate,
    });
    let tasks;
    if (prevtask) {
      tasks = await TasksModel.findOneAndReplace(
        { candidate: req.body.candidate },
        req.body
      );
    } else {
      tasks = await TasksModel(req.body);
    }
    const candidate = await CandidatesModel.findById(req.body.candidate);
    const updateCandidate = await CandidatesModel.findOneAndUpdate(
      { _id: req.body.candidate },
      {
        "rounds.$[level].resheduleRequested": "requested",
        status: "Rescheduled",
      },
      {
        arrayFilters: [
          {
            "level.level": candidate.rounds.length,
          },
        ],
        new: true,
      }
    );
    const note = await NotificationHRModel({
      name: req.body.userName,
      title: `has requested to reschedule the interview with candidate name ${req.body.candidateName}.`,
    });
    tasks.save();
    updateCandidate.save();
    note.save();
    console.log(req.body);
    message = "Meeting reschedule request sent successfully!";
    const resData = customResponse({ code, message, data: tasks });
    res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getTaskById = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const _id = req.params.id;
    const taskById = await TasksModel.findById({ _id })
      .populate("candidate", {
        candidateName: 1,
        email: 1,
        "rounds.resheduleRequested": 1,
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
        "rounds.endtime": 1,
        "rounds.level": 1,
        status: 1,
      })
      .populate("interviewer", { name: 1 });
    message = "Rescheduled task details";
    const resData = customResponse({ code, message, data: taskById });
    res.status(200).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

module.exports = { createTasks, getTasks, getTaskById };

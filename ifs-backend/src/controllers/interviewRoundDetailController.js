const mongoose = require("mongoose");
const interviewRoundDetailModel = require("../models/interviewRound");
const CandidatesModel = require("../models/candidates");
const { customResponse, customPagination } = require("../utility/helper");
const candidatesModel = require("../models/candidates");
const tasksModel = require("../models/tasks");
const NotificationHrModel = require("../models/notification-hr");

const addInterviewRoundDetails = async (req, res) => {
  let code, message;
  try {
    code = 201;
    const data = await interviewRoundDetailModel.find({
      candidateId: req.body.candidateId,
    });
    if (data.length != 0) {
      code = 409;
      message = "record already exist";
      const resData = customResponse({ code, message });
      return res.status(code).send(resData);
    }
    const interviewRoundDetail = await interviewRoundDetailModel(req.body);
    const candidate = await candidatesModel.findById(req.body.candidateId);
    const updateCandidate = await CandidatesModel.findOneAndUpdate(
      { _id: req.body.candidateId },
      {
        "rounds.$[level].MeetingDetailsExist": "Exist",
        status: req.body.status,
        ratings: req.body.info.rating,
      },
      {
        arrayFilters: [
          {
            "level.level": 1,
          },
        ],
        new: true,
        runValidators: true,
      }
    );
    updateCandidate.save();
    interviewRoundDetail.save();
    message = "interview Round Details added successful";
    const note = await NotificationHrModel({
      name: req.body.whoCreated,
      title: `has added level 1 meeting notes with candidate name ${req.body.candidateName}.`,
    });
    note.save();
    const resData = customResponse({
      code,
      message,
      data: interviewRoundDetail,
    });
    res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getInterviewRoundDetails = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const interviewRoundDetail = await interviewRoundDetailModel
      .find({})
      .populate("candidateId", {
        candidateName: 1,
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
        "rounds.endtime": 1,
      })
      .populate("info.InterviewerId", { name: 1 });
    message = "all interview Round Details";
    const cusPag = customPagination({ data: interviewRoundDetail });
    const resData = customResponse({
      code,
      message,
      data: cusPag,
    });
    res.status(code).send(resData);
  } catch (error) {
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getCandidateInterviewRoundDetails = async (req, res) => {
  let code, message;
  const query = req.query.level;

  if(!!query){
  if (query < 1 || query > 3) {
    code = 422;
    message = "invalid Level";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
}
  try {
    code = 200;
    const id = req.params.id;
    let interviewRoundDetail;
    if(!!query){
      interviewRoundDetail = await interviewRoundDetailModel
      .findOne({ candidateId: id, "info.level": query })
      .populate("candidateId", {
        candidateName: 1,
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
        "rounds.endtime": 1,
      })
      .populate("info.InterviewerId", { name: 1 });
    } else{
      interviewRoundDetail = await interviewRoundDetailModel
      .findOne({ candidateId: id})
      .populate("candidateId", {
        candidateName: 1,
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
        "rounds.endtime": 1,
      })
      .populate("info.InterviewerId", { name: 1 });
    }
    let data;
    if (interviewRoundDetail) {
      if(!!query){
        data = interviewRoundDetail.info[query - 1];
      } else {
        data = interviewRoundDetail
      }
    } else {
      data = {};
    }
    // console.log(data);
    message = "candidate interview Round Details";
    const resData = customResponse({
      code,
      message,
      data,
    });
    res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getInterviewRoundDetailsbyid = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const id = req.params.id;
    const interviewRoundDetail = await interviewRoundDetailModel
      .findById(id)
      .populate("candidateId", {
        candidateName: 1,
        "rounds.interviewDate": 1,
        "rounds.starttime": 1,
        "rounds.endtime": 1,
      })
      .populate("info.InterviewerId", { name: 1 });
    message = "interview Round Details by id";
    const resData = customResponse({
      code,
      message,
      data: interviewRoundDetail,
    });
    res.status(code).send(resData);
  } catch (error) {
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const updatecandidateinterviewrounddetail = async (req, res) => {
  let code, message;
  const query = req.query.level;
  if (query < 1 || query > 3) {
    code = 422;
    message = "invalid Level";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    code = 200;
    const id = req.params.id;
    const interviewRoundDetail = await interviewRoundDetailModel.find({
      candidateId: id,
      "info.level": query,
    });
    let data;
    // if (interviewRoundDetail.length != 0) {
    //   data = await interviewRoundDetailModel.findOneAndUpdate(
    //     { candidateId: id, "info.level": query },
    //     {
    //       $push: {
    //         "info.$[question].data": {
    //           question: req.body.question,
    //           answer: req.body.answer,
    //           rating: req.body.rating,
    //         },
    //       },
    //     },
    //     {
    //       arrayFilters: [
    //         {
    //           "question.level": query,
    //         },
    //       ],
    //       new: true,
    //     }
    //   );
    //   data.save();
    //   message = `interview Level ${query} data updated`;
    //   const resData = customResponse({ code, message, data });
    //   return res.status(code).send(resData);
    // }
    if (interviewRoundDetail.length !== 0) {
      code = 409;
      message = "level already exist can not be add this level ";
      const resData = customResponse({ code, message });
      return res.status(code).send(resData);
    }
    const candidate = await candidatesModel.findById(id);
    const overallrating = (candidate.ratings + req.body.rating) / query;
    data = await interviewRoundDetailModel.findOneAndUpdate(
      { candidateId: id },
      {
        $push: {
          info: {
            level: query,
            InterviewerId: req.body.InterviewerId,
            rating: req.body.rating,
            meetingfeedback: req.body.meetingfeedback,
            data: req.body.data,
          },
        },
      },
      { new: true }
    );
    const updateCandidate = await CandidatesModel.findOneAndUpdate(
      { _id: id },
      {
        "rounds.$[level].MeetingDetailsExist": "Exist",
        status: req.body.status,
        ratings: overallrating,
      },
      {
        arrayFilters: [
          {
            "level.level": query,
          },
        ],
        new: true,
        runValidators: true,
      }
    );

    updateCandidate.save();
    data.save();
     const note = await NotificationHrModel({
      name: req.body.whoCreated,
      title: `has added level ${query} meeting notes with candidate name ${req.body.candidateName}.`,
    });
    note.save();
    message = `interview Level ${query} data created`;
    const resData = customResponse({
      code,
      message,
      data,
    });
    res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

module.exports = {
  addInterviewRoundDetails,
  getInterviewRoundDetails,
  getCandidateInterviewRoundDetails,
  getInterviewRoundDetailsbyid,
  updatecandidateinterviewrounddetail,
};

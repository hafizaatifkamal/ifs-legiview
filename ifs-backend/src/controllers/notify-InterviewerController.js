const mongoose = require("mongoose");
const { customResponse, customPagination } = require("../utility/helper");
const NotificationInterviewerModel = require("../models/notification-interviewer");

const getNotifications = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const toWhom = req.query.toWhom;
    const notify = await NotificationInterviewerModel.find({
      toWhom: toWhom,
    });
    message = `All Notifications - Interviewer ${toWhom} view`;
    const resData = customResponse({ code, message, data: notify });
    res.status(code).json(resData);
  } catch (error) {
    code = 500;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(500).send(resData);
  }
};

module.exports = { getNotifications };

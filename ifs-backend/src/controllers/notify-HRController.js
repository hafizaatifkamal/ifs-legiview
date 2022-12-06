const mongoose = require("mongoose");
const { customResponse, customPagination } = require("../utility/helper");
const NotificationHRModel = require("../models/notification-hr");

const getNotifications = async (req, res) => {
  let code, message;
  try {
    code = 200;
    // const toWhom = req.query.toWhom;
    const notify = await NotificationHRModel.find({});
    message = `All Notifications - HR view`;
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

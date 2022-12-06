const mongoose = require("mongoose");
const userRoleModel = require("../models/userRole");
const { customPagination, customResponse } = require("../utility/helper");

const addUserRole = async (req, res) => {
  let code, message;
  try {
    code = 201;
    const userRole = await userRoleModel({ ...req.body });
    userRole.save();
    message = "User role added successfully";
    const resData = customResponse({ code, message, data: userRole });
    res.status(code).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

module.exports = { addUserRole };

const mongoose = require("mongoose");
const RolesModel = require("../models/roles");
const { customPagination, customResponse } = require("../utility/helper");

const createRole = async (req, res) => {
  let code, message;
  try {
    code = 201;
    const role = await RolesModel({ ...req.body });
    role.save();
    message = "interviewer added successfully";
    const resData = customResponse({ code, message, data: role });
    res.status(code).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

const getRolesList = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const query = req.query.role;
    const rolesList = await RolesModel.find({
      $or: [
        {
          role: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });
    message = "all roles";
    const data = customPagination({ data: rolesList });
    const resData = customResponse({ code, message, data });
    res.status(code).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

module.exports = { createRole, getRolesList };

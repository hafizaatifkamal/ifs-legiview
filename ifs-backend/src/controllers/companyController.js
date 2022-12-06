const mongoose = require("mongoose");
const CompanyModel = require("../models/companies");
const { customPagination, customResponse } = require("../utility/helper");

const createCompanies = async (req, res) => {
  let code, message;
  try {
    code = 201;
    const Companies = new CompanyModel({ ...req.body });
    Companies.save();
    message = "Companies added successfully";
    const resData = customResponse({ code, message, data: Companies });
    res.status(code).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

const getCompaniesList = async (req, res) => {
  let code, message;
  try {
    code = 200;
    const query = req.query.company;
    const CompaniesList = await CompanyModel.find({
      $or: [
        {
          companyName: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });
    message = "all Companies";
    const data = customPagination({ data: CompaniesList });
    const resData = customResponse({ code, message, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = 400;
    message = "something went wrong";
    const resData = customResponse({ code, message, err: error });
    res.status(400).send(resData);
  }
};

module.exports = { createCompanies, getCompaniesList };

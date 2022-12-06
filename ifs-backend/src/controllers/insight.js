const mongoose = require("mongoose");
const CandidatesModel = require("../models/candidates");
const { customResponse, customPagination } = require("../utility/helper");
const rolesModel = require("../models/roles");
const { promise } = require("bcrypt/promises");

const getInsight = async (req, res) => {
  let code, message;
  console.log("hello");
  try {
    code = 200;
    const insightselected = await CandidatesModel.find({
      status: "Selected",
    }).countDocuments();
    const insightRejected = await CandidatesModel.find({
      status: "Reject",
    }).countDocuments();
    const totalApplied = insightselected + insightRejected;
    // const data = {
    //   applied: totalApplied,
    //   accepted: insightselected,
    //   rejected: insightRejected,
    // };

    const data = [
      {property:"applied",value:totalApplied},
      {property:"accepted",value:insightselected},
      {property:"rejected",value:insightRejected}
    ]

    message = "user response";
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getRolesInsight = async (req, res) => {
  let code, message;
  let querySelected = [
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $match: {
        status: "Selected",
      },
    },
  ];

  let queryRejected = [
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
      },
    },
    { $unwind: "$role" },
    {
      $match: {
        status: "Reject",
      },
    },
  ];

  if (req.query.role) {
    querySelected.push({
      $match: {
        "role.role": req.query.role,
      },
    });
    queryRejected.push({
      $match: {
        "role.role": req.query.role,
      },
    });
  }
  try {
    code = 200;
    const selectedCandidates = await CandidatesModel.aggregate(
      querySelected
    ).project({ "role.role": 1, _id: 0, status: 1 });

    const RejectedCandidates = await CandidatesModel.aggregate(
      queryRejected
    ).project({ "role.role": 1, _id: 0, status: 1 });

    const total = selectedCandidates.length + RejectedCandidates.length;

    // const data = {
    //   interviewed: total,
    //   selected: selectedCandidates.length,
    // };

    const data = [
      {property:"interviewed",value:total},
      {property:"selected",value:selectedCandidates.length,}
    ]
    message = "user response";
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

const getSelectedInsight = async (req, res) => {
  let code, message;
  try {
    code = 200;
    let selectedCandidates;
    const data = []
    const roles = await rolesModel.distinct("role");
    await Promise.all(
      roles.map(async (elem) => {
        selectedCandidates = await CandidatesModel.aggregate([
          {
            $lookup: {
              from: "roles",
              localField: "role",
              foreignField: "_id",
              as: "roles",
            },
          },
          { $unwind: "$roles" },
          {
            $match: {
              status: "Selected",
            },
          },
          {
            $match: {
              "roles.role": elem,
            },
          },
        ]).project({ "roles.role": 1, _id: 0 });
        console.log(selectedCandidates);
        // data[elem] = selectedCandidates.length;
        const obj = {property:elem,value:selectedCandidates.length}
        data.push(obj)
      })
    );
    message = "user response";
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    message = "something went wrong";
    code = 500;
    const resData = customResponse({ code, message, err: error });
    res.status(code).send(resData);
  }
};

module.exports = { getInsight, getRolesInsight, getSelectedInsight };

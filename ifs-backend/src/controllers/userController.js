const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { addUserSchema } = require("../schema/userSchema");
const { customResponse, customPagination } = require("../utility/helper");
const bcrypt = require("bcrypt");

const userModel = require("../models/user");
const userRoleModel = require("../models/userRole");
const { nanoid } = require("nanoid");
const { sendEmail, generateMessage } = require("../utility/AutogenerateEmail");

const getUserList = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users list' 
      #swagger.parameters['page'] = {
        in: 'query',
        type: 'integer',
        description: 'Page number' 
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        type: 'integer',
        description: 'Data limit per page' 
      }
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "pageCount": 1,
            "totalCount": 1,
            "currentPage": 1,
            "results": [
              {
                "_id": "610d090636ba149966bd3b55",
                "first_name": "Jhon",
                "last_name": "Doe",
                "email": "jhon@valuebound.com",
                "role": "admin"
              }
            ]
          },
          "error": {}
        }
      }
  */
  let code, message;
  const searchString = [{ status: { $regex: "" } }];
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 15;
  if (req.query.name) {
    searchString.push({ name: { $regex: req.query.name } });
  }
  if (req.query.email) {
    searchString.push({ email: req.query.email });
  }
  if (req.query.role) {
    searchString.push({ role: req.query.role });
  }
  try {
    code = 200;
    const users = await userModel.find({
      $and: [{ $and: searchString }],
    });
    const data = customPagination({ data: users, page, limit });
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    console.log(error);
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getUserDeatil = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users Detail' 
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data":  {
            "_id": "610bc1b31b82a66f6bcd64ea",
            "first_name": "akash",
            "last_name": "kumar",
            "email": "akash@gmail.com",
            "role": "admin",
            "__v": 0
          },
          "error": {}
        }
      }
  */
  let code, message;
  const _id = req.params.id;
  try {
    code = 200;
    const data = await userModel.findById({ _id });
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const addUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Add new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $first_name: 'Jhon',
            $last_name: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 201,
          "message": "",
          "data": {
            "first_name": 'Jhon',
            "last_name": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin', 
          },
          "error": {}
        }
      }
  */
  let code, message;
  try {
    code = 201;
    const randomgenpassword = nanoid(12);
    req.body.password = await bcrypt.hash(randomgenpassword, 10);
    const data = new userModel(req.body);
    await data.save();
    const resData = customResponse({
      code,
      data,
    });
    const emailMessage = generateMessage(
      data.name,
      data.email,
      randomgenpassword,
      data.role
    );
    sendEmail(data.email, `LegiView Account Created`, emailMessage);
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Update user' 
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $first_name: 'Jhon',
            $last_name: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[200] = {
        description: 'User successfully updated.',
        schema: { 
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "first_name": 'Jhon',
            "last_name": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin'
          },
          "error": {}
        }
      }
  */
  let code, message;
  const _id = req.params.id;
  try {
    code = 200;
    message = "user successfully updated!";
    const body = {};
    if (req.body.status) {
      body.status = req.body.status;
    }
    if (req.body.role) {
      body.role = req.body.role;
    }
    const user = await userModel.findOneAndUpdate({ _id }, body, {
      new: true,
      runValidators: true,
    });
    await user.save();
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const deleteUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Delete user' 
      #swagger.responses[200] = {
      schema:{
        "status": "success",
        "code": 200,
        "message": "User deleted successfully",
        "data":  {
          "_id": "610bc1b31b82a66f6bcd64ea",
          "first_name": 'Jhon',
          "last_name": 'Doe',
          "email": 'jhon@valuebound.com',
          "role": 'admin',
          "__v": 0
        },
        "error": {}
      }
    }
  */
  let code, message;
  const _id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isValid) {
    code = 422;
    message = "Invalid objectId id";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    code = 200;
    const user = await userModel.findByIdAndDelete({ _id });
    message = "user successfully deleted!";
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const auth = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Add new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $first_name: 'Jhon',
            $last_name: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 201,
          "message": "",
          "data": { 
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */
  let code, message, data;
  try {
    code = 200;
    let payload = { ...req.body };
    const options = {
      expiresIn: process.env.EXPIRESIN,
      issuer: process.env.ISSUER,
    };
    const secret = process.env.JWT_SECRET;
    const user = await userModel.findOne({ email: req.body.email }).exec();
    const userDetail = {};
    if (!user) {
      code = 404;
      message = "Invalid request data";
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    } else {
      const userRole = user.role;
  
      const userPermission = await userRoleModel.findOne({ role: userRole });
      payload = {
        ...payload,
        permission: userPermission.permission,
        role: userRole,
      };
      const accessToken = jwt.sign(payload, secret, options);
      const refreshToken = jwt.sign(payload, secret, {
        expiresIn: "7d",
        issuer: process.env.ISSUER,
      });
      const userEntry = await userModel.findOne({ email: req.body.email });
      const doesPasswordMatch = await bcrypt.compare(
        req.body.password,
        userEntry.password
      );
      if (doesPasswordMatch && user.status === "active") {
        code = 200;

        const updateToken = await userModel.findOneAndUpdate(
          { email: req.body.email },
          {
            $push: {
              token: accessToken,
              refreshToken: refreshToken,
            },
          },
          { new: true }
        );
        userDetail.name = updateToken.name;
        userDetail.email = updateToken.email;
        userDetail.role = updateToken.role;
        userDetail.permission = userPermission.permission;
        userDetail.Authorization = "Bearer " + accessToken;
        userDetail.refreshToken = refreshToken;
        userDetail.id = updateToken._id.toString();
      } else {
        code = 422;
        message = "Invalid request data";
        data = customResponse({
          code,
          message,
        });
        return res.status(code).send(data);
      }
    }

    const resData = customResponse({ code, data: userDetail });
    return res.status(code).send(resData);
  } catch (error) {
    console.log(error,"autherror")
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getAccount = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get Account'
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 200,
          "message": "",
          "data": { 
            "first_name": 'Jhon',
            "last_name": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin', 
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */
  let code, message, data;
  const authorizationHeaader = req.headers.authorization.split(" ")[1];
  try {
    code = 200;
    const user = await userModel
      .findOne({ token: authorizationHeaader })
      .exec();
    const resData = customResponse({ code, data: user });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const addSuperAdmin = async (req, res) => {
  let code, message;
  try {
    code = 201;
    const randomgenpassword = nanoid(12);
    const enc_pwd = await bcrypt.hash(randomgenpassword, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      role: "super-admin",
      password: enc_pwd,
      comapnyId: req.body.comapnyId,
    };
    const data = new userModel(user);
    await data.save();
    const emailMessage = generateMessage(
      data.name,
      data.email,
      randomgenpassword,
      data.role
    );
    sendEmail(data.email, `LegiView Account Created`, emailMessage);
    const resData = customResponse({
      code,
      data,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const logout = async (req, res) => {
  try {
    let code, message;
    await userModel
      .findOneAndUpdate(
        { email: req.decoded.email },
        {
          $pull: {
            token: req.headers.authorization.split(" ")[1],
            refreshToken: req.headers.refresh,
          },
        },
        { new: true }
      )
      .then(() => {
        code = 200;
        message = "User successfully Logout";
        const resData = customResponse({ code, message });
        return res.status(code).send(resData);
      });
  } catch (error) {
    code = 500;
    message = "Internal Server Error";
    const resData = customResponse({ code, message, error });
    res.status(code).send(resData);
  }
};

const refreshToken = async (req, res) => {
  const options = {
    expiresIn: process.env.EXPIRESIN,
    issuer: process.env.ISSUER,
  };
  const secret = process.env.JWT_SECRET;
  const refreshToken = req.headers.refresh;
  try {
    code = 200;
    const user = await userModel.findOne({ refreshToken: refreshToken });
    if (user) {
      jwt.verify(refreshToken, secret, async function (err, decoded) {
        if (err) {
          code = 401;
          message = err.message;
          const resData = customResponse({
            code,
            message,
            err,
          });
          return res.status(code).send(resData);
        }
        const result = jwt.verify(refreshToken, process.env.JWT_SECRET, {
          expiresIn: "7d",
          issuer: process.env.ISSUER,
        });
        const payload = {
          email: result.email,
          password: result.password,
          permission: result.permission,
          role: result.role,
        };
        const accessToken = jwt.sign(payload, secret, options);
        const updateUser = await userModel.findOneAndUpdate(
          { email: result.email },
          {
            $push: { token: accessToken },
          },
          { new: true }
        );
        const check = await userModel
          .findOneAndUpdate(
            { email: result.email },
            {
              $pull: { token: req.headers.authorization.split(" ")[1] },
            },
            { new: true }
          )
          .exec();
        updateUser.save();
        const data = {
          name: user.name,
          email: user.email,
          permission: result.permission,
          role: result.role,
          Authorization: "Bearer " + accessToken,
          refreshToken: refreshToken,
          id: user._id.toString(),
        };
        message = "access token and details ";
        const resData = customResponse({ code, message, data });
        return res.status(code).send(resData);
      });
    } else {
      code = 401;
      message = "Invalid Token";
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    }
  } catch (error) {
    code = 401;
    message = "Invalid Token";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const setPassword = async (req, res) => {
  let code, message;
  const _id = req.params.id;
  const password = req.body.password;
  try {
    code = 200;
    message = "user successfully updated!";
    const enc_pwd = await bcrypt.hash(password, 10);
    const user = await userModel.findOneAndUpdate(
      { _id },
      { password: enc_pwd },
      { new: true }
    );
    if (!user) {
      code = 400;
      message = "Bad Request";
      const resdata = customResponse({ code, message });
      return res.status(code).send(resdata);
    }
    await user.save();
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

module.exports = {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
  auth,
  getAccount,
  addSuperAdmin,
  setPassword,
  logout,
  refreshToken,
};

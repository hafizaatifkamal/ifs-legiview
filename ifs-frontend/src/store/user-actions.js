import { uiActions } from "./ui-slice";
import { userActions } from "./user-slice";
import Cookies from "js-cookie";
import axios from "../helpers/axiosInstance";

export const loginApi = (data) => {
  return async (dispatch) => {
    const loginUser = async () => {
      const response = await axios.post(`/login`, data);
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        axios.defaults.headers.common["Authorization"] =
          response.data.data.Authorization;
        axios.defaults.headers.common["refresh"] =
          response.data.data.refreshToken;
        const data = response.data.data;
        return data;
      }
    };
    try {
      dispatch(uiActions.toggleLoader());
      const data = await loginUser();
      const token = { access: data.Authorization, refresh: data.refreshToken };
      dispatch(userActions.setUserDetails(data));
      dispatch(userActions.login(token));
      return true;
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Error!",
          message: "Inavlid Credientials",
        })
      );
      return false;
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const refreshToken = () => {
  return async (dispatch) => {
    const fetchTOkenandSetData = async () => {
      const token = Cookies.get("refresh");
      if (token) {
        axios.defaults.headers.common["Authorization"] = Cookies.get("access");
        axios.defaults.headers.common["refresh"] = Cookies.get("refresh");
        const response = await axios.get("/refresh-token");
        if (response.data.code === 200 || response.data.status === "success") {
          const data = response.data.data;
          return data;
        }
        throw new Error(
          response.data.message || "Something went wrong! Please try again..."
        );
      }
    };
    try {
      dispatch(uiActions.toggleLoader());
      const data = await fetchTOkenandSetData();
      const token = { access: data.Authorization, refresh: data.refreshToken };
      axios.defaults.headers.common["Authorization"] = data.Authorization;
      axios.defaults.headers.common["refresh"] = data.refreshToken;
      dispatch(userActions.setUserDetails(data));
      dispatch(userActions.login(token));
      return true;
    } catch (error) {
      return false;
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const getUserDetails = () => {
  return async (dispatch) => {
    try {
      const getUserData = async () => {
        const response = await axios.post("/account");
        if (response.status === "failure") {
          throw new Error(response.data.message);
        }
        return response;
      };

      const data = await getUserData();
      dispatch(
        userActions.setUserDetails({
          user: data.data.data || {},
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Error!",
          message: "error",
        })
      );
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    const logoutUser = async () => {
      const response = await axios.get(`/logout`);
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data;
        return data;
      }
    };
    try {
      dispatch(uiActions.toggleLoader());
      await logoutUser();
      axios.defaults.headers.common["Authorization"] = "";
      axios.defaults.headers.common["refresh"] = "";
      dispatch(userActions.logout());
      return true;
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Error!",
          message: "error",
        })
      );
      return false;
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const createUser = (body) => {
  return async (dispatch) => {
    const createUser = async () => {
      const response = await axios.post(`/users`, body);
      console.log(response, "creatingres");
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data.data;
        return data;
      }
    };
    try {
      dispatch(uiActions.toggleLoader());
      const res = await createUser();
      return true;
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Error!",
          message: "error",
        })
      );
      return false;
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const updateUserById = (body, id) => {
  return async (dispatch) => {
    const updateUser = async () => {
      const response = await axios.put(`/users/${id}`, body);
      // console.log(response, "updatingres");
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data.data;
        return data;
      }
    };
    try {
      dispatch(uiActions.toggleLoader());
      const res = await updateUser();
      return true;
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Error!",
          message: "error",
        })
      );
      return false;
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const getUserByName = (name) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`users?name=${name}`);
      // console.log(response)
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data.data.results;
        return data;
      }
    };
    try {
      const data = await fetchData();
      dispatch(userActions.setUserByName(data));
    } catch (err) {
      setTimeout(function () {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: err.message,
          })
        );
      }, 1000);
    }
  };
};

export const ChangePassword = (id, password) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.put(`${id}/setPassword`, password);
      // console.log(response)
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data.data.results;
        return data;
      }
    };
    try {
      dispatch(uiActions.toggleLoader());
      await fetchData();
      return true;
    } catch (err) {
      setTimeout(function () {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: err.message,
          })
        );
      }, 1000);
      return false;
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const getInterviewerNotifications = (whoCreated) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(
        `notifications-interviewer?toWhom=${whoCreated}`
      );
      // console.log(response,"getInterviewerNotifications")
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data.data;
        return data;
      }
    };
    try {
      const data = await fetchData();
      console.log(data, "setInterviewerNotifications");
      dispatch(userActions.setInterviewerNotifications(data));
    } catch (err) {
      setTimeout(function () {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: err.message,
          })
        );
      }, 1000);
    }
  };
};

export const getHrNotifications = (name) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`notifications-hr`);
      // console.log(response,"getHrNotifications")
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        const data = response.data.data;
        return data;
      }
    };
    try {
      const data = await fetchData();
      dispatch(userActions.setHrNotifications(data));
    } catch (err) {
      setTimeout(function () {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: err.message,
          })
        );
      }, 1000);
    }
  };
};

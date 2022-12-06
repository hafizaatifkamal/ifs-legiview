import { uiActions } from "./ui-slice";
import axios from "../../src/helpers/axiosInstance";
import { InterviewerAction } from "./interviewer-slice";

export const getInterviewer = (name, role) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`users?name=${name}&role=${role}`);
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
      dispatch(InterviewerAction.setInterviewer(data));
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

export const getRoles = (role) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`roles?role=${role}`);
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
      dispatch(InterviewerAction.setRoles(data));
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

export const rescheduleInterview = (body) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.post(`requestreschedule`, body);
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 201) {
        const data = response.data.data;
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

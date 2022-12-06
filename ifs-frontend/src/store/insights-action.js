import { uiActions } from "./ui-slice";
import axios from "../../src/helpers/axiosInstance";
import { InsightsAction } from "./insights-slice";

export const getInsights = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`insight`);
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
      dispatch(InsightsAction.setInsights(data));
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

export const getRoleGroupInsights = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`insight/getselectedinsight`);
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
      dispatch(InsightsAction.setRoleGroupInsights(data));
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

export const getInsightsByRole = (role) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`insight/getrolesinsight?role=${role}`);
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
      dispatch(InsightsAction.setInsightsByRole(data));
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

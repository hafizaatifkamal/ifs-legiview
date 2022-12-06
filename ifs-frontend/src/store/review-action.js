import { uiActions } from "./ui-slice";
import axios from "../../src/helpers/axiosInstance";
import { reviewAction } from "./review-slice";

export const getAllReviews = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`requestreschedule`);
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
      const data = await fetchData();
      dispatch(reviewAction.setreview(data));
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
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

export const getReviewsByid = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`requestreschedule/${id}`);
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
      const data = await fetchData();
      dispatch(reviewAction.setreviewDetail(data));
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
    } finally {
      dispatch(uiActions.toggleLoader());
    }
  };
};

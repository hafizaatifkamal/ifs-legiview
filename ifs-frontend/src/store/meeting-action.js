import { uiActions } from "./ui-slice";
import axios from "../../src/helpers/axiosInstance";

export const setMeetingDetails = (body) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const { level, candidateId } = body;
      let response;
      console.log(body);
      if (body.info && body.info.level === 1) {
        response = await axios.post(`interviewrounddetail`, body);
        console.log(response, "response");
      } else {
        response = await axios.put(
          `interviewrounddetail/candidate/${candidateId}?level=${level}`,
          body
        );
      }

      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 201 || response.status === 200) {
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

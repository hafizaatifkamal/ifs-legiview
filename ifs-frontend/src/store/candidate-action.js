import { uiActions } from "./ui-slice";
import axios from "../../src/helpers/axiosInstance";
import { candidateAction } from "./candidate-slice";

export const getCandidate = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`candidates`);
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
      dispatch(candidateAction.setCandidate(data));
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

export const getTodayInterviewByInterviewerID = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`candidates/todayinterview/${id}`);
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
      dispatch(candidateAction.setCandidate(data));
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

export const getMonthlyInterviewsByInterviewerID = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      let url;
      if (!!id) {
        url = `candidates/monthlyinterview/${id}`;
      } else {
        url = `/history/upcoming`;
      }
      const response = await axios.get(url);
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
      dispatch(candidateAction.setMonthlyMeetings(data));
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

export const getLevelDetails = (id, level) => {
  return async (dispatch) => {
    const fetchData = async () => {
      let url;
      if (!!level) {
        url = `interviewrounddetail/candidate/${id}?level=${level}`;
      } else {
        url = `interviewrounddetail/candidate/${id}`;
      }
      const response = await axios.get(url);
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
      dispatch(candidateAction.setlevelDetails(data));
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

export const createInterview = (data) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.post(`candidates`, data);
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

export const getCandidateById = (id) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`candidates/${id}`);
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
      dispatch(candidateAction.setcandidateByID(data));
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

export const resheduleInterview = (id, body) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.put(`candidates/reshedule/${id}`, body);
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

export const shedulenextRoundInterview = (id, body) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.put(`candidates/shedule/${id}`, body);
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

export const getstates = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`candidates/getstates`);
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
      dispatch(candidateAction.setStates(data));
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

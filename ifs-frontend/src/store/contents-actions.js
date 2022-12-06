import { uiActions } from "./ui-slice";
import { contentsActions } from "./contents-slice";
import axios from "../helpers/axiosInstance";

export const getContentsData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = axios.get("/getContentsData");

      if (!response.ok) {
        throw new Error("Could not fetch cart data!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const data = await fetchData();
      dispatch(
        contentsActions.getContents({
          contents: data.contents || [],
        })
      );
    } catch (error) {
      dispatch(uiActions.toggleLoader());
      setTimeout(function () {
        dispatch(uiActions.toggleLoader());
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: "Fetching content data failed!",
          })
        );
      }, 3000);
    }
  };
};

export const sendContentData = (content) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );
  };
};

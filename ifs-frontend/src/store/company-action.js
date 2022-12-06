import { uiActions } from "./ui-slice";
import axios from "../../src/helpers/axiosInstance";
import { CompanyAction } from "./company-slice";

export const getCompanies = (company) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await axios.get(`companies?company=${company}`);
      if (response.status === "failure") {
        throw new Error(response.data.message);
      }
      if (response.status === 200) {
        console.log(response, "cmpanyres");
        const data = response.data.data.results;
        return data;
      }
    };
    try {
      const data = await fetchData();
      dispatch(CompanyAction.setCompanies(data));
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

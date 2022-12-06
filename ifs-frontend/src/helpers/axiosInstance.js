import axios from "axios";
import Cookies from "js-cookie";

let headers = {};
const baseURL = process.env.REACT_APP_API_BASE_URL;

// token = Cookies.get("access");
// refresh = Cookies.get("refresh");
// if (token) {
//   console.log(token);
//   headers.Authorization = `${token}`;
//   headers.refresh = refresh;
// }

// console.log(headers, "headers");
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers,
});

axiosInstance.interceptors.response.use(
  (response) =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 403) {
      window.location = "/login";
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export default axiosInstance;

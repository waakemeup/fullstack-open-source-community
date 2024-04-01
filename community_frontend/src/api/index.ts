import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method?.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_URL,
  withCredentials: true,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  // },
});

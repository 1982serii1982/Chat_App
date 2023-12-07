import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4441/",
  //baseURL: "http://api.mern1.sergiucotruta.co.uk",
  //baseURL: "https://api.mern1.sergiucotruta.co.uk",
});

// instance.interceptors.request.use((req) => {
//   req.headers.Authorization = window.localStorage.getItem("token");
//   return req;
// });

export default instance;

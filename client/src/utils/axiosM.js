import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  //baseURL: "http://localhost:4441/",
  //baseURL: "http://api.mern1.sergiucotruta.co.uk",
  //baseURL: "https://api.mern1.sergiucotruta.co.uk",
});

export default instance;

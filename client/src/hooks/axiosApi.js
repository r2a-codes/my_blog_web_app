import axios from "axios";

const url = import.meta.env.VITE_SERVER_URL;





export default axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


export const privateAxios = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


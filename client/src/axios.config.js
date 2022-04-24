import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jupiter-book.herokuapp.com/api/",
});

export default axiosInstance;

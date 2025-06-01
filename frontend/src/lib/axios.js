import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "http://localhost/3300/api",
  withCredentials: true
})
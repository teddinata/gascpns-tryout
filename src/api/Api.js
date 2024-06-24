// api/Api.js

import axios from "axios";
import router from "../router";

const Api = axios.create({
  // baseURL: "https://api-cpns.creazylab.works/api", // Staging
  baseURL: "http://backend-gascpns.dev.com/api", // dev
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Hapus token yang mungkin tidak valid dari localStorage
      localStorage.removeItem("token");
      // Arahkan pengguna ke halaman login
      router.push({ name: "login" });
    }
    return Promise.reject(error);
  }
);

export default Api;

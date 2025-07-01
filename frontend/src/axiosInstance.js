import axios from "axios";

const BASE_URL = "";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request Interceptor (before token):", config);

    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header added:", config.headers.Authorization);
    } else {
      console.warn(
        "No authentication token found in localStorage under 'authToken'."
      );
    }

    return config;
  },

  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor:", response);
    return response;
  },
  (error) => {
    console.error("Response Interceptor Error:", error);

    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request. User might need to re-login.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

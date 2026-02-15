import axios from "axios";
import { toast } from "react-toastify";
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
  credentials: "include",
});

export const axiosBaseQuery =
  ({ baseUrl = "" } = {}) =>
  async ({ url, method, data, params, responseType }) => {
    try {
      const isFormData = data instanceof FormData;
      console.log("FormData is Multipart", isFormData);
      const response = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params, 
        responseType: responseType || "json",
        // Let the browser set the boundary for FormData automatically
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
      });

      return { data: response.data };
    } catch (axiosError) {
      const err = axiosError.response;
      console.log(err?.data?.message || "Something went wrong");

      return {
        error: {
          status: err?.status || 500,
          data: err?.data || axiosError.message,
        },
      };
    }
  };

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        toast.error("Session expired. Please login again.");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);



export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  } catch (err) {
    console.error("Refresh token failed", err);
    throw err;
  }
};

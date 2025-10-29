import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api"
});

// Attach access token
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const auth = JSON.parse(raw);
      if (auth?.token) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${auth.token}`;
      }
    }
  } catch (e) {}
  return config;
});

// Optional response interceptor to handle 401 + refresh token flow
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        const raw = localStorage.getItem("auth");
        if (raw) {
          const auth = JSON.parse(raw);
          if (auth?.refresh) {
            const refreshRes = await axios.post((import.meta.env.VITE_API_URL || "http://localhost:8000/api") + "/auth/token/refresh/", { refresh: auth.refresh });
            const newAccess = refreshRes.data.access;
            auth.token = newAccess;
            localStorage.setItem("auth", JSON.stringify(auth));
            // update header and retry original request
            originalReq.headers["Authorization"] = `Bearer ${newAccess}`;
            return axios(originalReq);
          }
        }
      } catch (refreshErr) {
        // refresh failed -> clear auth
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
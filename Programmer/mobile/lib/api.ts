import axios from "axios";
import { tokenStorage } from "./token";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://192.168.0.101:2257",
  withCredentials: true,
});

let isRefreshing = false;
let queue: any[] = [];

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();

  if (token) {
    const decoded: any = jwtDecode(token);
    const now = Date.now();

    if (decoded.exp * 1000 < now) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.get("http://192.168.0.101:2257/token", { withCredentials: true });

          await tokenStorage.set(res.data.accessToken);

          queue.forEach((cb) => cb(res.data.accessToken));
          queue = [];
        } catch (e) {
          await tokenStorage.clear();
          throw e;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        queue.push((newToken: string) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(config);
        });
      });
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

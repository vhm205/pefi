import { isDev } from "../utils/utils";

export const config = {
  API_URL: isDev()
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL,
  API_KEY: import.meta.env.VITE_API_KEY,
};

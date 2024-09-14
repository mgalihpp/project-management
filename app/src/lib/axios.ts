import axios from "axios";

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default baseApi;

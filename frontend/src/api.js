import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

console.log("API BASE URL USED:", api.defaults.baseURL);

export default api;
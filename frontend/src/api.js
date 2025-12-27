import axios from 'axios';

const api = axios.create({
    // It will use the variable from Vercel/Render, 
    // or fallback to localhost if you are testing on your laptop
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default api;
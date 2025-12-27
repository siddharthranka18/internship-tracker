import axios from 'axios';

const api = axios.create({
    // Hardcode the link directly to bypass the Vercel variable issue for now
    baseURL: "https://intern-track-backend-new.onrender.com",
});

export default api;
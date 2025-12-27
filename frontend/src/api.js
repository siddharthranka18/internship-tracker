import axios from 'axios'

const api = axios.create({
    // Replace localhost with your live Render URL
    baseURL: "https://intern-track-backend-new.onrender.com",
});

export default api
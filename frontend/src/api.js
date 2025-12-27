import axios from 'axios'

const api = axios.create({
    // Replace localhost with your live Render URL
    baseURL: 'https://intern-track-backend-937i.onrender.com/api',
});

export default api
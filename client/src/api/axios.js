import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://nexus-ai-server.onrender.com/api'),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

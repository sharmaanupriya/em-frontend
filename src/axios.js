import axios from 'axios';

const api = axios.create({
    baseURL: 'https://em-backend-wcn4.onrender.com/api',
});

export default api;
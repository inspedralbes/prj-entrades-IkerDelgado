const axios = require('axios');

const http = require('http');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5173/api', // I need to use the docker port or api url directly
    // Wait frontend is on 5173 but proxy handles it? Or backend is on 8000? 
    // Let's use backend port. We need to check docker-compose.yml 
    baseURL: 'http://localhost:8000/api'
});

async function login(email, password) {
    const res = await axiosInstance.post('/login', { email, password });
    return res.data.access_token; // assuming sanctum token is returned
}

async function run() {
    // wait I'll use the API directly since they use Sanctum
    // Sanctum sets cookies, let's just write this as a PHP artisan command or run in api container!
}

run();

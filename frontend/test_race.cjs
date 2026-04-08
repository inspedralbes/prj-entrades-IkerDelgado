const axios = require('axios');

async function testConcurrency() {
    console.log("Starting test...");
    
    const apiA = axios.create({ baseURL: 'http://localhost:8000/api' });
    const apiB = axios.create({ baseURL: 'http://localhost:8000/api' });

    // Login A
    const loginA = await apiA.post('/login', { email: 'ikerdelgras@gmail.com', password: 'password123' });
    const tokenA = loginA.data.access_token;
    apiA.defaults.headers.common['Authorization'] = `Bearer ${tokenA}`;
    
    // Login B
    const loginB = await apiB.post('/login', { email: 'iker@gmail.com', password: 'password123' });
    const tokenB = loginB.data.access_token;
    apiB.defaults.headers.common['Authorization'] = `Bearer ${tokenB}`;

    // Get an available seat
    const seats = await apiA.get('/seats?session_id=1');
    const seat = seats.data.data.find(s => s.status === 'available');
    
    if (!seat) {
        console.log("No seats available to test");
        return;
    }
    
    console.log(`Testing with seat ${seat.id}`);

    // Race condition on /seats/lock
    console.log("Both attempting to lock...");
    const pA = apiA.post('/seats/lock', { session_id: 1, seat_status_ids: [seat.id] })
        .then(res => ({ user: 'A', status: res.status, data: res.data }))
        .catch(err => ({ user: 'A', status: err.response.status, data: err.response.data }));
        
    const pB = apiB.post('/seats/lock', { session_id: 1, seat_status_ids: [seat.id] })
        .then(res => ({ user: 'B', status: res.status, data: res.data }))
        .catch(err => ({ user: 'B', status: err.response.status, data: err.response.data }));
        
    const results = await Promise.all([pA, pB]);
    console.log("Lock results:", results);
}

testConcurrency().catch(console.error);

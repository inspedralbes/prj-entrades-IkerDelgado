const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');

// Configuració
const PORT = process.env.SOCKET_PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Servidor HTTP natiu (sense Express per evitar dependències extres)
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Socket.io server is running');
});

// Inicialització de Socket.io amb CORS
const io = new Server(server, {
    cors: {
        origin: "*", // En producció s'hauria de restringir
        methods: ["GET", "POST"]
    }
});

// Clients de Redis
const redisSubscriber = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

const redisClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

// Emmagatzematge en memòria de timeouts de bloqueig (opcional, Laravel també ho neteja)
const lockTimeouts = new Map();

async function startServer() {
    try {
        await redisSubscriber.connect();
        await redisClient.connect();
        console.log('Connected to Redis');

        // Suscripció al canal de Laravel
        await redisSubscriber.subscribe('seat-updates', (message) => {
            const data = JSON.parse(message);
            console.log('Redis message received:', data);

            // Forward de l'event a la sala corresponent
            if (data.sessionId) {
                const room = `session_${data.sessionId}`;
                io.to(room).emit(data.event, data);
            }
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            // Unir-se al dashboard global (per rebre nous events)
            socket.on('join-dashboard', () => {
                socket.join('dashboard');
                console.log(`Client ${socket.id} joined dashboard`);
            });

            // Unir-se a una sala de sessió
            socket.on('join-session', ({ sessionId }) => {
                const room = `session_${sessionId}`;
                socket.join(room);
                console.log(`Client ${socket.id} joined ${room}`);
            });

            // Notificació de canvis en el catàleg (Admin -> Server -> Broadcast)
            socket.on('catalog-updated', (data) => {
                console.log('Catalog updated, broadcasting to dashboard');
                io.to('dashboard').emit('catalog-changed', data);
            });

            // Sortir de la sala
            socket.on('leave-session', ({ sessionId }) => {
                const room = `session_${sessionId}`;
                socket.leave(room);
                console.log(`Client ${socket.id} left ${room}`);
            });

            // Bloquejar seient (Client -> Server -> Broadcast)
            socket.on('lock-seat', ({ sessionId, seatStatusId, userId }) => {
                const room = `session_${sessionId}`;
                console.log(`Locking seat ${seatStatusId} in ${room} by user ${userId}`);

                // Broadcast a TOTS a la sala (incloent el sender per si de cas)
                io.to(room).emit('seat-locked', { seatStatusId, userId });

                // Gestionar timeout de 5 minuts
                const timeoutKey = `${sessionId}_${seatStatusId}`;
                if (lockTimeouts.has(timeoutKey)) {
                    clearTimeout(lockTimeouts.get(timeoutKey));
                }

                const timeout = setTimeout(() => {
                    io.to(room).emit('lock-expired', { seatStatusId });
                    lockTimeouts.delete(timeoutKey);
                }, 5 * 60 * 1000); // 5 minuts

                lockTimeouts.set(timeoutKey, timeout);
            });

            // Desbloquejar seient
            socket.on('unlock-seat', ({ sessionId, seatStatusId, userId }) => {
                const room = `session_${sessionId}`;
                console.log(`Unlocking seat ${seatStatusId} in ${room}`);

                io.to(room).emit('seat-unlocked', { seatStatusId });

                const timeoutKey = `${sessionId}_${seatStatusId}`;
                if (lockTimeouts.has(timeoutKey)) {
                    clearTimeout(lockTimeouts.get(timeoutKey));
                    lockTimeouts.delete(timeoutKey);
                }
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        server.listen(PORT, () => {
            console.log(`Socket server listening on port ${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();

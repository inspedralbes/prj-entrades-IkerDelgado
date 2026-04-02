import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const useSocket = (sessionId: string | undefined) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!sessionId) return;

        // Connexió al servidor
        socketRef.current = io(SOCKET_URL);

        // Unir-se a la sala de la sessió
        socketRef.current.emit('join-session', { sessionId });

        console.log(`Connected to socket for session: ${sessionId}`);

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave-session', { sessionId });
                socketRef.current.disconnect();
                console.log(`Disconnected from socket for session: ${sessionId}`);
            }
        };
    }, [sessionId]);

    const emitLock = (seatStatusId: number) => {
        socketRef.current?.emit('lock-seat', { sessionId, seatStatusId });
    };

    const emitUnlock = (seatStatusId: number) => {
        socketRef.current?.emit('unlock-seat', { sessionId, seatStatusId });
    };

    return {
        socket: socketRef.current,
        emitLock,
        emitUnlock
    };
};

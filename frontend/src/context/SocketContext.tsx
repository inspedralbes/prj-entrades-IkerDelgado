import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface SocketContextType {
    socket: Socket | null;
    joinSession: (sessionId: string) => void;
    leaveSession: (sessionId: string) => void;
    joinDashboard: () => void;
    notifyCatalogUpdate: (type: 'event' | 'session', action: 'created' | 'updated' | 'deleted') => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connexió única global al servidor de sockets
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Socket global connected:', socketRef.current?.id);
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket global disconnected');
            setIsConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const joinSession = (sessionId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('join-session', { sessionId });
            console.log(`Joined session room: ${sessionId}`);
        }
    };

    const leaveSession = (sessionId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('leave-session', { sessionId });
            console.log(`Left session room: ${sessionId}`);
        }
    };

    const joinDashboard = () => {
        if (socketRef.current) {
            socketRef.current.emit('join-dashboard');
            console.log('Joined global dashboard room');
        }
    };

    const notifyCatalogUpdate = (type: 'event' | 'session', action: 'created' | 'updated' | 'deleted') => {
        if (socketRef.current) {
            socketRef.current.emit('catalog-updated', { type, action });
            console.log(`Notified catalog update: ${type} ${action}`);
        }
    };

    return (
        <SocketContext.Provider value={{ 
            socket: socketRef.current, 
            joinSession, 
            leaveSession, 
            joinDashboard, 
            notifyCatalogUpdate 
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocketContext must be used within a SocketProvider');
    return context;
};

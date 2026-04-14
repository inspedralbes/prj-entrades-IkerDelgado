import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Armchair, ShoppingCart, Loader2, Clock } from 'lucide-react';
import api from '../../api/axios';
import { useSocketContext } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ca } from '../../locales/ca';

interface Seat {
    id: number;
    row: string;
    number: number;
    price: string | number;
    user_id?: number;
    locked_at?: string;
    status: 'available' | 'locked' | 'sold';
}

export const SeatSelection = () => {
    const { id: sessionId } = useParams();
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { socket, joinSession } = useSocketContext();
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (sessionId) {
            joinSession(sessionId);
        }
    }, [sessionId]);

    useEffect(() => {
        setLoading(true);
        api.get(`/seats?session_id=${sessionId}`)
            .then(res => {
                const data = res.data.data || res.data;
                const seatList = Array.isArray(data) ? data : [];
                setSeats(seatList);
                
                if (user) {
                    const myLockedSeatIds = seatList
                        .filter((s: Seat) => s.status === 'locked' && s.user_id === user.id)
                        .map((s: Seat) => s.id);
                    setSelectedSeats(myLockedSeatIds);
                }
            })
            .catch(err => console.error("Error carregant seients:", err))
            .finally(() => setLoading(false));
    }, [sessionId, user]);

    useEffect(() => {
        if (!socket || !user) return;

        socket.on('seat-locked', ({ seatStatusId, userId }) => {
            setSeats(prev => prev.map(s => s.id === seatStatusId ? { ...s, status: 'locked', user_id: userId } : s));
            if (userId == user.id) {
                setSelectedSeats(prev => prev.includes(seatStatusId) ? prev : [...prev, seatStatusId]);
            } else {
                setSelectedSeats(prev => prev.filter(id => id !== seatStatusId));
            }
        });

        socket.on('seat-unlocked', ({ seatStatusId, userId }) => {
            setSeats(prev => prev.map(s => s.id === seatStatusId ? { ...s, status: 'available', user_id: undefined } : s));
            if (userId != user.id) {
                setSelectedSeats(prev => prev.filter(id => id !== seatStatusId));
            }
        });

        socket.on('lock-expired', ({ seatStatusId }) => {
            setSeats(prev => prev.map(s => s.id === seatStatusId ? { ...s, status: 'available', user_id: undefined } : s));
            setSelectedSeats(prev => prev.filter(id => id !== seatStatusId));
        });

        socket.on('seat-purchased', ({ seatStatusIds }) => {
            setSeats(prev => prev.map(s => seatStatusIds.includes(s.id) ? { ...s, status: 'sold' } : s));
            setSelectedSeats(prev => prev.filter(id => !seatStatusIds.includes(id)));
        });

        return () => {
            socket.off('seat-locked');
            socket.off('seat-unlocked');
            socket.off('lock-expired');
            socket.off('seat-purchased');
        };
    }, [socket, user]);

    const [pendingSeats, setPendingSeats] = useState<Set<number>>(new Set());

    const toggleSeat = async (seatId: number) => {
        if (!user || pendingSeats.has(seatId)) return;
        
        const isCurrentlySelected = selectedSeats.includes(seatId);

        if (isCurrentlySelected) {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
            setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'available', user_id: undefined } : s));
            socket?.emit('unlock-seat', { sessionId, seatStatusId: seatId, userId: user.id });
        } else {
            if (selectedSeats.length >= 5) {
                showToast("Només pots seleccionar un màxim de 5 seients per compra.", "warning");
                return;
            }
            setSelectedSeats(prev => [...prev, seatId]);
            setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'locked', user_id: user.id } : s));
            socket?.emit('lock-seat', { sessionId, seatStatusId: seatId, userId: user.id });
        }
        
        setPendingSeats(prev => new Set(prev).add(seatId));
        
        try {
            if (isCurrentlySelected) {
                await api.post('/seats/unlock', { session_id: sessionId, seat_status_ids: [seatId] });
            } else {
                await api.post('/seats/lock', { session_id: sessionId, seat_status_ids: [seatId] });
            }
        } catch (error: any) {
            console.error("Error al gestionar el seient:", error);
            if (isCurrentlySelected) {
                setSelectedSeats(prev => [...prev, seatId]);
                setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'locked', user_id: user.id } : s));
                socket?.emit('lock-seat', { sessionId, seatStatusId: seatId, userId: user.id });
            } else {
                setSelectedSeats(prev => prev.filter(id => id !== seatId));
                setSeats(prev => prev.map(s => s.id === seatId ? { ...s, status: 'available', user_id: undefined } : s));
                socket?.emit('unlock-seat', { sessionId, seatStatusId: seatId, userId: user.id });
            }
            showToast(error.response?.data?.message || 'Aquest seient ja no està disponible.', "error");
        } finally {
            setPendingSeats(prev => {
                const next = new Set(prev);
                next.delete(seatId);
                return next;
            });
        }
    };

    const totalPrice = seats
        .filter(s => selectedSeats.includes(s.id))
        .reduce((sum, s) => sum + Number(s.price), 0);

    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        const timerKey = `buy_timer_${sessionId}`;
        let expireTimeStr = sessionStorage.getItem(timerKey);
        
        if (!expireTimeStr) {
            const expireTime = new Date().getTime() + 5 * 60 * 1000;
            sessionStorage.setItem(timerKey, expireTime.toString());
            expireTimeStr = expireTime.toString();
        }

        const expireTime = parseInt(expireTimeStr, 10);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = Math.max(0, Math.floor((expireTime - now) / 1000));
            setTimeLeft(diff);
            
            if (diff === 0) {
                clearInterval(timer);
                showToast('El temps per comprar ha expirat. Torneu a intentar-ho.', "error");
                sessionStorage.removeItem(timerKey);
                
                if (selectedSeats.length > 0) {
                    api.post('/seats/unlock', { session_id: sessionId, seat_status_ids: selectedSeats }).finally(() => {
                        navigate('/dashboard');
                    });
                } else {
                    navigate('/dashboard');
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionId, selectedSeats]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGoToCheckout = () => {
        if (selectedSeats.length === 0) return;
        
        navigate(`/session/${sessionId}/checkout`, { 
            state: { 
                selectedSeats: selectedSeats,
                seatsInfo: seats.filter(s => selectedSeats.includes(s.id)),
                totalPrice: totalPrice,
                initialTimeLeft: Math.max(1, timeLeft)
            } 
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen text-slate-200 p-4 sm:p-6 md:p-12 lg:p-16"
        >
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-8 sm:mb-12">
                {/* Fila superior: botó enrere + timer */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <button 
                        onClick={() => {
                            sessionStorage.removeItem(`buy_timer_${sessionId}`);
                            window.history.back();
                        }} 
                        className="group p-3 sm:p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all border border-white/5 shadow-xl hover:shadow-indigo-600/20 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    {/* Timer — sempre visible a la dreta en mòbil */}
                    <div className={`flex items-center gap-2 text-indigo-400 px-4 py-2 rounded-full border transition-colors ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                        <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'animate-pulse'}`} />
                        <span className={`font-black text-base sm:text-xl italic tracking-tighter leading-none ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                            {formatTime(timeLeft)}
                            <span className="hidden sm:inline text-xs uppercase tracking-widest opacity-50 ml-1">restants</span>
                        </span>
                    </div>
                </div>

                {/* Títol centrat */}
                <div className="text-center">
                    <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                    >
                        Sessió #{sessionId}
                    </motion.div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        {ca.client.seat_selection}
                    </h1>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto bg-slate-900/20 backdrop-blur-md border border-white/[0.04] rounded-3xl sm:rounded-[4rem] p-4 sm:p-8 md:p-16 relative overflow-hidden mb-40">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-shimmer" />
                
                {/* Escenari */}
                <div className="relative mb-8 sm:mb-16 text-center group">
                    <div className="w-full h-4 bg-indigo-500/10 rounded-[100%] blur-2xl absolute top-0 group-hover:bg-indigo-500/20 transition-colors duration-1000" />
                    <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
                    <p className="mt-4 text-indigo-500 font-black tracking-[0.8em] sm:tracking-[1.5em] uppercase text-[10px] sm:text-xs italic">
                        {ca.client.stage}
                    </p>
                </div>

                {/* Mapa de Seients */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3 md:gap-4 justify-items-center max-w-4xl mx-auto">
                        {seats.map((seat, index) => (
                            <motion.button
                                key={seat.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.005, type: 'spring' as const, stiffness: 200, damping: 20 }}
                                disabled={seat.status === 'sold' || (seat.status === 'locked' && !selectedSeats.includes(seat.id))}
                                onClick={() => toggleSeat(seat.id)}
                                className={`
                                    relative group w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                                    ${seat.status === 'sold' ? 'bg-slate-900 text-slate-800 cursor-not-allowed border border-white/[0.02]' : 
                                      seat.status === 'locked' && !selectedSeats.includes(seat.id) ? 'bg-orange-500/20 text-orange-400 cursor-not-allowed border border-orange-500/20' :
                                      selectedSeats.includes(seat.id) ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] z-10 border-2 border-white/20' : 
                                      'bg-slate-950 border border-white/5 hover:border-indigo-500/50 text-slate-600 hover:text-white hover:shadow-xl hover:shadow-indigo-600/10'}
                                `}
                            >
                                <Armchair className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedSeats.includes(seat.id) ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                                <span className="text-[7px] sm:text-[9px] font-black mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">{index + 1}</span>
                                
                                {/* Tooltip — només en no-touch */}
                                <AnimatePresence>
                                    {seat.status === 'available' && !selectedSeats.includes(seat.id) && (
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-950 px-3 py-1.5 rounded-xl text-[9px] font-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 flex flex-col items-center shadow-2xl z-50 whitespace-nowrap hidden sm:flex">
                                            <span className="text-indigo-600 text-xs italic">{Number(seat.price).toFixed(2)}€</span>
                                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45" />
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Llegenda */}
                <div className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 px-4 sm:px-8 py-4 sm:py-5 bg-slate-950/40 backdrop-blur-md rounded-2xl sm:rounded-[2rem] border border-white/5 w-fit mx-auto shadow-2xl">
                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-950 border border-white/5 rounded-md sm:rounded-lg" /> <span>{ca.client.free}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 rounded-md sm:rounded-lg shadow-lg shadow-indigo-600/30" /> <span>{ca.client.selected}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500/20 border border-orange-500/30 rounded-md sm:rounded-lg" /> <span>{ca.client.reserved}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-900 rounded-md sm:rounded-lg opacity-50" /> <span>{ca.client.sold}</span>
                    </div>
                </div>
            </main>

            {/* Barra flotant de compra — responsive */}
            <AnimatePresence>
                {selectedSeats.length > 0 && (
                    <motion.div 
                        initial={{ y: 120, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 120, opacity: 0, scale: 0.9 }}
                        className="fixed bottom-0 sm:bottom-6 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:max-w-2xl px-0 sm:px-6 z-50"
                    >
                        <div className="bg-white text-slate-950 p-4 sm:p-6 sm:rounded-[2.5rem] shadow-[0_-10px_60px_rgba(99,102,241,0.3)] sm:shadow-[0_20px_80px_rgba(99,102,241,0.4)] flex items-center justify-between border-t-2 sm:border-4 border-indigo-600/10 gap-4">
                            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 text-white rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 flex-shrink-0">
                                    <ShoppingCart className="w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-0.5 truncate">
                                        {selectedSeats.length} {ca.client.seats_selected}
                                    </p>
                                    <p className="text-2xl sm:text-4xl font-black tracking-tighter italic leading-none">
                                        {totalPrice.toFixed(2)}<span className="text-base sm:text-xl ml-1 not-italic opacity-50">€</span>
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handleGoToCheckout}
                                disabled={timeLeft === 0}
                                className={`flex-shrink-0 bg-indigo-600 text-white px-5 sm:px-10 py-3 sm:py-5 rounded-2xl sm:rounded-[1.8rem] font-black text-sm sm:text-lg tracking-tighter uppercase italic hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {ca.client.buy_now}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

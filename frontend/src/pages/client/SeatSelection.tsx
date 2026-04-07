import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Ticket, Armchair, Info, ShoppingCart, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { useSocketContext } from '../../context/SocketContext';
import { ca } from '../../locales/ca';

interface Seat {
    id: number;
    row: string;
    number: number;
    price: string | number;
    status: 'available' | 'locked' | 'sold';
}

export const SeatSelection = () => {
    const { id: sessionId } = useParams();
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { socket, joinSession } = useSocketContext();

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
                setSeats(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error("Error carregant seients:", err))
            .finally(() => setLoading(false));
    }, [sessionId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('seat-locked', ({ seatStatusId }) => {
            setSeats(prev => prev.map(s => s.id === seatStatusId ? { ...s, status: 'locked' } : s));
            setSelectedSeats(prev => prev.filter(id => id !== seatStatusId));
        });

        socket.on('seat-unlocked', ({ seatStatusId }) => {
            setSeats(prev => prev.map(s => s.id === seatStatusId ? { ...s, status: 'available' } : s));
        });

        socket.on('lock-expired', ({ seatStatusId }) => {
            setSeats(prev => prev.map(s => s.id === seatStatusId ? { ...s, status: 'available' } : s));
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
    }, [socket]);

    const toggleSeat = (seatId: number) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }
            if (prev.length >= 5) {
                alert("Només pots seleccionar un màxim de 5 seients per compra.");
                return prev;
            }
            return [...prev, seatId];
        });
    };

    const totalPrice = seats
        .filter(s => selectedSeats.includes(s.id))
        .reduce((sum, s) => sum + Number(s.price), 0);

    const handleGoToCheckout = async () => {
        if (selectedSeats.length === 0) return;
        try {
            await api.post('/seats/lock', { 
                session_id: sessionId, 
                seat_status_ids: selectedSeats 
            });
            
            navigate(`/session/${sessionId}/checkout`, { 
                state: { 
                    selectedSeats: selectedSeats,
                    seatsInfo: seats.filter(s => selectedSeats.includes(s.id)),
                    totalPrice: totalPrice
                } 
            });
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error bloquejant els seients. Algú potser s\'ha avançat!');
            api.get(`/seats?session_id=${sessionId}`).then(res => setSeats(res.data.data || res.data));
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen text-slate-200 p-6 md:p-12 lg:p-16"
        >
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-16">
                <button 
                    onClick={() => window.history.back()} 
                    className="group p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all border border-white/5 shadow-xl hover:shadow-indigo-600/20 active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="text-center">
                    <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3"
                    >
                        Sessió #{sessionId}
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">{ca.client.seat_selection}</h1>
                </div>
                <div className="w-12 h-12" />
            </header>

            <main className="max-w-6xl mx-auto bg-slate-900/20 backdrop-blur-md border border-white/[0.04] rounded-[4rem] p-10 md:p-20 relative overflow-hidden mb-32">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-shimmer" />
                
                {/* Escenari */}
                <div className="relative mb-32 text-center group">
                    <div className="w-full h-4 bg-indigo-500/10 rounded-[100%] blur-2xl absolute top-0 group-hover:bg-indigo-500/20 transition-colors duration-1000" />
                    <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
                    <p className="mt-6 text-indigo-500 font-black tracking-[1.5em] uppercase text-xs italic group-hover:scale-110 transition-transform duration-700">{ca.client.stage}</p>
                </div>

                {/* Mapa de Seients */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-5 justify-items-center max-w-4xl mx-auto">
                    {seats.map((seat, index) => (
                        <motion.button
                            key={seat.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.005, type: 'spring', stiffness: 200, damping: 20 }}
                            disabled={seat.status !== 'available'}
                            onClick={() => toggleSeat(seat.id)}
                            className={`
                                relative group w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-500
                                ${seat.status === 'sold' ? 'bg-slate-900 text-slate-800 cursor-not-allowed border border-white/[0.02]' : 
                                  seat.status === 'locked' ? 'bg-orange-500/20 text-orange-400 cursor-not-allowed border border-orange-500/20' :
                                  selectedSeats.includes(seat.id) ? 'bg-indigo-600 text-white scale-115 shadow-[0_0_30px_rgba(99,102,241,0.4)] z-10 border-2 border-white/20' : 
                                  'bg-slate-950 border border-white/5 hover:border-indigo-500/50 text-slate-600 hover:text-white hover:shadow-xl hover:shadow-indigo-600/10'}
                            `}
                        >
                            <Armchair className={`w-6 h-6 ${selectedSeats.includes(seat.id) ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="text-[9px] font-black mt-1 opacity-50 group-hover:opacity-100 transition-opacity">{index + 1}</span>
                            
                            {/* Tooltip mejorado */}
                            <AnimatePresence>
                                {seat.status === 'available' && (
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-slate-950 px-4 py-2 rounded-2xl text-[10px] font-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 flex flex-col items-center shadow-2xl z-50 whitespace-nowrap scale-75 group-hover:scale-100">
                                        <span className="text-indigo-600 text-xs italic">{Number(seat.price).toFixed(2)}€</span>
                                        <div className="w-8 h-px bg-slate-200 my-1" />
                                        <span className="text-[8px] text-slate-400 uppercase tracking-widest">{ca.client.free}</span>
                                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
                                    </div>
                                )}
                            </AnimatePresence>

                            {seat.status === 'locked' && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all flex flex-col items-center shadow-xl z-50">
                                    <span className="uppercase tracking-widest text-[8px]">{ca.client.reserved}</span>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Llegenda */}
                <div className="mt-24 flex flex-wrap justify-center gap-10 px-10 py-6 bg-slate-950/40 backdrop-blur-md rounded-[2rem] border border-white/5 w-fit mx-auto shadow-2xl">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <div className="w-5 h-5 bg-slate-950 border border-white/5 rounded-lg" /> <span>{ca.client.free}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                        <div className="w-5 h-5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30" /> <span>{ca.client.selected}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                        <div className="w-5 h-5 bg-orange-500/20 border border-orange-500/30 rounded-lg" /> <span>{ca.client.reserved}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                        <div className="w-5 h-5 bg-slate-900 rounded-lg opacity-50" /> <span>{ca.client.sold}</span>
                    </div>
                </div>
            </main>

            {/* Barra flotant de compra mejorada */}
            <AnimatePresence>
                {selectedSeats.length > 0 && (
                    <motion.div 
                        initial={{ y: 120, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 120, opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 z-50"
                    >
                        <div className="bg-white text-slate-950 p-8 rounded-[3rem] shadow-[0_20px_80px_rgba(99,102,241,0.4)] flex items-center justify-between border-4 border-indigo-600/10">
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 relative overflow-hidden group">
                                    <ShoppingCart className="w-8 h-8 relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                                        {selectedSeats.length} {ca.client.seats_selected}
                                    </p>
                                    <p className="text-5xl font-black tracking-tighter italic leading-none">
                                        {totalPrice.toFixed(2)}<span className="text-xl ml-1 not-italic opacity-50">€</span>
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handleGoToCheckout}
                                className="group relative bg-indigo-600 text-white px-12 py-6 rounded-[1.8rem] font-black text-xl tracking-tighter uppercase italic hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-600/30 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {ca.client.buy_now}
                                    <Sparkles className="w-6 h-6 animate-pulse" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

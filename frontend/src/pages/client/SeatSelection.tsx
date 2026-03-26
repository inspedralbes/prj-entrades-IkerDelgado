import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Ticket, Armchair, Info, ShoppingCart } from 'lucide-react';
import api from '../../api/axios';

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

    const toggleSeat = (seatId: number) => {
        setSelectedSeats(prev => 
            prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
        );
    };

    // Calcular el preu total
    const totalPrice = seats
        .filter(s => selectedSeats.includes(s.id))
        .reduce((sum, s) => sum + Number(s.price), 0);

    const handlePurchase = async () => {
        if (selectedSeats.length === 0) return;
        try {
            await api.post('/purchase', { seat_status_ids: selectedSeats });
            alert('Compra realitzada amb èxit!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error en la compra. Torna-ho a intentar.');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12">
            <header className="max-w-5xl mx-auto flex items-center justify-between mb-12">
                <button 
                    onClick={() => window.history.back()} 
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Selecció de Seients</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Sessió #{sessionId}</p>
                </div>
                <div className="w-12 h-12" />
            </header>

            <main className="max-w-5xl mx-auto bg-slate-900/30 border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                
                {/* Escenari */}
                <div className="relative mb-24 text-center">
                    <div className="w-full h-2 bg-indigo-500/20 rounded-full blur-md absolute top-0" />
                    <div className="w-full h-1 bg-indigo-500/40 rounded-full" />
                    <p className="mt-4 text-indigo-400 font-black tracking-[1em] uppercase text-xs opacity-50">ESCENARI</p>
                </div>

                {/* Mapa de Seients */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 justify-items-center max-w-3xl mx-auto">
                    {seats.map((seat, index) => (
                        <motion.button
                            key={seat.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                            disabled={seat.status !== 'available'}
                            onClick={() => toggleSeat(seat.id)}
                            className={`
                                relative group w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                                ${seat.status === 'sold' ? 'bg-slate-800/50 text-slate-700 cursor-not-allowed opacity-50' : 
                                  selectedSeats.includes(seat.id) ? 'bg-indigo-600 text-white scale-110 shadow-2xl shadow-indigo-600/50 z-10 ring-4 ring-white/20' : 
                                  'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'}
                            `}
                        >
                            <Armchair className={`w-5 h-5 ${selectedSeats.includes(seat.id) ? 'animate-pulse' : ''}`} />
                            <span className="text-[8px] font-black mt-0.5">{seat.row}{seat.number}</span>
                            
                            {/* Hover info con PRECIO */}
                            {seat.status === 'available' && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 pointer-events-none transition-all flex flex-col items-center shadow-xl z-50">
                                    <span className="text-indigo-600">{Number(seat.price).toFixed(2)}€</span>
                                    <span className="text-[8px] text-slate-400">LLIURE</span>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Llegenda */}
                <div className="mt-20 flex flex-wrap justify-center gap-8 px-6 py-4 bg-slate-950/50 rounded-2xl border border-white/5 w-fit mx-auto">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                        <div className="w-4 h-4 bg-slate-800 rounded-md" /> <span>Lliure</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                        <div className="w-4 h-4 bg-indigo-600 rounded-md" /> <span>Seleccionat</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                        <div className="w-4 h-4 bg-slate-800 opacity-50 rounded-md" /> <span>Ocupat</span>
                    </div>
                </div>
            </main>

            {/* Barra flotant de compra mejorada con TOTAL */}
            <AnimatePresence>
                {selectedSeats.length > 0 && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50"
                    >
                        <div className="bg-white text-slate-950 p-6 rounded-[2rem] shadow-2xl flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <ShoppingCart className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                                        {selectedSeats.length} {selectedSeats.length === 1 ? 'Seient' : 'Seients'} seleccionats
                                    </p>
                                    <p className="text-4xl font-black tracking-tighter leading-none">
                                        {totalPrice.toFixed(2)}<span className="text-xl ml-1">€</span>
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handlePurchase}
                                className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
                            >
                                COMPRAR ARA
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

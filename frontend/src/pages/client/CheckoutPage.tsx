import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CreditCard, User, Mail, MapPin, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { useSocketContext } from '../../context/SocketContext';
import { ca } from '../../locales/ca';

export const CheckoutPage = () => {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedSeats, seatsInfo, totalPrice } = location.state || { selectedSeats: [], seatsInfo: [], totalPrice: 0 };
    const { socket, joinSession, leaveSession } = useSocketContext();

    const [timeLeft, setTimeLeft] = useState(300); // 5 minuts en segons
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: 'Joan Sala',
        email: 'joan.sala@example.com',
        address: 'Carrer Major 123, Barcelona'
    });

    useEffect(() => {
        if (selectedSeats.length === 0) {
            navigate('/dashboard');
            return;
        }

        if (sessionId) {
            joinSession(sessionId);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleExpire();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            if (sessionId) {
                leaveSession(sessionId);
            }
        };
    }, [sessionId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('lock-expired', ({ seatStatusId }) => {
            if (selectedSeats.includes(seatStatusId)) {
                alert('La teva reserva ha expirat al servidor.');
                navigate(`/session/${sessionId}/seats`);
            }
        });

        return () => {
            socket.off('lock-expired');
        };
    }, [socket, selectedSeats, sessionId]);

    const handleExpire = async () => {
        alert('El temps de reserva ha expirat. Torna a seleccionar els teus seients.');
        try {
            await api.post('/seats/unlock', { session_id: sessionId, seat_status_ids: selectedSeats });
        } catch (e) {
            console.error("Error unlocking on expire", e);
        }
        navigate(`/session/${sessionId}/seats`);
    };

    const handleCancel = async () => {
        try {
            await api.post('/seats/unlock', { session_id: sessionId, seat_status_ids: selectedSeats });
        } catch (e) {
            console.error("Error unlocking on cancel", e);
        }
        navigate(`/session/${sessionId}/seats`);
    };

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/purchase', { seat_status_ids: selectedSeats });
            alert('Compra realitzada amb èxit! Gaudeix del concert.');
            navigate('/dashboard');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error en completar la compra.');
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen text-slate-200 p-6 md:p-12 lg:p-16"
        >
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-16">
                <div className="flex-1 flex justify-start">
                    <button 
                        onClick={handleCancel} 
                        className="group p-4 bg-white/5 hover:bg-red-500/20 rounded-2xl transition-all border border-white/5 flex items-center gap-3 text-[10px] font-black tracking-[0.2em] shadow-xl hover:shadow-red-500/10 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> CANCEL·LAR
                    </button>
                </div>
                <div className="text-center shrink-0">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Finalitzar Compra</h1>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-center gap-3 text-indigo-400 mt-4 px-6 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20"
                    >
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span className="font-black text-xl italic tracking-tighter leading-none">{formatTime(timeLeft)} <span className="text-xs uppercase tracking-widest opacity-50 ml-1">restants</span></span>
                    </motion.div>
                </div>
                <div className="flex-1" />
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Formulari de Dades */}
                <div className="lg:col-span-2 space-y-10">
                    <motion.section 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900/20 backdrop-blur-md border border-white/[0.04] rounded-[3rem] p-10 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 bg-indigo-600/10 text-indigo-400 rounded-2xl flex items-center justify-center shadow-xl">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Dades del Comprador</h2>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Sincronitzades amb el teu perfil</p>
                            </div>
                        </div>

                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nom Complet</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            readOnly
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white font-medium focus:outline-none focus:border-indigo-500/30 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            readOnly
                                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white font-medium focus:outline-none focus:border-indigo-500/30 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Adreça de Facturació</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        value={formData.address}
                                        readOnly
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white font-medium focus:outline-none focus:border-indigo-500/30 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        </form>
                    </motion.section>

                    <motion.section 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/20 backdrop-blur-md border border-white/[0.04] rounded-[3rem] p-10 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center shadow-xl">
                                <CreditCard className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Mètode de Pagament</h2>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Connexió segura i xifrada</p>
                            </div>
                        </div>
                        <div className="p-8 border-2 border-indigo-500/30 bg-indigo-500/5 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                                    <div className="w-8 h-5 bg-blue-600 rounded-sm" />
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                                </div>
                                <div>
                                    <p className="font-black text-white italic tracking-tighter text-xl">Targeta de Crèdit</p>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.3em] mt-1">•••• •••• •••• 4242</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <ShieldCheck className="w-8 h-8 text-emerald-500 shadow-emerald-500/20" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">SECURE</span>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* Resum de la Comanda */}
                <div className="lg:col-span-1">
                    <motion.aside 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white text-slate-950 rounded-[4rem] p-12 sticky top-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10 border-b-4 border-slate-50 pb-6 relative z-10">Resum</h2>
                        
                        <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                            {seatsInfo.map((seat: any) => (
                                <div key={seat.id} className="flex justify-between items-center group">
                                    <div>
                                        <p className="font-black text-lg italic tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">Seient {seat.row}{seat.number}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Sessió #{sessionId}</p>
                                    </div>
                                    <p className="font-black text-xl tracking-tighter italic">{Number(seat.price).toFixed(2)}€</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-10 border-t-4 border-slate-50 mb-12 relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 leading-none">Total a pagar</p>
                                <p className="text-5xl font-black tracking-tighter italic leading-none">{totalPrice.toFixed(2)}<span className="text-xl ml-1 not-italic opacity-50">€</span></p>
                            </div>
                        </div>

                        <button 
                            onClick={handlePurchase}
                            disabled={isSubmitting || timeLeft === 0}
                            className={`
                                w-full py-8 rounded-[2.5rem] font-black text-2xl tracking-tighter uppercase italic transition-all shadow-2xl flex items-center justify-center gap-4 group relative overflow-hidden
                                ${isSubmitting ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-indigo-600/30'}
                            `}
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={32} />
                            ) : (
                                <span>{ca.client.buy_now}</span>
                            )}
                        </button>
                        
                        <p className="text-[9px] text-center mt-8 font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto opacity-50">
                            Acceptes els termes de servei i la política de privadesa en confirmar.
                        </p>
                    </motion.aside>
                </div>
            </main>
        </motion.div>
    );
};

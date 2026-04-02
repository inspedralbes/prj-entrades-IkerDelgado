import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, User, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import { useSocketContext } from '../../context/SocketContext';

export const CheckoutPage = () => {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedSeats, seatsInfo, totalPrice } = location.state || { selectedSeats: [], seatsInfo: [], totalPrice: 0 };
    const { socket, joinSession, leaveSession } = useSocketContext();

    const [timeLeft, setTimeLeft] = useState(300); // 5 minuts en segons
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dades inventades (mockup)
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

        // Ens assegurem que estem a la room (per si hem entrat directament o recarregat)
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
            // Quan sortim del checkout totalment (ex: anem al dashboard), deixem la room
            if (sessionId) {
                leaveSession(sessionId);
            }
        };
    }, [sessionId]);

    // Escoltar si el servidor ens diu que el lock ha expirat (per sincronització)
    useEffect(() => {
        if (!socket) return;

        socket.on('lock-expired', ({ seatStatusId }) => {
            // Si un dels nostres seients seleccionats expira al servidor
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
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12">
            <header className="max-w-5xl mx-auto flex items-center justify-between mb-12">
                <button 
                    onClick={handleCancel} 
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 flex items-center gap-2 text-sm font-bold"
                >
                    <ChevronLeft className="w-5 h-5" /> CANCEL·LAR
                </button>
                <div className="text-center">
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Finalitzar Compra</h1>
                    <div className="flex items-center justify-center gap-2 text-indigo-400 mt-1">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span className="font-mono font-bold text-lg">{formatTime(timeLeft)} restants</span>
                    </div>
                </div>
                <div className="w-24" />
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulari de Dades */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Dades del Comprador</h2>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Nom Complet</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        readOnly
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        readOnly
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Adreça de Facturació</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={formData.address}
                                        readOnly
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </form>
                    </section>

                    <section className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Mètode de Pagament</h2>
                        </div>
                        <div className="p-6 border-2 border-indigo-500/50 bg-indigo-500/5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-4 bg-blue-600 rounded-sm" />
                                </div>
                                <div>
                                    <p className="font-black text-white">Targeta de Crèdit</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">**** **** **** 4242</p>
                                </div>
                            </div>
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                    </section>
                </div>

                {/* Resum de la Comanda */}
                <div className="lg:col-span-1">
                    <aside className="bg-white text-slate-950 rounded-[2rem] p-8 sticky top-12 shadow-2xl">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 border-b-2 border-slate-100 pb-4">Resum</h2>
                        
                        <div className="space-y-4 mb-8">
                            {seatsInfo.map((seat: any) => (
                                <div key={seat.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-black text-sm uppercase">Seient {seat.row}{seat.number}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sessió #{sessionId}</p>
                                    </div>
                                    <p className="font-black">{Number(seat.price).toFixed(2)}€</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t-4 border-slate-100 mb-8">
                            <div className="flex justify-between items-end">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total a pagar</p>
                                <p className="text-4xl font-black tracking-tighter">{totalPrice.toFixed(2)}€</p>
                            </div>
                        </div>

                        <button 
                            onClick={handlePurchase}
                            disabled={isSubmitting || timeLeft === 0}
                            className={`
                                w-full py-6 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3
                                ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-600/20'}
                            `}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'CONFIRMAR COMPRA'
                            )}
                        </button>
                        
                        <p className="text-[9px] text-center mt-6 font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            En fer clic, acceptes els termes de servei i la política de privadesa del sistema.
                        </p>
                    </aside>
                </div>
            </main>
        </div>
    );
};

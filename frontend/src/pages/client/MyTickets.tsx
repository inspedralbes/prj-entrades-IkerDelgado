import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Ticket, Calendar, MapPin, Music2, QrCode } from 'lucide-react';
import api from '../../api/axios';
import { Footer } from '../../components/ui/Footer';

export const MyTickets = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/my-tickets')
            .then(res => setTickets(res.data.data))
            .catch(err => console.error("Error carregant entrades:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen text-slate-200"
        >
            <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center gap-8">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="p-3 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all border border-white/5"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Les meves <span className="text-indigo-500">entrades</span></h1>
                </div>
            </nav>

            <main className="max-w-[1000px] mx-auto px-6 py-16 lg:py-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Carregant el teu historial...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/[0.08]">
                        <Ticket className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                        <p className="text-slate-400 text-2xl font-black uppercase tracking-tighter italic">Encara no tens entrades</p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all"
                        >
                            Descobrir concerts
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {tickets.map((ticket, idx) => (
                            <motion.div 
                                key={ticket.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-900/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="p-10 flex-1">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[8px] font-black uppercase tracking-widest">
                                            Ticket #{ticket.id}
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                                            Pagat
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2 group-hover:text-indigo-400 transition-colors">
                                        {ticket.session?.event?.title}
                                    </h2>
                                    <p className="text-xl font-bold text-indigo-500/60 mb-8">{ticket.session?.event?.artist}</p>
                                    
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500"><Calendar size={18} /></div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Data</p>
                                                <p className="text-sm font-bold text-white">
                                                    {new Date(ticket.session?.date_time).toLocaleDateString('ca-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500"><MapPin size={18} /></div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recinte</p>
                                                <p className="text-sm font-bold text-white">{ticket.session?.venue}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white text-slate-950 p-10 flex flex-col items-center justify-center md:w-[240px] relative">
                                    <div className="hidden md:block absolute top-0 left-0 bottom-0 w-8 h-full">
                                        <div className="h-full w-full flex flex-col justify-around py-4">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 bg-slate-900 rounded-full -translate-x-6" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border-2 border-slate-50">
                                        <QrCode size={80} className="text-slate-900" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Seient</p>
                                    <p className="text-3xl font-black italic tracking-tighter uppercase">{ticket.seat?.row}{ticket.seat?.number}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </motion.div>
    );
};

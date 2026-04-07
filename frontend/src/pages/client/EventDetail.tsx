import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Ticket, ChevronLeft, Clock, Info, Music2, Sparkles, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { ca } from '../../locales/ca';

interface Session {
    id: number;
    date_time: string;
    venue: string;
}

interface Event {
    id: number;
    title: string;
    artist: string;
    image: string;
    description: string;
    sessions?: Session[];
}

export const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        api.get(`/events/${id}`)
            .then(res => {
                const data = res.data.data || res.data;
                setEvent(data);
            })
            .catch(err => console.error("Error carregant l'esdeveniment:", err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
        </div>
    );

    if (!event) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center border border-white/5 mb-8">
                <Info className="text-slate-700" size={40} />
            </div>
            <p className="text-slate-400 mb-8 text-2xl font-black uppercase tracking-tighter italic italic">No s'ha trobat l'esdeveniment.</p>
            <button 
                onClick={() => navigate('/dashboard')} 
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
            >
                Tornar al Dashboard
            </button>
        </motion.div>
    );

    const sessions = event.sessions || [];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen text-slate-200"
        >
            {/* Hero Header */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    {event.image ? (
                        <motion.img 
                            initial={{ scale: 1.2, filter: 'blur(20px) brightness(0.3)' }}
                            animate={{ scale: 1, filter: 'blur(10px) brightness(0.2)' }}
                            transition={{ duration: 1.5 }}
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-950" />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10 lg:pb-32">
                    <div className="absolute top-8 left-6 z-20">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="p-4 bg-white/10 hover:bg-indigo-600 backdrop-blur-md rounded-2xl text-white transition-all border border-white/10 shadow-2xl group active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-end mt-24 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-[200px] lg:w-[280px] aspect-[3/4] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 flex-shrink-0 bg-slate-900 relative group"
                        >
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-800 uppercase tracking-[0.3em] text-[10px] font-black italic">SENSE IMATGE</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl shadow-indigo-600/10"
                            >
                                <Sparkles size={14} className="animate-pulse" />
                                {ca.client.concert}
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-4 leading-[0.85] uppercase italic"
                            >
                                {event.title}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-3xl md:text-4xl font-black text-indigo-500 mb-8 italic tracking-tight"
                            >
                                {event.artist}
                            </motion.p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-xl"
                                >
                                    <Ticket className="w-4 h-4 text-indigo-400" /> Entrades Disponibles
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-black uppercase tracking-widest shadow-xl"
                                >
                                    <Info className="w-4 h-4" /> Event Oficial
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-3 gap-20">
                <div className="lg:col-span-2 space-y-20">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-black text-white mb-10 uppercase italic tracking-tighter flex items-center gap-6">
                            <span className="w-16 h-1.5 bg-indigo-500 rounded-full animate-shimmer"></span> 
                            Descripció
                        </h2>
                        <p className="text-slate-400 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                            {event.description || "No hi ha una descripció detallada per a aquest esdeveniment, però t'assegurem que serà una experiència inoblidable."}
                        </p>
                    </motion.section>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[3rem] bg-gradient-to-br from-indigo-600/20 to-cyan-600/10 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-colors" />
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">T'esperem al concert</h3>
                        <p className="text-slate-300 font-medium mb-10 max-w-xl relative z-10 leading-relaxed">
                            Aprofita aquesta oportunitat única per viure la música en directe amb els teus artistes favorits en un lloc excepcional.
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <Music2 size={24} className="text-indigo-400" />
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                    </motion.div>
                </div>

                <aside>
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="sticky top-32 p-10 bg-slate-900/40 border border-white/5 rounded-[3rem] backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                    >
                        <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-tighter italic">
                            <Calendar className="text-indigo-500" size={28} /> Tria la teva sessió
                        </h2>
                        <div className="space-y-6">
                            {sessions.length > 0 ? (
                                sessions.map((session, index) => (
                                    <motion.button
                                        key={session.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.1) }}
                                        onClick={() => navigate(`/session/${session.id}/seats`)}
                                        className="w-full group p-6 bg-slate-950/40 border border-white/5 rounded-3xl hover:border-indigo-500/50 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-start gap-5 relative z-10">
                                            <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-xl group-hover:shadow-indigo-600/20 group-hover:rotate-6">
                                                <Clock className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-xl italic tracking-tighter leading-none mb-2">
                                                    {new Date(session.date_time).toLocaleDateString('ca-ES', { day: '2-digit', month: 'long' })}
                                                </p>
                                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                                    <span className="truncate">{session.venue}</span>
                                                </div>
                                            </div>
                                            <div className="self-center">
                                                <ArrowRight className="w-6 h-6 text-slate-800 group-hover:text-indigo-500 group-hover:translate-x-2 transition-all" />
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center border border-white/5 mx-auto mb-6">
                                        <Calendar className="text-slate-800" size={24} />
                                    </div>
                                    <p className="text-slate-600 font-black uppercase tracking-widest italic text-xs">Aviat noves dates!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </aside>
            </main>
        </motion.div>
    );
};

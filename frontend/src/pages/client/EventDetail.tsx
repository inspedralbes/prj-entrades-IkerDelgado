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
            <div className="relative min-h-[60vh] lg:h-[70vh] w-full overflow-hidden flex flex-col">
                <div className="absolute inset-0">
                    {event.image ? (
                        <motion.img 
                            initial={{ scale: 1.1, filter: 'blur(10px) brightness(0.2)' }}
                            animate={{ scale: 1, filter: 'blur(5px) brightness(0.3)' }}
                            transition={{ duration: 1.5 }}
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-950" />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col py-12 lg:pb-32">
                    <div className="mb-12">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="p-4 bg-white/10 hover:bg-indigo-600 backdrop-blur-md rounded-2xl text-white transition-all border border-white/10 shadow-2xl group active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="mt-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-[180px] lg:w-[280px] aspect-[3/4] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-slate-900"
                        >
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-800 uppercase tracking-[0.3em] text-[10px] font-black italic">SENSE IMATGE</div>
                            )}
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
                                className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic"
                            >
                                {event.title}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-2xl md:text-3xl font-black text-indigo-500 mb-8 italic tracking-tight"
                            >
                                {event.artist}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                <div className="lg:col-span-2 space-y-12 lg:space-y-20">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-black text-white mb-8 uppercase italic tracking-tighter flex items-center gap-4">
                            <span className="w-12 h-1 bg-indigo-500 rounded-full"></span> 
                            Descripció
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                            {event.description || "No hi ha una descripció detallada per a aquest esdeveniment, però t'assegurem que serà una experiència inoblidable."}
                        </p>
                    </motion.section>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-[2.5rem] bg-indigo-600/5 border border-white/5 relative overflow-hidden"
                    >
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">T'esperem al concert</h3>
                        <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
                            Aprofita aquesta oportunitat única per viure la música en directe amb els teus artistes favorits.
                        </p>
                    </motion.div>
                </div>

                <aside>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="sticky top-32 p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl"
                    >
                        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter italic">
                            <Calendar className="text-indigo-500" size={24} /> Tria la teva sessió
                        </h2>
                        <div className="space-y-4">
                            {sessions.length > 0 ? (
                                sessions.map((session, index) => (
                                    <motion.button
                                        key={session.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.05) }}
                                        onClick={() => navigate(`/session/${session.id}/seats`)}
                                        className="w-full group p-5 bg-slate-950/40 border border-white/5 rounded-2xl hover:border-indigo-500/50 transition-all text-left active:scale-[0.98] flex items-center justify-between overflow-hidden"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-lg italic tracking-tighter leading-none mb-1">
                                                    {new Date(session.date_time).toLocaleDateString('ca-ES', { day: '2-digit', month: 'long' })}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-[120px]">{session.venue}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                    </motion.button>
                                ))
                            ) : (
                                <p className="text-slate-600 font-black uppercase tracking-widest italic text-[10px] text-center py-10">Aviat noves dates!</p>
                            )}
                        </div>
                    </motion.div>
                </aside>
            </main>
        </motion.div>
    );
};

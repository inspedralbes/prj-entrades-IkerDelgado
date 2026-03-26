import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, ChevronLeft, Clock, Info } from 'lucide-react';
import api from '../../api/axios';

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
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8">
            <p className="text-slate-500 mb-4 text-xl font-medium">No s'ha trobat l'esdeveniment.</p>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Tornar al Dashboard</button>
        </div>
    );

    const sessions = event.sessions || [];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* Hero Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover scale-110 blur-xl opacity-30" />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="absolute top-8 left-6 p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl text-white transition-all border border-white/5"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row gap-8 items-end"
                    >
                        <div className="w-full md:w-64 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 bg-slate-900">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 uppercase tracking-widest text-[10px] font-black">Sense Imatge</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2 leading-none uppercase italic">
                                {event.title}
                            </h1>
                            <p className="text-3xl font-bold text-indigo-400 mb-6">{event.artist}</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-bold">
                                    <Ticket className="w-4 h-4" /> Entrades Disponibles
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold">
                                    <Info className="w-4 h-4" /> Event Oficial
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-1 bg-indigo-500 rounded-full"></span> Descripció
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-wrap">
                            {event.description || "No hi ha una descripció detallada per a aquest esdeveniment, però t'assegurem que serà una experiència inoblidable."}
                        </p>
                    </section>
                </div>

                <aside>
                    <div className="sticky top-32 p-8 bg-slate-900/50 border border-white/5 rounded-[2.5rem] backdrop-blur-md">
                        <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                            <Calendar className="text-indigo-500" /> Tria la teva sessió
                        </h2>
                        <div className="space-y-4">
                            {sessions.length > 0 ? (
                                sessions.map((session, index) => (
                                    <motion.button
                                        key={session.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => navigate(`/session/${session.id}/seats`)}
                                        className="w-full group p-5 bg-slate-950/50 border border-white/5 rounded-2xl hover:border-indigo-500/50 transition-all text-left relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-lg mb-1">
                                                    {new Date(session.date_time).toLocaleDateString('ca-ES', { day: '2-digit', month: 'long' })}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                                    <MapPin className="w-3 h-3" />
                                                    {session.venue}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            ) : (
                                <p className="text-slate-500 italic text-center py-8">Aviat noves dates!</p>
                            )}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

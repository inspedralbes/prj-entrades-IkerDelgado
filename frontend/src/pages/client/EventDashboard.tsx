import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, LogOut, User } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

interface Event {
    id: number;
    title: string;
    artist: string;
    image: string;
    description: string;
}

export const EventDashboard = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/events')
            .then(res => {
                const data = res.data.data || res.data;
                setEvents(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error("Error carregant esdeveniments:", err))
            .finally(() => setLoading(false));
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                            <Ticket className="text-white w-6 h-6 rotate-12" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">TICKET<span className="text-indigo-500">HUB</span></span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-white">{user?.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500">Client Premium</span>
                        </div>
                        <button 
                            onClick={logout}
                            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                            title="Tancar Sessió"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <header className="mb-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        Descobreix experiències
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                    >
                        Pròxims <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Esdeveniments</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 max-w-2xl text-lg leading-relaxed"
                    >
                        Reserva les teves entrades per als concerts més exclusius i viu moments inoblidables amb els teus artistes preferits.
                    </motion.p>
                </header>
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] bg-slate-900/50 animate-pulse rounded-3xl border border-white/5"></div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="py-20 text-center bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
                        <Ticket className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-20" />
                        <p className="text-slate-500 text-lg">No hi ha esdeveniments disponibles en aquest moment.</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {events.map(event => (
                            <motion.div 
                                key={event.id}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(`/event/${event.id}`)}
                                className="group relative bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden cursor-pointer hover:bg-slate-900/60 transition-all hover:border-indigo-500/30 shadow-2xl"
                            >
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">Sense imatge</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                                    
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                                                Concert
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-black text-white leading-tight mb-1">{event.title}</h2>
                                        <p className="text-indigo-400 font-medium">{event.artist}</p>
                                    </div>
                                </div>
                                <div className="p-6 pt-0">
                                    <button className="w-full py-4 bg-white text-black font-black rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl active:scale-95">
                                        RESERVAR ARA
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

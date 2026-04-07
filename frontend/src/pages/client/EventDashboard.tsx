import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Music2, Calendar, MapPin, Ticket, LogOut } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import { SpotlightCard } from '../../components/ui/SpotlightCard';
import { Footer } from '../../components/ui/Footer';
import { ca } from '../../locales/ca';

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
    const { socket, joinDashboard } = useSocketContext();

    const fetchEvents = () => {
        api.get('/events')
            .then(res => {
                const data = res.data.data || res.data;
                setEvents(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error("Error carregant esdeveniments:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEvents();
        joinDashboard();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('catalog-changed', (data) => {
            console.log('Catalog changed real-time:', data);
            fetchEvents();
        });

        return () => {
            socket.off('catalog-changed');
        };
    }, [socket]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen text-slate-200 selection:bg-indigo-500/30"
        >
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/[0.04] px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <motion.span 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-2xl font-black tracking-tighter text-white cursor-pointer group" 
                        onClick={() => navigate('/dashboard')}
                    >
                        TICKET<span className="text-indigo-500 group-hover:text-cyan-400 transition-colors">HUB</span>
                    </motion.span>
                    
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/my-tickets')}
                            className="flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-white transition-all uppercase tracking-widest border border-indigo-500/20 px-4 py-2 rounded-xl bg-indigo-500/5"
                        >
                            <Ticket size={14} />
                            Les meves entrades
                        </button>
                        <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.name}</span>
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest p-2 md:p-0"
                            title={ca.common.logout}
                        >
                            <LogOut size={18} className="md:hidden" />
                            <span className="hidden md:block">{ca.common.logout}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20 relative z-10">
                {/* Hero Section */}
                <header className="mb-20 text-center md:text-left">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        {ca.client.discover}
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase italic pr-4"
                    >
                        {ca.client.upcoming_events.split(' ')[0]}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-400 pr-2 md:pr-4">
                            {ca.client.upcoming_events.split(' ')[1]}
                        </span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl text-lg leading-relaxed font-medium"
                    >
                        {ca.client.hero_description}
                    </motion.p>
                </header>
                
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[320px] bg-slate-900/40 animate-pulse rounded-[2.5rem] border border-white/[0.04]" />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-32 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/[0.08] backdrop-blur-sm"
                    >
                        <Music2 className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                        <p className="text-slate-400 text-2xl font-black uppercase tracking-tighter">{ca.client.no_events}</p>
                        <p className="text-slate-600 text-sm mt-4 font-bold uppercase tracking-widest">{ca.client.no_events_subtitle}</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {events.map(event => (
                            <motion.div 
                                key={event.id}
                                variants={itemVariants}
                            >
                                <SpotlightCard
                                    className="rounded-[2.5rem] bg-slate-900/40 border border-white/[0.06] hover:border-indigo-500/40 transition-all duration-500 cursor-pointer group overflow-hidden"
                                    spotlightColor="rgba(99, 102, 241, 0.15)"
                                >
                                    <div 
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        className="flex flex-col sm:flex-row h-full min-h-[320px]"
                                    >
                                        {/* Image Section */}
                                        <div className="relative w-full sm:w-[240px] md:w-[300px] flex-shrink-0 overflow-hidden">
                                            {event.image ? (
                                                <img 
                                                    src={event.image} 
                                                    alt={event.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                                    <Music2 className="text-slate-700 w-12 h-12" />
                                                </div>
                                            )}
                                            {/* Image gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/90 hidden sm:block" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent sm:hidden" />
                                            
                                            {/* Badge */}
                                            <div className="absolute top-6 left-6">
                                                <span className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                                    {ca.client.concert}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between relative">
                                            <div>
                                                <h2 className="text-3xl font-black text-white leading-[0.9] mb-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tighter italic">
                                                    {event.title}
                                                </h2>
                                                <div className="flex items-center gap-2 text-indigo-400 font-black text-sm uppercase tracking-widest mb-6">
                                                    <Music2 size={16} />
                                                    {event.artist}
                                                </div>
                                                {event.description && (
                                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* CTA Button */}
                                            <div className="mt-8">
                                                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-indigo-600 text-white font-black text-xs tracking-[0.2em] rounded-2xl group-hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-600/20 group-hover:shadow-indigo-500/40 active:scale-[0.97]">
                                                    {ca.client.reserve_now}
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            <Footer />
        </motion.div>
    );
};

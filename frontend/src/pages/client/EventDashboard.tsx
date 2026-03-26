import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { SpotlightCard } from '../../components/ui/SpotlightCard';
import { Footer } from '../../components/ui/Footer';

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
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
            {/* Ambient background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/[0.07] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <span 
                        className="text-xl font-black tracking-tighter text-white cursor-pointer" 
                        onClick={() => navigate('/dashboard')}
                    >
                        TICKET<span className="text-indigo-400">HUB</span>
                    </span>
                    
                    <div className="flex items-center gap-5">
                        <span className="hidden md:block text-sm text-slate-400">{user?.name}</span>
                        <button 
                            onClick={logout}
                            className="text-sm text-slate-500 hover:text-white transition-colors"
                        >
                            Tancar sessió
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
                {/* Hero Section */}
                <header className="mb-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-6"
                    >
                        Descobreix experiències
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[0.95]"
                    >
                        Pròxims{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
                            Esdeveniments
                        </span>
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
                    /* Skeleton loaders — match new wide layout */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[280px] bg-slate-900/40 animate-pulse rounded-3xl border border-white/[0.04]" />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="py-24 text-center bg-slate-900/20 rounded-3xl border border-dashed border-white/[0.08]">
                        <p className="text-slate-500 text-lg font-medium">No hi ha esdeveniments disponibles en aquest moment.</p>
                        <p className="text-slate-600 text-sm mt-2">Torna aviat per descobrir nous concerts!</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {events.map(event => (
                            <motion.div 
                                key={event.id}
                                variants={itemVariants}
                            >
                                <SpotlightCard
                                    className="rounded-3xl bg-slate-900/40 border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-500 cursor-pointer group"
                                    spotlightColor="rgba(99, 102, 241, 0.12)"
                                >
                                    <div 
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        className="flex flex-col md:flex-row h-full"
                                    >
                                        {/* Image Section */}
                                        <div className="relative w-full md:w-[280px] lg:w-[320px] flex-shrink-0 overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                                            {event.image ? (
                                                <img 
                                                    src={event.image} 
                                                    alt={event.title} 
                                                    className="w-full h-[220px] md:h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                                />
                                            ) : (
                                                <div className="w-full h-[220px] md:h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                                    <span className="text-slate-700 text-sm">Sense imatge</span>
                                                </div>
                                            )}
                                            {/* Image gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/80 hidden md:block" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:hidden" />
                                            
                                            {/* Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-[10px] font-bold text-white uppercase tracking-[0.15em] flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                    Concert
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between min-h-[200px]">
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-300 transition-all duration-300">
                                                    {event.title}
                                                </h2>
                                                <p className="text-indigo-400 font-semibold text-lg mb-3">{event.artist}</p>
                                                {event.description && (
                                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* CTA Button */}
                                            <div className="mt-6">
                                                <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold rounded-2xl group-hover:from-indigo-500 group-hover:to-cyan-500 transition-all duration-500 shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-500/40 active:scale-[0.97]">
                                                    RESERVAR ARA
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
        </div>
    );
};

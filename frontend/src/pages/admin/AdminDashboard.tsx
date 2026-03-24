import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Clock, LogOut, Plus, Loader2, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const [tab, setTab] = useState<'users' | 'events' | 'sessions'>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint = tab === 'users' ? '/users' : (tab === 'events' ? '/events' : '/sessions');
        const res = await apiFetch(endpoint);
        setData(res.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 400); // Dona-li una mica de temps per l'animació
      }
    };
    fetchData();
  }, [tab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Animat */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
              ADMIN<span className="text-indigo-500">DASH</span>
            </h1>
            <p className="text-slate-500 font-medium">Benvingut, {user?.name}. Gestiona la teva plataforma de concerts.</p>
          </div>
          
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-2xl shadow-2xl">
            {(['users', 'events', 'sessions'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-8 py-3 rounded-xl text-sm font-black tracking-widest transition-all ${
                  tab === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === t && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  />
                )}
                <span className="relative z-10">{t.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </motion.header>

        {/* Stats Grid amb animació de cascada */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <StatCard label="Usuaris Actius" value="1,284" color="indigo" />
          <StatCard label="Entrades Venudes" value="14.2k" color="purple" />
          <StatCard label="Ingressos Mensuals" value="€42.5k" color="emerald" />
        </motion.div>

        {/* Taula amb efecte Glassmorphism i AnimatePresence */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] min-h-[500px]"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cerca registres..." 
                className="bg-slate-950/50 border border-white/5 pl-12 pr-6 py-3 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all w-80 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest hover:scale-105 hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] transition-all">
              <Plus size={18} /> AFEGIR {tab.toUpperCase().slice(0, -1)}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
                <p className="text-slate-500 animate-pulse font-medium">Sincronitzant dades amb Laravel...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="overflow-x-auto"
              >
                <table className="w-full text-left">
                  <thead className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th className="pb-6 px-4">Identificador</th>
                      <th className="pb-6 px-4">Dades Principals</th>
                      <th className="pb-6 px-4 text-center">Estat / Rol</th>
                      <th className="pb-6 px-4 text-right">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.length > 0 ? data.map((item: any, i) => (
                      <motion.tr 
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.05 }}
                        key={item.id} 
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-6 px-4 font-mono text-sm text-slate-500">#{item.id.toString().padStart(4, '0')}</td>
                        <td className="py-6 px-4">
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{item.name || item.title || item.venue}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.email || item.artist || 'Sessió de concert'}</div>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-black tracking-widest">
                            {(item.role || 'ACTIVE').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <button className="p-2.5 rounded-xl hover:bg-slate-800 transition-colors">
                            <ArrowRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </button>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr><td colSpan={4} className="py-20 text-center text-slate-600 font-medium">No s'han trobat registres.</td></tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

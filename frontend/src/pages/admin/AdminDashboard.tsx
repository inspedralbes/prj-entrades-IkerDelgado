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
        // Laravel 11 often wraps response in "data", so we check both
        setData(res.data || res);
      } catch (err) {
        console.error("Error al carregar les dades:", err);
        setData([]);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    fetchData();
  }, [tab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200">
      <div className="max-w-7xl mx-auto">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
              ADMIN<span className="text-indigo-500">HUB</span>
            </h1>
            <p className="text-slate-500 font-medium">Panel de control · {user?.name}</p>
          </div>
          
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-2xl shadow-2xl overflow-x-auto max-w-full">
            {(['users', 'events', 'sessions'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-6 md:px-8 py-3 rounded-xl text-xs md:text-sm font-black tracking-widest transition-all ${
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
            <button onClick={logout} className="px-4 py-3 text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatCard label="Usuaris Actius" value={data.length && tab === 'users' ? data.length : "148"} color="indigo" />
          <StatCard label="Vendes del mes" value="1.2k" color="purple" />
          <StatCard label="Ingressos" value="€12,450" color="emerald" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl min-h-[400px]"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder={`Cerca ${tab}...`} 
                className="w-full bg-slate-950/50 border border-white/5 pl-12 pr-6 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-xs tracking-widest hover:scale-105 transition-all">
              <Plus size={18} /> NOU {tab.toUpperCase().slice(0, -1)}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-48">
                <Loader2 className="animate-spin text-indigo-500 w-10 h-10 mb-4" />
                <p className="text-slate-500 text-sm">Carregant dades...</p>
              </motion.div>
            ) : (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th className="pb-6 px-4">Info</th>
                      <th className="pb-6 px-4">Detall</th>
                      <th className="pb-6 px-4 text-center">Rol/Estat</th>
                      <th className="pb-6 px-4 text-right">Acció</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.map((item: any, i) => (
                      <motion.tr 
                        key={item.id} 
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-white/[0.02]"
                      >
                        <td className="py-6 px-4">
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {item.name || item.title || item.venue}
                          </div>
                          <div className="text-xs text-slate-500">{item.email || item.artist || "Sessió activa"}</div>
                        </td>
                        <td className="py-6 px-4 text-sm text-slate-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : (item.date_time ? new Date(item.date_time).toLocaleString() : "---")}
                        </td>
                        <td className="py-6 px-4 text-center">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {item.role || item.status || "ADMIN"}
                          </span>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <ArrowRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {data.length === 0 && (
                      <tr><td colSpan={4} className="py-20 text-center text-slate-600">No hi ha dades disponibles en aquesta secció.</td></tr>
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

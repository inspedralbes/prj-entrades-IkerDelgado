import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Clock, LogOut, Plus, Loader2, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ContentCard, RoleBadge } from '../../components/ui/DashboardUI';

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
        setData([]);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchData();
  }, [tab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      {/* Background Dot Pattern (Minimalista) */}
      <div className="absolute inset-0 z-0 opacity-10 [background-image:radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Sòbri */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">ADMIN PANEL</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Gestió de {tab}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-slate-900 border border-white/5 p-1 rounded-xl">
              {(['users', 'events', 'sessions'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <button 
              onClick={logout}
              className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
              title="Tancar sessió"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Taula de Contingut Neta */}
        <ContentCard>
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 border-b border-white/5">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder={`Cerca per nom...`} 
                className="w-full bg-slate-950 border border-white/5 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm transition-all text-slate-300"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-lg font-black text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              <Plus size={16} /> AFEGIR {tab.toUpperCase().slice(0, -1)}
            </button>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-indigo-500 w-10 h-10 mb-2" />
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Carregant...</p>
                </motion.div>
              ) : (
                <motion.table key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left">
                  <thead className="bg-slate-900/30 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th className="py-4 px-6">Nom / Títol</th>
                      <th className="py-4 px-6">Dades Secundàries</th>
                      <th className="py-4 px-6 text-center">Rol / Estat</th>
                      <th className="py-4 px-6 text-right">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.map((item: any) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-6 px-6 font-bold text-slate-200">
                          {item.name || item.title || item.venue}
                        </td>
                        <td className="py-6 px-6 text-sm text-slate-500">
                          {item.email || item.artist || item.date_time}
                        </td>
                        <td className="py-6 px-6 text-center">
                          <RoleBadge role={item.role || item.status || "client"} />
                        </td>
                        <td className="py-6 px-6 text-right">
                          <button className="p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                            <ArrowRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr><td colSpan={4} className="py-32 text-center text-slate-600 text-sm italic">No hi ha dades disponibles en aquesta secció.</td></tr>
                    )}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </ContentCard>

        {/* Info adicional (Molt subtil) */}
        <div className="mt-8 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          <p>Total de registres: {data.length}</p>
          <p>Sessió iniciada com a {user?.role}</p>
        </div>
      </div>
    </div>
  );
};

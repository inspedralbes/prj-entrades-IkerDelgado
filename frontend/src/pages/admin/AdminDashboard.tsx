import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Clock, LogOut, Plus, Loader2, 
  Search, Trash2, Edit3, X, Save, AlertCircle,
  MapPin, Music, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ContentCard, RoleBadge } from '../../components/ui/DashboardUI';

type TabType = 'users' | 'events' | 'sessions';

export const AdminDashboard = () => {
  const [tab, setTab] = useState<TabType>('users');
  const [data, setData] = useState<any[]>([]);
  const [eventsForSessions, setEventsForSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { logout, user } = useAuth();

  // Estats per als Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'users' ? '/users' : (tab === 'events' ? '/events' : '/sessions');
      const res = await api.get(endpoint);
      // Els esdeveniments i sessions solen venir dins de .data.data degut als Resources de Laravel
      setData(res.data.data || res.data);
      
      // Si estem a sessions, també necessitem els events per al select
      if (tab === 'sessions') {
        const eventsRes = await api.get('/events');
        setEventsForSessions(eventsRes.data.data || eventsRes.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setData([]);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Estàs segur que vols eliminar aquest registre?')) return;
    
    try {
      const endpoint = tab === 'users' ? `/users/${id}` : (tab === 'events' ? `/events/${id}` : `/sessions/${id}`);
      await api.delete(endpoint);
      setData(data.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      // Valors per defecte segons la pestanya
      if (tab === 'events') {
        setFormData({ title: '', artist: '', description: '', image: '' });
      } else if (tab === 'sessions') {
        setFormData({ event_id: '', date_time: '', venue: '' });
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const endpoint = tab === 'events' ? '/events' : '/sessions';
      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      await fetchData();
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData = data.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      (item.name?.toLowerCase().includes(searchLower)) ||
      (item.title?.toLowerCase().includes(searchLower)) ||
      (item.artist?.toLowerCase().includes(searchLower)) ||
      (item.venue?.toLowerCase().includes(searchLower)) ||
      (item.email?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="absolute inset-0 z-0 opacity-10 [background-image:radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">ADMIN PANEL</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Gestió de {tab}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-900 border border-white/5 p-1 rounded-xl">
              {(['users', 'events', 'sessions'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 md:px-6 py-2 rounded-lg text-xs font-bold transition-all ${
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
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <ContentCard>
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 border-b border-white/5">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder={`Cerca ${tab}...`} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm transition-all text-slate-300"
              />
            </div>
            
            {tab !== 'users' && (
              <button 
                onClick={() => openModal()}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-black text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Plus size={16} /> NOU {tab.toUpperCase().slice(0, -1)}
              </button>
            )}
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
                      <th className="py-4 px-6">{tab === 'sessions' ? 'Lloc' : 'Nom / Títol'}</th>
                      <th className="py-4 px-6">Dades Secundàries</th>
                      <th className="py-4 px-6 text-center">Estat / Detall</th>
                      <th className="py-4 px-6 text-right">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6 font-bold text-slate-200">
                          {tab === 'sessions' ? (
                            <div className="flex flex-col">
                              <span>{item.venue}</span>
                              <span className="text-[10px] text-indigo-400 font-normal">{item.event_title || item.event?.title}</span>
                            </div>
                          ) : (item.name || item.title)}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {tab === 'users' ? item.email : 
                           tab === 'events' ? item.artist : 
                           new Date(item.date_time).toLocaleString('ca-ES')}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {tab === 'users' ? (
                            <RoleBadge role={item.role} />
                          ) : tab === 'events' ? (
                            <span className="text-xs font-medium text-slate-400">{item.sessions_count || 0} sessions</span>
                          ) : (
                            <span className="text-xs font-medium text-indigo-400/80">ID: {item.id}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {tab !== 'users' && (
                              <button 
                                onClick={() => openModal(item)}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                              >
                                <Edit3 size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan={4} className="py-32 text-center text-slate-600 text-sm italic">No s'ha trobat cap registre.</td></tr>
                    )}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </ContentCard>
      </div>

      {/* MODAL (Create/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  {editingItem ? 'Editar' : 'Crear'} {tab.slice(0, -1)}
                </h2>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {tab === 'events' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Music size={12} /> Títol de l'event
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                        placeholder="Ex: Primavera Sound 2026"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={12} /> Artista / Grup
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.artist || ''}
                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                        placeholder="Ex: Arctic Monkeys"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <ImageIcon size={12} /> URL de la imatge
                      </label>
                      <input 
                        type="text" 
                        value={formData.image || ''}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertCircle size={12} /> Descripció
                      </label>
                      <textarea 
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                        placeholder="Explica de què tracta l'esdeveniment..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Music size={12} /> Selecciona Event
                      </label>
                      <select 
                        required
                        value={formData.event_id || ''}
                        onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all appearance-none"
                      >
                        <option value="">-- Selecciona un event --</option>
                        {eventsForSessions.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title} ({ev.artist})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} /> Data i Hora
                      </label>
                      <input 
                        required
                        type="datetime-local" 
                        value={formData.date_time ? formData.date_time.slice(0, 16) : ''}
                        onChange={(e) => setFormData({...formData, date_time: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin size={12} /> Lloc (Venue)
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.venue || ''}
                        onChange={(e) => setFormData({...formData, venue: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                        placeholder="Ex: Palau Sant Jordi"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all"
                  >
                    Cancel·lar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {editingItem ? 'Guardar Canvis' : 'Crear Registre'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

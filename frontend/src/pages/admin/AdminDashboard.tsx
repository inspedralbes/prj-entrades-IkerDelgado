"use client";

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, LogOut, Plus, Loader2, 
  Search, Trash2, Edit3, X, Save, AlertCircle,
  MapPin, Music, Image as ImageIcon, ArrowRight,
  Menu, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ContentCard, RoleBadge } from '../../components/ui/DashboardUI';

const MenuVertical = ({
  menuItems,
  activeTab,
  color = "#6366f1",
  skew = 0,
}: {
  menuItems: { id: string; label: string; onClick: () => void }[];
  activeTab: string;
  color?: string;
  skew?: number;
}) => {
  return (
    <div className="flex flex-col gap-8">
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <motion.div
            key={item.id}
            className={`group/nav flex items-center gap-3 cursor-pointer transition-colors ${
              isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            initial="initial"
            whileHover="hover"
            onClick={item.onClick}
          >
            <motion.div
              variants={{
                initial: { x: -10, opacity: 0 },
                hover: { x: 0, opacity: 1 },
                active: { x: 0, opacity: 1 }
              }}
              animate={isActive ? "active" : "initial"}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ArrowRight strokeWidth={3} size={24} style={{ color: isActive ? color : 'inherit' }} />
            </motion.div>

            <motion.span
              variants={{
                initial: { x: -20 },
                hover: { x: 0, skewX: skew },
                active: { x: 0 }
              }}
              animate={isActive ? "active" : "initial"}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-black text-3xl tracking-tighter uppercase"
              style={{ color: isActive ? color : 'inherit' }}
            >
              {item.label}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
};

type TabType = 'users' | 'events' | 'sessions';

export const AdminDashboard = () => {
  const [tab, setTab] = useState<TabType>('users');
  const [data, setData] = useState<any[]>([]);
  const [eventsForSessions, setEventsForSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setData(res.data.data || res.data);
      
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
    setIsMobileMenuOpen(false);
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

  const menuItems = [
    { id: 'users', label: 'Usuaris', onClick: () => setTab('users') },
    { id: 'events', label: 'Esdeveniments', onClick: () => setTab('events') },
    { id: 'sessions', label: 'Sessions', onClick: () => setTab('sessions') },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 z-0 opacity-10 [background-image:radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-80 bg-slate-950 border-r border-white/5 h-screen sticky top-0 z-20 p-10 shrink-0">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">ADMIN PANEL</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] pl-1">Ticketing System v1.0</p>
        </div>

        <nav className="flex-1">
           <MenuVertical menuItems={menuItems} activeTab={tab} color="#6366f1" />
        </nav>

        <div className="mt-auto">
          <button 
            onClick={logout}
            className="group flex items-center gap-4 text-slate-500 hover:text-red-400 transition-all font-bold uppercase text-[10px] tracking-[0.2em]"
          >
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl group-hover:bg-red-500/10 group-hover:border-red-500/20 transition-all">
              <LogOut size={18} />
            </div>
            <span>Tancar Sessió</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 z-30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white" size={16} />
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter uppercase">Admin</h1>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-900 border border-white/5 text-slate-400 rounded-lg"
            >
              <Menu size={20} />
            </button>
           <button 
              onClick={logout}
              className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg"
            >
              <LogOut size={20} />
            </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-20 bg-slate-950 p-6 pt-24 flex flex-col gap-8"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`text-left text-4xl font-black uppercase tracking-tighter ${
                  tab === item.id ? 'text-indigo-500' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto h-screen relative z-10 pt-20 lg:pt-0">
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase">
                {tab}
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-1 bg-indigo-500 rounded-full" />
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black">Control Panel / {tab}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4 bg-slate-900/50 p-2 border border-white/5 rounded-2xl backdrop-blur-sm">
              <div className="px-4 py-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Registres Totals</p>
                <p className="text-xl font-black text-white">{filteredData.length}</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="px-4 py-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Estat</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-sm font-bold text-emerald-500 uppercase">En línia</p>
                </div>
              </div>
            </div>
          </header>

        <ContentCard>
          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/50 border-b border-white/5">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder={`Cerca en ${tab}...`} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500/50 text-sm transition-all text-slate-300 placeholder:text-slate-700"
              />
            </div>
            
            {tab !== 'users' && (
              <button 
                onClick={() => openModal()}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <Plus size={18} /> NOU {tab.toUpperCase().slice(0, -1)}
              </button>
            )}
          </div>

          <div className="overflow-x-auto min-h-[500px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Sincronitzant dades...</p>
                </motion.div>
              ) : (
                <motion.table key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left border-collapse">
                  <thead className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <tr>
                      <th className="py-6 px-8">{tab === 'sessions' ? 'Lloc' : 'Nom / Títol'}</th>
                      <th className="py-6 px-8">Dades Secundàries</th>
                      <th className="py-6 px-8 text-center">Estat / Detall</th>
                      <th className="py-6 px-8 text-right">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                        <td className="py-6 px-8 font-bold text-slate-200">
                          {tab === 'sessions' ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-base">{item.venue}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{item.event_title || item.event?.title}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-base">{item.name || item.title}</span>
                          )}
                        </td>
                        <td className="py-6 px-8 text-slate-400 font-medium">
                          {tab === 'users' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-slate-800" />
                              {item.email}
                            </div>
                          ) : 
                           tab === 'events' ? (
                            <div className="flex items-center gap-2 text-indigo-400/80">
                              <Music size={14} />
                              {item.artist}
                            </div>
                           ) : (
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(item.date_time).toLocaleString('ca-ES', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          )}
                        </td>
                        <td className="py-6 px-8 text-center">
                          {tab === 'users' ? (
                            <RoleBadge role={item.role} />
                          ) : tab === 'events' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-white/5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.sessions_count || 0} SESSIONS</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest">REF: #{item.id}</span>
                          )}
                        </td>
                        <td className="py-6 px-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            {tab !== 'users' && (
                              <button 
                                onClick={() => openModal(item)}
                                className="p-2.5 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all shadow-lg hover:shadow-indigo-600/20"
                              >
                                <Edit3 size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2.5 text-slate-400 hover:text-white hover:bg-red-600 rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan={4} className="py-40 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                            <Search className="text-slate-700" size={32} />
                          </div>
                          <p className="text-slate-600 text-sm font-bold uppercase tracking-widest italic">No s'ha trobat cap registre en {tab}</p>
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>
        </ContentCard>
        </div>
      </main>

      {/* MODAL (Create/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                    {editingItem ? 'Editar' : 'Crear'} {tab.slice(0, -1)}
                  </h2>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Introducció de dades al sistema</p>
                </div>
                <button onClick={closeModal} className="p-2 bg-slate-950 border border-white/5 text-slate-500 hover:text-white rounded-xl transition-all hover:rotate-90">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
                {tab === 'events' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Music size={14} className="text-indigo-500" /> Títol de l'event
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800"
                        placeholder="Ex: Primavera Sound 2026"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Users size={14} className="text-indigo-500" /> Artista / Grup
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.artist || ''}
                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800"
                        placeholder="Ex: Arctic Monkeys"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ImageIcon size={14} className="text-indigo-500" /> URL de la imatge
                      </label>
                      <input 
                        type="text" 
                        value={formData.image || ''}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle size={14} className="text-indigo-500" /> Descripció detallada
                      </label>
                      <textarea 
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all h-32 resize-none placeholder:text-slate-800"
                        placeholder="Explica de què tracta l'esdeveniment..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <LayoutDashboard size={14} className="text-indigo-500" /> Selecciona l'esdeveniment
                      </label>
                      <select 
                        required
                        value={formData.event_id || ''}
                        onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all appearance-none text-slate-300"
                      >
                        <option value="">-- Selecciona un event --</option>
                        {eventsForSessions.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title} ({ev.artist})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-500" /> Data i Hora
                        </label>
                        <input 
                          required
                          type="datetime-local" 
                          value={formData.date_time ? formData.date_time.slice(0, 16) : ''}
                          onChange={(e) => setFormData({...formData, date_time: e.target.value})}
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all text-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <MapPin size={14} className="text-indigo-500" /> Lloc (Venue)
                        </label>
                        <input 
                          required
                          type="text" 
                          value={formData.venue || ''}
                          onChange={(e) => setFormData({...formData, venue: e.target.value})}
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800"
                          placeholder="Ex: Palau Sant Jordi"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-8 py-4 border border-white/5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                  >
                    Cancel·lar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {editingItem ? 'Actualitzar' : 'Confirmar'}
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

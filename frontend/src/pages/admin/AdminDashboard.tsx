"use client";

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, LogOut, Plus, Loader2, 
  Search, Trash2, Edit3, X, Save, AlertCircle,
  MapPin, Music, Image as ImageIcon, ArrowRight,
  Menu, LayoutDashboard, DollarSign, Ticket as TicketIcon,
  TrendingUp, PieChart, BarChart3, Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import { ContentCard, RoleBadge } from '../../components/ui/DashboardUI';
import { ca } from '../../locales/ca';

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
    <div className="flex flex-col gap-6">
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <motion.div
            key={item.id}
            className={`group/nav flex items-center gap-4 cursor-pointer transition-all ${
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
              <ArrowRight strokeWidth={3} size={20} style={{ color: isActive ? color : 'inherit' }} />
            </motion.div>

            <motion.span
              variants={{
                initial: { x: -10 },
                hover: { x: 0, skewX: skew },
                active: { x: 0 }
              }}
              animate={isActive ? "active" : "initial"}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-black text-2xl tracking-tighter uppercase italic"
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

type TabType = 'users' | 'events' | 'sessions' | 'reports';

export const AdminDashboard = () => {
  const [tab, setTab] = useState<TabType>('reports');
  const [data, setData] = useState<any[]>([]);
  const [eventsForSessions, setEventsForSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 8;
  const { logout, user } = useAuth();
  const { socket, joinDashboard, notifyCatalogUpdate } = useSocketContext();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setSortConfig(null);
  }, [tab, search]);
  
  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key && current?.direction === 'asc') return { key, direction: 'desc' };
      return { key, direction: 'asc' };
    });
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(item => Object.values(item).map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_hub_${tab}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Estats per als Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab !== 'reports') {
        const endpoint = tab === 'users' ? '/users' : (tab === 'events' ? '/events' : '/sessions');
        const res = await api.get(endpoint);
        setData(res.data.data || res.data);
        
        if (tab === 'sessions') {
          const eventsRes = await api.get('/events');
          setEventsForSessions(eventsRes.data.data || eventsRes.data);
        }
      }

      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setData([]);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchData();
    setIsMobileMenuOpen(false);
    joinDashboard();
  }, [tab]);

  useEffect(() => {
    if (!socket) return;

    socket.on('catalog-changed', (data) => {
      fetchData();
    });

    socket.on('seat-purchased', () => {
      fetchData();
    });

    return () => {
      socket.off('catalog-changed');
      socket.off('seat-purchased');
    };
  }, [socket, tab]);

  const handleDelete = async (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const endpoint = tab === 'users' ? `/users/${itemToDelete}` : (tab === 'events' ? `/events/${itemToDelete}` : `/sessions/${itemToDelete}`);
      await api.delete(endpoint);
      setData(data.filter(item => item.id !== itemToDelete));
      if (tab !== 'users') {
        notifyCatalogUpdate(tab === 'events' ? 'event' : 'session', 'deleted');
      }
      showToast("Registre eliminat correctament", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || ca.common.error, "error");
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
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
        notifyCatalogUpdate(tab === 'events' ? 'event' : 'session', 'updated');
        showToast("Actualitzat correctament", "success");
      } else {
        await api.post(endpoint, formData);
        notifyCatalogUpdate(tab === 'events' ? 'event' : 'session', 'created');
        showToast("Creat correctament", "success");
      }
      
      // Tanquem el modal immediatament per millorar la UX
      closeModal();
      // Refresquem dades en segon pla
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || ca.common.error, "error");
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

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const valA = a[key] || '';
    const valB = b[key] || '';
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ChevronUp className="w-3 h-3 opacity-20 inline-block ml-2" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-indigo-400 inline-block ml-2" /> 
      : <ChevronDown className="w-3 h-3 text-indigo-400 inline-block ml-2" />;
  };

  const menuItems = [
    { id: 'reports', label: 'Informes', onClick: () => setTab('reports') },
    { id: 'users', label: ca.admin.users, onClick: () => setTab('users') },
    { id: 'events', label: ca.admin.events, onClick: () => setTab('events') },
    { id: 'sessions', label: ca.admin.sessions, onClick: () => setTab('sessions') },
  ];

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen text-slate-200 flex overflow-hidden"
    >
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-80 bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 h-screen sticky top-0 z-20 p-10 shrink-0">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black tracking-tighter text-white cursor-default group italic">
                TICKET<span className="text-indigo-500 group-hover:text-cyan-400 transition-colors">HUB</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] pl-1">{ca.admin.system_version}</p>
        </div>

        <nav className="flex-1">
           <MenuVertical menuItems={menuItems} activeTab={tab} color="#6366f1" />
        </nav>

        <div className="mt-auto">
          <button 
            onClick={logout}
            className="group flex items-center gap-4 text-slate-500 hover:text-red-400 transition-all font-black uppercase text-[10px] tracking-[0.2em]"
          >
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-all group-hover:rotate-12">
              <LogOut size={18} />
            </div>
            <span>{ca.common.logout}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 z-30 px-6 py-4 flex justify-between items-center group">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-white tracking-tighter italic">TICKET<span className="text-indigo-500 group-hover:text-cyan-400 transition-colors">HUB</span></h1>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 bg-slate-900 border border-white/5 text-slate-400 rounded-xl"
            >
              <Menu size={20} />
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
            className="lg:hidden fixed inset-0 z-20 bg-slate-950 p-6 pt-24 flex flex-col gap-6"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`text-left text-3xl font-black uppercase italic tracking-tighter ${
                  tab === item.id ? 'text-indigo-500' : 'text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
                onClick={logout}
                className="mt-auto flex items-center gap-4 text-red-500 font-black uppercase text-xs tracking-widest p-6 bg-red-500/10 rounded-3xl"
            >
                <LogOut size={20} /> {ca.common.logout}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto h-screen relative z-10 pt-24 lg:pt-0">
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto w-full">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 md:min-h-[96px]">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-1 bg-indigo-500 rounded-full animate-shimmer" />
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.5em] font-black">Control Panel / {tab}</p>
              </div>
            </motion.div>
            
            {tab !== 'reports' && (
              <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="hidden md:flex items-center gap-6 bg-slate-900/40 p-3 border border-white/5 rounded-[2rem] backdrop-blur-sm"
              >
                <div className="px-6 py-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{ca.admin.total_records}</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">{filteredData.length}</p>
                </div>
              </motion.div>
            )}
          </header>

        {tab === 'reports' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

            {/* Recaptació Total */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-4 hover:border-emerald-500/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-emerald-500/20 transition-colors">
                  <DollarSign size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 bg-emerald-500/10 px-3 py-1 rounded-full">Ingressos</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Recaptació Total</p>
                <p className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none">
                  {stats ? Number(stats.total_revenue).toFixed(0) : '0'}
                  <span className="text-xl ml-1 not-italic text-emerald-500">€</span>
                </p>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-auto">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </motion.div>

            {/* Entrades Venudes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-4 hover:border-indigo-500/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-indigo-500/20 transition-colors">
                  <TicketIcon size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500/60 bg-indigo-500/10 px-3 py-1 rounded-full">Vendes</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Entrades Venudes</p>
                <p className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none">
                  {stats ? stats.tickets_sold : '0'}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <TrendingUp className="text-indigo-400" size={16} />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">En augment constant</p>
              </div>
            </motion.div>

            {/* Ocupació */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-4 hover:border-orange-500/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-orange-500/20 transition-colors">
                  <PieChart size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-orange-500/60 bg-orange-500/10 px-3 py-1 rounded-full">Ocupació</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Ocupació Mitjana</p>
                <p className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter leading-none">
                  {stats ? stats.occupancy_rate : '0'}
                  <span className="text-xl ml-1 not-italic text-orange-500">%</span>
                </p>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-px mt-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.occupancy_rate || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </motion.div>

            {/* Catàleg */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.24 }}
              className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-4 hover:border-cyan-500/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-cyan-500/20 transition-colors">
                  <BarChart3 size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-500/60 bg-cyan-500/10 px-3 py-1 rounded-full">Catàleg</span>
              </div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resum de Catàleg</p>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Events</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">{stats?.total_events || 0}</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Sessions</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">{stats?.total_sessions || 0}</p>
                </div>
              </div>
            </motion.div>

          </div>
        ) : (
          <ContentCard className="rounded-[3rem] overflow-hidden border border-white/[0.04] bg-slate-900/20 backdrop-blur-md">
            <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-900/40 border-b border-white/5">
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                <input 
                  type="text" 
                  placeholder={ca.common.search} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 text-sm transition-all text-slate-300 placeholder:text-slate-700 font-medium"
                />
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={exportToCSV}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-slate-300 rounded-[1.2rem] font-black text-xs tracking-[0.2em] hover:bg-slate-700 transition-all border border-white/5 active:scale-95 group"
                >
                  <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> 
                  EXPORT
                </button>
              {tab !== 'users' && (
                <button 
                  onClick={() => openModal()}
                  className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-4 bg-indigo-600 text-white rounded-[1.2rem] font-black text-xs tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
                  {tab === 'events' ? ca.admin.new_event : ca.admin.new_session}
                </button>
              )}
              </div>
            </div>

            <div className="overflow-x-auto min-h-[500px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="animate-spin text-indigo-500 w-16 h-16 mb-6 opacity-50" />
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">{ca.admin.syncing}</p>
                  </motion.div>
                ) : (
                  <motion.table key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left border-collapse">
                    <thead className="bg-slate-950/30 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                      <tr>
                        <th className="py-8 px-10 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort(tab === 'sessions' ? 'venue' : (tab === 'events' ? 'title' : 'name'))}>
                          {tab === 'sessions' ? ca.admin.venue : 'Nom / Títol'}
                          <SortIcon columnKey={tab === 'sessions' ? 'venue' : (tab === 'events' ? 'title' : 'name')} />
                        </th>
                        <th className="py-8 px-10 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort(tab === 'sessions' ? 'date_time' : 'email')}>
                          Dades Secundàries
                          <SortIcon columnKey={tab === 'sessions' ? 'date_time' : 'email'} />
                        </th>
                        <th className="py-8 px-10 text-center">Estat / Detall</th>
                        <th className="py-8 px-10 text-right">{ca.common.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {paginatedData.map((item: any, idx: number) => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-8 px-10 font-bold text-slate-100">
                            {tab === 'sessions' ? (
                              <div className="flex flex-col gap-2">
                                <span className="text-lg italic tracking-tight">{item.venue}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{item.event_title || item.event?.title}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-lg italic tracking-tight">{item.name || item.title}</span>
                            )}
                          </td>
                          <td className="py-8 px-10 text-slate-400 font-medium">
                            {tab === 'users' ? (
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-slate-800" />
                                <span className="font-mono text-xs">{item.email}</span>
                              </div>
                            ) : 
                             tab === 'events' ? (
                              <div className="flex items-center gap-3 text-indigo-400/80">
                                <Music size={16} />
                                <span className="font-black uppercase tracking-widest text-[10px]">{item.artist}</span>
                              </div>
                             ) : (
                              <div className="flex items-center gap-3 text-slate-500">
                                <Calendar size={16} className="text-indigo-500/50" />
                                <span className="font-bold">
                                  {new Date(item.date_time).toLocaleString('ca-ES', { 
                                      day: '2-digit', 
                                      month: '2-digit', 
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-8 px-10 text-center">
                            {tab === 'users' ? (
                              <RoleBadge role={item.role} />
                            ) : tab === 'events' ? (
                              <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-950/50 border border-white/5 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.sessions_count || 0} SESSIONS</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-indigo-400/40 uppercase tracking-[0.3em] font-mono">REF: #{item.id}</span>
                            )}
                          </td>
                          <td className="py-8 px-10 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              {tab !== 'users' && (
                                <button 
                                  onClick={() => openModal(item)}
                                  className="p-3 text-slate-500 hover:text-white hover:bg-indigo-600 rounded-xl transition-all shadow-xl hover:shadow-indigo-600/30"
                                >
                                  <Edit3 size={18} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-3 text-slate-500 hover:text-white hover:bg-red-600 rounded-xl transition-all shadow-xl hover:shadow-red-600/30"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      {paginatedData.length === 0 && (
                        <tr><td colSpan={4} className="py-48 text-center">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-slate-900/50 rounded-[2rem] flex items-center justify-center border border-white/5">
                              <Search className="text-slate-800" size={40} />
                            </div>
                            <p className="text-slate-600 text-lg font-black uppercase tracking-tighter italic">{ca.common.no_results}</p>
                          </motion.div>
                        </td></tr>
                      )}
                    </tbody>
                  </motion.table>
                )}
              </AnimatePresence>
            </div>
            {totalPages > 1 && (
              <div className="p-6 border-t border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-4">
                  Pàgina {currentPage} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 bg-slate-950 border border-white/5 text-white rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 bg-slate-950 border border-white/5 text-white rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </ContentCard>
        )}
        </div>
      </main>

      {/* MODAL DE CONFIRMACIÓ D'ELIMINACIÓ */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-red-500/20 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Trash2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Confirmar Eliminació</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                Estàs segur que vols eliminar aquest registre? Aquesta acció és permanent i no es pot desfer.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-5 bg-slate-800 text-slate-300 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-700 transition-all active:scale-95"
                >
                  CANCEL·LAR
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-5 bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 transition-all shadow-2xl shadow-red-600/30 active:scale-95"
                >
                  ELIMINAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL (Create/Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
                <div>
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    {editingItem ? ca.common.edit : ca.common.create} {tab.slice(0, -1)}
                  </h2>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-2">Dades del sistema d'entrades</p>
                </div>
                <button onClick={closeModal} className="p-3 bg-slate-950 border border-white/5 text-slate-500 hover:text-white rounded-2xl transition-all hover:rotate-90">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                {tab === 'events' ? (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <Music size={14} className="text-indigo-500" /> {ca.admin.event_title}
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.title || ''}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                        placeholder="Ex: Primavera Sound 2026"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <Users size={14} className="text-indigo-500" /> {ca.admin.artist}
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.artist || ''}
                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                        placeholder="Ex: Arctic Monkeys"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <ImageIcon size={14} className="text-indigo-500" /> {ca.admin.image_url}
                      </label>
                      <input 
                        type="text" 
                        value={formData.image || ''}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-medium font-mono text-xs"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <AlertCircle size={14} className="text-indigo-500" /> {ca.admin.description}
                      </label>
                      <textarea 
                        value={formData.description || ''}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all h-32 resize-none placeholder:text-slate-800 font-medium"
                        placeholder="Explica de què tracta l'esdeveniment..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                        <LayoutDashboard size={14} className="text-indigo-500" /> Selecciona l'esdeveniment
                      </label>
                      <select 
                        required
                        value={formData.event_id || ''}
                        onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all appearance-none text-slate-300 font-bold uppercase tracking-widest"
                      >
                        <option value="">-- {ca.admin.events} --</option>
                        {eventsForSessions.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title} ({ev.artist})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                          <Calendar size={14} className="text-indigo-500" /> {ca.admin.date_time}
                        </label>
                        <input 
                          required
                          type="datetime-local" 
                          value={formData.date_time ? formData.date_time.slice(0, 16) : ''}
                          onChange={(e) => setFormData({...formData, date_time: e.target.value})}
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all text-slate-300 font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                          <MapPin size={14} className="text-indigo-500" /> {ca.admin.venue}
                        </label>
                        <input 
                          required
                          type="text" 
                          value={formData.venue || ''}
                          onChange={(e) => setFormData({...formData, venue: e.target.value})}
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                          placeholder="Ex: Palau Sant Jordi"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-10 flex gap-6">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-8 py-5 border border-white/5 text-slate-500 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                  >
                    {ca.common.cancel}
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-8 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingItem ? ca.admin.update : ca.common.confirm}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

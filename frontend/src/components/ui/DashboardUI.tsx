import { motion } from 'framer-motion';

export const ContentCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/50 border border-white/5 rounded-xl shadow-xl overflow-hidden"
  >
    {children}
  </motion.div>
);

export const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === 'admin';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
      isAdmin ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-800 text-slate-400 border-white/5'
    }`}>
      {role}
    </span>
  );
};

import { motion } from 'framer-motion';

export const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      viewport={{ once: true }}
      className="relative p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl overflow-hidden group transition-all"
    >
      {/* Background Glow que reacciona */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 blur-[80px] opacity-10 bg-${color}-500 group-hover:opacity-30 transition-opacity duration-500`} />
      
      <motion.p 
        initial={{ x: -10 }} 
        animate={{ x: 0 }} 
        className="text-slate-500 text-sm font-semibold tracking-wider uppercase mb-3"
      >
        {label}
      </motion.p>
      
      <motion.h3 
        initial={{ y: 10, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.1 }}
        className="text-4xl font-black text-white tracking-tight"
      >
        {value}
      </motion.h3>
      
      {/* Detall decoratiu inferior */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${color}-500 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`} />
    </motion.div>
  );
};

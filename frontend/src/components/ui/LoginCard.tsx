import { motion } from 'framer-motion';

export const LoginCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative p-[2px] rounded-3xl bg-slate-800/50 overflow-hidden group"
    >
      {/* Animació de vora giratòria (Efecte Neó) */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0,transparent_25%,#6366f1_50%,transparent_75%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="relative bg-slate-950/90 backdrop-blur-3xl p-10 rounded-[22px] border border-white/5 z-10">
        {/* Llum interior suau */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full" />
        {children}
      </div>
    </motion.div>
  );
};

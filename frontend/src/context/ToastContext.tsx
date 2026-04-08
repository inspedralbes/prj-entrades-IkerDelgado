import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full sm:w-96">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
              layout
              className={`
                pointer-events-auto flex items-center gap-4 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl
                ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                ${toast.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : ''}
                ${toast.type === 'info' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : ''}
              `}
            >
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                {toast.type === 'error' && <XCircle className="w-6 h-6" />}
                {toast.type === 'warning' && <AlertCircle className="w-6 h-6" />}
                {toast.type === 'info' && <Info className="w-6 h-6" />}
              </div>
              
              <p className="flex-1 font-black text-xs uppercase tracking-widest leading-relaxed">
                {toast.message}
              </p>
              
              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

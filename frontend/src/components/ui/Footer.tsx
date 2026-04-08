import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Shield, FileText, Settings, Heart } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-white/[0.04] bg-slate-950/40 backdrop-blur-3xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            <div className="max-w-[1400px] mx-auto px-10 py-20 lg:py-24">
                {/* Top section */}
                <div className="flex flex-col lg:flex-row justify-between gap-20 mb-20">
                    {/* Brand */}
                    <div className="max-w-md">
                        <motion.span 
                            className="text-3xl font-black tracking-tighter text-white cursor-default inline-block italic group"
                        >
                            TICKET<span className="text-indigo-500 group-hover:text-cyan-400 transition-colors">HUB</span>
                        </motion.span>
                        <p className="text-slate-500 text-lg mt-6 leading-relaxed font-medium">
                            La teva plataforma de confiança per descobrir i reservar entrades per als millors esdeveniments. Viu la música com mai.
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-pointer">
                                <Mail size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-pointer">
                                <Shield size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-20 lg:gap-32">
                        <div>
                            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 italic">Legalitat</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/privacy" className="group flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-all uppercase tracking-widest">
                                        <FileText size={14} className="text-slate-700 group-hover:text-indigo-500 transition-colors" />
                                        Política de Privacitat
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="group flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-all uppercase tracking-widest">
                                        <Shield size={14} className="text-slate-700 group-hover:text-indigo-500 transition-colors" />
                                        Termes de Servei
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('tickethub_cookie_consent');
                                            window.location.reload();
                                        }}
                                        className="group flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-all uppercase tracking-widest"
                                    >
                                        <Settings size={14} className="text-slate-700 group-hover:text-indigo-500 transition-colors animate-spin-slow" />
                                        Configuració Cookies
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 italic">Suport</h4>
                            <ul className="space-y-4">
                                <li>
                                    <a href="mailto:info@tickethub.cat" className="group flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-all uppercase tracking-widest">
                                        <Mail size={14} className="text-slate-700 group-hover:text-indigo-500 transition-colors" />
                                        info@tickethub.cat
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-10 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        © {currentYear} TicketHub. <span className="text-slate-800 ml-2">Fet amb</span> <Heart size={10} className="inline text-red-500/40 mx-1" /> <span className="text-slate-800">a Barcelona.</span>
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className="text-slate-600 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                            Privacitat
                        </Link>
                        <Link to="/terms" className="text-slate-600 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                            Termes
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('tickethub_cookie_consent');
                                window.location.reload();
                            }}
                            className="text-slate-600 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                            Cookies
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

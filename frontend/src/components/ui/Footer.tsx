import { Link } from 'react-router-dom';
import { Mail, Shield, FileText, Settings, Heart } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-white/[0.04] bg-slate-950/40 backdrop-blur-3xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12 sm:py-16 lg:py-20">
                {/* Top section */}
                <div className="flex flex-col lg:flex-row justify-between gap-10 sm:gap-14 mb-10 sm:mb-14">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white cursor-default inline-block italic">
                            TICKET<span className="text-indigo-500">HUB</span>
                        </span>
                        <p className="text-slate-500 text-sm sm:text-base mt-4 leading-relaxed font-medium">
                            La teva plataforma de confiança per descobrir i reservar entrades per als millors esdeveniments.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-pointer">
                                <Mail size={18} />
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-pointer">
                                <Shield size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Links — en mobile es posen en fila, en desktop en columnes */}
                    <div className="grid grid-cols-2 gap-8 sm:gap-16 lg:gap-24">
                        <div>
                            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-5 sm:mb-7 italic">Legalitat</h4>
                            <ul className="space-y-3 sm:space-y-4">
                                <li>
                                    <Link to="/privacy" className="group flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-white text-xs sm:text-sm font-bold transition-all uppercase tracking-widest">
                                        <FileText size={13} className="text-slate-700 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                        <span>Privacitat</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="group flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-white text-xs sm:text-sm font-bold transition-all uppercase tracking-widest">
                                        <Shield size={13} className="text-slate-700 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                        <span>Termes</span>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('tickethub_cookie_consent');
                                            window.location.reload();
                                        }}
                                        className="group flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-white text-xs sm:text-sm font-bold transition-all uppercase tracking-widest"
                                    >
                                        <Settings size={13} className="text-slate-700 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                        <span>Cookies</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-5 sm:mb-7 italic">Suport</h4>
                            <ul className="space-y-3 sm:space-y-4">
                                <li>
                                    <a href="mailto:info@tickethub.cat" className="group flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-white text-xs sm:text-sm font-bold transition-all uppercase tracking-widest">
                                        <Mail size={13} className="text-slate-700 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                        <span className="truncate">info@tickethub.cat</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] text-center sm:text-left">
                        © {currentYear} TicketHub · Fet amb <Heart size={9} className="inline text-red-500/40 mx-1" /> a Barcelona
                    </p>
                    <div className="flex items-center gap-5 sm:gap-8">
                        <Link to="/privacy" className="text-slate-700 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                            Privacitat
                        </Link>
                        <Link to="/terms" className="text-slate-700 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                            Termes
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('tickethub_cookie_consent');
                                window.location.reload();
                            }}
                            className="text-slate-700 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                            Cookies
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

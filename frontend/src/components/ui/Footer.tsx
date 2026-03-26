import { Link } from 'react-router-dom';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                {/* Top section */}
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <span className="text-lg font-black tracking-tighter text-white">
                            TICKET<span className="text-indigo-400">HUB</span>
                        </span>
                        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                            La teva plataforma de confiança per descobrir i reservar entrades per als millors esdeveniments.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16">
                        <div>
                            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Legal</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">
                                        Política de Privacitat
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
                                        Termes de Servei
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('tickethub_cookie_consent');
                                            window.location.reload();
                                        }}
                                        className="text-slate-500 hover:text-white text-sm transition-colors"
                                    >
                                        Configuració de Cookies
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">Contacte</h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <a href="mailto:info@tickethub.cat" className="text-slate-500 hover:text-white text-sm transition-colors">
                                        info@tickethub.cat
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-slate-600 text-xs">
                        © {currentYear} TicketHub. Tots els drets reservats.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                            Privacitat
                        </Link>
                        <span className="text-slate-800">·</span>
                        <Link to="/terms" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                            Termes
                        </Link>
                        <span className="text-slate-800">·</span>
                        <button
                            onClick={() => {
                                localStorage.removeItem('tickethub_cookie_consent');
                                window.location.reload();
                            }}
                            className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
                        >
                            Cookies
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

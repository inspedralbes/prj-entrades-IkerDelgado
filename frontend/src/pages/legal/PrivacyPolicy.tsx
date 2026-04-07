import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen text-slate-200"
        >
            <div className="max-w-3xl mx-auto px-6 py-16">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-slate-500 hover:text-white text-sm mb-10 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Tornar
                </button>

                <h1 className="text-4xl font-black text-white mb-2">Política de Privacitat</h1>
                <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest font-bold italic">Última actualització: Març 2026</p>

                <div className="space-y-8 text-slate-400 text-sm leading-relaxed font-medium">
                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">1. Responsable del tractament</h2>
                        <p>TicketHub és responsable del tractament de les dades personals recollides a través d'aquesta plataforma. Ens comprometem a protegir la privacitat dels nostres usuaris d'acord amb el Reglament General de Protecció de Dades (RGPD) i la legislació vigent.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">2. Dades que recopilem</h2>
                        <ul className="list-disc list-inside space-y-1.5 ml-2 border-l-2 border-indigo-500/20 pl-4">
                            <li>Nom i cognoms</li>
                            <li>Adreça de correu electrònic</li>
                            <li>Informació de compra d'entrades</li>
                            <li>Dades de navegació i cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">3. Finalitat del tractament</h2>
                        <p>Utilitzem les teves dades per:</p>
                        <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2 border-l-2 border-indigo-500/20 pl-4">
                            <li>Gestionar el teu compte d'usuari</li>
                            <li>Processar la compra d'entrades</li>
                            <li>Enviar confirmacions i notificacions sobre els teus esdeveniments</li>
                            <li>Millorar els nostres serveis mitjançant analítiques</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">4. Cookies</h2>
                        <p>Utilitzem els següents tipus de cookies:</p>
                        <div className="mt-6 space-y-4">
                            <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                                <span className="text-white font-bold uppercase text-xs tracking-widest">Cookies essencials</span>
                                <p className="text-slate-500 text-xs mt-2 font-medium">Necessàries per al funcionament bàsic del lloc web, com la gestió de sessions i la seguretat. No es poden desactivar.</p>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                                <span className="text-white font-bold uppercase text-xs tracking-widest">Cookies analítiques</span>
                                <p className="text-slate-500 text-xs mt-2 font-medium">Ens permeten analitzar l'ús del lloc web per millorar la seva funcionalitat i contingut. Opcionals.</p>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                                <span className="text-white font-bold uppercase text-xs tracking-widest">Cookies de màrqueting</span>
                                <p className="text-slate-500 text-xs mt-2 font-medium">S'utilitzen per personalitzar els anuncis i el contingut segons els teus interessos. Opcionals.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">5. Drets dels usuaris</h2>
                        <p>Tens dret a accedir, rectificar, suprimir i portar les teves dades, així com a oposar-te o limitar el seu tractament. Per exercir aquests drets, pots contactar-nos a <a href="mailto:info@tickethub.cat" className="text-indigo-400 hover:text-indigo-300 font-bold">info@tickethub.cat</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">6. Seguretat</h2>
                        <p>Apliquem mesures tècniques i organitzatives per protegir les teves dades contra accessos no autoritzats, pèrdua o destrucció.</p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

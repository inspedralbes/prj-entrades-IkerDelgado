import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-slate-500 hover:text-white text-sm mb-10 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Tornar
                </button>

                <h1 className="text-4xl font-black text-white mb-2">Política de Privacitat</h1>
                <p className="text-slate-500 text-sm mb-10">Última actualització: Març 2026</p>

                <div className="space-y-8 text-slate-400 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-white text-lg font-bold mb-3">1. Responsable del tractament</h2>
                        <p>TicketHub és responsable del tractament de les dades personals recollides a través d'aquesta plataforma. Ens comprometem a protegir la privacitat dels nostres usuaris d'acord amb el Reglament General de Protecció de Dades (RGPD) i la legislació vigent.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-bold mb-3">2. Dades que recopilem</h2>
                        <ul className="list-disc list-inside space-y-1.5 ml-2">
                            <li>Nom i cognoms</li>
                            <li>Adreça de correu electrònic</li>
                            <li>Informació de compra d'entrades</li>
                            <li>Dades de navegació i cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-bold mb-3">3. Finalitat del tractament</h2>
                        <p>Utilitzem les teves dades per:</p>
                        <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2">
                            <li>Gestionar el teu compte d'usuari</li>
                            <li>Processar la compra d'entrades</li>
                            <li>Enviar confirmacions i notificacions sobre els teus esdeveniments</li>
                            <li>Millorar els nostres serveis mitjançant analítiques</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-bold mb-3">4. Cookies</h2>
                        <p>Utilitzem els següents tipus de cookies:</p>
                        <div className="mt-3 space-y-3">
                            <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                <span className="text-white font-medium">Cookies essencials</span>
                                <p className="text-slate-500 text-xs mt-1">Necessàries per al funcionament bàsic del lloc web, com la gestió de sessions i la seguretat. No es poden desactivar.</p>
                            </div>
                            <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                <span className="text-white font-medium">Cookies analítiques</span>
                                <p className="text-slate-500 text-xs mt-1">Ens permeten analitzar l'ús del lloc web per millorar la seva funcionalitat i contingut. Opcionals.</p>
                            </div>
                            <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                <span className="text-white font-medium">Cookies de màrqueting</span>
                                <p className="text-slate-500 text-xs mt-1">S'utilitzen per personalitzar els anuncis i el contingut segons els teus interessos. Opcionals.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-bold mb-3">5. Drets dels usuaris</h2>
                        <p>Tens dret a accedir, rectificar, suprimir i portar les teves dades, així com a oposar-te o limitar el seu tractament. Per exercir aquests drets, pots contactar-nos a <a href="mailto:info@tickethub.cat" className="text-indigo-400 hover:text-indigo-300">info@tickethub.cat</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-bold mb-3">6. Seguretat</h2>
                        <p>Apliquem mesures tècniques i organitzatives per protegir les teves dades contra accessos no autoritzats, pèrdua o destrucció.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

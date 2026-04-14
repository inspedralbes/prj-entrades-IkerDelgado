import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsOfService = () => {
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

                <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Termes de Servei</h1>
                <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest font-bold italic">Última actualització: Març 2026</p>

                <div className="space-y-8 text-slate-400 text-sm leading-relaxed font-medium">
                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">1. Acceptació dels termes</h2>
                        <p>En accedir i utilitzar TicketHub, acceptes complir amb aquests Termes de Servei. Si no estàs d'acord amb alguna part d'aquests termes, no podràs accedir al servei.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">2. Descripció del servei</h2>
                        <p>TicketHub és una plataforma en línia que permet als usuaris descobrir esdeveniments, comprar entrades i gestionar les seves reserves. Ens reservem el dret de modificar o interrompre el servei en qualsevol moment.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">3. Comptes d'usuari</h2>
                        <ul className="list-disc list-inside space-y-1.5 ml-2 border-l-2 border-indigo-500/20 pl-4">
                            <li>Has de proporcionar informació veraç en el registre</li>
                            <li>Ets responsable de mantenir la seguretat del teu compte</li>
                            <li>Has de notificar-nos immediatament qualsevol ús no autoritzat</li>
                            <li>No pots tenir més d'un compte per persona</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">4. Compra d'entrades</h2>
                        <p>La compra d'entrades està subjecta a disponibilitat. Un cop confirmada la compra, l'entrada és nominativa i intransferible excepte en els casos previstos per la llei. Les cancel·lacions es regeixen per la política de cancel·lació de cada esdeveniment.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">5. Conducta de l'usuari</h2>
                        <p>L'usuari es compromet a:</p>
                        <ul className="list-disc list-inside space-y-1.5 ml-2 mt-2 border-l-2 border-indigo-500/20 pl-4">
                            <li>No utilitzar el servei amb finalitats il·legals</li>
                            <li>No intentar accedir a àrees restringides del sistema</li>
                            <li>No revendre entrades sense autorització</li>
                            <li>Respectar les normes de cada esdeveniment</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">6. Limitació de responsabilitat</h2>
                        <p>TicketHub actua com a intermediari entre els organitzadors d'esdeveniments i els compradors. No ens fem responsables de cancel·lacions, canvis d'horari o qualsevol incidència relacionada amb l'esdeveniment en si.</p>
                    </section>

                    <section>
                        <h2 className="text-white text-lg font-black uppercase tracking-tighter italic mb-3">7. Contacte</h2>
                        <p>Per a qualsevol consulta sobre aquests termes, pots contactar-nos a <a href="mailto:info@tickethub.cat" className="text-indigo-400 hover:text-indigo-300 font-bold">info@tickethub.cat</a>.</p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

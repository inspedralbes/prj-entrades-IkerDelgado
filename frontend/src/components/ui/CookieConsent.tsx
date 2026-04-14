import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'tickethub_cookie_consent';

export const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
        setVisible(false);
    };

    const acceptAll = () => {
        savePreferences({ essential: true, analytics: true, marketing: true });
    };

    const rejectOptional = () => {
        savePreferences({ essential: true, analytics: false, marketing: false });
    };

    const saveSelected = () => {
        savePreferences(preferences);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-[440px] z-[100] bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/40"
                >
                    <h3 className="text-white font-bold text-base mb-2">Configuració de cookies</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        Utilitzem cookies per millorar la teva experiència. Pots acceptar-les totes o configurar les teves preferències.
                    </p>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-4"
                            >
                                <div className="space-y-3 pt-1">
                                    {/* Essential */}
                                    <label className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                        <div>
                                            <span className="text-white text-sm font-medium">Essencials</span>
                                            <p className="text-slate-500 text-xs mt-0.5">Necessàries per al funcionament del lloc</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            disabled
                                            className="w-4 h-4 accent-indigo-500 rounded"
                                        />
                                    </label>

                                    {/* Analytics */}
                                    <label className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl cursor-pointer hover:border-white/[0.12] transition-colors">
                                        <div>
                                            <span className="text-white text-sm font-medium">Analítiques</span>
                                            <p className="text-slate-500 text-xs mt-0.5">Ens ajuden a entendre l'ús del lloc</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                            className="w-4 h-4 accent-indigo-500 rounded"
                                        />
                                    </label>

                                    {/* Marketing */}
                                    <label className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl cursor-pointer hover:border-white/[0.12] transition-colors">
                                        <div>
                                            <span className="text-white text-sm font-medium">Màrqueting</span>
                                            <p className="text-slate-500 text-xs mt-0.5">Personalitzen anuncis i contingut</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                            className="w-4 h-4 accent-indigo-500 rounded"
                                        />
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button
                                onClick={acceptAll}
                                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Acceptar totes
                            </button>
                            <button
                                onClick={rejectOptional}
                                className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-sm font-semibold rounded-xl transition-colors border border-white/[0.06]"
                            >
                                Només essencials
                            </button>
                        </div>
                        {showDetails ? (
                            <button
                                onClick={saveSelected}
                                className="w-full py-2.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                            >
                                Guardar preferències
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowDetails(true)}
                                className="w-full py-2.5 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                            >
                                Configurar cookies
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

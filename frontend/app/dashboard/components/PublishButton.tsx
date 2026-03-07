'use client';

import { useState, useEffect } from 'react';
import { Globe, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    { id: 'saving', label: '1. Saving Master JSON Data' },
    { id: 'committing', label: '2. Committing Changes to Git' },
    { id: 'pushing', label: '3. Pushing to GitHub Origin' },
    { id: 'deploying', label: '4. Triggering Vercel Rebuild' },
];

export default function PublishButton() {
    const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'publishing') {
            // Fake animation progression logic to sync with UI. The actual API call might just be 1 big await,
            // but we simulate the progress for UX before the final success/error.
            interval = setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev < steps.length - 1) return prev + 1;
                    return prev;
                });
            }, 1500); // Progress every 1.5s
        }
        return () => clearInterval(interval);
    }, [status]);

    const handlePublish = async () => {
        setStatus('publishing');
        setCurrentStepIndex(0);
        setMessage('');

        try {
            const res = await fetch('/api/admin/publish', {
                method: 'POST',
            });
            const data = await res.json();

            // Finish the sequence quickly if it resolves before the fake timer is done
            if (res.ok) {
                setCurrentStepIndex(steps.length - 1);
                setTimeout(() => {
                    setStatus('success');
                    setMessage(data.message || 'Published successfully!');
                    setTimeout(() => {
                        setStatus('idle');
                        setCurrentStepIndex(0);
                    }, 5000);
                }, 1000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Failed to publish.');
            }
        } catch (e: any) {
            setStatus('error');
            setMessage(e.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="mt-8 bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#c5a059]/30 rounded-xl p-6 shadow-sm font-outfit" dir="ltr">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 w-12 h-12 bg-gold-royal/10 text-gold-royal rounded-xl flex items-center justify-center shrink-0">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold font-cinzel text-gray-900 dark:text-white mb-1">The Bridge</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                            Deploy all changes made to your articles and homepage cards directly to your live Moroverse website via Vercel.
                        </p>
                    </div>
                </div>

                <div className="flex-col items-end shrink-0 w-full md:w-auto">
                    <button
                        onClick={handlePublish}
                        disabled={status === 'publishing'}
                        className={`w-full md:w-auto font-bold py-3 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all tracking-wider text-sm uppercase ${status === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
                                status === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                                    'bg-gold-royal text-white hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                    >
                        {status === 'publishing' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Deploying...</>
                        ) : status === 'success' ? (
                            <><CheckCircle className="w-4 h-4" /> Published</>
                        ) : status === 'error' ? (
                            <><AlertCircle className="w-4 h-4" /> Failed</>
                        ) : (
                            <>Publish to Live Site <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                    {message && (
                        <p className={`mt-3 text-xs font-bold text-center md:text-right ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>

            {/* Progress Bar Area */}
            <AnimatePresence>
                {status === 'publishing' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden border-t border-gray-100 dark:border-[#c5a059]/10 pt-6"
                    >
                        <div className="flex flex-col md:flex-row justify-between relative">
                            {/* Line connecting steps */}
                            <div className="hidden md:block absolute top-[11px] left-0 right-0 h-0.5 bg-gray-200 dark:bg-[#0a192f] z-0" />

                            {steps.map((step, index) => {
                                const isActive = index === currentStepIndex;
                                const isPast = index < currentStepIndex;

                                return (
                                    <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-3 md:gap-2 mb-4 md:mb-0">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm ${isActive ? 'bg-gold-royal text-white animate-pulse shadow-gold-royal/50' :
                                                isPast ? 'bg-green-500 text-white' :
                                                    'bg-gray-200 dark:bg-[#0a192f] text-gray-400 dark:text-gray-600'
                                            }`}>
                                            {isPast ? <CheckCircle className="w-3 h-3" /> : (index + 1)}
                                        </div>
                                        <span className={`text-xs font-bold ${isActive ? 'text-gold-royal' :
                                                isPast ? 'text-green-500 dark:text-green-400' :
                                                    'text-gray-400 dark:text-gray-600'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

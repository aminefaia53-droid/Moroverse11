'use client';
import { useState } from 'react';
import { Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PingTest() {
    const [pingStatus, setPingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const runPing = async () => {
        setPingStatus('loading');
        try {
            const res = await fetch('/api/admin/ping');
            const data = await res.json();
            if (data.success && data.status === 'online') {
                setPingStatus('success');
                setMessage(data.message);
            } else {
                setPingStatus('error');
                setMessage(data.message || 'Connection failed.');
            }
        } catch (e: any) {
            setPingStatus('error');
            setMessage(e.message || 'Ping failed.');
        }
    };

    return (
        <div className="mt-8 bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#c5a059]/30 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-cinzel">Al-Jisr Connectivity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">Test if the dashboard can read/write to GitHub (Vercel bypass).</p>
                    {message && (
                        <p className={`text-xs font-bold mt-1 ${pingStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
            <button onClick={runPing} disabled={pingStatus === 'loading'} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#0a192f] dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center gap-2">
                {pingStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : pingStatus === 'success' ? <CheckCircle className="w-4 h-4 text-green-500" /> : pingStatus === 'error' ? <XCircle className="w-4 h-4 text-red-500" /> : <Activity className="w-4 h-4" />}
                Run Ping Test
            </button>
        </div>
    );
}

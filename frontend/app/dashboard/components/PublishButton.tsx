'use client';

import { useState } from 'react';
import { Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function PublishButton() {
    const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handlePublish = async () => {
        setStatus('publishing');
        setMessage('');

        try {
            const res = await fetch('/api/admin/publish', {
                method: 'POST',
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Published successfully!');
                setTimeout(() => setStatus('idle'), 5000);
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
        <div className="mt-8 bg-gold-royal/5 border border-gold-royal/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" dir="ltr">
            <div className="flex items-start gap-4">
                <div className="mt-1">
                    <Globe className="w-6 h-6 text-gold-royal" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">The Bridge: Auto-Publishing</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
                        Changes made here are saved directly to your local file system. Hitting <strong>Publish</strong> will automatically execute the deployment script to push your changes to GitHub and trigger a Vercel rebuild.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
                <button
                    onClick={handlePublish}
                    disabled={status === 'publishing'}
                    className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-colors disabled:opacity-50 tracking-wider text-sm uppercase"
                >
                    {status === 'publishing' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Deploying...</>
                    ) : status === 'success' ? (
                        <><CheckCircle className="w-4 h-4 text-green-500" /> Published</>
                    ) : (
                        'Publish to Live Site'
                    )}
                </button>
                {message && (
                    <p className={`mt-2 text-xs font-medium ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

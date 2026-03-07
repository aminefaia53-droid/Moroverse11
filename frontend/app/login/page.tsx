'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-black p-4 relative overflow-hidden" dir="ltr">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-xl shadow-2xl p-8 relative z-10 border border-gold-royal/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gold-royal/10 text-gold-royal rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-cinzel font-bold text-gray-900 dark:text-white">Moroverse Admin</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-outfit">Control Panel</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-outfit" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-gold-royal focus:border-transparent outline-none transition-all bg-white dark:bg-stone-800 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-outfit" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-gold-royal focus:border-transparent outline-none transition-all bg-white dark:bg-stone-800 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold-royal hover:bg-gold-light text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center font-outfit shadow-lg shadow-gold-royal/20"
                    >
                        {loading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

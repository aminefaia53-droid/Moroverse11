'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileEdit, LogOut, PanelTop } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/login');
        router.refresh(); // Important to refresh after logout
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Editor', href: '/dashboard/editor', icon: FileEdit },
        { name: 'Card Control', href: '/dashboard/cards', icon: PanelTop },
    ];

    return (
        <div className="flex h-screen bg-stone-100 dark:bg-[#0a192f] font-outfit" dir="ltr">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#112240] border-r border-gray-200 dark:border-[#c5a059]/20 flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10">
                <div className="p-6">
                    <Link href="/">
                        <h2 className="text-2xl font-cinzel font-bold text-gray-900 dark:text-white hover:text-gold-royal transition-colors">Moroverse</h2>
                    </Link>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Control Panel</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-gold-royal/10 text-gold-royal font-medium border border-gold-royal/30 shadow-[0_0_10px_rgba(197,160,89,0.1)]'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0a192f]'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-[#c5a059]/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-stone-50 dark:bg-[#0a192f]">
                <div className="h-full relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

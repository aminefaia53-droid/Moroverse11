import { ArrowRight, FileEdit, PanelTop, Landmark } from 'lucide-react';
import Link from 'next/link';
import PublishButton from './components/PublishButton';
import PingTest from './components/PingTest';

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto" dir="ltr">
            <h1 className="text-3xl font-bold font-cinzel mb-2 text-gray-900 dark:text-white">Welcome, Admin</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-outfit">
                Manage Moroverse content and layout from this Blogger-style dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/editor" className="group block">
                    <div className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#c5a059]/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-xl p-6 transition-all hover:border-gold-royal hover:shadow-lg hover:shadow-gold-royal/20 h-full relative overflow-hidden group-hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-royal/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                            <FileEdit className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-gold-royal transition-colors">Write Article</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                            Create and edit historic articles using the custom editor. Upload images and map stories to specific cities.
                        </p>
                        <div className="flex items-center text-sm font-medium text-gold-royal mt-auto">
                            Go to Editor <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/content" className="group block">
                    <div className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#c5a059]/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-xl p-6 transition-all hover:border-gold-royal hover:shadow-lg hover:shadow-gold-royal/20 h-full relative overflow-hidden group-hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-royal/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mb-4">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-gold-royal transition-colors">Content Manager</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                            A unified editor to manage data identity and media for Cities, Landmarks, Elite Battles, and Historical Figures.
                        </p>
                        <div className="flex items-center text-sm font-medium text-gold-royal mt-auto">
                            Manage Content <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/cards" className="group block">
                    <div className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#c5a059]/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-xl p-6 transition-all hover:border-gold-royal hover:shadow-lg hover:shadow-gold-royal/20 h-full relative overflow-hidden group-hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-royal/5 rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                            <PanelTop className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-gold-royal transition-colors">Homepage Cards</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                            Control the content displayed on the main landing page cards. Assign key articles to get featured instantly.
                        </p>
                        <div className="flex items-center text-sm font-medium text-gold-royal mt-auto">
                            Manage Cards <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            </div>

            <PublishButton />
            <PingTest />
        </div>
    );
}


'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, ShieldAlert } from 'lucide-react';
import { CATEGORY_ENTITIES } from '../data/moroverse-entities';

export default function CardsControlPage() {
    const [data, setData] = useState<Record<string, any[]>>({ cities: [], landmarks: [], battles: [], figures: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cities');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        fetch('/api/admin/content')
            .then(res => res.json())
            .then(json => {
                if (json.success) setData(json.data);
                setLoading(false);
            });
    }, [refresh]);

    const toggleVisibility = async (category: string, id: string, currentPending: boolean) => {
        try {
            await fetch('/api/admin/content/visibility', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, id, action: 'toggleVisibility', isPending: !currentPending })
            });
            setRefresh(r => r + 1);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteItem = async (category: string, id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await fetch('/api/admin/content/visibility', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, id, action: 'delete' })
            });
            setRefresh(r => r + 1);
        } catch (e) {
            console.error(e);
        }
    };

    const tabs = [
        { id: 'cities', label: 'Cities' },
        { id: 'landmarks', label: 'Landmarks' },
        { id: 'battles', label: 'Battles' },
        { id: 'figures', label: 'Historical Figures' },
    ];

    if (loading) return <div className="p-8 font-outfit text-gray-500">Loading Moroverse Database...</div>;

    const currentItems = data[activeTab] || [];

    return (
        <div className="max-w-6xl mx-auto p-8" dir="ltr">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-cinzel text-gray-900 dark:text-white mb-2">Homepage Cards</h1>
                    <p className="text-gray-500 font-outfit">Control which articles are featured on the main Moroverse grids.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-[#c5a059]/30 shadow-sm overflow-hidden font-outfit">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-[#c5a059]/30 bg-stone-50 dark:bg-[#0a192f]/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === tab.id
                                ? 'border-b-2 border-gold-royal text-gold-royal bg-white dark:bg-[#112240]'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#112240]/80'
                                }`}
                        >
                            {tab.label} ({data[tab.id]?.length || 0} / {CATEGORY_ENTITIES[tab.id as keyof typeof CATEGORY_ENTITIES]?.length || 0})
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="p-0">
                    {currentItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No items found in this category.</div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-[#c5a059]/20">
                            {currentItems.map((item: any) => (
                                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-[#0a192f]/50 transition-colors">
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#0a192f] border border-gray-200 dark:border-[#c5a059]/20">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name.en} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ShieldAlert className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                                {item.name.en}
                                                <span className="text-sm font-arabic font-normal text-gray-500">{item.name.ar}</span>
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate mt-1 max-w-2xl">{item.desc?.en || 'No description provided.'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-6 shrink-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${!item.isPending
                                            ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                            }`}>
                                            {!item.isPending ? 'Visible on Site' : 'Hidden (Pending)'}
                                        </span>

                                        <button
                                            onClick={() => toggleVisibility(activeTab, item.id, item.isPending)}
                                            title={!item.isPending ? 'Hide from Homepage' : 'Show on Homepage'}
                                            className={`p-2 rounded-lg transition-colors shadow-sm ${!item.isPending
                                                ? 'bg-stone-100 text-gray-700 hover:bg-stone-200 dark:bg-[#0a192f] dark:text-gray-300 dark:hover:bg-[#112240] border border-transparent'
                                                : 'bg-gold-royal text-white hover:bg-gold-light border border-gold-royal/50'
                                                }`}
                                        >
                                            {!item.isPending ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>

                                        <button
                                            onClick={() => deleteItem(activeTab, item.id)}
                                            title="Delete Item"
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

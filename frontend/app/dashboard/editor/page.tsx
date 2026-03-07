'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Image as ImageIcon, CheckCircle, Search, PlusCircle, Edit3, Loader2 } from 'lucide-react';
import MarkdownEditor from '../components/MarkdownEditor';
import ImageGalleryModal from '../components/ImageGalleryModal';
import { CATEGORY_ENTITIES, CATEGORY_LABELS, type BilingualEntry } from '../data/moroverse-entities';

// ——— Types ———
type Category = 'cities' | 'landmarks' | 'battles' | 'figures';

interface EntityItem {
    id: string;
    name: { en: string; ar: string };
    city?: { en: string; ar: string };
    desc?: { en: string; ar: string };
    imageUrl?: string;
    isPending?: boolean;
}

function toId(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function EditorPage() {
    const [mode, setMode] = useState<'new' | 'edit'>('new');
    const [existingItems, setExistingItems] = useState<EntityItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState<Category>('cities');

    // Entity selection
    const [selectedEntityEn, setSelectedEntityEn] = useState('');
    const [selectedEntityAr, setSelectedEntityAr] = useState('');

    // City association (for landmarks + battles)
    const [cityEn, setCityEn] = useState('');
    const [cityAr, setCityAr] = useState('');

    // Content
    const [descEn, setDescEn] = useState('');
    const [descAr, setDescAr] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [loadingItems, setLoadingItems] = useState(false);

    // Fetch all items of current category for editing or lookup
    const fetchItems = useCallback(async () => {
        setLoadingItems(true);
        try {
            const res = await fetch('/api/admin/content');
            const data = await res.json();
            if (data.success) setExistingItems(data.data[category] || []);
        } catch { /* ignore */ }
        finally { setLoadingItems(false); }
    }, [category]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    // When category changes, reset selections
    useEffect(() => {
        setSelectedEntityEn('');
        setSelectedEntityAr('');
        setCityEn('');
        setCityAr('');
        setDescEn('');
        setDescAr('');
        setImageUrl('');
        setMode('new');
    }, [category]);

    // Smart entity dropdown change handler
    const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const enVal = e.target.value;
        setSelectedEntityEn(enVal);
        const matched = CATEGORY_ENTITIES[category]?.find((c: BilingualEntry) => c.en === enVal);
        setSelectedEntityAr(matched?.ar || '');
    };

    // Smart city dropdown change handler
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const enVal = e.target.value;
        setCityEn(enVal);
        const matched = CATEGORY_ENTITIES['cities']?.find((c: BilingualEntry) => c.en === enVal);
        setCityAr(matched?.ar || '');
    };

    // Load an existing article for editing
    const loadForEdit = (item: EntityItem) => {
        setMode('edit');
        setSelectedEntityEn(item.name.en);
        setSelectedEntityAr(item.name.ar);
        setCityEn(item.city?.en || '');
        setCityAr(item.city?.ar || '');
        setDescEn(item.desc?.en || '');
        setDescAr(item.desc?.ar || '');
        setImageUrl(item.imageUrl || '');
        setSearchQuery('');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEntityEn) { alert('Please select an entity from the dropdown.'); return; }
        setStatus('saving');

        const payload = {
            id: toId(selectedEntityEn),
            category,
            title: { en: selectedEntityEn, ar: selectedEntityAr },
            city: { en: cityEn, ar: cityAr },
            description: { en: descEn, ar: descAr },
            imageUrl,
            dateAdded: new Date().toISOString(),
        };

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setStatus('success');
                fetchItems();
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const categoryEntities = CATEGORY_ENTITIES[category] || [];
    const citiesEntities = CATEGORY_ENTITIES['cities'] || [];
    const showCitySelector = category !== 'figures' && category !== 'cities';
    const filteredItems = existingItems.filter(i =>
        i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.name.ar.includes(searchQuery)
    );

    return (
        <div className="max-w-5xl mx-auto p-8 font-outfit" dir="ltr">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-cinzel text-gray-900 dark:text-white mb-2">Smart Editor</h1>
                    <p className="text-gray-500 dark:text-gray-400">Add new entries or edit existing records — no manual typing required.</p>
                </div>
                <div className="flex bg-[#112240] rounded-xl p-1 border border-[#c5a059]/20 shadow-sm">
                    <button type="button" onClick={() => setMode('new')}
                        className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${mode === 'new' ? 'bg-gold-royal text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                        <PlusCircle className="w-4 h-4" /> New Entry
                    </button>
                    <button type="button" onClick={() => setMode('edit')}
                        className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${mode === 'edit' ? 'bg-gold-royal text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                        <Edit3 className="w-4 h-4" /> Edit Existing
                    </button>
                </div>
            </div>

            {/* Edit Mode: Search Panel */}
            {mode === 'edit' && (
                <div className="bg-white dark:bg-[#112240] rounded-xl border border-gray-200 dark:border-[#c5a059]/30 shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gold-royal" /> Search & Select to Edit
                    </h2>
                    <div className="flex gap-3 mb-4">
                        {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                            <button key={cat} type="button" onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${category === cat ? 'bg-gold-royal text-white' : 'bg-[#0a192f] text-gray-400 hover:text-gold-royal border border-[#c5a059]/20'}`}>
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name (EN or AR)..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-[#c5a059]/20 rounded-lg dark:bg-[#0a192f] dark:text-white focus:ring-2 focus:ring-gold-royal mb-4"
                    />
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#c5a059]/10 rounded-lg border border-[#c5a059]/10 bg-[#0a192f]">
                        {loadingItems ? (
                            <div className="p-6 text-center text-gold-royal">
                                <Loader2 className="w-5 h-5 animate-spin inline" />
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">No results — try a different keyword.</div>
                        ) : filteredItems.map(item => (
                            <button key={item.id} type="button" onClick={() => loadForEdit(item)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#112240] transition-colors text-left group">
                                <div>
                                    <span className="font-bold text-white group-hover:text-gold-royal transition-colors">{item.name.en}</span>
                                    <span className="ml-3 text-gray-400 font-arabic text-sm">{item.name.ar}</span>
                                </div>
                                <Edit3 className="w-4 h-4 text-gray-600 group-hover:text-gold-royal" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Category & Entity Selection */}
                <div className="bg-white dark:bg-[#112240] p-6 rounded-xl border border-gray-200 dark:border-[#c5a059]/30 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select Category & Entity</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                        {/* Category Chip Selector */}
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <div className="flex gap-3 flex-wrap">
                                {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${category === cat
                                            ? 'bg-gold-royal text-white border-gold-royal shadow-lg shadow-gold-royal/20'
                                            : 'bg-white dark:bg-[#0a192f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#c5a059]/20 hover:border-gold-royal hover:text-gold-royal'
                                            }`}>
                                        {CATEGORY_LABELS[cat]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Smart Entity Dropdown */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Select {CATEGORY_LABELS[category]}
                            </label>
                            <select
                                value={selectedEntityEn}
                                onChange={handleEntityChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-[#c5a059]/20 rounded-lg dark:bg-[#0a192f] dark:text-white focus:ring-2 focus:ring-gold-royal"
                            >
                                <option value="">— Select {CATEGORY_LABELS[category]} —</option>
                                {categoryEntities.map((c: BilingualEntry) => (
                                    <option key={c.en} value={c.en}>{c.en}</option>
                                ))}
                            </select>
                        </div>

                        {/* Auto-filled Arabic name */}
                        <div className="md:col-span-2" dir="rtl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                الاسم (تلقائي)
                            </label>
                            <input
                                readOnly disabled
                                value={selectedEntityAr}
                                placeholder="يُملأ تلقائياً..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#c5a059]/20 bg-gray-100 dark:bg-[#0a192f]/60 text-gray-500 dark:text-gold-royal/80 cursor-not-allowed font-arabic"
                            />
                        </div>
                    </div>
                </div>

                {/* City Selector (for Landmarks & Battles only) */}
                {showCitySelector && (
                    <div className="bg-white dark:bg-[#112240] p-6 rounded-xl border border-gray-200 dark:border-[#c5a059]/30 shadow-sm">
                        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Geographic Association</h2>
                        <p className="text-gray-500 text-sm mb-4">Which city is this {CATEGORY_LABELS[category].toLowerCase()} associated with?</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Associated City</label>
                                <select
                                    value={cityEn}
                                    onChange={handleCityChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#c5a059]/20 rounded-lg dark:bg-[#0a192f] dark:text-white focus:ring-2 focus:ring-gold-royal"
                                >
                                    <option value="">— Select City (Optional) —</option>
                                    {citiesEntities.map((c: BilingualEntry) => (
                                        <option key={c.en} value={c.en}>{c.en}</option>
                                    ))}
                                </select>
                            </div>
                            <div dir="rtl">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المدينة (تلقائي)</label>
                                <input
                                    readOnly disabled value={cityAr}
                                    placeholder="يُملأ تلقائياً..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#c5a059]/20 rounded-lg bg-gray-100 dark:bg-[#0a192f]/60 text-gray-500 dark:text-gold-royal/80 cursor-not-allowed font-arabic"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Cover Image */}
                <div className="bg-white dark:bg-[#112240] p-6 rounded-xl border border-gray-200 dark:border-[#c5a059]/30 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-gold-royal" /> Cover Image
                        </h2>
                        <button type="button" onClick={() => setIsGalleryOpen(true)}
                            className="text-sm font-bold bg-gold-royal/10 text-gold-royal hover:bg-gold-royal/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gold-royal/20">
                            <Search className="w-4 h-4" /> Browse Gallery
                        </button>
                    </div>
                    <input
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or upload from gallery"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-[#c5a059]/20 rounded-lg dark:bg-[#0a192f] dark:text-white focus:ring-2 focus:ring-gold-royal mb-4"
                    />
                    {imageUrl && (
                        <div className="relative w-full h-52 rounded-xl overflow-hidden border border-gray-200 dark:border-[#c5a059]/20">
                            <img src={imageUrl} alt="Cover Preview" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <span className="absolute bottom-2 left-3 text-xs text-white/80 font-bold">Preview</span>
                        </div>
                    )}
                </div>

                {/* Content Description */}
                <div className="bg-white dark:bg-[#112240] p-6 rounded-xl border border-gray-200 dark:border-[#c5a059]/30 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Content Description</h2>
                    <div className="space-y-6">
                        <MarkdownEditor
                            value={descEn}
                            onChange={setDescEn}
                            placeholder="Write the history here... (Supports **bold**, *italic*, ## headings)"
                            label="English Description"
                        />
                        <MarkdownEditor
                            value={descAr}
                            onChange={setDescAr}
                            dir="rtl"
                            placeholder="اكتب التاريخ هنا... (يدعم **عريض**، *مائل*)"
                            label="Arabic Description"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-4 pb-8">
                    {status === 'success' && (
                        <span className="text-green-500 flex items-center gap-2 font-bold text-sm">
                            <CheckCircle className="w-5 h-5" /> Saved successfully!
                        </span>
                    )}
                    {status === 'error' && (
                        <span className="text-red-500 text-sm font-bold">Failed to save. Please try again.</span>
                    )}
                    <button
                        type="submit"
                        disabled={status === 'saving' || !selectedEntityEn}
                        className="bg-gold-royal hover:bg-gold-light text-white font-bold py-3 px-10 rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                    >
                        {status === 'saving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {status === 'saving' ? 'Saving...' : mode === 'edit' ? 'Update Entry' : 'Save Draft'}
                    </button>
                </div>
            </form>

            <ImageGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onSelectImage={url => setImageUrl(url)}
            />
        </div>
    );
}

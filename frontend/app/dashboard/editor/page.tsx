'use client';

import { useState } from 'react';
import { Save, Image as ImageIcon, CheckCircle } from 'lucide-react';

export default function EditorPage() {
    const [titleEn, setTitleEn] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [category, setCategory] = useState('cities');
    const [cityEn, setCityEn] = useState('');
    const [cityAr, setCityAr] = useState('');
    const [descEn, setDescEn] = useState('');
    const [descAr, setDescAr] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');

        const data = {
            id: titleEn.toLowerCase().replace(/\s+/g, '-'),
            category,
            title: { en: titleEn, ar: titleAr },
            city: { en: cityEn, ar: cityAr },
            description: { en: descEn, ar: descAr },
            imageUrl,
            dateAdded: new Date().toISOString(),
        };

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8" dir="ltr">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-cinzel text-gray-900 dark:text-white mb-2">Editor</h1>
                    <p className="text-gray-500 font-outfit">Create or modify a Moroverse entry.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8 font-outfit">
                {/* Basic Info */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
                            <input required value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal" />
                        </div>
                        <div dir="rtl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Arabic)</label>
                            <input required value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal">
                                <option value="cities">City</option>
                                <option value="landmarks">Landmark</option>
                                <option value="battles">Battle</option>
                                <option value="figures">Historical Figure</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Associated City (EN)</label>
                            <input value={cityEn} onChange={e => setCityEn(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal" />
                        </div>
                        <div dir="rtl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Associated City (AR)</label>
                            <input value={cityAr} onChange={e => setCityAr(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal" />
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> Cover Image
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                        <input
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal mb-4"
                        />
                        {imageUrl && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-stone-700">
                                <img src={imageUrl} alt="Preview" className="object-cover w-full h-full" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Content Description</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (English)</label>
                            <textarea required value={descEn} onChange={e => setDescEn(e.target.value)} rows={6} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal" placeholder="Write the history here..." />
                        </div>
                        <div dir="rtl">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Arabic)</label>
                            <textarea required value={descAr} onChange={e => setDescAr(e.target.value)} rows={6} className="w-full px-4 py-2 border border-gray-300 dark:border-stone-700 rounded-lg dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-gold-royal font-arabic" placeholder="اكتب التاريخ هنا..." />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-4">
                    {status === 'success' && (
                        <span className="text-green-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Saved successfully!</span>
                    )}
                    {status === 'error' && (
                        <span className="text-red-600">Failed to save. Try again.</span>
                    )}
                    <button
                        type="submit"
                        disabled={status === 'saving'}
                        className="bg-gold-royal hover:bg-gold-light text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {status === 'saving' ? 'Saving...' : 'Save Draft'}
                    </button>
                </div>
            </form>
        </div>
    );
}

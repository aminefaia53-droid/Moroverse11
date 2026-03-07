'use client';

import { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import { Save, Search, PlusCircle, Edit3, Loader2, Eye, CheckCircle, UploadCloud } from 'lucide-react';
import RichToolbar from '../components/RichToolbar';
import ImageGalleryModal from '../components/ImageGalleryModal';
import LivePreviewModal from '../components/LivePreviewModal';
import { CATEGORY_ENTITIES, CATEGORY_LABELS, type BilingualEntry } from '../data/moroverse-entities';

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

// ——— Simple textarea with drag-drop support ———
function DragDropEditor({
    textareaRef, value, onChange, dir, placeholder, label
}: {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    value: string;
    onChange: (v: string) => void;
    dir?: 'ltr' | 'rtl';
    placeholder?: string;
    label?: string;
}) {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                const ta = textareaRef.current;
                const cursor = ta?.selectionStart ?? value.length;
                const inserted = `![${file.name}](${data.url})\n`;
                onChange(value.substring(0, cursor) + inserted + value.substring(cursor));
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {label && (
                <div className="flex items-center justify-between px-3 py-2 bg-[#0a192f] border-b border-[#c5a059]/20 shrink-0">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
                    {dir === 'rtl' && <span className="text-[10px] text-gold-royal bg-gold-royal/10 px-2 py-0.5 rounded-full">عربي ← Arabic</span>}
                </div>
            )}
            <div
                className={`flex-1 relative transition-all ${dragging ? 'bg-gold-royal/5 ring-2 ring-gold-royal ring-inset rounded-b-lg' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    dir={dir}
                    placeholder={placeholder}
                    className={`w-full h-full min-h-[280px] p-4 bg-transparent resize-none outline-none text-gray-200 placeholder-gray-600 text-sm leading-relaxed ${dir === 'rtl' ? 'font-arabic text-right' : 'font-outfit'}`}
                />
                {/* Drag overlay */}
                {dragging && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <UploadCloud className="w-12 h-12 text-gold-royal animate-bounce mb-2" />
                        <span className="text-gold-royal font-bold text-sm">Drop to insert image</span>
                    </div>
                )}
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="w-8 h-8 text-gold-royal animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}

// ——— MAIN PAGE ———
export default function EditorPage() {
    const [mode, setMode] = useState<'new' | 'edit'>('new');
    const [existingItems, setExistingItems] = useState<EntityItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState<Category>('cities');
    const [selectedEntityEn, setSelectedEntityEn] = useState('');
    const [selectedEntityAr, setSelectedEntityAr] = useState('');
    const [cityEn, setCityEn] = useState('');
    const [cityAr, setCityAr] = useState('');
    const [descEn, setDescEn] = useState('');
    const [descAr, setDescAr] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('draft');

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [loadingItems, setLoadingItems] = useState(false);

    const textareaEnRef = useRef<HTMLTextAreaElement>(null);
    const textareaArRef = useRef<HTMLTextAreaElement>(null);

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

    useEffect(() => {
        setSelectedEntityEn(''); setSelectedEntityAr('');
        setCityEn(''); setCityAr('');
        setDescEn(''); setDescAr(''); setImageUrl('');
        setMode('new');
    }, [category]);

    const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const enVal = e.target.value;
        setSelectedEntityEn(enVal);
        const matched = CATEGORY_ENTITIES[category]?.find((c: BilingualEntry) => c.en === enVal);
        setSelectedEntityAr(matched?.ar || '');
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const enVal = e.target.value;
        setCityEn(enVal);
        const matched = CATEGORY_ENTITIES['cities']?.find((c: BilingualEntry) => c.en === enVal);
        setCityAr(matched?.ar || '');
    };

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
        if (!selectedEntityEn) { alert('Please select an entity.'); return; }
        setStatus('saving');
        const payload = {
            id: toId(selectedEntityEn),
            category,
            title: { en: selectedEntityEn, ar: selectedEntityAr },
            city: { en: cityEn, ar: cityAr },
            description: { en: descEn, ar: descAr },
            imageUrl,
            isPending: publishStatus === 'draft',
            dateAdded: new Date().toISOString(),
        };
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            if (res.ok) { setStatus('success'); fetchItems(); setTimeout(() => setStatus('idle'), 3000); }
            else setStatus('error');
        } catch { setStatus('error'); }
    };

    const categoryEntities = CATEGORY_ENTITIES[category] || [];
    const citiesEntities = CATEGORY_ENTITIES['cities'] || [];
    const showCitySelector = category !== 'figures' && category !== 'cities';
    const filteredItems = existingItems.filter(i =>
        i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.ar.includes(searchQuery)
    );

    return (
        <div className="h-screen flex flex-col overflow-hidden font-outfit bg-[#050d1a]" dir="ltr">
            {/* ——— Top action bar (Blogger-style) ——— */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#0a192f] border-b border-[#c5a059]/30 shrink-0 z-10 shadow-md">
                <div className="flex items-center gap-4">
                    <div className="flex bg-[#112240] rounded-xl p-1 border border-[#c5a059]/20">
                        <button type="button" onClick={() => setMode('new')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${mode === 'new' ? 'bg-gold-royal text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <PlusCircle className="w-3.5 h-3.5" /> New
                        </button>
                        <button type="button" onClick={() => setMode('edit')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${mode === 'edit' ? 'bg-gold-royal text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                    </div>

                    {/* Entity title display */}
                    <span className="text-white font-cinzel font-bold text-lg">
                        {selectedEntityEn || <span className="text-gray-600 text-base">Untitled Entry</span>}
                    </span>
                    {selectedEntityAr && <span className="text-gold-royal/70 font-arabic text-sm">{selectedEntityAr}</span>}
                </div>

                <div className="flex items-center gap-3">
                    {status === 'success' && <span className="text-green-400 text-xs flex items-center gap-1 font-bold"><CheckCircle className="w-3.5 h-3.5" /> Saved</span>}
                    {status === 'error' && <span className="text-red-400 text-xs font-bold">Save Failed</span>}
                    <button type="button" onClick={() => setIsPreviewOpen(true)}
                        className="flex items-center gap-2 text-sm font-bold text-gold-royal border border-gold-royal/30 px-4 py-2 rounded-lg hover:bg-gold-royal/10 transition-colors">
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button form="editor-form" type="submit" disabled={status === 'saving' || !selectedEntityEn}
                        className="flex items-center gap-2 text-sm font-bold bg-gold-royal hover:bg-gold-light text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-md">
                        {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {status === 'saving' ? 'Saving…' : mode === 'edit' ? 'Update' : 'Save Draft'}
                    </button>
                </div>
            </div>

            {/* ——— Main: Editor + Sidebar ——— */}
            <form id="editor-form" onSubmit={handleSave} className="flex flex-1 overflow-hidden">
                {/* ——— LEFT: Writing area ——— */}
                <div className="flex-1 flex flex-col overflow-hidden border-r border-[#c5a059]/20">
                    {/* Rich Toolbar (shared — applies to EN editor) */}
                    <RichToolbar
                        textareaRef={textareaEnRef}
                        value={descEn}
                        onChange={setDescEn}
                        onImageUpload={url => setImageUrl(url)}
                    />

                    {/* Bilingual editors side-by-side */}
                    <div className="flex flex-1 overflow-hidden divide-x divide-[#c5a059]/10">
                        {/* English */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-[#080f1e]">
                            <DragDropEditor
                                textareaRef={textareaEnRef}
                                value={descEn}
                                onChange={setDescEn}
                                dir="ltr"
                                placeholder="Write the English description here... Drag & drop images directly into this area."
                                label="English / الإنجليزية"
                            />
                        </div>
                        {/* Arabic */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-[#060c18]">
                            <DragDropEditor
                                textareaRef={textareaArRef}
                                value={descAr}
                                onChange={setDescAr}
                                dir="rtl"
                                placeholder="اكتب الوصف العربي هنا... يمكنك سحب الصور وإفلاتها مباشرة."
                                label="Arabic / العربية"
                            />
                        </div>
                    </div>
                </div>

                {/* ——— RIGHT: Sidebar ——— */}
                <aside className="w-72 shrink-0 flex flex-col overflow-y-auto bg-[#0a192f] border-l border-[#c5a059]/20">
                    <div className="p-4 space-y-5">

                        {/* Edit Search Panel */}
                        {mode === 'edit' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Search className="w-3.5 h-3.5 text-gold-royal" /> Search to Edit
                                </label>
                                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by name..."
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none mb-2" />
                                <div className="max-h-48 overflow-y-auto rounded-lg border border-[#c5a059]/10 bg-[#050d1a] divide-y divide-[#c5a059]/5">
                                    {loadingItems ? (
                                        <div className="p-3 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-gold-royal" /></div>
                                    ) : filteredItems.slice(0, 20).map(item => (
                                        <button key={item.id} type="button" onClick={() => loadForEdit(item)}
                                            className="w-full text-left px-3 py-2.5 text-xs hover:bg-[#112240] transition-colors group">
                                            <div className="font-bold text-gray-300 group-hover:text-gold-royal truncate">{item.name.en}</div>
                                            <div className="text-gray-600 font-arabic truncate">{item.name.ar}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${category === cat
                                            ? 'bg-gold-royal text-white border-gold-royal shadow'
                                            : 'bg-[#112240] text-gray-400 border-[#c5a059]/10 hover:border-gold-royal/40 hover:text-gray-200'
                                            }`}>
                                        {CATEGORY_LABELS[cat]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Entity selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {CATEGORY_LABELS[category]}
                            </label>
                            <select value={selectedEntityEn} onChange={handleEntityChange} required
                                className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none">
                                <option value="">— Select —</option>
                                {categoryEntities.map((c: BilingualEntry) => (
                                    <option key={c.en} value={c.en}>{c.en}</option>
                                ))}
                            </select>
                            {selectedEntityAr && (
                                <div className="mt-1 text-xs text-gold-royal/70 font-arabic text-right px-1">{selectedEntityAr}</div>
                            )}
                        </div>

                        {/* City (for landmarks + battles) */}
                        {showCitySelector && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Associated City</label>
                                <select value={cityEn} onChange={handleCityChange}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none">
                                    <option value="">— Optional —</option>
                                    {citiesEntities.map((c: BilingualEntry) => (
                                        <option key={c.en} value={c.en}>{c.en}</option>
                                    ))}
                                </select>
                                {cityAr && <div className="mt-1 text-xs text-gold-royal/70 font-arabic text-right px-1">{cityAr}</div>}
                            </div>
                        )}

                        {/* Publish Status */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Publish Status</label>
                            <div className="flex gap-2">
                                {(['draft', 'published'] as const).map(s => (
                                    <button key={s} type="button" onClick={() => setPublishStatus(s)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors capitalize ${publishStatus === s
                                            ? s === 'published' ? 'bg-green-600 text-white border-green-500' : 'bg-[#112240] text-gold-royal border-gold-royal'
                                            : 'bg-[#112240] text-gray-500 border-[#c5a059]/10 hover:text-gray-300'
                                            }`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Image</label>
                            <button type="button" onClick={() => setIsGalleryOpen(true)}
                                className="w-full text-xs font-bold border border-[#c5a059]/20 bg-[#112240] text-gold-royal hover:bg-gold-royal/10 px-3 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mb-2">
                                Browse Gallery
                            </button>
                            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="or paste URL..."
                                className="w-full text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none" />
                            {imageUrl && (
                                <div className="mt-2 rounded-lg overflow-hidden aspect-video border border-[#c5a059]/20">
                                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Word count */}
                        <div className="border-t border-[#c5a059]/10 pt-4">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>EN Words</span><span className="text-gray-400 font-bold">{descEn.trim().split(/\s+/).filter(Boolean).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>AR Words</span><span className="text-gray-400 font-bold">{descAr.trim().split(/\s+/).filter(Boolean).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </form>

            {/* Modals */}
            <ImageGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} onSelectImage={url => setImageUrl(url)} />
            <LivePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                titleEn={selectedEntityEn}
                titleAr={selectedEntityAr}
                descEn={descEn}
                descAr={descAr}
                imageUrl={imageUrl}
                category={category}
                cityEn={cityEn}
                cityAr={cityAr}
            />
        </div>
    );
}

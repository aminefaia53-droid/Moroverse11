'use client';

import { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import { Save, Search, PlusCircle, Edit3, Loader2, Eye, CheckCircle, UploadCloud } from 'lucide-react';
import RichToolbar from '../components/RichToolbar';
import ImageGalleryModal from '../components/ImageGalleryModal';
import LivePreviewModal from '../components/LivePreviewModal';
import { CATEGORY_ENTITIES, CATEGORY_LABELS, type Category, type BilingualEntry } from '../data/moroverse-entities';

interface EntityItem {
    id: string;
    name: { en: string; ar: string };
    city?: { en: string; ar: string };
    desc?: { en: string; ar: string };
    imageUrl?: string;
    isPending?: boolean;
}

function toId(str: string) {
    const lat = str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return lat || `entry-${Date.now()}`;
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

    const compressImage = (file: File): Promise<Blob | File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const max = 1200;
                    if (width > height && width > max) { height *= max / width; width = max; }
                    else if (height > max) { width *= max / height; height = max; }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        setUploading(true);
        try {
            const compressedBlob = await compressImage(file);
            const formData = new FormData();
            formData.append('file', compressedBlob, file.name);

            const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                const ta = textareaRef.current;
                const cursor = ta?.selectionStart ?? value.length;
                const inserted = `![${file.name}](${data.url})\n`;
                onChange(value.substring(0, cursor) + inserted + value.substring(cursor));
            } else {
                alert(`Upload failed: ${data.message}${data.error ? ` (${data.error})` : ''}${data.hint ? `\nHint: ${data.hint}` : ''}`);
            }
        } catch (e: any) {
            console.error('Upload Error Client:', e);
            alert('An error occurred during upload: ' + (e.message || 'Unknown error'));
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
    const [showEnglish, setShowEnglish] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [eliteSearchQuery, setEliteSearchQuery] = useState('');
    const [showEliteDropdown, setShowEliteDropdown] = useState(false);

    const handleTranslate = async () => {
        if (!descAr && !selectedEntityAr) { alert('الرجاء كتابة نص أو عنوان عربي أولاً للترجمة.'); return; }
        setIsTranslating(true);
        try {
            // Translate Title if needed
            if (selectedEntityAr && !selectedEntityEn) {
                const resT = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(selectedEntityAr)}&langpair=ar|en`);
                const dataT = await resT.json();
                if (dataT.responseData?.translatedText) {
                    setSelectedEntityEn(dataT.responseData.translatedText);
                }
            }

            // Translate Content if needed
            if (descAr) {
                const resC = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(descAr)}&langpair=ar|en`);
                const dataC = await resC.json();
                if (dataC.responseData?.translatedText) {
                    setDescEn(dataC.responseData.translatedText);
                    setShowEnglish(true);
                }
            }
        } catch (e) {
            alert('فشلت الترجمة التلقائية. يرجى المحاولة لاحقاً.');
        } finally {
            setIsTranslating(false);
        }
    };

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
        setSelectedEntityAr('');
        setCityAr('');
        setDescAr(''); setImageUrl('');
        setMode('new');
    }, [category]);

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

    // Auto-fill logic when selecting an Arabic Entity (Auto-Fill Knowledge)
    const handleEntityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const arVal = e.target.value;
        setSelectedEntityAr(arVal);

        const matched = CATEGORY_ENTITIES[category]?.find((c: BilingualEntry) => c.ar === arVal);
        setSelectedEntityEn(matched?.en || '');

        // Elite Tours Auto-Fill functionality
        if (category === 'elite_tours' && matched?.en) {
            try {
                // We'll search our local static data or Headless API to pre-fill known fields
                // Simulating auto-fill from a known knowledge-base source

                // For demonstration, map specific hardcoded entries mentioned by the User
                if (matched.en === 'Merchich Region') {
                    setDescAr('منطقة الأسرار والغموض بضواحي الدار البيضاء، تعتبر من الوجهات غير المستكشفة في السياحة السوداء.');
                    setDescEn('A region of secrets and mystery on the outskirts of Casablanca, considered an unexplored destination in Dark Tourism.');
                    setCityAr('الدار البيضاء'); setCityEn('Casablanca');
                } else if (matched.en === 'Kara Prison') {
                    setDescAr('سجن ضخم تحت الأرض بني في القرن الثامن عشر، يحيط به الغموض والتاريخ المظلم أسفل مدينة مكناس.');
                    setDescEn('A massive underground prison built in the 18th century, wrapped in myths and dark history beneath Meknes.');
                    setCityAr('مكناس'); setCityEn('Meknes');
                } else if (matched.en === 'Agadir Ruins') {
                    setDescAr('البقايا الحزينة للقصبة القديمة التي تحفظ ذاكرة زلزال عام 1960 المدمر.');
                    setDescEn('The somber remains of the old Kasbah, preserving the memory of the devastating 1960 earthquake.');
                    setCityAr('أكادير'); setCityEn('Agadir');
                }
            } catch (err) {
                console.log('Autofill failed', err);
            }
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const arVal = e.target.value;
        setCityAr(arVal);
        const matched = CATEGORY_ENTITIES['cities']?.find((c: BilingualEntry) => c.ar === arVal);
        setCityEn(matched?.en || '');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEntityAr && mode === 'new') { alert('الرجاء اختيار العنصر.'); return; }

        // For Elite Tours we let them type free-form titles if it's not in the dropdown
        const finalTitleAr = selectedEntityAr || (category === 'elite_tours' ? document.getElementById('elite-title-ar')?.nodeValue : '');
        const finalTitleEn = selectedEntityEn || (category === 'elite_tours' ? document.getElementById('elite-title-en')?.nodeValue : '');

        if (!finalTitleAr) { alert('الرجاء إدخال أو اختيار عنوان.'); return; }

        setStatus('saving');
        const payload = {
            id: toId(finalTitleEn || finalTitleAr as string),
            category,
            title: { en: finalTitleEn, ar: finalTitleAr },
            city: { en: cityEn, ar: cityAr },
            description: { en: descEn || '', ar: descAr },
            imageUrl,
            isPending: publishStatus === 'draft',
            dateAdded: new Date().toISOString(),
        };

        // Specific push flow for Elite Tours to Headless WP simulation/sync
        if (category === 'elite_tours') {
            try {
                // If the user has a WP endpoint
                const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
                if (wpUrl && wpUrl !== '') {
                    // Just pushing async to the background
                    fetch(`${wpUrl}/wp-json/wp/v2/destinations`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.WP_CONTENT_TOKEN || ''}` },
                        body: JSON.stringify({
                            title: finalTitleEn,
                            status: 'publish',
                            acf: {
                                title_ar: finalTitleAr,
                                description_en: descEn,
                                description_ar: descAr,
                                image_url: imageUrl
                            }
                        })
                    }).catch(e => console.log('WP sync warning:', e));
                }
            } catch (err) {
                console.log('WP Sync failed', err);
            }
        }

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setStatus('success');
                fetchItems();
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                alert(`خطأ في الحفظ: ${result.message || 'فشل الاتصال بالسيرفر'}`);
            }
        } catch (err: any) {
            setStatus('error');
            alert(`حدث خطأ غير متوقع: ${err.message}`);
        }
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
                    <button form="editor-form" type="submit" disabled={status === 'saving' || !selectedEntityAr}
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
                    {/* Rich Toolbar (Targets Arabic editor for Moroccan local experience) */}
                    <RichToolbar
                        textareaRef={textareaArRef}
                        value={descAr}
                        onChange={setDescAr}
                        onImageUpload={url => setImageUrl(url)}
                    />

                    {/* Arabic Editor Only */}
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 flex flex-col overflow-hidden bg-[#060c18]">
                            <DragDropEditor
                                textareaRef={textareaArRef}
                                value={descAr}
                                onChange={setDescAr}
                                dir="rtl"
                                placeholder="اكتب الوصف العربي هنا... يمكنك سحب الصور وإفلاتها مباشرة."
                                label="البحث عن العظمة المغربية وكتابتها..."
                            />
                        </div>

                        {showEnglish && (
                            <div className="flex-1 flex flex-col overflow-hidden bg-[#0a192f] border-l border-[#c5a059]/20 animate-in slide-in-from-right duration-300">
                                <DragDropEditor
                                    textareaRef={textareaEnRef}
                                    value={descEn}
                                    onChange={setDescEn}
                                    dir="ltr"
                                    placeholder="English description will appear here..."
                                    label="English Content (Preview/Edit)"
                                />
                            </div>
                        )}
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

                            {/* ── Elite Tours: real-time search input ── */}
                            {category === 'elite_tours' ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={eliteSearchQuery || selectedEntityAr}
                                        onChange={e => {
                                            const v = e.target.value;
                                            setEliteSearchQuery(v);
                                            setSelectedEntityAr(v);
                                            setShowEliteDropdown(v.length >= 2);
                                        }}
                                        onFocus={() => eliteSearchQuery.length >= 2 && setShowEliteDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowEliteDropdown(false), 200)}
                                        placeholder="اكتب اسم الوجهة... (مر، قا، أج)"
                                        dir="rtl"
                                        className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none font-arabic mb-1"
                                    />
                                    {showEliteDropdown && (() => {
                                        const q = eliteSearchQuery.trim();
                                        const matches = CATEGORY_ENTITIES['elite_tours'].filter(
                                            e => e.ar.includes(q) || e.en.toLowerCase().includes(q.toLowerCase())
                                        );
                                        return matches.length > 0 ? (
                                            <div className="absolute z-30 top-full left-0 right-0 bg-[#0a192f] border border-[#c5a059]/30 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                                                {matches.map(m => (
                                                    <button key={m.en} type="button"
                                                        onMouseDown={() => {
                                                            // trigger full auto-fill via the existing handler
                                                            handleEntityChange({ target: { value: m.ar } } as React.ChangeEvent<HTMLSelectElement>);
                                                            setEliteSearchQuery(m.ar);
                                                            setShowEliteDropdown(false);
                                                        }}
                                                        className="w-full text-right px-3 py-2 text-sm hover:bg-[#112240] text-white font-arabic border-b border-[#c5a059]/10 last:border-0"
                                                    >
                                                        <div className="font-bold text-gold-royal">{m.ar}</div>
                                                        <div className="text-xs text-gray-500">{m.en}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : null;
                                    })()}
                                    {selectedEntityEn && (
                                        <div className="mt-1 text-xs text-gold-royal/50 text-left px-1">{selectedEntityEn}</div>
                                    )}
                                </div>
                            ) : (
                                /* ── Standard dropdown for other categories ── */
                                <>
                                    <select value={selectedEntityAr} onChange={handleEntityChange} required
                                        className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" dir="rtl">
                                        <option value="">— اختر العنصر —</option>
                                        {categoryEntities.map((c: BilingualEntry) => (
                                            <option key={c.en} value={c.ar}>{c.ar}</option>
                                        ))}
                                    </select>
                                    {selectedEntityEn && (
                                        <div className="mt-1 text-xs text-gold-royal/50 text-left px-1">{selectedEntityEn}</div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* City (for landmarks + battles) */}
                        {showCitySelector && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Associated City</label>
                                <select value={cityAr} onChange={handleCityChange}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" dir="rtl">
                                    <option value="">— اختياري —</option>
                                    {citiesEntities.map((c: BilingualEntry) => (
                                        <option key={c.en} value={c.ar}>{c.ar}</option>
                                    ))}
                                </select>
                                {cityEn && <div className="mt-1 text-xs text-gold-royal/50 text-left px-1">{cityEn}</div>}
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
                        <div className="border-t border-[#c5a059]/10 pt-4 space-y-3">
                            <button type="button" onClick={handleTranslate} disabled={isTranslating}
                                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-[#112240] text-gold-royal border border-gold-royal/30 hover:bg-gold-royal/10 transition-all flex items-center justify-center gap-2">
                                {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <div className="w-3 hot-3 border border-current rounded-full flex items-center justify-center text-[8px]">T</div>}
                                {isTranslating ? 'Translating...' : 'Translate to English'}
                            </button>

                            <button type="button" onClick={() => setShowEnglish(!showEnglish)}
                                className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${showEnglish ? 'bg-gold-royal text-white border-gold-royal' : 'bg-[#112240] text-gray-400 border-[#c5a059]/10'}`}>
                                <Eye className="w-3.5 h-3.5" /> {showEnglish ? 'Hide English' : 'Show English'}
                            </button>

                            <div className="text-xs text-gray-600 space-y-1 pt-2">
                                <div className="flex justify-between">
                                    <span>كلمات (AR)</span><span className="text-gray-400 font-bold">{descAr.trim().split(/\s+/).filter(Boolean).length}</span>
                                </div>
                                {showEnglish && (
                                    <div className="flex justify-between">
                                        <span>Words (EN)</span><span className="text-gray-400 font-bold">{descEn.trim().split(/\s+/).filter(Boolean).length}</span>
                                    </div>
                                )}
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

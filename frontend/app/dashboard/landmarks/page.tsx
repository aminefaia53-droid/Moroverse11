'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search, Save, Upload, Video, Globe, Tag, FileText,
    ImageOff, Loader2, CheckCircle, X, ChevronDown, ChevronUp,
    Film, MapPin, Calendar, BookOpen, Hash
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────
interface LandmarkEntry {
    id: string;
    name: { ar: string; en: string };
    city?: { ar: string; en: string };
    history?: { ar: string; en: string };
    foundation?: { ar: string; en: string };
    imageUrl?: string | null;
    videoUrl?: string | null;
    isPending?: boolean;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        slug?: string;
        altText?: string;
    };
}

interface SaveStatus { [id: string]: 'idle' | 'saving' | 'success' | 'error'; }

// ── Image Upload Helper ─────────────────────────────────────────
async function uploadImageFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.success ? data.url : null;
}

// ── Individual Landmark Card Editor ─────────────────────────────
function LandmarkEditor({ landmark, onSaved }: { landmark: LandmarkEntry; onSaved: (updated: LandmarkEntry) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState<LandmarkEntry>(landmark);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [uploadingImg, setUploadingImg] = useState(false);
    const imgInputRef = useRef<HTMLInputElement>(null);

    const set = (field: string, value: any) => setDraft(d => ({ ...d, [field]: value }));
    const setNested = (parent: string, field: string, value: string) =>
        setDraft(d => ({ ...d, [parent]: { ...(d as any)[parent], [field]: value } }));

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const url = await uploadImageFile(file);
            if (url) set('imageUrl', url);
        } catch { alert('رفع الصورة فشل'); }
        finally { setUploadingImg(false); }
    };

    const handleSave = async () => {
        setStatus('saving');
        // Save via existing content API which auto-pushes to GitHub
        try {
            const payload = {
                id: draft.id,
                category: 'landmarks',
                title: draft.name,
                city: draft.city,
                description: draft.history,
                imageUrl: draft.imageUrl,
                videoUrl: draft.videoUrl,
                foundation: draft.foundation,
                isPending: false,
                seo: draft.seo,
            };
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setStatus('success');
                onSaved(draft);
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="border border-[#c5a059]/20 rounded-xl bg-[#0a192f] overflow-hidden">
            {/* ── Header Row ── */}
            <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#112240]/60 transition-colors"
                onClick={() => setExpanded(e => !e)}
            >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#112240] shrink-0 relative border border-[#c5a059]/20">
                    {draft.imageUrl ? (
                        <img src={draft.imageUrl} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageOff className="w-5 h-5 text-gray-600" /></div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{draft.name.en || draft.name.ar}</div>
                    <div className="text-xs text-gray-500 font-arabic truncate">{draft.name.ar}</div>
                    {draft.city && <div className="text-[10px] text-gold-royal/60 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{draft.city.en}</div>}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {status === 'error' && <X className="w-4 h-4 text-red-400" />}
                    {!draft.imageUrl && <span className="text-[10px] bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">No Image</span>}
                    {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
            </div>

            {/* ── Expanded Editor ── */}
            {expanded && (
                <div className="border-t border-[#c5a059]/10 p-5 space-y-6">
                    {/* ── Section: Media ── */}
                    <div>
                        <h4 className="text-[10px] font-black text-gold-royal uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                            <Upload className="w-3 h-3" /> Media Management
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Cover Image */}
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5 block">صورة الواجهة (Cover Image)</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={draft.imageUrl || ''}
                                        onChange={e => set('imageUrl', e.target.value)}
                                        placeholder="https://... أو ارفع ملفاً"
                                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => imgInputRef.current?.click()}
                                        disabled={uploadingImg}
                                        className="px-3 py-2 rounded-lg bg-gold-royal/10 border border-gold-royal/30 text-gold-royal hover:bg-gold-royal/20 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
                                    >
                                        {uploadingImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                        رفع
                                    </button>
                                    <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </div>
                                {draft.imageUrl && (
                                    <div className="rounded-lg overflow-hidden aspect-video border border-[#c5a059]/20 relative">
                                        <img src={draft.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                        <button onClick={() => set('imageUrl', '')} className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5 block flex items-center gap-1.5">
                                    <Film className="w-3 h-3" /> فيديو المقال (YouTube / MP4)
                                </label>
                                <input
                                    value={draft.videoUrl || ''}
                                    onChange={e => set('videoUrl', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none mb-2"
                                />
                                {draft.videoUrl && (
                                    <div className="aspect-video rounded-lg overflow-hidden border border-[#c5a059]/20 bg-black">
                                        {draft.videoUrl.includes('youtube') || draft.videoUrl.includes('youtu.be') ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${draft.videoUrl.split('v=')[1]?.split('&')[0] || draft.videoUrl.split('/').pop()}`}
                                                className="w-full h-full"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video src={draft.videoUrl} controls className="w-full h-full" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Section: Data Identity ── */}
                    <div>
                        <h4 className="text-[10px] font-black text-gold-royal uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" /> Data Identity
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">الاسم (عربي)</label>
                                <input value={draft.name.ar} onChange={e => setNested('name', 'ar', e.target.value)}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" dir="rtl" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Name (English)</label>
                                <input value={draft.name.en} onChange={e => setNested('name', 'en', e.target.value)}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><Calendar className="w-3 h-3" /> تاريخ التأسيس</label>
                                <div className="flex gap-2">
                                    <input value={draft.foundation?.ar || ''} onChange={e => setNested('foundation', 'ar', e.target.value)}
                                        placeholder="عربي" dir="rtl"
                                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                    <input value={draft.foundation?.en || ''} onChange={e => setNested('foundation', 'en', e.target.value)}
                                        placeholder="English"
                                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> المدينة</label>
                                <div className="flex gap-2">
                                    <input value={draft.city?.ar || ''} onChange={e => setNested('city', 'ar', e.target.value)}
                                        placeholder="عربي" dir="rtl"
                                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                    <input value={draft.city?.en || ''} onChange={e => setNested('city', 'en', e.target.value)}
                                        placeholder="English"
                                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">الملخص التاريخي (عربي)</label>
                                <textarea value={draft.history?.ar || ''} onChange={e => setNested('history', 'ar', e.target.value)}
                                    rows={3} dir="rtl"
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none resize-none font-arabic" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Historical Summary (English)</label>
                                <textarea value={draft.history?.en || ''} onChange={e => setNested('history', 'en', e.target.value)}
                                    rows={3}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* ── Section: SEO ── */}
                    <div>
                        <h4 className="text-[10px] font-black text-gold-royal uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> SEO Settings (Blogger-Style)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <Tag className="w-3 h-3" /> Meta Title
                                </label>
                                <input
                                    value={draft.seo?.metaTitle || ''}
                                    onChange={e => set('seo', { ...draft.seo, metaTitle: e.target.value })}
                                    placeholder="عنوان الصفحة لمحركات البحث — 60 حرفاً مثالياً"
                                    maxLength={70}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none"
                                />
                                <div className="text-[10px] text-gray-600 mt-1 text-right">{(draft.seo?.metaTitle || '').length}/70</div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <FileText className="w-3 h-3" /> Meta Description
                                </label>
                                <textarea
                                    value={draft.seo?.metaDescription || ''}
                                    onChange={e => set('seo', { ...draft.seo, metaDescription: e.target.value })}
                                    placeholder="وصف مختصر يظهر في نتائج جوجل — 160 حرفاً مثالياً"
                                    maxLength={165}
                                    rows={2}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none resize-none"
                                />
                                <div className="text-[10px] text-gray-600 mt-1 text-right">{(draft.seo?.metaDescription || '').length}/165</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" /> Custom Slug (URL)
                                </label>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-gray-600 shrink-0">/heritage/</span>
                                    <input
                                        value={draft.seo?.slug || draft.id}
                                        onChange={e => set('seo', { ...draft.seo, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                        placeholder="hassan-tower"
                                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Alt Text (Image SEO)</label>
                                <input
                                    value={draft.seo?.altText || ''}
                                    onChange={e => set('seo', { ...draft.seo, altText: e.target.value })}
                                    placeholder="صورة لصومعة حسان في الرباط، المغرب"
                                    className="w-full text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Save Button ── */}
                    <div className="flex justify-end pt-2 border-t border-[#c5a059]/10">
                        <button
                            onClick={handleSave}
                            disabled={status === 'saving'}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-royal hover:bg-yellow-500 text-black font-black text-sm transition-all shadow-lg disabled:opacity-50"
                        >
                            {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {status === 'saving' ? 'جارٍ الحفظ والرفع...' : status === 'success' ? '✓ تم الحفظ' : 'حفظ ورفع للموقع الحي'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Landmark Manager Page ─────────────────────────────────
export default function LandmarkManagerPage() {
    const [landmarks, setLandmarks] = useState<LandmarkEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const loadLandmarks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/content');
            const data = await res.json();
            if (data.success && data.data?.landmarks) {
                setLandmarks(data.data.landmarks);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadLandmarks(); }, [loadLandmarks]);

    const handleSaved = (updated: LandmarkEntry) => {
        setLandmarks(prev => prev.map(lm => lm.id === updated.id ? updated : lm));
    };

    const cities = Array.from(new Set(landmarks.map(l => l.city?.en).filter(Boolean)));
    const filtered = landmarks.filter(lm => {
        const matchSearch = !search ||
            lm.name.en.toLowerCase().includes(search.toLowerCase()) ||
            lm.name.ar.includes(search);
        const matchCity = !cityFilter || lm.city?.en === cityFilter;
        return matchSearch && matchCity;
    });

    const withImage = landmarks.filter(l => l.imageUrl).length;

    return (
        <div className="min-h-screen bg-[#050d1a] text-white font-outfit" dir="ltr">
            {/* ── Header ── */}
            <div className="sticky top-0 z-50 bg-[#0a192f] border-b border-[#c5a059]/30 px-6 py-4 shadow-xl">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-white font-cinzel">🗂 Landmark Manager</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {loading ? 'Loading...' : `${filtered.length} landmarks · ${withImage}/${landmarks.length} with images`}
                        </p>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search landmarks..."
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none"
                            />
                        </div>
                        <select
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                            className="text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none"
                        >
                            <option value="">All Cities</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total Landmarks', value: landmarks.length, color: 'text-white' },
                        { label: 'With Images', value: withImage, color: 'text-green-400' },
                        { label: 'Missing Images', value: landmarks.length - withImage, color: 'text-red-400' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-[#0a192f] rounded-xl p-4 border border-[#c5a059]/10 text-center">
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Landmark List ── */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold-royal" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-600">No landmarks found.</div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(lm => (
                            <LandmarkEditor key={lm.id} landmark={lm} onSaved={handleSaved} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search, Save, Upload, Video, Globe, Tag, FileText,
    ImageOff, Loader2, CheckCircle, X, ChevronDown, ChevronUp,
    Film, MapPin, Calendar, BookOpen, Hash, Building2, Box, AlertTriangle
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

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
    modelUrl?: string | null;
    location_type?: string;
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

// ── 3D Asset Upload Helper (GLB) ── SIGNED URL PATTERN ──────────────
// STEP 1: Ask the server for a pre-signed Supabase upload URL (tiny, no file)
// STEP 2: Browser uploads the GLB DIRECTLY to Supabase via XHR using that URL
// This bypasses Vercel's 4.5MB limit AND all RLS authentication issues.
async function uploadAssetToSupabase(
    file: File,
    onProgress?: (percent: number) => void
): Promise<{ url: string | null; error: string | null }> {

    // Step 1: Get a pre-signed upload URL from our server (admin-verified server-side)
    let signedUrl: string;
    let publicUrl: string;
    try {
        const res = await fetch('/api/admin/assets/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name }),
        });
        const data = await res.json();
        if (!res.ok || !data.success || !data.signedUrl) {
            return { url: null, error: data.message || 'Failed to generate signed upload URL from server.' };
        }
        signedUrl = data.signedUrl;
        publicUrl = data.publicUrl;
    } catch (e: any) {
        return { url: null, error: `Server error: ${e.message}` };
    }

    // Step 2: Upload directly to Supabase using the signed URL (XHR for progress tracking)
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve({ url: publicUrl, error: null });
            } else {
                let errMsg = `Upload failed: HTTP ${xhr.status}`;
                try {
                    const resp = JSON.parse(xhr.responseText);
                    errMsg = resp.message || resp.error || errMsg;
                } catch {}
                resolve({ url: null, error: errMsg });
            }
        });

        xhr.addEventListener('error', () => {
            resolve({ url: null, error: 'Network error during upload. Check your connection and try again.' });
        });

        // PUT to the signed URL — no Authorization header needed, the signature is in the URL
        xhr.open('PUT', signedUrl);
        xhr.setRequestHeader('Content-Type', file.type || 'model/gltf-binary');
        xhr.send(file);
    });
}

// ── Individual Landmark Card Editor ─────────────────────────────
function LandmarkEditor({ landmark, onSaved }: { landmark: LandmarkEntry; onSaved: (updated: LandmarkEntry) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState<LandmarkEntry>(landmark);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [serverMessage, setServerMessage] = useState('');
    const [uploadingImg, setUploadingImg] = useState(false);
    const [uploadingAsset, setUploadingAsset] = useState(false);
    const [assetUploadProgress, setAssetUploadProgress] = useState(0);
    const [assetUploadError, setAssetUploadError] = useState<string | null>(null);
    const imgInputRef = useRef<HTMLInputElement>(null);
    const assetInputRef = useRef<HTMLInputElement>(null);

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

    const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.glb')) {
            setAssetUploadError('يدعم فقط صيغة .glb — Only .glb files are supported');
            return;
        }

        setUploadingAsset(true);
        setAssetUploadProgress(0);
        setAssetUploadError(null);

        const { url, error } = await uploadAssetToSupabase(file, (percent) => {
            setAssetUploadProgress(percent);
        });

        if (url) {
            set('modelUrl', url);
            set('location_type', 'monument');
            setAssetUploadProgress(100);
        } else {
            setAssetUploadError(error || 'فشل رفع العنصر ثلاثي الأبعاد');
        }

        setUploadingAsset(false);
        // Reset file input so the same file can be re-uploaded if needed
        if (assetInputRef.current) assetInputRef.current.value = '';
    };

    const handleSave = async () => {
        setStatus('saving');
        setServerMessage('');
        try {
            // Call the dedicated /api/update-content endpoint which auto-pushes to GitHub
            const res = await fetch('/api/update-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: draft.id,
                    category: 'landmarks',
                    landmark: draft,
                }),
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setStatus('success');
                setServerMessage(result.message);
                onSaved(draft);
                // Keep success message visible — don't auto-reset until user clicks again
            } else {
                setStatus('error');
                setServerMessage(result.message || 'فشل الحفظ — تحقق من GITHUB_TOKEN في Vercel.');
            }
        } catch (err: any) {
            setStatus('error');
            setServerMessage(`خطأ غير متوقع: ${err.message}`);
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
                            </div>
                        </div>

                        {/* ── 3D Asset Management (Elite View) ── */}
                        <div className="mt-4 pt-4 border-t border-[#c5a059]/10">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5 block flex items-center gap-1.5">
                                <Box className="w-3.5 h-3.5 text-gold-royal" /> المجسم ثلاثي الأبعاد (Elite 3D Asset - .glb)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    value={draft.modelUrl || ''}
                                    onChange={e => {
                                        set('modelUrl', e.target.value);
                                        if (e.target.value) set('location_type', 'monument');
                                    }}
                                    placeholder="https://... GLB URL"
                                    className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setAssetUploadError(null); assetInputRef.current?.click(); }}
                                    disabled={uploadingAsset}
                                    className="px-4 py-2 rounded-lg bg-gold-royal text-black hover:bg-yellow-500 transition-colors flex items-center gap-2 text-xs font-black shrink-0 shadow-lg disabled:opacity-60"
                                >
                                    {uploadingAsset ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                    {uploadingAsset ? `${assetUploadProgress}%` : 'رفع GLB'}
                                </button>
                                <input ref={assetInputRef} type="file" accept=".glb" className="hidden" onChange={handleAssetUpload} />
                            </div>

                            {/* Upload Progress Bar */}
                            {uploadingAsset && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                                        <span>جاري الرفع إلى Supabase Storage...</span>
                                        <span className="font-bold text-gold-royal">{assetUploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-[#112240] rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#c5a059] to-yellow-300 transition-all duration-300 rounded-full"
                                            style={{ width: `${assetUploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-500 mt-1">⚡ يتم الرفع مباشرة — لا حد للحجم (Bypass Vercel Limit)</p>
                                </div>
                            )}

                            {/* Upload Error */}
                            {assetUploadError && (
                                <div className="mt-2 p-2 rounded-lg bg-red-900/30 border border-red-500/30 flex items-start gap-2">
                                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-red-300">{assetUploadError}</p>
                                </div>
                            )}

                            {/* Linked Model URL */}
                            {draft.modelUrl && !uploadingAsset && (
                                <div className="mt-2 p-2 rounded-lg bg-gold-royal/5 border border-gold-royal/20 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] text-gold-royal truncate">
                                        <CheckCircle className="w-3 h-3" /> Asset Linked: {draft.modelUrl.split('/').pop()}
                                    </div>
                                    <button onClick={() => { set('modelUrl', ''); set('location_type', 'city'); setAssetUploadProgress(0); }} className="text-red-400 hover:text-red-300 p-1">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
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

                    {/* ── Save Button + Server Message ── */}
                    <div className="flex flex-col gap-3 pt-2 border-t border-[#c5a059]/10">
                        {/* Server Message Banner */}
                        {serverMessage && (
                            <div className={`w-full rounded-xl px-4 py-3 text-sm font-bold flex items-center gap-2 ${status === 'success'
                                    ? 'bg-green-900/40 border border-green-500/40 text-green-300'
                                    : 'bg-red-900/40 border border-red-500/40 text-red-300'
                                }`} dir="rtl">
                                {status === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                                {serverMessage}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={status === 'saving'}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-royal hover:bg-yellow-500 text-black font-black text-sm transition-all shadow-lg disabled:opacity-50"
                            >
                                {status === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {status === 'saving' ? 'جارٍ الحفظ والرفع...' : status === 'success' ? '✓ تم — حفظ مرة أخرى' : 'حفظ ورفع للموقع الحي'}
                            </button>
                        </div>
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

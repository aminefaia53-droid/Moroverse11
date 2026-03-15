'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search, Save, Upload, Video, Globe, Tag, FileText, Play,
    ImageOff, Loader2, CheckCircle, X, ChevronDown, ChevronUp,
    Film, MapPin, Calendar, BookOpen, Hash, Swords, Building2, Landmark, Users, Box
} from 'lucide-react';
import { createClient as createBrowserClient } from '@/utils/supabase/client';

// ── Types ──────────────────────────────────────────────────────
type CategoryType = 'cities' | 'landmarks' | 'battles' | 'figures';

interface EntityEntry {
    id: string;
    name: { ar: string; en: string };

    // Shared / Varying
    history?: { ar: string; en: string }; // For cities/landmarks/figures
    desc?: { ar: string; en: string }; // For battles
    imageUrl?: string | null;
    videoUrl?: string | null;
    modelUrl?: string | null;
    isPending?: boolean;
    location_type?: string;

    // Landmark specific
    city?: { ar: string; en: string };
    foundation?: { ar: string; en: string };

    // City specific
    regionName?: { ar: string; en: string };
    type?: string;
    climate?: string;

    // Battle specific
    location?: { ar: string; en: string };
    era?: string;
    year?: string;
    dynasty?: string;
    combatants?: { ar: string; en: string };
    leaders?: { ar: string; en: string };
    tactics?: { ar: string; en: string };
    outcome?: { ar: string; en: string };
    impact?: { ar: string; en: string };

    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        slug?: string;
        altText?: string;
    };
    visualSoul?: string;
}

interface DBData {
    cities: EntityEntry[];
    landmarks: EntityEntry[];
    battles: EntityEntry[];
    figures: EntityEntry[];
}

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
            credentials: 'include', // Ensure session cookies are sent
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
            if (xhr.status === 200 || xhr.status === 201) {
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

// ── Individual Entity Editor ─────────────────────────────
function EntityEditor({ entity, category, onSaved }: { entity: EntityEntry; category: CategoryType, onSaved: (updated: EntityEntry, cat: CategoryType) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState<EntityEntry>(entity);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [serverMessage, setServerMessage] = useState('');
    const [uploadingImg, setUploadingImg] = useState(false);
    const [uploadingAsset, setUploadingAsset] = useState(false);
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
        } catch { alert('Image upload failed / رفع الصورة فشل'); }
        finally { setUploadingImg(false); }
    };

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation for .glb
        if (!file.name.toLowerCase().endsWith('.glb')) {
            alert('Invalid file type. Only .glb assets are supported / يدعم فقط صيغة .glb');
            return;
        }

        setUploadingAsset(true);
        setUploadProgress(0);
        setStatus('saving');
        setServerMessage('Preparing signed upload URL...');
        
        try {
            // Using Signed URL pattern to bypass Vercel limits and fix auth issues
            const result = await uploadAssetToSupabase(file, (percent) => {
                setUploadProgress(percent);
                setServerMessage(`Uploading: ${percent}% ...`);
            });
            
            if (!result.error && result.url) {
                set('modelUrl', result.url);
                set('location_type', 'monument'); // Auto-tag as monument for 3D activation
                setStatus('success');
                setServerMessage('3D Asset uploaded and synced to Supabase ✓');
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err: any) { 
            console.error('3D Upload Error:', err);
            setStatus('error');
            setServerMessage(`3D upload failed: ${err.message}`);
            alert(`3D asset upload failed: ${err.message}`); 
        }
        finally { 
            setUploadingAsset(false);
            setUploadProgress(0);
        }
    };

    const handleSave = async () => {
        setStatus('saving');
        setServerMessage('');
        try {
            const res = await fetch('/api/update-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: draft.id,
                    category: category,
                    landmark: draft, // Using 'landmark' payload name for backward compatibility in the API
                }),
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setStatus('success');
                setServerMessage(result.message);
                onSaved(draft, category);
            } else {
                setStatus('error');
                setServerMessage(result.message || 'Save failed / فشل الحفظ');
            }
        } catch (err: any) {
            setStatus('error');
            setServerMessage(`Unexpected error / خطأ غير متوقع: ${err.message}`);
        }
    };

    return (
        <div className="border border-[#c5a059]/20 rounded-xl bg-[#0a192f] overflow-hidden">
            {/* ── Header Row ── */}
            <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#112240]/60 transition-colors"
                onClick={() => setExpanded(e => !e)}
            >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#112240] shrink-0 relative border border-[#c5a059]/20">
                    {draft.imageUrl ? (
                        <img src={draft.imageUrl} alt="" className="w-full h-full object-cover object-center transition-transform duration-300 ease-out" onError={e => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageOff className="w-5 h-5 text-gray-600" /></div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{draft.name?.en || draft.name?.ar}</div>
                    <div className="text-xs text-gray-500 font-arabic truncate">{draft.name?.ar}</div>
                    {draft.city && <div className="text-[10px] text-gold-royal/60 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{draft.city.en}</div>}
                    {draft.regionName && <div className="text-[10px] text-gold-royal/60 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{draft.regionName.en}</div>}
                    {draft.year && <div className="text-[10px] text-gold-royal/60 flex items-center gap-1 mt-0.5"><Calendar className="w-2.5 h-2.5" />{draft.year} {draft.era && `— ${draft.era}`}</div>}
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
                                    <div className="rounded-lg overflow-hidden aspect-[16/9] border border-[#c5a059]/20 relative">
                                        <img src={draft.imageUrl} alt="Cover" className="w-full h-full object-cover object-center transition-transform duration-300 ease-out" />
                                        <button onClick={() => set('imageUrl', '')} className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5 block flex items-center gap-1.5">
                                    <Film className="w-3.5 h-3.5 text-red-400" /> فيديو وثائقي (Video URL)
                                </label>
                                <input
                                    value={draft.videoUrl || ''}
                                    onChange={e => set('videoUrl', e.target.value)}
                                    placeholder="https://youtube.com/... أو https://vimeo.com/..."
                                    className="w-full text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none"
                                />
                                {draft.videoUrl && (
                                    <div className="mt-2 p-2 rounded-lg bg-red-900/10 border border-red-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-red-400 truncate">
                                            <Play className="w-3 h-3" /> Video Linked: {draft.videoUrl.substring(0, 50)}...
                                        </div>
                                        <button onClick={() => set('videoUrl', '')} className="text-red-400 hover:text-red-300 p-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                        {/* ── 3D Asset Management (Elite View) ── */}
                        {(category === 'landmarks' || category === 'cities') && (
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
                                        onClick={() => assetInputRef.current?.click()}
                                        className="px-4 py-2 rounded-lg bg-gold-royal text-black hover:bg-yellow-500 transition-colors flex items-center gap-2 text-xs font-black shrink-0 shadow-lg disabled:opacity-50"
                                    >
                                        {uploadingAsset ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                        {uploadingAsset ? `جاري الرفع ${uploadProgress}%...` : 'رفع GLB'}
                                    </button>
                                    <input ref={assetInputRef} type="file" accept=".glb" className="hidden" onChange={handleAssetUpload} />
                                </div>
                                {draft.modelUrl && (
                                    <div className="mt-2 p-2 rounded-lg bg-gold-royal/5 border border-gold-royal/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] text-gold-royal truncate">
                                            <CheckCircle className="w-3 h-3" /> Asset Linked: {draft.modelUrl.split('/').pop()}
                                        </div>
                                        <button onClick={() => { set('modelUrl', ''); set('location_type', 'city'); }} className="text-red-400 hover:text-red-300 p-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* ── Section: Data Identity ── */}
                    <div>
                        <h4 className="text-[10px] font-black text-gold-royal uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" /> Data Identity ({category})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">الاسم (عربي)</label>
                                <input value={draft.name?.ar || ''} onChange={e => setNested('name', 'ar', e.target.value)}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" dir="rtl" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Name (English)</label>
                                <input value={draft.name?.en || ''} onChange={e => setNested('name', 'en', e.target.value)}
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                            </div>

                            {/* Category Specific Fields */}

                            {/* Landmarks */}
                            {category === 'landmarks' && (
                                <>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><Calendar className="w-3 h-3" /> تاريخ التأسيس</label>
                                        <div className="flex gap-2">
                                            <input value={draft.foundation?.ar || ''} onChange={e => setNested('foundation', 'ar', e.target.value)} placeholder="عربي" dir="rtl" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                            <input value={draft.foundation?.en || ''} onChange={e => setNested('foundation', 'en', e.target.value)} placeholder="English" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> المدينة</label>
                                        <div className="flex gap-2">
                                            <input value={draft.city?.ar || ''} onChange={e => setNested('city', 'ar', e.target.value)} placeholder="عربي" dir="rtl" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                            <input value={draft.city?.en || ''} onChange={e => setNested('city', 'en', e.target.value)} placeholder="English" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Cities */}
                            {category === 'cities' && (
                                <>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> الجهة (Region)</label>
                                        <div className="flex gap-2">
                                            <input value={draft.regionName?.ar || ''} onChange={e => setNested('regionName', 'ar', e.target.value)} placeholder="عربي" dir="rtl" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                            <input value={draft.regionName?.en || ''} onChange={e => setNested('regionName', 'en', e.target.value)} placeholder="English" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"> نوع المدينة</label>
                                        <input value={draft.type || ''} onChange={e => set('type', e.target.value)} placeholder="Major City" className="w-full text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                    </div>
                                </>
                            )}

                            {/* Battles */}
                            {category === 'battles' && (
                                <>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><Calendar className="w-3 h-3" /> السنه و العصر (Year & Era)</label>
                                        <div className="flex gap-2">
                                            <input value={draft.year || ''} onChange={e => set('year', e.target.value)} placeholder="1578" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                            <input value={draft.era || ''} onChange={e => set('era', e.target.value)} placeholder="Imperial" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block flex items-center gap-1.5"><MapPin className="w-3 h-3" /> الموقع</label>
                                        <div className="flex gap-2">
                                            <input value={draft.location?.ar || ''} onChange={e => setNested('location', 'ar', e.target.value)} placeholder="عربي" dir="rtl" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none font-arabic" />
                                            <input value={draft.location?.en || ''} onChange={e => setNested('location', 'en', e.target.value)} placeholder="English" className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Description / History */}
                            <div className="md:col-span-2 mt-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">الملخص التاريخي (عربي)</label>
                                <textarea value={(category === 'battles' ? draft.desc?.ar : draft.history?.ar) || ''} onChange={e => setNested(category === 'battles' ? 'desc' : 'history', 'ar', e.target.value)}
                                    rows={3} dir="rtl"
                                    className="w-full text-sm px-3 py-2 rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white focus:ring-1 focus:ring-gold-royal outline-none resize-none font-arabic" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 block">Historical Summary (English)</label>
                                <textarea value={(category === 'battles' ? draft.desc?.en : draft.history?.en) || ''} onChange={e => setNested(category === 'battles' ? 'desc' : 'history', 'en', e.target.value)}
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
                        {serverMessage && (
                            <div className={`w-full rounded-xl px-4 py-3 text-sm font-bold flex items-center gap-2 ${status === 'success' ? 'bg-green-900/40 border border-green-500/40 text-green-300' : 'bg-red-900/40 border border-red-500/40 text-red-300'}`} dir="rtl">
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

// ── Main Content Manager Page ─────────────────────────────────
export default function ContentManagerPage() {
    const [dbData, setDbData] = useState<DBData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<CategoryType>('cities');
    const [search, setSearch] = useState('');

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/content');
            const data = await res.json();
            if (data.success && data.data) {
                setDbData(data.data as DBData);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleSaved = (updated: EntityEntry, category: CategoryType) => {
        setDbData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [category]: (prev[category] || []).map((item: any) => item.id === updated.id ? updated : item)
            };
        });
    };

    const currentList = dbData ? (dbData[activeTab] || []) : [];

    const filtered = currentList.filter((entry: EntityEntry) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return entry.name?.en?.toLowerCase().includes(q) || entry.name?.ar?.includes(q) || entry.id?.toLowerCase().includes(q);
    });

    const withImage = filtered.filter((l: any) => l.imageUrl).length;

    const tabs: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
        { id: 'cities', label: 'Cities', icon: <Building2 className="w-4 h-4" /> },
        { id: 'landmarks', label: 'Landmarks', icon: <Landmark className="w-4 h-4" /> },
        { id: 'battles', label: 'Elite Battles', icon: <Swords className="w-4 h-4" /> },
        { id: 'figures', label: 'Historical Figures', icon: <Users className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#050d1a] text-white font-outfit" dir="ltr">
            {/* ── Header ── */}
            <div className="sticky top-0 z-50 bg-[#0a192f] border-b border-[#c5a059]/30 shadow-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-white font-cinzel text-gold-royal">👑 Content Manager</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {loading ? 'Loading...' : `${filtered.length} entries · ${withImage}/${filtered.length} with images`}
                        </p>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or id..."
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-[#112240] border border-[#c5a059]/20 text-white placeholder-gray-600 focus:ring-1 focus:ring-gold-royal outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="max-w-6xl mx-auto px-6 flex gap-2 overflow-x-auto no-scrollbar pb-[-1px]">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-gold-royal text-gold-royal bg-gold-royal/5'
                                    : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Area ── */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold-royal" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 border border-dashed border-gray-700 rounded-xl">
                        No {activeTab} found matching "{search}".
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((entry: EntityEntry) => (
                            <EntityEditor key={entry.id} entity={entry} category={activeTab} onSaved={handleSaved} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

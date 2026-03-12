"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { createClient } from "../../utils/supabase/client";
import SmartSidebar from "../../components/SmartSidebar";
import MoroVerseLogo from "../../components/MoroVerseLogo";

export default function ProfilePage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const supabase = createClient();
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        username: "",
        full_name: "",
        bio: "",
        website: "",
        avatar_url: ""
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setProfile({
                        username: data.username || "",
                        full_name: data.full_name || "",
                        bio: data.bio || "",
                        website: data.website || "",
                        avatar_url: data.avatar_url || ""
                    });
                }
            } catch (err) {
                console.error("Error loading profile", err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [router, supabase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploadingAvatar(true);
        setError(null);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `avatar-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('community-media')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('community-media')
                .getPublicUrl(filePath);

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            
            // Auto save avatar
            await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error(err);
            setError(isAr ? 'فشل رفع الصورة.' : 'Avatar upload failed.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username: profile.username || user.email?.split('@')[0],
                    full_name: profile.full_name,
                    bio: profile.bio,
                    website: profile.website,
                    avatar_url: profile.avatar_url,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error(err);
            setError(isAr ? 'فشل في حفظ البيانات.' : 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen bg-[#050505] flex items-center justify-center`}>
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${isAr ? 'font-arabic' : 'font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }} />
            
            <header className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center bg-black/80 backdrop-blur-sm border-b border-[#C5A059]/10">
                <a href={`/?lang=${lang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <MoroVerseLogo className="w-6 h-6" />
                    <h1 className="font-display text-xs tracking-[0.6em] text-white/70 font-medium uppercase hidden md:block" style={{ letterSpacing: '0.6em' }}>MOROVERSE</h1>
                </a>
                <SmartSidebar isHeaderTrigger={true} />
            </header>
            <SmartSidebar isHeaderTrigger={false} />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-2xl mx-auto min-h-screen relative z-10">
                <div className="mb-8">
                    <button onClick={() => router.push('/community')} className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] transition-colors font-medium text-sm mb-6">
                        <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                        {isAr ? 'العودة للمجتمع' : 'Back to Community'}
                    </button>
                    <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold tracking-wider mb-2">
                        {isAr ? 'الملف الشخصي' : 'Your Profile'}
                    </h1>
                    <p className="text-white/50 text-sm">
                        {isAr ? 'قم بتحديث معلوماتك ليتمكن الآخرون من التعرف إليك' : 'Update your information so others can recognize you'}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pb-8 border-b border-white/10">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4 shrink-0 mx-auto md:mx-0">
                            <div className="relative group w-32 h-32 rounded-full border-2 border-[#C5A059]/50 overflow-hidden bg-black/50">
                                <img 
                                    src={profile.avatar_url || "https://i.pravatar.cc/150?img=68"} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                />
                                <div 
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                                >
                                    {uploadingAvatar ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : (
                                        <>
                                            <Camera className="w-6 h-6 text-white mb-1" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-white">{isAr ? 'تغيير الصورة' : 'Change'}</span>
                                        </>
                                    )}
                                </div>
                                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </div>
                            <span className="text-xs text-white/40">{isAr ? 'صورة بحجم أقل من 2 ميغابايت' : 'JPG/PNG under 2MB'}</span>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                                <input 
                                    type="text" 
                                    name="full_name"
                                    value={profile.full_name}
                                    onChange={handleChange}
                                    placeholder={isAr ? "مثال: أمين بنيس" : "e.g. Amine Bennis"}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C5A059]/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">{isAr ? 'اسم المستخدم (فريد)' : 'Username (Unique)'}</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={profile.username}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C5A059]/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">{isAr ? 'نبذة عنك' : 'Bio'}</label>
                            <textarea 
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder={isAr ? "حدثنا عن شغفك بالتراث المغربي..." : "Tell us about your passion for Moroccan heritage..."}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C5A059]/50 transition-colors min-h-[120px] resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">{isAr ? 'رابط الموقع المدونة' : 'Website / Blog Link'}</label>
                            <input 
                                type="url" 
                                name="website"
                                value={profile.website}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C5A059]/50 transition-colors"
                            />
                        </div>

                        {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">{error}</div>}
                        {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">{isAr ? 'تم حفظ التغييرات بنجاح!' : 'Profile saved successfully!'}</div>}

                        <button 
                            type="submit" 
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#A38347] text-black font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

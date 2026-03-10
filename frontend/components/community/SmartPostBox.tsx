"use client";

import React, { useState, useRef } from "react";
import { Camera, MapPin, Send, X, Loader2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { createClient } from "../../utils/supabase/client";
import { ALL_CITIES, LANDMARKS } from "../../data/morocco-geo";

interface SmartPostBoxProps {
    onPostCreated?: () => void;
    selectedCityId?: string | null;
}

export default function SmartPostBox({ onPostCreated, selectedCityId }: SmartPostBoxProps) {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const supabase = createClient();
    const fileRef = useRef<HTMLInputElement>(null);

    const [content, setContent] = useState("");
    const [cityId, setCityId] = useState(selectedCityId || "");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        // Store URL as data URL (for demo since we don't have Supabase Storage configured yet)
        // In production, upload to Supabase Storage and store the public URL
        setImageUrl(URL.createObjectURL(file));
    };

    const handlePost = async () => {
        if (!content.trim()) return;
        setPosting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError(isAr ? 'يجب تسجيل الدخول أولاً.' : 'You must be logged in to post.');
                setPosting(false);
                return;
            }

            const selectedCity = ALL_CITIES.find(c => c.id === cityId);
            const cityName = selectedCity ? (isAr ? selectedCity.nameAr : selectedCity.name) : cityId;

            const { error: insertError } = await supabase.from('posts').insert({
                user_id: user.id,
                content: content.trim(),
                city_id: cityId || null,
                image_url: imagePreview || null, // Use preview as data URL for now
                likes_count: 0,
                comments_count: 0,
            });

            if (insertError) throw insertError;

            setContent("");
            setCityId(selectedCityId || "");
            setImagePreview(null);
            setImageUrl("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            onPostCreated?.();
        } catch (err: any) {
            console.error(err);
            setError(isAr ? 'حدث خطأ أثناء النشر.' : 'Error creating post.');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl mb-6">
            <div className="flex gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-[#C5A059]/50 bg-[#C5A059]/10 flex items-center justify-center">
                    <span className="text-[#C5A059] text-lg font-bold">👤</span>
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={isAr ? "شارك تجربتك، نصيحة، أو صورة من زيارتك..." : "Share your experience, tip, or photo from Morocco..."}
                        className="w-full bg-transparent text-white/90 placeholder-white/30 resize-none outline-none min-h-[80px] text-base leading-relaxed"
                        maxLength={500}
                    />

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="relative mb-3 rounded-xl overflow-hidden border border-white/10">
                            <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover" />
                            <button
                                onClick={() => { setImagePreview(null); setImageUrl(""); }}
                                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Error / Success */}
                    {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
                    {success && <p className="text-green-400 text-xs mb-2">{isAr ? '✅ تم النشر بنجاح!' : '✅ Posted successfully!'}</p>}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Image upload */}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-1.5 text-white/50 hover:text-[#C5A059] transition-colors py-1.5 px-3 rounded-xl hover:bg-white/5 text-sm"
                            >
                                <Camera className="w-4 h-4" />
                                <span>{isAr ? 'صورة' : 'Photo'}</span>
                            </button>

                            {/* City selector */}
                            <div className="flex items-center gap-1.5 text-[#C5A059] py-1 px-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <select
                                    value={cityId}
                                    onChange={(e) => setCityId(e.target.value)}
                                    className="bg-transparent outline-none text-xs text-[#C5A059] max-w-[110px]"
                                >
                                    <option value="">{isAr ? 'اختر المدينة' : 'Select city'}</option>
                                    {ALL_CITIES.map(city => (
                                        <option key={city.id} value={city.id} className="bg-black text-white">
                                            {isAr ? city.nameAr : city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-white/20 text-xs">{content.length}/500</span>
                            <button
                                onClick={handlePost}
                                disabled={!content.trim() || posting}
                                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A38347] text-black font-bold py-2 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {posting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                                )}
                                {isAr ? 'نشر' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

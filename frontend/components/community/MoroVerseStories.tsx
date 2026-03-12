"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { createClient } from "../../utils/supabase/client";

interface Story {
    id: string;
    user_id: string;
    media_url: string;
    created_at: string;
    profiles: {
        username: string;
        full_name: string;
        avatar_url: string;
    };
}

export default function MoroVerseStories() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const supabase = createClient();
    
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchStories = async () => {
        try {
            const { data, error } = await supabase
                .from('stories')
                .select(`
                    id, user_id, media_url, created_at,
                    profiles (username, full_name, avatar_url)
                `)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Group by user, or just show latest. For simplicity, we just list them.
                setStories(data as any);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, [supabase]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert(isAr ? 'يجب تسجيل الدخول لنشر قصة.' : 'You must be logged in to post a story.');
                setUploading(false);
                return;
            }

            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
                .from('community-media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('community-media')
                .getPublicUrl(filePath);

            // 2. Insert to Database
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);

            const { error: dbError } = await supabase.from('stories').insert({
                user_id: user.id,
                media_url: publicUrl,
                expires_at: expiresAt.toISOString()
            });

            if (dbError) throw dbError;

            alert(isAr ? 'تم نشر القصة!' : 'Story published!');
            fetchStories();
        } catch (error) {
            console.error("Story upload error", error);
            alert(isAr ? 'حدث خطأ أثناء الرفع.' : 'Error uploading story.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-6 relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {/* Upload Button */}
                <div className="flex flex-col items-center gap-2 shrink-0 snap-start">
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className="w-16 h-16 rounded-full border-2 border-dashed border-[#C5A059]/50 flex items-center justify-center cursor-pointer hover:bg-[#C5A059]/10 transition-colors relative"
                    >
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Plus className="text-[#C5A059] w-6 h-6" />
                        )}
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUpload} />
                    </div>
                    <span className="text-[10px] text-white/60 font-medium">{isAr ? 'إضافة قصة' : 'Add Story'}</span>
                </div>

                {/* Stories List */}
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
                            <div className="w-12 h-2 bg-white/5 animate-pulse rounded" />
                        </div>
                    ))
                ) : (
                    stories.map(story => (
                        <div key={story.id} className="flex flex-col items-center gap-2 shrink-0 snap-start cursor-pointer group" onClick={() => setActiveStory(story)}>
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#C5A059] to-[#E5D089] transition-transform group-hover:scale-105">
                                <img 
                                    src={story.profiles?.avatar_url || "https://i.pravatar.cc/150"} 
                                    alt={story.profiles?.username} 
                                    className="w-full h-full rounded-full border-2 border-black object-cover"
                                />
                            </div>
                            <span className="text-[10px] text-white/80 font-medium truncate w-16 text-center">
                                {story.profiles?.full_name?.split(' ')[0] || story.profiles?.username || 'User'}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Fullscreen Story Viewer */}
            {activeStory && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center">
                    <button 
                        onClick={() => setActiveStory(null)}
                        className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="relative w-full max-w-md aspect-[9/16] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Progress Bar Mock */}
                        <div className="absolute top-0 left-0 w-full p-3 z-10 flex gap-1">
                            <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                                <div className="h-full bg-white animate-[storyProgress_5s_linear]" onAnimationEnd={() => setActiveStory(null)} />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="absolute top-6 left-0 w-full p-4 z-10 flex items-center gap-3 backdrop-blur-sm bg-gradient-to-b from-black/60 to-transparent">
                            <img 
                                src={activeStory.profiles?.avatar_url || "https://i.pravatar.cc/150"} 
                                className="w-10 h-10 rounded-full border border-white/20" 
                            />
                            <div>
                                <p className="text-sm font-bold text-white">{activeStory.profiles?.full_name}</p>
                                <p className="text-xs text-white/60">
                                    {new Date(activeStory.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>

                        {/* Media */}
                        <img src={activeStory.media_url} className="w-full h-full object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
}

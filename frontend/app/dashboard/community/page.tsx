"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Eye, EyeOff, ShieldCheck, Users, MessageSquare, RefreshCw, Search } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

export default function CommunityManagerPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'posts' | 'profiles'>('posts');
    const [posts, setPosts] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select('*, profiles(full_name, avatar_url, username)')
                .order('created_at', { ascending: false })
                .limit(100);
            if (!error) setPosts(data || []);
        } catch { } finally { setLoading(false); }
    }, [supabase]);

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);
            if (!error) setProfiles(data || []);
        } catch { } finally { setLoading(false); }
    }, [supabase]);

    useEffect(() => {
        if (activeTab === 'posts') fetchPosts();
        else fetchProfiles();
    }, [activeTab, fetchPosts, fetchProfiles]);

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        await supabase.from('community_posts').delete().eq('id', id);
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const filteredPosts = posts.filter(p =>
        (p.content || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.profiles?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.location_name || '').toLowerCase().includes(search.toLowerCase())
    );

    const filteredProfiles = profiles.filter(p =>
        (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.username || '').toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Posts', value: posts.length, icon: MessageSquare, color: 'text-blue-400 bg-blue-900/30' },
        { label: 'Active Users', value: profiles.length, icon: Users, color: 'text-emerald-400 bg-emerald-900/30' },
        { label: 'Geo-Tagged Posts', value: posts.filter(p => p.lat && p.lng).length, icon: ShieldCheck, color: 'text-amber-400 bg-amber-900/30' },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto" dir="ltr">
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-cinzel text-gray-900 dark:text-white mb-1">Community Manager</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Moderate posts, manage user profiles, and oversee community activity.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-[#c5a059]/20 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                <div className="flex gap-2 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
                    <button
                        onClick={() => { setActiveTab('posts'); setSearch(""); }}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'posts' ? 'bg-white dark:bg-[#C5A059] text-gray-900 dark:text-black shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => { setActiveTab('profiles'); setSearch(""); }}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'profiles' ? 'bg-white dark:bg-[#C5A059] text-gray-900 dark:text-black shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Users
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={activeTab === 'posts' ? "Search posts..." : "Search users..."}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-amber-400 dark:focus:border-[#C5A059] text-gray-900 dark:text-white placeholder-gray-400 transition"
                        />
                    </div>
                    <button
                        onClick={() => activeTab === 'posts' ? fetchPosts() : fetchProfiles()}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-600 dark:text-white"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-amber-400 dark:border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : activeTab === 'posts' ? (
                <div className="space-y-3">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl">No posts found.</div>
                    ) : filteredPosts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/5 rounded-xl p-4 flex gap-4 items-start group hover:border-amber-200 dark:hover:border-[#C5A059]/20 transition">
                            <img src={post.profiles?.avatar_url || 'https://i.pravatar.cc/40'} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-white/10" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{post.profiles?.full_name || 'Unknown'}</span>
                                    {post.location_name && (
                                        <span className="text-xs text-amber-600 dark:text-[#C5A059] bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">📍 {post.location_name}</span>
                                    )}
                                    {post.lat && post.lng && (
                                        <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">🗺 Geo-tagged</span>
                                    )}
                                    <span className="text-xs text-gray-400 ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.content}</p>
                                {post.image_url && (
                                    <img src={post.image_url} className="mt-2 h-16 w-auto max-w-full rounded-lg object-cover border border-gray-100 dark:border-white/10" />
                                )}
                            </div>
                            <button
                                onClick={() => handleDeletePost(post.id)}
                                className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition ml-2 opacity-0 group-hover:opacity-100"
                                title="Delete Post"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredProfiles.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl">No users found.</div>
                    ) : filteredProfiles.map(profile => (
                        <div key={profile.id} className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/5 rounded-xl p-4 flex gap-4 items-center">
                            <img src={profile.avatar_url || 'https://i.pravatar.cc/40'} className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-amber-200 dark:border-[#C5A059]/40" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">{profile.full_name || 'No Name'}</p>
                                <p className="text-xs text-gray-400">@{profile.username || 'unknown'}</p>
                                {profile.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{profile.bio}</p>}
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0">{new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

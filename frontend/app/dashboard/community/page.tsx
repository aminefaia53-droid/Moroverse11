"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Eye, ShieldCheck, Users, MessageSquare, RefreshCw, Search, ShieldAlert, FileText } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";
import { DashboardService } from "../../../services/DashboardService";
import { SocialService } from "../../../services/SocialService";

export default function CommunityManagerPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'posts' | 'profiles' | 'audit'>('posts');
    const [posts, setPosts] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [search, setSearch] = useState("");

    const checkAdmin = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setIsAdmin(false);
            return;
        }
        const status = await DashboardService.checkAdminStatus(session.user.id);
        setIsAdmin(status);
    }, [supabase]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await SocialService.getPosts();
            setPosts(data);
        } catch { } finally { setLoading(false); }
    }, []);

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error) setProfiles(data || []);
        } catch { } finally { setLoading(false); }
    }, [supabase]);

    const fetchAuditLogs = useCallback(async () => {
        setLoading(true);
        try {
            const logs = await DashboardService.getAuditLogs();
            setAuditLogs(logs);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        checkAdmin();
    }, [checkAdmin]);

    useEffect(() => {
        if (isAdmin === true) {
            if (activeTab === 'posts') fetchPosts();
            else if (activeTab === 'profiles') fetchProfiles();
            else if (activeTab === 'audit') fetchAuditLogs();
        }
    }, [activeTab, isAdmin, fetchPosts, fetchProfiles, fetchAuditLogs]);

    const handleDeletePost = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post? This action will be recorded in the audit logs.")) return;
        try {
            await DashboardService.deletePost(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("Failed to delete post. Ensure you have proper admin privileges.");
        }
    };

    if (isAdmin === false) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-white/50 max-w-md">The MoroVerse Cyber-Fortress has restricted access to this area. Secure administrative credentials are required.</p>
            </div>
        );
    }

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
        { label: 'Admin Actions', value: auditLogs.length, icon: FileText, color: 'text-purple-400 bg-purple-900/30' },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto" dir="ltr">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#C5A059]/20 p-2 rounded-lg border border-[#C5A059]/40">
                        <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                    </div>
                    <h1 className="text-2xl font-bold font-cinzel text-gray-900 dark:text-white">Fortress Community Manager</h1>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Secure oversight of MoroVerse Social Hub. All actions are logged and audited.</p>
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
                    <button
                        onClick={() => { setActiveTab('audit'); setSearch(""); }}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-[#C5A059] text-gray-900 dark:text-black shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Audit Logs
                    </button>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Filter data..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-amber-400 dark:focus:border-[#C5A059] text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (activeTab === 'posts') fetchPosts();
                            else if (activeTab === 'profiles') fetchProfiles();
                            else fetchAuditLogs();
                        }}
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
                        <div key={post.id} className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/5 rounded-xl p-4 flex gap-4 items-start group hover:border-[#C5A059]/30 transition shadow-sm">
                            <img src={post.profiles?.avatar_url || 'https://i.pravatar.cc/40'} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-white/10" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{post.profiles?.full_name || 'Unknown'}</span>
                                    {post.location_name && (
                                        <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-full border border-[#C5A059]/20">📍 {post.location_name}</span>
                                    )}
                                    <span className="text-xs text-gray-400 ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.content}</p>
                            </div>
                            <button
                                onClick={() => handleDeletePost(post.id)}
                                className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition ml-2 opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : activeTab === 'profiles' ? (
                <div className="space-y-3">
                    {filteredProfiles.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl">No users found.</div>
                    ) : filteredProfiles.map(profile => (
                        <div key={profile.id} className="bg-white dark:bg-[#112240] border border-gray-200 dark:border-white/5 rounded-xl p-4 flex gap-4 items-center">
                            <img src={profile.avatar_url || 'https://i.pravatar.cc/40'} className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-[#C5A059]/40" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">{profile.full_name || 'No Name'}</p>
                                    {profile.is_admin && <span className="bg-purple-900/40 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">ADMIN</span>}
                                </div>
                                <p className="text-xs text-gray-400">@{profile.username || 'unknown'}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0">{new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {auditLogs.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl">No audit logs recorded yet.</div>
                    ) : auditLogs.map(log => (
                        <div key={log.id} className="bg-white dark:bg-[#0d1b32] border border-gray-200 dark:border-white/5 rounded-xl p-4 text-xs">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`font-bold px-2 py-0.5 rounded ${log.action === 'DELETE' ? 'bg-red-900/30 text-red-500' : 'bg-blue-900/30 text-blue-500'}`}>{log.action}</span>
                                <span className="text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                                <span className="ml-auto text-gray-500">Target ID: {log.target_id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <span className="text-[#C5A059] font-semibold">Admin:</span>
                                <span>{log.profiles?.full_name || log.profiles?.username || 'System Agent'}</span>
                                <span className="mx-2">|</span>
                                <span className="text-[#C5A059] font-semibold">Table:</span>
                                <span>{log.target_table}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Share2, X, Copy, Check, MessageCircle, Facebook,
    Twitter, Link2, ExternalLink
} from 'lucide-react';

interface ShareButtonProps {
    title: string;
    description?: string;
    imageUrl?: string | null;
    slug?: string; // custom SEO slug, fallback to id
    id: string;
    className?: string;
    size?: 'sm' | 'md';
}

const BASE_URL = 'https://moroverse.vercel.app';

function getShareUrl(id: string, slug?: string) {
    const path = slug ? `/heritage/${slug}` : `/?landmark=${id}`;
    return `${BASE_URL}${path}`;
}

export default function ShareButton({
    title, description, imageUrl, slug, id, className = '', size = 'sm'
}: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const url = getShareUrl(id, slug);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || `اكتشف ${title} على موسوعة MoroVerse — الأرشيف الرقمي المغربي`);

    const shareLinks = [
        {
            label: 'WhatsApp',
            icon: <MessageCircle className="w-4 h-4" />,
            color: 'hover:bg-green-600/20 hover:border-green-500/40 hover:text-green-400',
            href: `https://wa.me/?text=${encodedTitle}%0A${encodedDesc}%0A${encodedUrl}`,
        },
        {
            label: 'Facebook',
            icon: <Facebook className="w-4 h-4" />,
            color: 'hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
        },
        {
            label: 'X (Twitter)',
            icon: <Twitter className="w-4 h-4" />,
            color: 'hover:bg-sky-600/20 hover:border-sky-500/40 hover:text-sky-400',
            href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=المغرب,تاريخ,MoroVerse`,
        },
    ];

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleMainClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        // Use native Web Share API on mobile if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description || `اكتشف ${title} على موسوعة MoroVerse`,
                    url,
                });
            } catch { /* user cancelled */ }
            return;
        }
        setOpen(o => !o);
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const btnSize = size === 'sm'
        ? 'w-8 h-8'
        : 'w-10 h-10 text-sm gap-2 px-3';

    return (
        <div ref={ref} className={`relative ${className}`} onClick={e => e.stopPropagation()}>
            {/* Trigger button */}
            <button
                onClick={handleMainClick}
                className={`${btnSize} flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/20 hover:border-[#c5a059]/70 transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(197,160,89,0.15)] group/share`}
                title="مشاركة"
                aria-label="شارك هذا المعلم"
            >
                <Share2 className="w-3.5 h-3.5 group-hover/share:rotate-12 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute top-full mt-2 right-0 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-52 rounded-2xl bg-black/80 backdrop-blur-2xl border border-[#c5a059]/25 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#c5a059]/15">
                            <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em]">مشاركة</span>
                            <button
                                onClick={e => { e.stopPropagation(); setOpen(false); }}
                                className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Social Links */}
                        <div className="p-2 space-y-1">
                            {shareLinks.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-300 border border-transparent transition-all ${link.color}`}
                                >
                                    {link.icon}
                                    {link.label}
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                                </a>
                            ))}

                            {/* Divider */}
                            <div className="my-1 border-t border-[#c5a059]/10" />

                            {/* Copy Link */}
                            <button
                                onClick={handleCopy}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${copied
                                        ? 'bg-green-600/20 border-green-500/40 text-green-400'
                                        : 'text-gray-300 border-transparent hover:bg-[#c5a059]/10 hover:border-[#c5a059]/30 hover:text-[#c5a059]'
                                    }`}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'تم النسخ! ✓' : 'نسخ الرابط'}
                            </button>
                        </div>

                        {/* URL Preview */}
                        <div className="px-4 py-2 border-t border-[#c5a059]/10">
                            <div className="flex items-center gap-2 text-[9px] text-gray-600 truncate">
                                <Link2 className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{url.replace('https://', '')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

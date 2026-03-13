'use client';

import { useRef } from 'react';
import {
    Bold, Italic, Underline, Heading2, Heading3,
    Quote, Link as LinkIcon, Code, List, ListOrdered,
    Minus, Image as ImageIcon, Loader2
} from 'lucide-react';
import { useState } from 'react';

interface RichToolbarProps {
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    value: string;
    onChange: (val: string) => void;
    onImageUpload?: (url: string) => void;
    isUploading?: boolean;
}

function insertAt(text: string, cursor: number, before: string, after: string = '') {
    return text.substring(0, cursor) + before + after + text.substring(cursor);
}

function wrapSelection(text: string, start: number, end: number, before: string, after: string = '') {
    const selected = text.substring(start, end);
    return text.substring(0, start) + before + selected + after + text.substring(end);
}

export default function RichToolbar({ textareaRef, value, onChange, onImageUpload, isUploading }: RichToolbarProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [linkUrlPrompt, setLinkUrlPrompt] = useState(false);
    const [linkUrl, setLinkUrl] = useState('https://');

    const getSelection = () => {
        const ta = textareaRef.current;
        if (!ta) return { start: 0, end: 0 };
        return { start: ta.selectionStart, end: ta.selectionEnd };
    };

    const applyAndFocus = (newVal: string, newCursor?: number) => {
        onChange(newVal);
        requestAnimationFrame(() => {
            const ta = textareaRef.current;
            if (!ta) return;
            ta.focus();
            if (newCursor !== undefined) ta.setSelectionRange(newCursor, newCursor);
        });
    };

    const wrap = (before: string, after: string = before) => {
        const { start, end } = getSelection();
        applyAndFocus(wrapSelection(value, start, end, before, after), end + before.length + after.length);
    };

    const insertLine = (prefix: string) => {
        const { start } = getSelection();
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const newVal = value.substring(0, lineStart) + prefix + value.substring(lineStart);
        applyAndFocus(newVal, lineStart + prefix.length);
    };

    const insertLink = () => {
        const { start, end } = getSelection();
        const selected = value.substring(start, end) || 'link text';
        const newVal = wrapSelection(value, start, end, `[${selected}](`, `${linkUrl})`);
        applyAndFocus(newVal);
        setLinkUrlPrompt(false);
        setLinkUrl('https://');
    };

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
                    canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', 0.82);
                };
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onImageUpload) return;

        try {
            const compressedBlob = await compressImage(file);
            const formData = new FormData();
            formData.append('file', compressedBlob, file.name);

            const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                const { start } = getSelection();
                const newVal = insertAt(value, start, `![${file.name}](${data.url})\n`);
                applyAndFocus(newVal);
                onImageUpload(data.url);
            } else {
                alert(`Upload failed: ${data.message}${data.error ? ` (${data.error})` : ''}${data.hint ? `\nHint: ${data.hint}` : ''}`);
            }
        } catch (e: any) {
            console.error('Upload Error Toolbar:', e);
            alert('An error occurred during upload: ' + (e.message || 'Unknown error'));
        } finally {
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const tools = [
        { icon: Bold, label: 'Bold', action: () => wrap('**') },
        { icon: Italic, label: 'Italic', action: () => wrap('*') },
        { icon: Underline, label: 'Underline', action: () => wrap('<u>', '</u>') },
        { divider: true },
        { icon: Heading2, label: 'H2', action: () => insertLine('## ') },
        { icon: Heading3, label: 'H3', action: () => insertLine('### ') },
        { divider: true },
        { icon: Quote, label: 'Quote', action: () => insertLine('> ') },
        { icon: Code, label: 'Code', action: () => wrap('`') },
        { icon: Minus, label: 'Divider', action: () => { const { start } = getSelection(); applyAndFocus(insertAt(value, start, '\n---\n')); } },
        { divider: true },
        { icon: List, label: 'Bullet List', action: () => insertLine('- ') },
        { icon: ListOrdered, label: 'Numbered List', action: () => insertLine('1. ') },
        { divider: true },
        { icon: LinkIcon, label: 'Link', action: () => setLinkUrlPrompt(v => !v) },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-[#c5a059]/20 bg-stone-50 dark:bg-[#0a192f]">
            <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5">
                {tools.map((tool, i) => {
                    if (tool.divider) {
                        return <div key={`div-${i}`} className="w-px h-5 bg-gray-200 dark:bg-[#c5a059]/20 mx-1" />;
                    }
                    if (!tool.icon) return null;
                    return (
                        <button
                            key={i}
                            type="button"
                            title={tool.label}
                            onClick={tool.action}
                            className="p-1.5 rounded-md text-gray-500 hover:text-gold-royal hover:bg-gold-royal/10 dark:hover:bg-gold-royal/10 transition-colors"
                        >
                            {/* @ts-ignore */}
                            <tool.icon className="w-4 h-4" />
                        </button>
                    );
                })}
                {/* Image upload from toolbar */}
                <button
                    type="button"
                    title="Insert Image"
                    onClick={() => fileRef.current?.click()}
                    disabled={isUploading}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gold-royal hover:bg-gold-royal/10 transition-colors disabled:opacity-50"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Link URL inline prompt */}
            {linkUrlPrompt && (
                <div className="flex items-center gap-2 px-3 py-2 border-t border-[#c5a059]/20 bg-[#112240]">
                    <span className="text-xs text-gray-400 font-bold">URL:</span>
                    <input
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') insertLink(); if (e.key === 'Escape') setLinkUrlPrompt(false); }}
                        className="flex-1 text-xs px-2 py-1 rounded-md bg-[#0a192f] border border-[#c5a059]/20 text-white outline-none focus:ring-1 focus:ring-gold-royal"
                        placeholder="https://"
                        autoFocus
                    />
                    <button type="button" onClick={insertLink} className="text-xs font-bold bg-gold-royal text-white px-3 py-1 rounded-md hover:bg-gold-light">Insert</button>
                    <button type="button" onClick={() => setLinkUrlPrompt(false)} className="text-xs text-gray-400 hover:text-red-400">Cancel</button>
                </div>
            )}
        </div>
    );
}

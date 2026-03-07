'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Heading2, Quote, Link as LinkIcon, Eye, PenLine } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    dir?: 'ltr' | 'rtl';
    label: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, dir = 'ltr', label }: MarkdownEditorProps) {
    const [view, setView] = useState<'edit' | 'preview'>('edit');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [previewHtml, setPreviewHtml] = useState('');

    useEffect(() => {
        if (view === 'preview') {
            const html = marked(value || 'Nothing to preview...');
            // Wait for marked if it returns a promise, otherwise use directly. (marked v17+ might return promise depending on async option, assume sync for basic strings)
            Promise.resolve(html).then(res => setPreviewHtml(res as string));
        }
    }, [value, view]);

    const insertFormat = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const selectedText = text.substring(start, end);
        const replacement = `${prefix}${selectedText}${suffix}`;

        const newValue = text.substring(0, start) + replacement + text.substring(end);

        onChange(newValue);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const tools = [
        { icon: Bold, label: 'Bold', action: () => insertFormat('**', '**') },
        { icon: Italic, label: 'Italic', action: () => insertFormat('*', '*') },
        { icon: Heading2, label: 'Heading', action: () => insertFormat('## ', '') },
        { icon: Quote, label: 'Quote', action: () => insertFormat('> ', '') },
        { icon: List, label: 'List', action: () => insertFormat('- ', '') },
        { icon: LinkIcon, label: 'Link', action: () => insertFormat('[', '](url)') },
    ];

    return (
        <div className="flex flex-col border border-gray-300 dark:border-[#c5a059]/20 rounded-lg overflow-hidden bg-white dark:bg-[#0a192f] shadow-sm focus-within:ring-2 focus-within:ring-gold-royal transition-all">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-stone-50 dark:bg-[#112240] border-b border-gray-200 dark:border-[#c5a059]/20">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>

                <div className="flex items-center gap-1">
                    {/* View toggles */}
                    <div className="flex bg-stone-200 dark:bg-[#0a192f] rounded-md p-1 mr-4">
                        <button
                            type="button"
                            onClick={() => setView('edit')}
                            className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${view === 'edit' ? 'bg-white dark:bg-[#112240] text-gold-royal shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <PenLine className="w-3 h-3" /> Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => setView('preview')}
                            className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${view === 'preview' ? 'bg-white dark:bg-[#112240] text-gold-royal shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <Eye className="w-3 h-3" /> Preview
                        </button>
                    </div>

                    {/* Toolbar buttons */}
                    {view === 'edit' && tools.map((tool, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={tool.action}
                            title={tool.label}
                            className="p-1.5 text-gray-500 hover:text-gold-royal hover:bg-gold-royal/10 rounded transition-colors"
                        >
                            <tool.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            {view === 'edit' ? (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    dir={dir}
                    placeholder={placeholder}
                    className={`w-full min-h-[200px] p-4 bg-transparent resize-y outline-none text-gray-900 dark:text-white ${dir === 'rtl' ? 'font-arabic' : 'font-outfit'}`}
                />
            ) : (
                <div
                    dir={dir}
                    className={`w-full min-h-[200px] p-4 prose prose-stone dark:prose-invert max-w-none 
                        prose-headings:font-cinzel prose-headings:text-gold-royal 
                        prose-a:text-blue-600 dark:prose-a:text-blue-400
                        ${dir === 'rtl' ? 'font-arabic text-right' : 'font-outfit text-left'}`}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
            )}
        </div>
    );
}

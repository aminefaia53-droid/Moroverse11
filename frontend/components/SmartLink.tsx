"use client";

import React from 'react';
import Link from 'next/link';

interface SmartLinkProps {
    text: string;
}

// Map of keywords to their slugs/ids
const entityMap: Record<string, string> = {
    // Cities
    'طنجة': 'tangier',
    'تطوان': 'tetouan',
    'فاس': 'fes',
    'مكناس': 'meknes',
    'الرباط': 'rabat',
    'سلا': 'sale',
    'القنيطرة': 'kenitra',
    'مراكش': 'marrakech',
    'الدار البيضاء': 'casablanca',
    'كازابلانكا': 'casablanca',
    'أكادير': 'agadir',
    'العيون': 'laayoune',
    'الداخلة': 'dakhla',
    'وجدة': 'oujda',
    'آسفي': 'safi',
    'الصويرة': 'essaouira',

    // Landmarks
    'مسجد الحسن الثاني': 'hassan-ii-mosque',
    'صومعة حسان': 'hassan-tower',
    'قصر البديع': 'el-badi-palace',
    'وليلي': 'volubilis',
    'مغارة هرقل': 'hercules-caves',

    // High-level entities/eras
    'المرابطين': 'zallaqa',
    'الموحدين': 'hassan-tower',
    'السعديين': 'wadi-makhazin',
};

const SmartLink: React.FC<SmartLinkProps> = ({ text }) => {
    if (!text) return null;

    // Sorting keys by length descending to match longest phrases first (e.g. "مسجد الحسن الثاني" before "الحسن الثاني")
    const sortedKeywords = Object.keys(entityMap).sort((a, b) => b.length - a.length);
    const regexPattern = sortedKeywords.join('|');
    const regex = new RegExp(`(${regexPattern})`, 'g');

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                const slug = entityMap[part];
                if (slug) {
                    return (
                        <Link
                            key={i}
                            href={`/archive/${slug}`}
                            className="text-primary font-bold border-b border-primary/20 hover:border-primary hover:bg-primary/5 transition-all px-0.5 rounded-sm"
                        >
                            {part}
                        </Link>
                    );
                }
                return part;
            })}
        </>
    );
};

export default SmartLink;

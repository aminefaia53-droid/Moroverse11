'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, X, ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

interface ImageGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
}

export default function ImageGalleryModal({ isOpen, onClose, onSelectImage }: ImageGalleryModalProps) {
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/images');
            const data = await res.json();
            if (data.success) {
                setImages(data.files);
            }
        } catch (e) {
            console.error('Failed to fetch images', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/images/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                // Prepend to show immediately
                setImages(prev => [data.url, ...prev]);
                onSelectImage(data.url);
                onClose();
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (e) {
            alert('An error occurred during upload.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="ltr">
            <div className="bg-white dark:bg-[#0a192f] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-[#c5a059]/30 font-outfit">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#c5a059]/30 bg-stone-50 dark:bg-[#112240]">
                    <h2 className="text-xl font-bold font-cinzel text-gray-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-gold-royal" /> Image Library
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Upload Section */}
                <div className="p-6 border-b border-gray-100 dark:border-[#112240] bg-white dark:bg-[#0a192f]">
                    <div
                        className="border-2 border-dashed border-gray-300 dark:border-[#c5a059]/40 rounded-xl p-8 text-center hover:bg-stone-50 dark:hover:bg-[#112240] cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center text-gold-royal">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <span className="font-bold">Uploading Image...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gold-royal/10 text-gold-royal rounded-full flex items-center justify-center mb-4">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Click to Upload</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG, WebP up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="p-6 overflow-y-auto flex-1 bg-stone-50 dark:bg-[#0a192f]">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Previously Uploaded</h3>

                    {loading ? (
                        <div className="flex justify-center p-8 text-gold-royal">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">No images uploaded yet.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map(url => (
                                <div
                                    key={url}
                                    onClick={() => {
                                        onSelectImage(url);
                                        onClose();
                                    }}
                                    className="relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-gold-royal cursor-pointer shadow-sm bg-gray-100 dark:bg-[#112240]"
                                >
                                    <img src={url} alt="Gallery item" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <CheckCircle className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 shadow-lg rounded-full drop-shadow-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

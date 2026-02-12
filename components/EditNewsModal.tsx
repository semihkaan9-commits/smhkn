import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { NewsItem } from '../types';
import { toast } from 'react-hot-toast';

interface EditNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, title: string, content: string, date: string) => void;
    newsItem: NewsItem | null;
}

export const EditNewsModal: React.FC<EditNewsModalProps> = ({ isOpen, onClose, onSave, newsItem }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        if (newsItem) {
            setTitle(newsItem.title);
            setContent(newsItem.content);
            // Convert DD.MM.YYYY to YYYY-MM-DD for input type="date" if needed, 
            // or just keep as text if we want to allow free format or if input type="text".
            // For simplicity and consistency with existing format (DD.MM.YYYY), we'll use text input or try to parse.
            // Let's stick to simple text edit for date to match current display format flexibility, 
            // or better, providing a date picker.
            // If the date is "DD.MM.YYYY", we can't directly feed it to type="date".
            // Let's use a standard text input for date to avoid parsing issues for now, or use a date picker if format allows.
            setDate(newsItem.date);
        }
    }, [newsItem]);

    if (!isOpen || !newsItem) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Başlık ve içerik alanları zorunludur.');
            return;
        }

        onSave(newsItem.id, title, content, date);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Haberi Düzenle</h3>
                    <button onClick={onClose} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlık</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tarih</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                placeholder="GG.AA.YYYY"
                                className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors pl-8"
                            />
                            <Calendar size={16} className="absolute left-0 top-3 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Format: GG.AA.YYYY (Örn: 24.05.2024)</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İçerik</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={6}
                            className="w-full border rounded-lg border-gray-200 focus:border-green-500 outline-none p-3 bg-transparent text-black transition-colors resize-none"
                        />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-800">
                            Not: Görsel düzenleme bu alandan yapılamaz. Görseli değiştirmek için haberi silip yeniden eklemeniz gerekmektedir.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={20} />
                        Değişiklikleri Kaydet
                    </button>

                </form>
            </div>
        </div>
    );
};

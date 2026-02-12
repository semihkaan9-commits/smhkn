import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { EventItem } from '../types';
import { toast } from 'react-hot-toast';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, title: string, content: string, startDate?: string, endDate?: string) => void;
    eventItem: EventItem | null;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, onSave, eventItem }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (eventItem) {
            setTitle(eventItem.title);
            setContent(eventItem.content);
            // Ensure dates are in the correct format for datetime-local input (YYYY-MM-DDTHH:mm)
            if (eventItem.startDate) {
                // Assuming stored as ISO string, slice to get compatible format
                setStartDate(eventItem.startDate.slice(0, 16));
            }
            if (eventItem.endDate) {
                setEndDate(eventItem.endDate.slice(0, 16));
            }
        }
    }, [eventItem]);

    if (!isOpen || !eventItem) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Başlık ve içerik alanları zorunludur.');
            return;
        }

        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            toast.error('Bitiş tarihi başlangıç tarihinden önce olamaz.');
            return;
        }

        onSave(eventItem.id, title, content, startDate || undefined, endDate || undefined);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Etkinliği Düzenle</h3>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Başlangıç</label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bitiş</label>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
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
                            Not: Görsel düzenleme bu alandan yapılamaz.
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

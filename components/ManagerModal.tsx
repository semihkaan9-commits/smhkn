import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Manager } from '../types';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface ManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (managerData: Partial<Manager>) => void;
    manager?: Manager | null;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({ isOpen, onClose, onSave, manager }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [title, setTitle] = useState('');
    const [phone, setPhone] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (manager) {
            setName(manager.name);
            setSurname(manager.surname);
            setTitle(manager.title);
            setPhone(manager.phone);
            setPhotoUrl(manager.photo_url || '');
        } else {
            setName('');
            setSurname('');
            setTitle('');
            setPhone('');
            setPhotoUrl('');
        }
    }, [manager, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `managers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery') // Reuse existing bucket if possible, or another public bucket
                .upload(filePath, file);

            if (uploadError) {
                // If it fails, fallback to Data URL for simplicity
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotoUrl(reader.result as string);
                    setIsUploading(false);
                };
                reader.readAsDataURL(file);
                return;
            }

            const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
            setPhotoUrl(data.publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Fotoğraf yüklenirken hata oluştu.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !surname.trim() || !title.trim() || !phone.trim()) {
            toast.error('İsim, Soyisim, Ünvan ve Telefon alanları zorunludur.');
            return;
        }

        const managerData: Partial<Manager> = {
            name,
            surname,
            title,
            phone,
            photo_url: photoUrl
        };

        if (manager) {
            managerData.id = manager.id;
        }

        onSave(managerData);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                <div className="bg-[#805894] px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">{manager ? 'Yönetici Düzenle' : 'Yeni Yönetici Ekle'}</h3>
                    <button onClick={onClose} className="hover:bg-[#805894] p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İsim</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-[#805894] outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Soyisim</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-[#805894] outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ünvan</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Örn: Dernek Başkanı, Muhtar..."
                            className="w-full border-b-2 border-gray-200 focus:border-[#805894] outline-none py-2 bg-transparent text-black transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon Numarası</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full border-b-2 border-gray-200 focus:border-[#805894] outline-none py-2 bg-transparent text-black transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fotoğraf</label>
                        {photoUrl && (
                            <div className="mb-2">
                                <img src={photoUrl} alt="Yönetici Fotoğrafı" className="h-20 w-auto rounded border border-gray-200 object-cover" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="w-full p-2 border border-gray-200 rounded text-xs bg-white text-black file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#805894]/10 file:text-[#805894] hover:file:bg-[#805894]/20"
                        />
                        {isUploading && <p className="text-xs text-blue-500 mt-1">Yükleniyor...</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full bg-[#805894] hover:bg-[#805894] text-white font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {manager ? 'Güncelle' : 'Ekle'}
                    </button>

                </form>
            </div>
        </div>
    );
};

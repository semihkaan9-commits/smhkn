import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Villager } from '../types';
import { toast } from 'react-hot-toast';

interface EditVillagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedVillager: Villager) => void;
    villager: Villager | null;
}

export const EditVillagerModal: React.FC<EditVillagerModalProps> = ({ isOpen, onClose, onSave, villager }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [nickname, setNickname] = useState('');
    const [profession, setProfession] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (villager) {
            setName(villager.name);
            setSurname(villager.surname);
            setNickname(villager.nickname || '');
            setProfession(villager.profession);
            setAddress(villager.address || ''); // Assuming address exists on type, fallback if not
            setContact(villager.contact || '');
        }
    }, [villager]);

    if (!isOpen || !villager) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !surname.trim() || !profession.trim()) {
            toast.error('İsim, Soyisim ve Meslek alanları zorunludur.');
            return;
        }

        const updatedVillager: Villager = {
            ...villager,
            name,
            surname,
            nickname: nickname || undefined,
            profession,
            address,
            contact
        };

        onSave(updatedVillager);
        onClose();
        toast.success('Kişi bilgileri güncellendi.');
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Kişi Düzenle</h3>
                    <button onClick={onClose} className="hover:bg-green-700 p-1 rounded-full transition-colors">
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
                                className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Soyisim</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lakap</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="Varsa..."
                            className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meslek</label>
                        <input
                            type="text"
                            value={profession}
                            onChange={e => setProfession(e.target.value)}
                            className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">İletişim</label>
                            <input
                                type="tel"
                                value={contact}
                                onChange={e => setContact(e.target.value)}
                                className="w-full border-b-2 border-gray-200 focus:border-green-500 outline-none py-2 bg-transparent text-black transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adres</label>
                        <textarea
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            rows={3}
                            className="w-full border rounded-lg border-gray-200 focus:border-green-500 outline-none p-3 bg-transparent text-black transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                    >
                        <Save size={20} />
                        Kaydet
                    </button>

                </form>
            </div>
        </div>
    );
};

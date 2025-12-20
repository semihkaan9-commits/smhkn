import React, { useState } from 'react';
import { Donation, UserRole, AnyUser } from '../types';
import { CreditCard, Landmark, Plus, AlertCircle, Coins, Trash2 } from 'lucide-react';
import { DeleteModal } from './DeleteModal';

interface DonationSectionProps {
  donations: Donation[];
  currentUser: AnyUser | null;
  onAddDonation: (donorName: string, amount: number) => void;
  onDeleteDonation: (id: string) => void;
  bottomAAd?: string | null;
  bottomBAd?: string | null;
}

export const DonationSection: React.FC<DonationSectionProps> = ({ 
  donations, 
  currentUser, 
  onAddDonation, 
  onDeleteDonation, 
  bottomAAd,
  bottomBAd 
}) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const [showForm, setShowForm] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const totalAmount = donations.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      onAddDonation(donorName.trim() || 'Anonim', parseFloat(amount));
      setDonorName('');
      setAmount('');
      setShowForm(false);
    }
  };

  const openDeleteModal = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  return (
    <section id="donations" className="py-16 px-4 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center justify-center gap-2">
            <Landmark className="text-green-600" />
            Köy Sandığı & Bağışlar
          </h2>
          <p className="text-stone-600">Köyümüzün ihtiyaçları ve gelişimi için yapılan katkılar.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm mb-10">
            <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-700 shrink-0">
                    <CreditCard size={32} />
                </div>
                <div className="w-full">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Bağış Hesabı Bilgileri</h3>
                    <div className="bg-white/60 p-3 rounded-md mb-2 font-mono text-gray-700 border border-yellow-100">
                        <p className="font-bold">Alıcı: Yeşilvadi Köyü Derneği</p>
                        <p>IBAN: TR12 0000 0000 0000 0000 0000 00</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-800 bg-orange-100/50 p-2 rounded">
                        <AlertCircle size={16} className="shrink-0" />
                        <p><strong>UYARI:</strong> IBAN üzerinden para gönderirken açıklama kısmına <u>isim ve soyisim</u> yazılmazsa bağışınız listede <strong>"Anonim"</strong> olarak görünecektir.</p>
                    </div>
                </div>
            </div>
        </div>

        {isAdmin && (
            <div className="mb-8 max-w-4xl mx-auto">
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="w-full bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                >
                    <Plus size={20} />
                    {showForm ? 'Paneli Kapat' : 'Yeni Bağış Ekle (Yönetici)'}
                </button>
                
                {showForm && (
                    <div className="bg-white p-6 rounded-xl shadow mt-4 animate-fade-in-up border border-green-200">
                        <h4 className="font-bold text-gray-800 mb-4">Manuel Bağış Girişi</h4>
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                placeholder="Bağışçı Adı Soyadı (Boş bırakılırsa Anonim)" 
                                value={donorName}
                                onChange={e => setDonorName(e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                            />
                             <input 
                                type="number" 
                                placeholder="Miktar (TL)" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                min="1"
                                className="w-full md:w-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                            />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold">
                                Ekle
                            </button>
                        </form>
                    </div>
                )}
            </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between font-semibold text-green-900">
                <span>Bağışçı</span>
                <span className="flex-1 text-right mr-4">Miktar</span>
                {isAdmin && <span className="w-8"></span>}
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {donations.length > 0 ? (
                    donations.map((donation) => (
                        <div key={donation.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{donation.donorName}</span>
                                <span className="text-xs text-gray-400">{donation.date}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-green-600">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(donation.amount)}
                                </span>
                                {isAdmin && (
                                    <button 
                                        type="button"
                                        onClick={(e) => openDeleteModal(e, donation.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                        title="Bağışı Sil"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">Henüz bağış kaydı bulunmamaktadır.</div>
                )}
            </div>
        </div>

        <DeleteModal 
          isOpen={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            if (deleteTargetId) onDeleteDonation(deleteTargetId);
          }}
          title="Bağış kaydı silinsin mi?"
          description="Bu bağış kaydı listeden kalıcı olarak silinecektir. Toplam kasa miktarı güncellenecektir."
        />

        {/* The Vault / Safe Visual with independent ads */}
        <div className="mt-12 flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-8 animate-fade-in-up">
            
            {/* Left Ad - Area 2A */}
            <div className="w-full max-w-md lg:w-52 h-40 lg:h-64 bg-stone-200 rounded-2xl items-center justify-center text-stone-400 font-bold border-2 border-dashed border-stone-300 shadow-inner hover:bg-stone-300 transition-colors cursor-pointer overflow-hidden group flex">
                {bottomAAd ? (
                  <img src={bottomAAd} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Reklam A" />
                ) : (
                  <div className="text-center p-4">
                      <span className="block text-xl lg:text-2xl mb-1 lg:mb-2 uppercase tracking-tighter">REKLAM A</span>
                      <span className="text-[10px] lg:text-sm font-medium opacity-60">Sol Reklam Alanı</span>
                  </div>
                )}
            </div>

            {/* Main Vault Box */}
            <div className="bg-stone-800 text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-md border-4 border-stone-600 relative overflow-hidden shrink-0">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-stone-700/50 rounded-full blur-xl"></div>
                <div className="bg-yellow-500 p-4 rounded-full shadow-lg mb-4 z-10">
                    <Coins size={48} className="text-yellow-900" />
                </div>
                <h3 className="text-stone-400 font-medium uppercase tracking-widest text-sm mb-1 z-10">Köy Sandığı Toplam</h3>
                <div className="text-4xl md:text-5xl font-bold text-white z-10">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalAmount)}
                </div>
                <div className="mt-4 text-xs text-stone-500 z-10">
                    Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                </div>
            </div>

            {/* Right Ad - Area 2B */}
            <div className="w-full max-w-md lg:w-52 h-40 lg:h-64 bg-stone-200 rounded-2xl items-center justify-center text-stone-400 font-bold border-2 border-dashed border-stone-300 shadow-inner hover:bg-stone-300 transition-colors cursor-pointer overflow-hidden group flex">
                 {bottomBAd ? (
                   <img src={bottomBAd} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Reklam B" />
                 ) : (
                    <div className="text-center p-4">
                      <span className="block text-xl lg:text-2xl mb-1 lg:mb-2 uppercase tracking-tighter">REKLAM B</span>
                      <span className="text-[10px] lg:text-sm font-medium opacity-60">Sağ Reklam Alanı</span>
                    </div>
                 )}
            </div>
        </div>
      </div>
    </section>
  );
};
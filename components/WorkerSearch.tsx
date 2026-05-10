import React, { useState, useMemo } from 'react';
import { Villager, UserRole, AnyUser } from '../types';
import { Search, Phone, MapPin, BadgeCheck, Navigation, Star, Trash2, Pencil, Download } from 'lucide-react';
import { DeleteModal } from './DeleteModal';
import { EditVillagerModal } from './EditVillagerModal';
import { EditableText } from './EditableText';

interface AdData { url: string; link: string | null; }

interface WorkerSearchProps {
  villagers: Villager[];
  onRateVillager: (id: string, newRating: number) => void;
  adsMap?: Record<string, AdData>;
  currentUser: AnyUser | null;
  onDeleteVillager: (id: string) => void;
  onUpdateVillager: (updatedVillager: Villager) => void;
}

export const WorkerSearch: React.FC<WorkerSearchProps> = ({
  villagers,
  onRateVillager,
  adsMap = {},
  currentUser,
  onDeleteVillager,
  onUpdateVillager
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [villagerToDelete, setVillagerToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVillager, setSelectedVillager] = useState<Villager | null>(null);

  const filteredVillagers = useMemo(() => {
    let result = villagers;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLocaleLowerCase('tr-TR');
      if (lowerTerm === 'esnaf') {
        result = villagers;
      } else {
        result = villagers.filter(v =>
          v.profession.toLocaleLowerCase('tr-TR').includes(lowerTerm) ||
          v.name.toLocaleLowerCase('tr-TR').includes(lowerTerm) ||
          v.surname.toLocaleLowerCase('tr-TR').includes(lowerTerm)
        );
      }
    }
    return result.sort((a, b) => b.rating - a.rating);
  }, [searchTerm, villagers]);

  const handleDeleteClick = (id: string) => {
    setVillagerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (villager: Villager) => {
    setSelectedVillager(villager);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (villagerToDelete) {
      onDeleteVillager(villagerToDelete);
      setVillagerToDelete(null);
    }
  };

  const downloadExcel = () => {
    const headers = ['Isim', 'Soyisim', 'Numara'];
    const csvLines = [headers.join(',')];
    
    villagers.forEach(v => {
      const name = `"${v.name.replace(/"/g, '""')}"`;
      const surname = `"${v.surname.replace(/"/g, '""')}"`;
      const contact = `"${v.contact.replace(/"/g, '""')}"`;
      csvLines.push(`${name},${surname},${contact}`);
    });
    
    const csvContent = "\uFEFF" + csvLines.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kullanicilar.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="workers" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#805894] mb-4">
          <EditableText textKey="workers.title" defaultText="Köy Rehberi & İş İlanları" />
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto">
          <EditableText as="span" textKey="workers.desc" defaultText="Köyümüzde yapılacak bir işiniz mi var? Aradığınız ustayı veya yardımcıyı buradan kolayca bulabilirsiniz." />
          <br />
          <span className="text-xs text-[#805894] font-medium">
            <EditableText textKey="workers.note" defaultText="Not: En yüksek puanlı üyeler en üstte listelenir." />
          </span>
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12 flex gap-3 items-center px-4 md:px-0">
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-[#805894] transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white shadow-sm focus:border-[#805894] focus:ring-4 focus:ring-[#805894] transition-all outline-none text-lg text-black"
            placeholder="Ne aramıştınız? (Örn: Tesisatçı, Elektrikçi...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentUser?.role === UserRole.ADMIN && (
          <button
            onClick={downloadExcel}
            className="bg-[#805894] hover:bg-purple-900 text-white px-4 md:px-6 py-4 rounded-xl shadow-md font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-colors border-2 border-transparent h-full"
            title="Kullanıcı Listesini İndir"
          >
            <Download size={20} /> <span className="hidden sm:inline">İndir</span>
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {filteredVillagers.length > 0 ? (
            filteredVillagers.map((person) => (
              <div key={person.id} className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-[#805894] flex flex-col group ${person.business_card_url ? 'h-[350px] p-0 overflow-hidden' : 'h-full p-6'}`}>

                {/* Admin Actions */}
                {currentUser?.role === UserRole.ADMIN && (
                  <div className="absolute top-4 right-4 z-[5] flex gap-2">
                    <button
                      onClick={() => handleEditClick(person)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                      title="Kişiyi Düzenle"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(person.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                      title="Kişiyi Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                {person.business_card_url ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <img 
                      src={person.business_card_url} 
                      alt={`${person.name} ${person.surname} Kartvizit`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{person.name} {person.surname}</h3>
                        {person.nickname && <p className="text-sm text-gray-500 italic">"{person.nickname}"</p>}
                      </div>
                      <BadgeCheck className="text-[#805894]" />
                    </div>

                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => onRateVillager(person.id, star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            size={18}
                            className={`${star <= person.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs text-gray-500">({person.rating}/5)</span>
                    </div>

                    <div className="space-y-4 mt-auto">
                      <div className="inline-block bg-[#805894]/10 text-[#805894] px-3 py-1 rounded-full text-sm font-semibold">
                        {person.profession}
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="shrink-0 text-[#805894] mt-1" />
                        <div className="flex-grow">
                          <span className="text-gray-600 text-sm block mb-2">{person.address}</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(person.address + (person.address.toLowerCase().includes('konya') ? '' : ' Balcılar Köyü Konya'))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                          >
                            <Navigation size={12} /> Yol Tarifi
                          </a>
                        </div>
                      </div>

                      {/* Google Maps Preview */}
                      <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 mt-2 shadow-inner">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(person.address + (person.address.toLowerCase().includes('konya') ? '' : ' Balcılar Köyü Konya'))}&t=m&z=15&ie=UTF8&iwloc=A&output=embed&hl=tr`}
                          title={`Harita: ${person.name}`}
                        ></iframe>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={18} className="text-[#805894]" />
                          <span className="font-mono text-sm">{person.contact}</span>
                        </div>
                        <a
                          href={`tel:${person.contact}`}
                          className="bg-[#805894] hover:bg-[#805894] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Phone size={14} /> Ara
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              <p>Aradığınız kriterlere uygun köy sakini bulunamadı.</p>
            </div>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="w-full relative h-80 flex gap-4 animate-fade-in-up">
          {/* Ad 1 (Left/Top) */}
          <div className="w-full flex-1 h-full bg-stone-200 rounded-2xl border-4 border-dashed border-stone-300 flex items-center justify-center overflow-hidden group">
            {adsMap['top1'] ? (
              adsMap['top1'].link ? (
                <a href={adsMap['top1'].link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer w-full h-full">
                  {adsMap['top1'].url && adsMap['top1'].url.trim() !== '' ? (
                    <img src={adsMap['top1'].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="1/1. Alan Reklam" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/80 text-stone-400 p-4 text-center">
                      <span className="font-bold text-xs uppercase block tracking-widest mb-1 text-stone-500">Reklam Alanı</span>
                      <span className="text-[10px] font-semibold">Reklam Vermek İçin İletişime Geçin</span>
                    </div>
                  )}
                </a>
              ) : (
                <div className="w-full h-full">
                  {adsMap['top1'].url && adsMap['top1'].url.trim() !== '' ? (
                    <img src={adsMap['top1'].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="1/1. Alan Reklam" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/80 text-stone-400 p-4 text-center">
                      <span className="font-bold text-xs uppercase block tracking-widest mb-1 text-stone-500">Reklam Alanı</span>
                      <span className="text-[10px] font-semibold">Reklam Vermek İçin İletişime Geçin</span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="text-center p-4">
                <h3 className="text-xl md:text-3xl font-extrabold text-stone-400 mb-2 tracking-widest uppercase">1/1. ALAN</h3>
              </div>
            )}
          </div>
          
          {/* Ad 2 (Right/Top) */}
          <div className="w-full flex-1 h-full bg-stone-200 rounded-2xl border-4 border-dashed border-stone-300 flex items-center justify-center overflow-hidden group">
            {adsMap['top2'] ? (
              adsMap['top2'].link ? (
                <a href={adsMap['top2'].link} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                  {adsMap['top2'].url && adsMap['top2'].url.trim() !== '' ? (
                    <img src={adsMap['top2'].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="1/2. Alan Reklam" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/80 text-stone-400 p-4 text-center">
                      <span className="font-bold text-xs uppercase block tracking-widest mb-1 text-stone-500">Reklam Alanı</span>
                      <span className="text-[10px] font-semibold">Reklam Vermek İçin İletişime Geçin</span>
                    </div>
                  )}
                </a>
              ) : (
                <div className="w-full h-full">
                  {adsMap['top2'].url && adsMap['top2'].url.trim() !== '' ? (
                    <img src={adsMap['top2'].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="1/2. Alan Reklam" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/80 text-stone-400 p-4 text-center">
                      <span className="font-bold text-xs uppercase block tracking-widest mb-1 text-stone-500">Reklam Alanı</span>
                      <span className="text-[10px] font-semibold">Reklam Vermek İçin İletişime Geçin</span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="text-center p-4">
                <h3 className="text-xl md:text-3xl font-extrabold text-stone-400 mb-2 tracking-widest uppercase">1/2. ALAN</h3>
              </div>
            )}
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Köy Sakinini Sil"
        description="Bu kişiyi köy rehberinden silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />

      <EditVillagerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onUpdateVillager}
        villager={selectedVillager}
      />
    </section>
  );
};
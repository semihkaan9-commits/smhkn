import React, { useState, useMemo } from 'react';
import { Villager, UserRole, AnyUser } from '../types';
import { Search, Phone, MapPin, BadgeCheck, Navigation, Star, Trash2, Pencil } from 'lucide-react';
import { DeleteModal } from './DeleteModal';
import { EditVillagerModal } from './EditVillagerModal';

interface WorkerSearchProps {
  villagers: Villager[];
  onRateVillager: (id: string, newRating: number) => void;
  topAd?: string | null;
  topAdLink?: string | null;
  currentUser: AnyUser | null;
  onDeleteVillager: (id: string) => void;
  onUpdateVillager: (updatedVillager: Villager) => void;
}

export const WorkerSearch: React.FC<WorkerSearchProps> = ({
  villagers,
  onRateVillager,
  topAd,
  topAdLink,
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
      result = villagers.filter(v =>
        v.profession.toLocaleLowerCase('tr-TR').includes(lowerTerm) ||
        v.name.toLocaleLowerCase('tr-TR').includes(lowerTerm) ||
        v.surname.toLocaleLowerCase('tr-TR').includes(lowerTerm)
      );
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

  return (
    <section id="workers" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-green-900 mb-4">Köy Rehberi & İş İlanları</h2>
        <p className="text-stone-600 max-w-xl mx-auto">
          Köyümüzde yapılacak bir işiniz mi var? Aradığınız ustayı veya yardımcıyı buradan kolayca bulabilirsiniz.
          <br />
          <span className="text-xs text-green-600 font-medium">Not: En yüksek puanlı üyeler en üstte listelenir.</span>
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-green-600 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-lg text-black"
            placeholder="Ne aramıştınız? (Örn: Tesisatçı, Elektrikçi...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {searchTerm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {filteredVillagers.length > 0 ? (
            filteredVillagers.map((person) => (
              <div key={person.id} className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-t-4 border-green-500 flex flex-col h-full group">

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

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{person.name} {person.surname}</h3>
                    {person.nickname && <p className="text-sm text-gray-500 italic">"{person.nickname}"</p>}
                  </div>
                  <BadgeCheck className="text-green-500" />
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
                  <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {person.profession}
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="shrink-0 text-green-600 mt-1" />
                    <div className="flex-grow">
                      <span className="text-gray-600 text-sm block mb-2">{person.address}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(person.address + ' Balcılar Köyü')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Navigation size={12} /> Yol Tarifi
                      </a>
                    </div>
                  </div>

                  {/* Google Maps Preview */}
                  <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200 mt-2 shadow-inner">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(person.address + ' Balcılar Köyü Konya')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      title={`Harita: ${person.name}`}
                    ></iframe>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={18} className="text-green-600" />
                      <span className="font-mono text-sm">{person.contact}</span>
                    </div>
                    <a
                      href={`tel:${person.contact}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Phone size={14} /> Ara
                    </a>
                  </div>
                </div>
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
        <div className="w-full h-80 bg-stone-200 rounded-2xl border-4 border-dashed border-stone-300 flex items-center justify-center animate-fade-in-up overflow-hidden group">
          {topAd ? (
            topAdLink ? (
              <a href={topAdLink} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                <img src={topAd} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Üst Reklam" />
              </a>
            ) : (
              <img src={topAd} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Üst Reklam" />
            )
          ) : (
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-stone-400 mb-2 tracking-widest uppercase">REKLAM ALANI 1</h3>
              <p className="text-stone-500 font-medium italic">Köyümüzün en değerli alanında yerinizi alın.</p>
            </div>
          )}
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
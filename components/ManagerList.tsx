import React, { useState } from 'react';
import { Manager, AnyUser, UserRole } from '../types';
import { Phone, Pencil, Trash2, BadgeCheck } from 'lucide-react';
import { DeleteModal } from './DeleteModal';
import { ManagerModal } from './ManagerModal';

interface ManagerListProps {
  managers: Manager[];
  currentUser: AnyUser | null;
  onAddManager: (manager: Partial<Manager>) => void;
  onUpdateManager: (manager: Partial<Manager>) => void;
  onDeleteManager: (id: string) => void;
}

export const ManagerList: React.FC<ManagerListProps> = ({
  managers,
  currentUser,
  onAddManager,
  onUpdateManager,
  onDeleteManager
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [managerToDelete, setManagerToDelete] = useState<string | null>(null);

  const isAdmin = currentUser?.role === UserRole.ADMIN || (currentUser?.role as string)?.toUpperCase() === 'ADMIN';

  const handleEditClick = (manager: Manager) => {
    setSelectedManager(manager);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setManagerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (managerToDelete) {
      onDeleteManager(managerToDelete);
      setManagerToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveManager = (managerData: Partial<Manager>) => {
    if (selectedManager) {
      onUpdateManager(managerData);
      setIsEditModalOpen(false);
      setSelectedManager(null);
    } else {
      onAddManager(managerData);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12 relative">
        <h2 className="text-3xl font-bold text-[#805894] mb-4">
          Yöneticiler
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto">
          Köyümüzün değerli yöneticilerine buradan ulaşabilirsiniz.
        </p>

        {isAdmin && (
          <button
            onClick={() => { setSelectedManager(null); setIsAddModalOpen(true); }}
            className="mt-6 md:absolute md:top-0 md:right-0 bg-[#805894] hover:bg-purple-900 text-white px-6 py-2 rounded-xl shadow-md font-bold text-sm flex items-center gap-2 transition-colors mx-auto"
          >
            + Yönetici Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {managers.length > 0 ? (
          managers.map((manager) => (
            <div key={manager.id} className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-[#805894] flex flex-col h-full group p-6">
              
              {isAdmin && (
                <div className="absolute top-4 right-4 z-[5] flex gap-2">
                  <button
                    onClick={() => handleEditClick(manager)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                    title="Düzenle"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(manager.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div className="flex flex-col h-full items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm mb-4 bg-gray-50 flex items-center justify-center shrink-0">
                  {manager.photo_url ? (
                    <img src={manager.photo_url} alt={`${manager.name} ${manager.surname}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-gray-300 font-bold">{manager.name.charAt(0)}{manager.surname.charAt(0)}</span>
                  )}
                </div>

                <div className="mb-2">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    {manager.name} {manager.surname} <BadgeCheck className="text-[#805894]" size={18} />
                  </h3>
                </div>

                <div className="inline-block bg-[#805894]/10 text-[#805894] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                  {manager.title}
                </div>

                <div className="mt-auto w-full pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={18} className="text-[#805894]" />
                      <span className="font-mono text-sm">{manager.phone}</span>
                    </div>
                    <a
                      href={`tel:${manager.phone}`}
                      className="bg-[#805894] hover:bg-[#805894] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Phone size={16} /> Ara
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p>Kayıtlı yönetici bulunmamaktadır.</p>
          </div>
        )}
      </div>

      <ManagerModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setSelectedManager(null); }}
        onSave={handleSaveManager}
        manager={selectedManager}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Yöneticiyi Sil"
        description="Bu yöneticiyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
};

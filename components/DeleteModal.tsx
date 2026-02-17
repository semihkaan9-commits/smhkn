import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Silinsin mi?", 
  description = "Bu ögeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in" 
        onClick={onClose}
      ></div>
      
      {/* Instagram Style Modal Box */}
      <div className="relative bg-white w-full max-w-[320px] rounded-[14px] overflow-hidden shadow-2xl animate-fade-in-up scale-100">
        <div className="p-6 text-center">
          <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-[14px] text-gray-500 leading-tight">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col border-t border-gray-100">
          <button 
            onClick={() => {
              onConfirm();
              console.log('Öge başarıyla silindi.');
              onClose();
            }}
            className="w-full py-3.5 text-[14px] font-bold text-red-500 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
          >
            Sil
          </button>
          <button 
            onClick={onClose}
            className="w-full py-3.5 text-[14px] font-normal text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};
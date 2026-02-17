import React, { useState } from 'react';
import { GalleryItem, UserRole, AnyUser } from '../types';
import { Image as ImageIcon, Video, Plus, X, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { DeleteModal } from './DeleteModal';

interface GallerySectionProps {
  items: GalleryItem[];
  currentUser: AnyUser | null;
  onAddItem: (type: 'image' | 'video', url: string, caption: string) => void;
  onDeleteItem: (id: string) => void;
  limit?: number;
  onShowAll?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items, currentUser, onAddItem, onDeleteItem, limit, onShowAll }) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'URL' | 'FILE'>('URL');

  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Or 12, depending on preference

  // Filter & Pagination Logic
  const displayedItems = limit ? items.slice(0, limit) : items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video')) {
        setType('video');
      } else {
        setType('image');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAddItem(type, url, caption);
      setUrl('');
      setCaption('');
      setShowForm(false);
    }
  };

  const openDeleteModal = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  return (
    <section id="gallery" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center gap-2">
              <ImageIcon className="text-green-600" />
              Fotoğraf ve Video Galerisi
            </h2>
            <p className="text-stone-600">Köyümüzden manzaralar ve anılar.</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 md:mt-0 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md"
            >
              <Plus size={20} />
              {showForm ? 'Paneli Kapat' : 'Medya Ekle'}
            </button>
          )}
        </div>

        {/* Admin Form */}
        {isAdmin && showForm && (
          <div className="bg-stone-50 p-6 rounded-xl shadow-inner mb-10 animate-fade-in-up border border-stone-200">
            <h3 className="text-lg font-bold mb-4 text-green-800">Galeriye Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMode('URL')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploadMode === 'URL' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <LinkIcon size={16} /> Link ile Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('FILE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploadMode === 'FILE' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Upload size={16} /> Cihazdan Yükle
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'image' | 'video')}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-green-500"
                    disabled={uploadMode === 'FILE'}
                  >
                    <option value="image">Fotoğraf</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {uploadMode === 'URL' ? 'Medya URL' : 'Dosya Seç'}
                  </label>

                  {uploadMode === 'URL' ? (
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                      placeholder="https://..."
                      required
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        required
                      />
                      {url && <p className="text-xs text-green-600 mt-1">Dosya seçildi.</p>}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                  placeholder="Köy meydanı..."
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <div
                className="w-full h-full cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700">
                    <video src={item.url} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Video className="text-white w-8 h-8" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                  <p className="text-white font-medium truncate">{item.caption || 'Başlıksız'}</p>
                  <p className="text-gray-300 text-xs">{item.date}</p>
                </div>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => openDeleteModal(e, item.id)}
                  className="absolute top-2 right-2 z-[5] bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                  title="Öğeyi Sil"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Show All / Pagination Controls */}
        {!limit && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentPage === page ? 'bg-green-700 text-white shadow-lg scale-110' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {limit && items.length > limit && onShowAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={onShowAll}
              className="bg-green-100 hover:bg-green-200 text-green-800 px-8 py-3 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2"
            >
              Tüm Galeriye Bak ({items.length})
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            if (deleteTargetId) onDeleteItem(deleteTargetId);
          }}
          title="Medya silinsin mi?"
          description="Bu fotoğrafı veya videoyu sildiğinizde galeriden kalıcı olarak kaldırılacaktır."
        />

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </button>

            <div className="max-w-4xl max-h-[80vh] w-full flex flex-col items-center">
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.url} alt={selectedItem.caption} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
              ) : (
                <video controls autoPlay src={selectedItem.url} className="max-w-full max-h-[70vh] rounded-lg shadow-2xl bg-black" />
              )}
              {selectedItem.caption && (
                <div className="mt-4 text-center">
                  <p className="text-white text-lg font-medium">{selectedItem.caption}</p>
                  <p className="text-gray-400 text-sm">{selectedItem.date}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
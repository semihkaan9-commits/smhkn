import React, { useState } from 'react';
import { NewsItem, UserRole, AnyUser } from '../types';
import { Calendar, UserCircle, Plus, Megaphone, Trash2, X, Upload, Link as LinkIcon, Pencil } from 'lucide-react';
import { DeleteModal } from './DeleteModal';
import { EditNewsModal } from './EditNewsModal';

interface NewsSectionProps {
  news: NewsItem[];
  currentUser: AnyUser | null;
  onAddNews: (title: string, content: string, imageUrl?: string) => void;
  onDeleteNews: (id: string) => void;
  onUpdateNews: (id: string, title: string, content: string, date: string) => void;
  limit?: number;
  onShowAll?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, currentUser, onAddNews, onDeleteNews, onUpdateNews, limit, onShowAll }) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Edit State
  const [editTarget, setEditTarget] = useState<NewsItem | null>(null);

  // Image Upload State
  const [uploadMode, setUploadMode] = useState<'URL' | 'FILE'>('URL');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Detail Modal State
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Pagination Logic
  const displayedNews = limit ? news.slice(0, limit) : news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newContent) {
      onAddNews(newTitle, newContent, newImageUrl);
      setNewTitle('');
      setNewContent('');
      setNewImageUrl('');
      setShowForm(false);
    }
  };

  const openDeleteModal = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const openEditModal = (e: React.MouseEvent, item: NewsItem) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTarget(item);
  };

  return (
    <section id="news" className="bg-stone-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center gap-2">
              <Megaphone className="text-green-600" />
              Köyden Haberler
            </h2>
            <p className="text-stone-600">Köyümüzdeki son gelişmeler ve duyurular.</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 md:mt-0 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md"
            >
              <Plus size={20} />
              {showForm ? 'Paneli Kapat' : 'Haber Ekle'}
            </button>
          )}
        </div>

        {/* Admin Form */}
        {isAdmin && showForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10 animate-fade-in-up border border-green-200">
            <h3 className="text-lg font-bold mb-4 text-green-800">Yeni Duyuru Yayınla</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black"
                  placeholder="Duyuru başlığı..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf (Opsiyonel)</label>

                <div className="flex gap-4 mb-2">
                  <button
                    type="button"
                    onClick={() => setUploadMode('URL')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${uploadMode === 'URL' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <LinkIcon size={14} /> Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('FILE')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${uploadMode === 'FILE' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <Upload size={14} /> Cihazdan
                  </button>
                </div>

                {uploadMode === 'URL' ? (
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black"
                    placeholder="https://..."
                  />
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {newImageUrl && <p className="text-xs text-green-600 mt-1">Görsel seçildi.</p>}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">* Eklenen fotoğraf otomatik olarak galeriye de düşecektir.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black"
                  placeholder="Duyuru detayları..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Yayınla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {displayedNews.length > 0 ? (
            displayedNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border-l-4 border-green-600 flex flex-col h-full relative group"
              >
                {/* Clickable Wrapper for Content */}
                <div
                  onClick={() => setSelectedNews(item)}
                  className="flex flex-col h-full w-full cursor-pointer"
                >
                  {item.imageUrl && (
                    <div className="h-48 w-full overflow-hidden bg-gray-100 relative rounded-tr-xl">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{item.title}</h3>
                      <div className="flex items-center text-xs text-gray-400 gap-4">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                        <span className="flex items-center gap-1"><UserCircle size={14} /> {item.author}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    <div className="mt-auto text-green-600 text-sm font-medium">
                      Detayları Görüntüle →
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-[5] flex gap-2">
                    <button
                      onClick={(e) => openEditModal(e, item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                      title="Haberi Düzenle"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => openDeleteModal(e, item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                      title="Haberi Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">Henüz yayınlanmış bir haber bulunmuyor.</p>
            </div>
          )}
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

        {limit && news.length > limit && onShowAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={onShowAll}
              className="bg-green-100 hover:bg-green-200 text-green-800 px-8 py-3 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2"
            >
              Tüm Haberleri Gör ({news.length})
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteNews(deleteTargetId);
        }}
        title="Haber silinsin mi?"
        description="Bu haberi sildiğinizde bu işlem geri alınamaz ve haber listeden kaldırılır."
      />

      {/* Edit Modal */}
      <EditNewsModal
        isOpen={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSave={onUpdateNews}
        newsItem={editTarget}
      />

      {/* Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedNews(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {selectedNews.imageUrl && (
              <div className="w-full h-64 sm:h-80">
                <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{selectedNews.title}</h2>
              <div className="flex items-center text-sm text-gray-500 gap-4 mb-6 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-1"><Calendar size={16} /> {selectedNews.date}</span>
                <span className="flex items-center gap-1"><UserCircle size={16} /> {selectedNews.author}</span>
              </div>
              <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
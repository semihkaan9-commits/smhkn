import React, { useState } from 'react';
import { DynamicSection, DynamicItem, AnyUser, UserRole } from '../types';
import { EditableText } from './EditableText';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Plus, X, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import { DeleteModal } from './DeleteModal';

interface DynamicSectionViewProps {
  section: DynamicSection;
  items: DynamicItem[];
  currentUser: AnyUser | null;
  refreshData: () => void;
}

export const DynamicSectionView: React.FC<DynamicSectionViewProps> = ({ 
  section, 
  items, 
  currentUser,
  refreshData
}) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN || (currentUser?.role as string)?.toUpperCase() === 'ADMIN';
  
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'URL' | 'FILE'>('URL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteSectionModalOpen, setDeleteSectionModalOpen] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    
    try {
      const { error } = await supabase.from('dynamic_items').insert([{
        section_id: section.id,
        title: newTitle,
        content: newContent,
        image_url: newImageUrl
      }]);
      
      if (error) throw error;
      toast.success('İçerik eklendi!');
      setNewTitle('');
      setNewContent('');
      setNewImageUrl('');
      setShowForm(false);
      refreshData();
    } catch (err: any) {
      console.error(err);
      toast.error('Giriş eklenirken bir hata oluştu');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from('dynamic_items').delete().eq('id', id);
      if (error) throw error;
      toast.success('İçerik silindi!');
      refreshData();
    } catch (err) {
      toast.error('Silinirken hata oluştu');
    }
  };

  const handleDeleteSectionConfirm = async () => {
    try {
      const { error } = await supabase.from('dynamic_sections').delete().eq('id', section.id);
      if (error) throw error;
      toast.success('Sekme başarıyla silindi.');
      refreshData();
    } catch (err) {
      toast.error('Sekme silinirken hata oluştu');
    }
    setDeleteSectionModalOpen(false);
  };

  return (
    <div id={`ds-${section.id}`} className="py-16 bg-white shrink border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-green-900 mb-2">
              <EditableText textKey={`ds.title.${section.id}`} defaultText={section.title} />
            </h2>
            <div className="text-gray-600 prose max-w-none relative">
              <EditableText as="div" textKey={`ds.content.${section.id}`} defaultText={section.content || "Yeni sekme içeriği buraya gelecek..."} />
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2 mt-4 md:mt-0">
               <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus size={20} />
                  {showForm ? 'Paneli Kapat' : 'İçerik Ekle'}
                </button>
            </div>
          )}
        </div>

        {/* Add Form */}
        {isAdmin && showForm && (
          <div className="bg-stone-50 p-6 rounded-xl shadow-lg mb-10 animate-fade-in-up border border-green-200">
            <h3 className="text-lg font-bold mb-4 text-green-800">Yeni İçerik Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                  placeholder="Başlık..."
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                    placeholder="https://..."
                  />
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black file:py-2 file:px-4 file:rounded-full file:bg-green-50 file:text-green-700"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik Açıklaması</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black"
                  placeholder="Detaylar..."
                />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Display Items List */}
        {items && items.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
                {item.image_url && (
                    <div className="h-48 w-full overflow-hidden bg-gray-100">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                )}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    {item.content && (
                       <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{item.content}</p>
                    )}
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110"
                    title="İçeriği Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Admin Delete Section Button at Bottom */}
        {isAdmin && (
           <div className="text-center mt-12 pt-6 border-t border-gray-200 border-dashed">
              <button 
                onClick={() => setDeleteSectionModalOpen(true)}
                className="text-red-500 text-sm font-medium px-4 py-2 hover:bg-red-50 rounded transition-colors"
                title="Tüm sekmeyi ve içeriklerini kaldır"
              >
                Bu Sekmeyi Tamamen Sil
              </button>
           </div>
        )}

        {/* Delete Confirmation Modal for Items */}
        <DeleteModal
          isOpen={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            if (deleteTargetId) handleDeleteItem(deleteTargetId);
            setDeleteTargetId(null);
          }}
          title="İçerik Silinsin Mi?"
          description="Bu içerik kalıcı olarak kaldırılacaktır."
        />

        {/* Delete Confirmation Modal for Section */}
        <DeleteModal
          isOpen={deleteSectionModalOpen}
          onClose={() => setDeleteSectionModalOpen(false)}
          onConfirm={handleDeleteSectionConfirm}
          title="Sekme Silinsin Mi?"
          description={`Bu sekmeyi SİLMEK istediğinize emin misiniz? (İçindeki tüm gönderiler de kalıcı olarak silinir.)`}
        />
      </div>
    </div>
  );
};

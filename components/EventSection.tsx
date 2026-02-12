import React, { useState } from 'react';
import { EventItem, UserRole, AnyUser } from '../types';
import { Calendar, UserCircle, Plus, Megaphone, Trash2, X, Upload, Link as LinkIcon, Pencil } from 'lucide-react';
import { DeleteModal } from './DeleteModal';
import { toast } from 'react-hot-toast';
import { EditEventModal } from './EditEventModal';

interface EventSectionProps {
    events: EventItem[];
    currentUser: AnyUser | null;
    onAddEvent: (title: string, content: string, imageUrl?: string, startDate?: string, endDate?: string) => void;
    onDeleteEvent: (id: string) => void;
    onUpdateEvent: (id: string, title: string, content: string, startDate?: string, endDate?: string) => void;
    limit?: number;
    onShowAll?: () => void;
}

export const EventSection: React.FC<EventSectionProps> = ({ events, currentUser, onAddEvent, onDeleteEvent, onUpdateEvent, limit, onShowAll }) => {
    const isAdmin = currentUser?.role === UserRole.ADMIN;
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modal State
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Edit State
    const [editTarget, setEditTarget] = useState<EventItem | null>(null);

    // Image Upload State
    const [uploadMode, setUploadMode] = useState<'URL' | 'FILE'>('URL');
    const [newImageUrl, setNewImageUrl] = useState('');

    // Detail Modal State
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Filter & Pagination Logic
    const displayedEvents = limit ? events.slice(0, limit) : events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(events.length / itemsPerPage);

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

        // Validation: Date Range Check
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                toast.error("Hata: Bitiş zamanı başlangıç zamanından önce olamaz!", {
                    duration: 4000,
                    icon: '⚠️'
                });
                return;
            }
        }

        if (newTitle && newContent) {
            onAddEvent(newTitle, newContent, newImageUrl, startDate, endDate);
            setNewTitle('');
            setNewContent('');
            setNewImageUrl('');
            setStartDate('');
            setEndDate('');
            setShowForm(false);
        }
    };

    // Helper to format date range
    const formatDateRange = (start?: string, end?: string) => {
        if (!start) return '';
        const s = new Date(start);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };

        if (!end) return s.toLocaleDateString('tr-TR', options);

        const e = new Date(end);
        return `${s.toLocaleDateString('tr-TR', options)} - ${e.toLocaleDateString('tr-TR', options)}`;
    };

    const openDeleteModal = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteTargetId(id);
    };

    const openEditModal = (e: React.MouseEvent, item: EventItem) => {
        e.preventDefault();
        e.stopPropagation();
        setEditTarget(item);
    };

    return (
        <section id="events" className="bg-white py-16 px-4 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center gap-2">
                            <Calendar className="text-green-600" />
                            Etkinlik Duyuruları
                        </h2>
                        <p className="text-stone-600">Köyümüzdeki yaklaşan etkinlikler ve organizasyonlar.</p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="mt-4 md:mt-0 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md"
                        >
                            <Plus size={20} />
                            {showForm ? 'Paneli Kapat' : 'Etkinlik Ekle'}
                        </button>
                    )}
                </div>

                {/* Admin Form */}
                {isAdmin && showForm && (
                    <div className="bg-stone-50 p-6 rounded-xl shadow-lg mb-10 animate-fade-in-up border border-green-200">
                        <h3 className="text-lg font-bold mb-4 text-green-800">Yeni Etkinlik Paylaş</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Başlık</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black transition-all"
                                    placeholder="Etkinlik başlığı..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Başlangıç Zamanı</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black transition-all appearance-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Etkinliğin başlayacağı tarih ve saat.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Bitiş Zamanı (Opsiyonel)</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-black transition-all appearance-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Etkinliğin biteceği tarih ve saat.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Fotoğraf (Opsiyonel)</label>

                                <div className="flex gap-4 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('URL')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${uploadMode === 'URL' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        <LinkIcon size={16} /> Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('FILE')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${uploadMode === 'FILE' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        <Upload size={16} /> Cihazdan
                                    </button>
                                </div>

                                {uploadMode === 'URL' ? (
                                    <input
                                        type="url"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black transition-all"
                                        placeholder="https://örnek-görsel.com/image.jpg"
                                    />
                                ) : (
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full p-2 border border-dashed border-gray-400 rounded-lg bg-gray-50 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                                        />
                                    </div>
                                )}
                                {newImageUrl && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Görsel kullanıma hazır.</p>}
                                <p className="text-xs text-gray-400 mt-2">* Eklenen fotoğraf otomatik olarak galeriye de eklenecektir.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik</label>
                                <textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-black transition-all"
                                    placeholder="Etkinlik detaylarını buraya yazınız..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-0.5 transition-all">
                                    Etkinliği Paylaş
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Events Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedEvents.length > 0 ? (
                        displayedEvents.map((item) => (
                            <div
                                key={item.id}
                                className="bg-stone-50 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full relative group"
                            >
                                {/* Clickable Wrapper for Content */}
                                <div
                                    onClick={() => setSelectedEvent(item)}
                                    className="flex flex-col h-full w-full cursor-pointer"
                                >
                                    {item.imageUrl && (
                                        <div className="h-48 w-full overflow-hidden bg-gray-200 relative rounded-t-xl">
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                                ETKİNLİK
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{item.title}</h3>
                                            <div className="flex flex-col text-xs text-gray-500 gap-2 mt-3">
                                                <span className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded w-fit text-green-700 font-medium">
                                                    <Calendar size={14} />
                                                    {item.startDate ? formatDateRange(item.startDate, item.endDate) : item.date}
                                                </span>
                                                <span className="flex items-center gap-2 pl-2 border-l-2 border-gray-200"><UserCircle size={14} /> {item.author}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4 text-sm">
                                            {item.content}
                                        </p>
                                        <div className="mt-auto text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Detayları İncele <span>→</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-[5] flex gap-2">
                                        <button
                                            onClick={(e) => openEditModal(e, item)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                                            title="Etkinliği Düzenle"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => openDeleteModal(e, item.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                                            title="Etkinliği Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-stone-50 rounded-lg shadow-sm border border-stone-200">
                            <p className="text-gray-500">Henüz planlanmış bir etkinlik bulunmuyor.</p>
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

                {limit && events.length > limit && onShowAll && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={onShowAll}
                            className="bg-green-100 hover:bg-green-200 text-green-800 px-8 py-3 rounded-full font-bold transition-colors shadow-sm flex items-center gap-2"
                        >
                            Tüm Etkinlikleri Gör ({events.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={deleteTargetId !== null}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={() => {
                    if (deleteTargetId) onDeleteEvent(deleteTargetId);
                }}
                title="Etkinlik silinsin mi?"
                description="Bu etkinliği sildiğinizde bu işlem geri alınamaz ve listeden kaldırılır."
            />

            {/* Edit Modal */}
            <EditEventModal
                isOpen={editTarget !== null}
                onClose={() => setEditTarget(null)}
                onSave={onUpdateEvent}
                eventItem={editTarget}
            />

            {/* Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {selectedEvent.imageUrl && (
                            <div className="w-full h-64 sm:h-80">
                                <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">{selectedEvent.title}</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-4 mb-6 pb-6 border-b border-gray-100">
                                <span className="flex items-center gap-2 font-medium text-green-700 bg-green-50 w-fit px-3 py-1.5 rounded-full border border-green-100">
                                    <Calendar size={18} />
                                    {selectedEvent.startDate ? formatDateRange(selectedEvent.startDate, selectedEvent.endDate) : selectedEvent.date}
                                </span>
                                <span className="flex items-center gap-2"><UserCircle size={18} /> Paylaşan: {selectedEvent.author}</span>
                            </div>
                            <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                {selectedEvent.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

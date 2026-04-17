import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import { ChevronLeftIcon } from '../components/Icons';
import ProgressBar from '../components/ProgressBar';
import NotesScreen from './NotesScreen';

const BookDetailScreen = ({ book, onClose, onBookUpdated }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [isCurrentReading, setIsCurrentReading] = useState(false);

  const checkIfCurrentReading = useCallback(async () => {
    const reading = await db.getCurrentReading();
    setIsCurrentReading(reading?.id === book.id);
  }, [book.id]);

  useEffect(() => {
    const fetch = async () => {
      await checkIfCurrentReading();
    };
    fetch();
  }, [checkIfCurrentReading]);

  const handleSetAsCurrentReading = async () => {
    await db.setAsCurrentReading(book.id);
    setIsCurrentReading(true);
    onBookUpdated?.();
  };

  const handleRemoveFromLibrary = async () => {
    if (confirm('¿Eliminar este libro de tu biblioteca?')) {
      await db.books.delete(book.id);
      onBookUpdated?.();
      onClose();
    }
  };

  const handleUpdateProgress = async (progress) => {
    await db.books.update(book.id, { progress });
    setCurrentBook({ ...currentBook, progress });
    onBookUpdated?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#F2F2F7] safe-top overflow-y-auto">
        <div className="sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-ios px-4 py-3 border-b border-gray-200/50 safe-top">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 transition-colors">
              <ChevronLeftIcon />
            </button>
            <h2 className="font-semibold text-lg flex-1">Detalles</h2>
            <button onClick={handleRemoveFromLibrary} className="text-red-500 text-sm px-3 py-1.5 hover:bg-red-50 rounded-full transition-colors">Eliminar</button>
          </div>
        </div>

        <div className="p-5 pb-24">
          <div className="flex gap-5 mb-8">
            <div className="w-32 flex-shrink-0">
              {currentBook.coverUrl ? (
                <img src={currentBook.coverUrl} alt={currentBook.title} className="w-full rounded-2xl shadow-lg" />
              ) : (
                <div className="w-full aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-5xl">📖</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold leading-tight mb-1">{currentBook.title}</h1>
              <p className="text-ios-gray text-base mb-4">{currentBook.author}</p>
              {!isCurrentReading ? (
                <button onClick={handleSetAsCurrentReading} className="bg-ios-blue text-white px-4 py-2 rounded-full text-sm font-medium w-full">Marcar como Lectura Actual</button>
              ) : (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium text-center">✓ Lectura Actual</div>
              )}
            </div>
          </div>

          {isCurrentReading && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Progreso de Lectura</h3>
                <span className="text-ios-blue font-medium">{currentBook.progress || 0}%</span>
              </div>
              <ProgressBar progress={currentBook.progress || 0} />
              <input type="range" min="0" max="100" value={currentBook.progress || 0} onChange={(e) => handleUpdateProgress(parseInt(e.target.value))} className="w-full mt-4 accent-ios-blue" />
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button onClick={() => setShowNotes(true)} className="w-full p-5 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div><h3 className="font-semibold text-lg mb-1">Notas y Citas</h3><p className="text-ios-gray text-sm">Gestiona tus notas para este libro</p></div>
                <span className="text-ios-blue text-2xl">→</span>
              </div>
            </button>
          </div>

          <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-semibold mb-3">Información</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ios-gray">Añadido</span><span>{new Date(currentBook.createdAt).toLocaleDateString('es-ES')}</span></div>
              <div className="flex justify-between"><span className="text-ios-gray">Estado</span><span className="capitalize">{currentBook.status === 'owned' ? 'En biblioteca' : 'Lectura actual'}</span></div>
            </div>
          </div>
        </div>
      </div>
      {showNotes && <NotesScreen book={currentBook} onClose={() => setShowNotes(false)} />}
    </>
  );
};

export default BookDetailScreen;

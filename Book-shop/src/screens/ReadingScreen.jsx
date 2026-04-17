import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import ProgressBar from '../components/ProgressBar';
import { v4 as uuidv4 } from 'uuid';

const ReadingScreen = ({ onNavigateToDetail }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [quickNote, setQuickNote] = useState('');
  const [recentNotes, setRecentNotes] = useState([]);

  const loadCurrentBook = useCallback(async () => {
    const book = await db.getCurrentReading();
    setCurrentBook(book);
    if (book) {
      const notes = await db.getBookNotes(book.id);
      setRecentNotes(notes.slice(0, 3));
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      await loadCurrentBook();
    };
    fetch();
  }, [loadCurrentBook]);

  const handleAddQuickNote = async () => {
    if (!quickNote.trim() || !currentBook) return;
    
    await db.notes.add({
      id: uuidv4(),
      bookId: currentBook.id,
      content: quickNote,
      createdAt: new Date()
    });
    
    setQuickNote('');
    loadCurrentBook();
  };

  const handleUpdateProgress = async (newProgress) => {
    if (!currentBook) return;
    await db.books.update(currentBook.id, { progress: newProgress });
    setCurrentBook({ ...currentBook, progress: newProgress });
  };

  if (!currentBook) {
    return (
      <div className="p-5 pt-10 safe-top">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Lectura Actual</h1>
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
          <span className="text-5xl mb-4 block">📚</span>
          <p className="text-ios-gray mb-4">No tienes ningún libro en lectura</p>
          <p className="text-sm text-ios-gray">
            Ve a tu Biblioteca y selecciona un libro como "Lectura Actual"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 pt-10 safe-top pb-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Lectura Actual</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex p-4 gap-4">
          <div className="w-28 flex-shrink-0">
            {currentBook.coverUrl ? (
              <img src={currentBook.coverUrl} alt={currentBook.title} className="w-full rounded-xl" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-100 rounded-xl flex items-center justify-center text-3xl">📖</div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <h2 className="text-lg font-semibold leading-tight">{currentBook.title}</h2>
              <p className="text-ios-gray text-sm mt-1">{currentBook.author}</p>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs font-medium text-ios-gray mb-1.5">
                <span>Progreso</span>
                <span>{currentBook.progress || 0}%</span>
              </div>
              <ProgressBar progress={currentBook.progress || 0} />
              <input 
                type="range"
                min="0"
                max="100"
                value={currentBook.progress || 0}
                onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
                className="w-full mt-3 accent-ios-blue"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-3 bg-gray-50/50">
          <button 
            onClick={() => onNavigateToDetail(currentBook)}
            className="w-full text-left px-3 py-2 text-ios-blue font-medium text-sm hover:bg-blue-50 rounded-xl transition-colors"
          >
            ✏️ Ver todas las notas
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Nota rápida</h3>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Escribe una cita o pensamiento..."
            className="w-full p-3 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ios-blue/20"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddQuickNote}
              disabled={!quickNote.trim()}
              className="bg-ios-blue text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-all"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {recentNotes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Notas recientes</h3>
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-2xl border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
                <p className="text-ios-gray text-xs mt-2">
                  {new Date(note.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingScreen;

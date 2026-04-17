import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import { PlusIcon } from '../components/Icons';
import { v4 as uuidv4 } from 'uuid';

const LibraryScreen = ({ onNavigateToDetail }) => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', coverUrl: '', progress: 0 });

  const loadBooks = useCallback(async () => {
    const libraryBooks = await db.getLibraryBooks();
    setBooks(libraryBooks);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      await loadBooks();
    };
    fetch();
  }, [loadBooks]);

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) return;
    const book = { id: uuidv4(), ...newBook, status: 'owned', createdAt: new Date() };
    await db.books.add(book);
    setNewBook({ title: '', author: '', coverUrl: '', progress: 0 });
    setShowAddModal(false);
    loadBooks();
  };

  return (
    <div className="p-5 pt-10 safe-top pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mi Biblioteca</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-ios-blue text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <PlusIcon />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {books.length === 0 ? (
          <div className="col-span-2 text-center py-16">
            <span className="text-6xl mb-4 block opacity-40">📚</span>
            <p className="text-ios-gray text-lg mb-2">Biblioteca vacía</p>
            <p className="text-ios-gray text-sm">Toca el botón + para añadir tu primer libro</p>
          </div>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} onClick={() => onNavigateToDetail(book)} />)
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Añadir Libro">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ios-gray mb-2">Título *</label>
            <input type="text" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} placeholder="Ej: Cien años de soledad" className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ios-gray mb-2">Autor *</label>
            <input type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} placeholder="Ej: Gabriel García Márquez" className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ios-gray mb-2">URL de la Portada</label>
            <input type="text" value={newBook.coverUrl} onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" />
          </div>
          <button onClick={handleAddBook} disabled={!newBook.title || !newBook.author} className="w-full bg-ios-blue text-white py-3 rounded-full font-medium disabled:opacity-50 transition-all mt-4">
            Guardar Libro
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LibraryScreen;

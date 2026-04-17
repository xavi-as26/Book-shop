import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import Modal from '../components/Modal';
import { PlusIcon } from '../components/Icons';
import { v4 as uuidv4 } from 'uuid';

const WishlistScreen = () => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', coverUrl: '', price: '', purchaseLink: '' });

  const loadBooks = useCallback(async () => {
    const wishlistBooks = await db.getWishlistBooks();
    setBooks(wishlistBooks);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      await loadBooks();
    };
    fetch();
  }, [loadBooks]);

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) return;
    const book = { id: uuidv4(), ...newBook, price: parseFloat(newBook.price) || null, status: 'wishlist', createdAt: new Date() };
    await db.books.add(book);
    setNewBook({ title: '', author: '', coverUrl: '', price: '', purchaseLink: '' });
    setShowAddModal(false);
    loadBooks();
  };

  const handleMoveToLibrary = async (bookId) => {
    await db.books.update(bookId, { status: 'owned' });
    loadBooks();
  };

  const handleDelete = async (bookId) => {
    await db.books.delete(bookId);
    loadBooks();
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <div className="p-5 pt-10 safe-top pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Lista de Deseos</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-ios-blue text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <PlusIcon />
        </button>
      </div>

      <div className="space-y-3">
        {books.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block opacity-40">⭐</span>
            <p className="text-ios-gray text-lg mb-2">Lista de deseos vacía</p>
            <p className="text-ios-gray text-sm">Añade libros que quieras comprar en el futuro</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex gap-4">
                <div className="w-20 flex-shrink-0">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full rounded-lg" />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-ios-gray text-sm">{book.author}</p>
                  {book.price && <p className="text-ios-blue font-medium text-lg mt-1">{formatPrice(book.price)}</p>}
                  <div className="flex gap-2 mt-3">
                    {book.purchaseLink && (
                      <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="bg-ios-blue text-white px-4 py-2 rounded-full text-xs font-medium">Comprar</a>
                    )}
                    <button onClick={() => handleMoveToLibrary(book.id)} className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-medium">Ya lo tengo</button>
                    <button onClick={() => handleDelete(book.id)} className="text-red-500 text-xs px-3 py-2">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Añadir a Deseos">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-ios-gray mb-2">Título *</label><input type="text" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} placeholder="Ej: El Principito" className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" /></div>
          <div><label className="block text-sm font-medium text-ios-gray mb-2">Autor *</label><input type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} placeholder="Ej: Antoine de Saint-Exupéry" className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" /></div>
          <div><label className="block text-sm font-medium text-ios-gray mb-2">Precio (CLP)</label><input type="number" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} placeholder="Ej: 15990" className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" /></div>
          <div><label className="block text-sm font-medium text-ios-gray mb-2">Link de Compra</label><input type="url" value={newBook.purchaseLink} onChange={(e) => setNewBook({ ...newBook, purchaseLink: e.target.value })} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" /></div>
          <div><label className="block text-sm font-medium text-ios-gray mb-2">URL de Portada</label><input type="text" value={newBook.coverUrl} onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })} placeholder="https://..." className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/20" /></div>
          <button onClick={handleAddBook} disabled={!newBook.title || !newBook.author} className="w-full bg-ios-blue text-white py-3 rounded-full font-medium disabled:opacity-50 transition-all mt-4">Añadir a Deseos</button>
        </div>
      </Modal>
    </div>
  );
};

export default WishlistScreen;

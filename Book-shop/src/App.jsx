import { useState, useEffect, useCallback } from 'react';
import TabBar from './components/TabBar';
import ReadingScreen from './screens/ReadingScreen';
import LibraryScreen from './screens/LibraryScreen';
import WishlistScreen from './screens/WishlistScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import { db } from './db/database';

const sampleBooks = [
  { id: '1', title: 'El Problema de los Tres Cuerpos', author: 'Cixin Liu', coverUrl: 'https://m.media-amazon.com/images/I/81rAniA3YIL._SL1500_.jpg', status: 'reading', progress: 45, createdAt: new Date('2024-01-01') },
  { id: '2', title: 'Dune', author: 'Frank Herbert', coverUrl: 'https://m.media-amazon.com/images/I/81Tqk7W4CbL._SL1500_.jpg', status: 'owned', progress: 100, createdAt: new Date('2023-12-15') },
  { id: '3', title: 'Project Hail Mary', author: 'Andy Weir', coverUrl: 'https://m.media-amazon.com/images/I/81S+D9mFL6L._SL1500_.jpg', status: 'wishlist', price: 18990, purchaseLink: 'https://www.buscalibre.cl', createdAt: new Date('2024-01-10') }
];

function App() {
  const [activeTab, setActiveTab] = useState('reading');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeDatabase = useCallback(async () => {
    const bookCount = await db.books.count();
    if (bookCount === 0) {
      for (const book of sampleBooks) {
        await db.books.add(book);
      }
      await db.notes.add({ id: 'note1', bookId: '1', content: 'El concepto de la esfera de Dyson es fascinante. Los Trisolarianos son una civilización increíblemente resiliente.', createdAt: new Date('2024-01-15') });
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
    };
    init();
  }, [initializeDatabase]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleNavigateToDetail = (book) => setSelectedBook(book);
  const handleCloseDetail = () => setSelectedBook(null);
  const handleBookUpdated = () => setRefreshKey(prev => prev + 1);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]"><div className="text-center"><span className="text-5xl mb-4 block animate-pulse">📚</span><p className="text-ios-gray">Cargando biblioteca...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="pb-24">
        {activeTab === 'reading' && <ReadingScreen key={`reading-${refreshKey}`} onNavigateToDetail={handleNavigateToDetail} />}
        {activeTab === 'library' && <LibraryScreen key={`library-${refreshKey}`} onNavigateToDetail={handleNavigateToDetail} />}
        {activeTab === 'wishlist' && <WishlistScreen key={`wishlist-${refreshKey}`} />}
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {selectedBook && <BookDetailScreen book={selectedBook} onClose={handleCloseDetail} onBookUpdated={handleBookUpdated} />}
    </div>
  );
}

export default App;

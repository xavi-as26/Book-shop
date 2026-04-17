const BookCard = ({ book, onClick, showProgress = false }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform duration-150"
    >
      <div className="aspect-[2/3] bg-gray-100 relative">
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl">📖</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{book.title}</h3>
        <p className="text-ios-gray text-xs mt-1">{book.author}</p>
        {showProgress && book.progress !== undefined && (
          <div className="mt-2">
            <ProgressBar progress={book.progress} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;

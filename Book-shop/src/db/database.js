import Dexie from 'dexie';

export class EstanteDB extends Dexie {
  constructor() {
    super('EstanteDB');
    
    this.version(1).stores({
      books: 'id, status, title, author, createdAt',
      notes: 'id, bookId, createdAt'
    });
    
    this.books = this.table('books');
    this.notes = this.table('notes');
  }

  async getCurrentReading() {
    return await this.books.where('status').equals('reading').first();
  }

  async getLibraryBooks() {
    return await this.books.where('status').equals('owned').toArray();
  }

  async getWishlistBooks() {
    return await this.books.where('status').equals('wishlist').toArray();
  }

  async setAsCurrentReading(bookId) {
    await this.books.where('status').equals('reading').modify({ status: 'owned' });
    return await this.books.update(bookId, { status: 'reading' });
  }

  async getBookNotes(bookId) {
    return await this.notes.where('bookId').equals(bookId).reverse().sortBy('createdAt');
  }
}

export const db = new EstanteDB();

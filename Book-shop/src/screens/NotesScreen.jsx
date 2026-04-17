import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeftIcon } from '../components/Icons';

const NotesScreen = ({ book, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = useCallback(async () => {
    const bookNotes = await db.getBookNotes(book.id);
    setNotes(bookNotes);
  }, [book.id]);

  useEffect(() => {
    const fetch = async () => {
      await loadNotes();
    };
    fetch();
  }, [loadNotes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    await db.notes.add({
      id: uuidv4(),
      bookId: book.id,
      content: newNote,
      createdAt: new Date()
    });
    
    setNewNote('');
    loadNotes();
  };

  const handleDeleteNote = async (noteId) => {
    await db.notes.delete(noteId);
    loadNotes();
  };

  const handleUpdateNote = async (noteId, content) => {
    await db.notes.update(noteId, { content });
    setEditingNote(null);
    loadNotes();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F2F7] safe-top">
      <div className="sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-ios px-4 py-3 border-b border-gray-200/50 safe-top">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{book.title}</h2>
            <p className="text-ios-gray text-xs">Notas y citas</p>
          </div>
        </div>
      </div>

      <div className="p-5 pb-24">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nueva nota..."
            className="w-full p-3 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ios-blue/20"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="bg-ios-blue text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50 transition-all"
            >
              Guardar nota
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-3 block opacity-50">📝</span>
              <p className="text-ios-gray">No hay notas todavía</p>
              <p className="text-ios-gray text-sm mt-1">Añade citas, pensamientos o reflexiones</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                {editingNote === note.id ? (
                  <div>
                    <textarea
                      defaultValue={note.content}
                      onBlur={(e) => handleUpdateNote(note.id, e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ios-blue/20"
                      rows="4"
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-ios-gray text-xs">
                        {new Date(note.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingNote(note.id)} className="text-ios-blue text-xs px-3 py-1.5 hover:bg-blue-50 rounded-full">Editar</button>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 text-xs px-3 py-1.5 hover:bg-red-50 rounded-full">Eliminar</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesScreen;

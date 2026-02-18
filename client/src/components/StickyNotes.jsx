import { useState, useEffect, useCallback } from 'react';
import { Pin, X } from 'lucide-react';

const COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecdd3', '#e9d5ff', '#fed7aa', '#a5f3fc'];

export default function StickyNotes() {
    const [notes, setNotes] = useState([]);

    const loadNotes = useCallback(() => {
        const saved = JSON.parse(localStorage.getItem('stickyNotes') || '[]');
        setNotes(saved);
    }, []);

    useEffect(() => {
        loadNotes();
        window.addEventListener('notesUpdated', loadNotes);
        return () => window.removeEventListener('notesUpdated', loadNotes);
    }, [loadNotes]);

    const saveNotes = (updated) => {
        setNotes(updated);
        localStorage.setItem('stickyNotes', JSON.stringify(updated));
    };

    const updateNote = (id, text) => {
        saveNotes(notes.map(n => n.id === id ? { ...n, text } : n));
    };

    const deleteNote = (id) => {
        saveNotes(notes.filter(n => n.id !== id));
    };

    if (notes.length === 0) {
        return (
            <div className="text-center py-6">
                <Pin size={28} className="mx-auto mb-2 text-gray-400" />
                <p className="text-[10px] text-gray-400 italic">No sticky notes yet. Click "+ Add" to jot something down!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            {notes.map((note) => (
                <div
                    key={note.id}
                    className="relative group rounded-xl p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{
                        backgroundColor: note.color,
                        transform: `rotate(${(note.id % 3 - 1) * 0.8}deg)`,
                    }}
                >
                    <button
                        onClick={() => deleteNote(note.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 flex items-center justify-center z-10"
                    >
                        <X size={10} />
                    </button>
                    <textarea
                        value={note.text}
                        onChange={(e) => updateNote(note.id, e.target.value)}
                        placeholder="Type your note..."
                        rows={2}
                        className="w-full bg-transparent text-gray-800 text-[11px] leading-relaxed outline-none resize-none placeholder-gray-500/50 font-medium"
                        style={{ fontFamily: "'Segoe UI', sans-serif" }}
                    />
                    <div className="text-[8px] text-gray-500/60 text-right mt-1 font-medium">
                        {new Date(note.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                </div>
            ))}
        </div>
    );
}

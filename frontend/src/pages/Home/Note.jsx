import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import NoteCard from "../../components/Cards/NoteCard";
import AddEditNotes from "./AddEditNotes";
import baseURL from "../../environment";

const Note = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [showModal, setShowModal] = useState({ isShown: false, type: "add", data: null });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please log in"); navigate("/login"); return; }
    getAllNotes();
  }, []);

  const getAllNotes = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${baseURL}/api/note/all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (res.data.success) {
        setAllNotes(res.data.notes);
        setFilteredNotes(res.data.notes);
        setIsSearch(false);
        setActiveTag(null);
        setSearchQuery("");
      }
    } catch {
      toast.error("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) { setFilteredNotes(allNotes); setIsSearch(false); return; }
    setIsSearch(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${baseURL}/api/note/search`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (res.data.success) setFilteredNotes(res.data.notes);
    } catch {
      toast.error("Search failed.");
    }
  };

  const handleTagFilter = (tag) => {
    if (activeTag === tag) {
      setActiveTag(null);
      setFilteredNotes(allNotes);
    } else {
      setActiveTag(tag);
      setFilteredNotes(allNotes.filter(n => n.tags?.includes(tag)));
    }
  };

  const deleteNote = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${baseURL}/api/note/delete/${confirmDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Note deleted.");
        getAllNotes();
      }
    } catch {
      toast.error("Failed to delete note.");
    } finally {
      setConfirmDelete(null);
    }
  };

  const updateIsPinned = async (note) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${baseURL}/api/note/update-note-pinned/${note._id}`,
        { isPinned: !note.isPinned },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      getAllNotes();
    } catch {
      toast.error("Failed to update note.");
    }
  };

  // All unique tags
  const allTags = [...new Set(allNotes.flatMap(n => n.tags || []))];

  // Separate pinned and unpinned
  const pinned = filteredNotes.filter(n => n.isPinned);
  const unpinned = filteredNotes.filter(n => !n.isPinned);

  const noteColorIndex = (note, idx) => allNotes.indexOf(note) >= 0 ? allNotes.indexOf(note) : idx;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-sm text-gray-400">{allNotes.length} notes total</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              className="ff-input pl-9 h-9 text-sm w-52"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button onClick={getAllNotes}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowModal({ isShown: true, type: "add", data: null })}
            className="ff-btn ff-btn-primary">
            <i className="fa-solid fa-plus text-sm"></i> New Note
          </button>
        </div>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <span className="text-xs text-gray-400 self-center">Filter:</span>
          {allTags.map(tag => (
            <button key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`ff-badge cursor-pointer transition-all ${activeTag === tag ? "ff-badge-primary" : "ff-badge-gray"}`}>
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-44"></div>
          ))}
        </div>
      )}

      {/* Notes */}
      {!loading && filteredNotes.length === 0 && (
        <div className="ff-card p-16 text-center">
          <i className="fa-solid fa-sticky-note text-5xl text-gray-200 mb-4"></i>
          <h3 className="text-lg font-600 text-gray-500 mb-2" style={{ fontWeight: 600 }}>
            {isSearch || activeTag ? "No notes found" : "No notes yet"}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {isSearch || activeTag
              ? "Try a different search term or tag."
              : "Capture your ideas, thoughts, and reminders."}
          </p>
          {!isSearch && !activeTag && (
            <button onClick={() => setShowModal({ isShown: true, type: "add", data: null })}
              className="ff-btn ff-btn-primary">
              <i className="fa-solid fa-plus"></i> Create Your First Note
            </button>
          )}
        </div>
      )}

      {!loading && filteredNotes.length > 0 && (
        <>
          {/* Pinned notes */}
          {pinned.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-thumbtack text-indigo-400 text-xs rotate-45"></i>
                <span className="text-xs font-600 text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Pinned ({pinned.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {pinned.map((note, idx) => (
                    <motion.div
                      key={note._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}>
                      <NoteCard
                        title={note.title}
                        date={note.createdAt}
                        content={note.content}
                        tags={note.tags}
                        isPinned={note.isPinned}
                        colorIndex={noteColorIndex(note, idx)}
                        onEdit={() => setShowModal({ isShown: true, type: "edit", data: note })}
                        onDelete={() => setConfirmDelete(note)}
                        onPinNote={() => updateIsPinned(note)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* All / unpinned notes */}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-sticky-note text-gray-300 text-xs"></i>
                  <span className="text-xs font-600 text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    Notes ({unpinned.length})
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {unpinned.map((note, idx) => (
                    <motion.div
                      key={note._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}>
                      <NoteCard
                        title={note.title}
                        date={note.createdAt}
                        content={note.content}
                        tags={note.tags}
                        isPinned={note.isPinned}
                        colorIndex={noteColorIndex(note, idx + pinned.length)}
                        onEdit={() => setShowModal({ isShown: true, type: "edit", data: note })}
                        onDelete={() => setConfirmDelete(note)}
                        onPinNote={() => updateIsPinned(note)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal.isShown && (
          <AddEditNotes
            onClose={() => setShowModal({ isShown: false, type: "add", data: null })}
            noteData={showModal.data}
            type={showModal.type}
            getAllNotes={getAllNotes}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="ff-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ff-modal p-6 max-w-sm text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-trash text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>Delete Note?</h3>
              <p className="text-sm text-gray-500 mb-6">
                "{confirmDelete.title}" will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
                <button onClick={deleteNote} className="ff-btn ff-btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Note;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import baseURL from "../../environment";

const DECK_COLORS = [
  { bg: "#EEF2FF", icon: "#4F46E5" },
  { bg: "#F0FDF4", icon: "#22C55E" },
  { bg: "#FFFBEB", icon: "#F59E0B" },
  { bg: "#FEF2F2", icon: "#EF4444" },
  { bg: "#FAF5FF", icon: "#7C3AED" },
  { bg: "#EFF6FF", icon: "#0EA5E9" },
];

function DeckModal({ deck, onClose, onSave }) {
  const [name, setName] = useState(deck?.name || "");
  const [description, setDescription] = useState(deck?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Deck name is required"); return; }
    setLoading(true);
    try {
      await onSave({ name: name.trim(), description: description.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ff-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="ff-modal p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-600 text-gray-800" style={{ fontWeight: 600 }}>
            {deck?._id ? "Edit Deck" : "New Deck"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-times text-gray-500"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
              Deck Name *
            </label>
            <input className="ff-input" placeholder="e.g. Biology Chapter 3"
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()} autoFocus />
          </div>
          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>
              Description
            </label>
            <textarea className="ff-input resize-none" rows={3}
              placeholder="What will you study in this deck?"
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="ff-btn ff-btn-primary flex-1">
            {loading ? <><i className="fa-solid fa-spinner animate-spin text-sm mr-1"></i>Saving...</> : deck?._id ? "Save Changes" : "Create Deck"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AllDecks() {
  const [decks, setDecks] = useState([]);
  const [cardCounts, setCardCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDeck, setEditDeck] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchDecks = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/flash/createDeck/all`, { withCredentials: true });
      const deckList = res.data || [];
      setDecks(deckList);
      // Fetch card counts for each deck
      const counts = {};
      await Promise.allSettled(
        deckList.map(async (deck) => {
          try {
            const r = await axios.get(`${baseURL}/api/flash/createcard/deck/${deck._id}`, { withCredentials: true });
            counts[deck._id] = r.data.cards?.length || 0;
          } catch { counts[deck._id] = 0; }
        })
      );
      setCardCounts(counts);
    } catch (err) {
      toast.error("Failed to load decks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDecks(); }, []);

  const handleCreate = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/api/flash/createDeck/create`,
        { name: data.name, description: data.description },
        { withCredentials: true }
      );
      toast.success("Deck created!");
      setModalOpen(false);
      fetchDecks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create deck");
    }
  };

  const handleEdit = async (data) => {
    try {
      await axios.put(`${baseURL}/api/flash/createDeck/${editDeck._id}`,
        { name: data.name },
        { withCredentials: true }
      );
      toast.success("Deck updated!");
      setEditDeck(null);
      fetchDecks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update deck");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/flash/createDeck/${deleteConfirm}`, { withCredentials: true });
      setDecks(prev => prev.filter(d => d._id !== deleteConfirm));
      toast.success("Deck deleted");
    } catch (err) {
      toast.error("Failed to delete deck");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const totalCards = Object.values(cardCounts).reduce((sum, n) => sum + n, 0);
  const filtered = decks.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Decks",   value: decks.length, icon: "fa-solid fa-layer-group",   color: "#4F46E5" },
          { label: "Total Cards",   value: totalCards,   icon: "fa-solid fa-id-card",        color: "#22C55E" },
          { label: "Ready to Study",value: decks.filter(d => (cardCounts[d._id] || 0) > 0).length,
            icon: "fa-solid fa-graduation-cap", color: "#F59E0B" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-2xl font-700 mt-1" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: s.color + "15" }}>
                <i className={s.icon} style={{ color: s.color }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input className="ff-input pl-9 h-9 text-sm w-full"
            placeholder="Search decks..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setModalOpen(true)} className="ff-btn ff-btn-primary">
          <i className="fa-solid fa-plus text-sm"></i> New Deck
        </button>
      </div>

      {/* Decks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-40"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ff-card p-12 text-center">
          <i className="fa-solid fa-layer-group text-5xl text-gray-200 mb-4"></i>
          <h3 className="text-lg font-600 text-gray-500 mb-2" style={{ fontWeight: 600 }}>
            {search ? "No decks found" : "No decks yet"}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {search ? "Try a different search." : "Create your first deck and start learning!"}
          </p>
          {!search && (
            <button onClick={() => setModalOpen(true)} className="ff-btn ff-btn-primary">
              <i className="fa-solid fa-plus"></i> Create First Deck
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((deck, idx) => {
              const color = DECK_COLORS[idx % DECK_COLORS.length];
              const count = cardCounts[deck._id] || 0;
              return (
                <motion.div
                  key={deck._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="ff-card p-5 cursor-pointer group hover:shadow-lg transition-all"
                  onClick={() => navigate(`/flashcard/dashboard/${deck._id}`)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: color.bg }}>
                      <i className="fa-solid fa-layer-group text-lg" style={{ color: color.icon }}></i>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setEditDeck(deck); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-pen text-gray-400 text-xs"></i>
                      </button>
                      <button onClick={() => setDeleteConfirm(deck._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <i className="fa-solid fa-trash text-gray-400 text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-600 text-gray-800 mb-1 truncate" style={{ fontWeight: 600 }}>
                    {deck.name}
                  </h3>
                  {deck.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{deck.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="ff-badge ff-badge-gray text-xs">
                      <i className="fa-solid fa-id-card mr-1 text-xs"></i>
                      {count} card{count !== 1 ? "s" : ""}
                    </span>
                    {count > 0 ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/flashcard/study/${deck._id}`); }}
                        className="ff-btn text-xs py-1 px-3"
                        style={{ background: color.bg, color: color.icon, border: "none" }}>
                        <i className="fa-solid fa-play text-xs mr-1"></i>Study
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">No cards yet</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {modalOpen && (
          <DeckModal onClose={() => setModalOpen(false)} onSave={handleCreate} />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editDeck && (
          <DeckModal deck={editDeck} onClose={() => setEditDeck(null)} onSave={handleEdit} />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="ff-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ff-modal p-6 max-w-sm text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-layer-group text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg font-600 text-gray-800 mb-2" style={{ fontWeight: 600 }}>Delete Deck?</h3>
              <p className="text-sm text-gray-500 mb-6">This deck and all its cards will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
                <button onClick={confirmDelete} className="ff-btn ff-btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

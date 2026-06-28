import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import baseURL from "../../environment";

function CardModal({ card, onClose, onSave }) {
  const [term, setTerm] = useState(card?.term || "");
  const [definition, setDefinition] = useState(card?.defination || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!term.trim() || !definition.trim()) { toast.error("Both term and definition are required"); return; }
    setLoading(true);
    try { await onSave({ term: term.trim(), defination: definition.trim() }); }
    finally { setLoading(false); }
  };

  return (
    <div className="ff-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="ff-modal p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg text-gray-800" style={{ fontWeight: 600 }}>
            {card?._id ? "Edit Card" : "Add Card"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <i className="fa-solid fa-times text-gray-500"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Term *</label>
            <input className="ff-input" placeholder="e.g. Photosynthesis"
              value={term} onChange={e => setTerm(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Definition *</label>
            <textarea className="ff-input resize-none" rows={4}
              placeholder="e.g. The process by which plants convert sunlight..."
              value={definition} onChange={e => setDefinition(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="ff-btn ff-btn-primary flex-1">
            {loading ? <><i className="fa-solid fa-spinner animate-spin text-sm mr-1"></i>Saving...</> : card?._id ? "Save Changes" : "Add Card"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function DeckDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState({});

  const fetchDeck = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/flash/createdeck/one/${id}`, { withCredentials: true });
      setDeck(res.data.deck);
      setCards(res.data.cards || []);
    } catch { toast.error("Failed to load deck"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeck(); }, [id]);

  const handleAddCard = async (data) => {
    try {
      await axios.post(`${baseURL}/api/flash/createcard/create`,
        { term: data.term, defination: data.defination, deckName: [id] },
        { withCredentials: true });
      toast.success("Card added!");
      setAddOpen(false);
      fetchDeck();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add card");
    }
  };

  const handleEditCard = async (data) => {
    try {
      await axios.put(`${baseURL}/api/flash/createcard/${editCard._id}`,
        { term: data.term, defination: data.defination },
        { withCredentials: true });
      toast.success("Card updated!");
      setEditCard(null);
      fetchDeck();
    } catch { toast.error("Failed to update card"); }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/flash/createcard/${deleteConfirm}`, { withCredentials: true });
      setCards(prev => prev.filter(c => c._id !== deleteConfirm));
      toast.success("Card deleted");
    } catch { toast.error("Failed to delete card"); }
    finally { setDeleteConfirm(null); }
  };

  const toggleFlip = (cardId) => setFlipped(prev => ({ ...prev, [cardId]: !prev[cardId] }));

  const filtered = cards.filter(c =>
    c.term.toLowerCase().includes(search.toLowerCase()) ||
    c.defination.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton rounded-2xl h-24"></div>)}
    </div>
  );

  if (!deck) return (
    <div className="ff-card p-12 text-center">
      <i className="fa-solid fa-circle-exclamation text-4xl text-gray-200 mb-3"></i>
      <p className="text-gray-500">Deck not found</p>
      <button onClick={() => navigate("/flashcard")} className="ff-btn ff-btn-primary mt-4">Back to Decks</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate("/flashcard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <i className="fa-solid fa-arrow-left"></i>
          <span>All Decks</span>
        </button>
        <div className="flex items-center gap-2">
          {cards.length > 0 && (
            <button onClick={() => navigate(`/flashcard/study/${id}`)}
              className="ff-btn ff-btn-primary">
              <i className="fa-solid fa-graduation-cap text-sm"></i> Study
            </button>
          )}
          <button onClick={() => setAddOpen(true)} className="ff-btn ff-btn-secondary">
            <i className="fa-solid fa-plus text-sm"></i> Add Card
          </button>
        </div>
      </div>

      {/* Deck Header */}
      <div className="ff-card p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl text-gray-800 mb-1" style={{ fontWeight: 600 }}>{deck.name}</h2>
            {deck.description && <p className="text-sm text-gray-500">{deck.description}</p>}
          </div>
          <div className="text-center">
            <p className="text-2xl" style={{ fontWeight: 700, color: "#4F46E5" }}>{cards.length}</p>
            <p className="text-xs text-gray-400">Cards</p>
          </div>
        </div>
      </div>

      {/* Search */}
      {cards.length > 0 && (
        <div className="relative mb-5">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input className="ff-input pl-9 h-9 text-sm w-full"
            placeholder="Search cards..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* Cards */}
      {cards.length === 0 ? (
        <div className="ff-card p-12 text-center">
          <i className="fa-solid fa-id-card text-5xl text-gray-200 mb-4"></i>
          <h3 className="text-lg text-gray-500 mb-2" style={{ fontWeight: 600 }}>No cards yet</h3>
          <p className="text-gray-400 text-sm mb-4">Add your first flashcard to start studying.</p>
          <button onClick={() => setAddOpen(true)} className="ff-btn ff-btn-primary">
            <i className="fa-solid fa-plus"></i> Add First Card
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ff-card p-8 text-center">
          <p className="text-gray-400">No cards match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((card, idx) => (
              <motion.div
                key={card._id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className="group" style={{ perspective: "1000px" }}>
                <div
                  className="relative cursor-pointer"
                  style={{
                    height: "160px",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.5s",
                    transform: flipped[card._id] ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  onClick={() => toggleFlip(card._id)}>
                  {/* Front */}
                  <div className="ff-card p-4 absolute inset-0 flex flex-col justify-between"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                    <div className="flex items-start justify-between">
                      <span className="ff-badge text-xs" style={{ background: "#EEF2FF", color: "#4F46E5" }}>TERM</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => e.stopPropagation()}>
                        <button onClick={() => setEditCard(card)}
                          className="p-1.5 rounded-lg hover:bg-gray-100">
                          <i className="fa-solid fa-pen text-gray-400 text-xs"></i>
                        </button>
                        <button onClick={() => setDeleteConfirm(card._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50">
                          <i className="fa-solid fa-trash text-gray-400 text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm line-clamp-3" style={{ fontWeight: 600 }}>{card.term}</p>
                    <p className="text-xs text-gray-400">Click to see definition</p>
                  </div>
                  {/* Back */}
                  <div className="ff-card p-4 absolute inset-0 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "#EEF2FF",
                    }}>
                    <span className="ff-badge text-xs self-start" style={{ background: "#C7D2FE", color: "#4F46E5" }}>DEFINITION</span>
                    <p className="text-gray-700 text-sm line-clamp-4">{card.defination}</p>
                    <p className="text-xs" style={{ color: "#4F46E5" }}>Click to flip back</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {addOpen && <CardModal onClose={() => setAddOpen(false)} onSave={handleAddCard} />}
      </AnimatePresence>
      <AnimatePresence>
        {editCard && <CardModal card={editCard} onClose={() => setEditCard(null)} onSave={handleEditCard} />}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirm && (
          <div className="ff-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ff-modal p-6 max-w-sm text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-id-card text-red-500 text-xl"></i>
              </div>
              <h3 className="text-lg text-gray-800 mb-2" style={{ fontWeight: 600 }}>Delete Card?</h3>
              <p className="text-sm text-gray-500 mb-6">This card will be permanently removed from the deck.</p>
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

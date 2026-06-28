import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import baseURL from "../../../environment";

export default function Study() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/flash/createdeck/one/${id}`, { withCredentials: true });
        const deckData = res.data.deck;
        const cardData = res.data.cards || [];
        if (!cardData.length) { toast.error("No cards in this deck"); navigate(`/flashcard/dashboard/${id}`); return; }
        setDeck(deckData);
        setCards(cardData);
        setQueue(shuffleArray([...cardData]));
      } catch { toast.error("Failed to load deck"); }
      finally { setLoading(false); }
    };
    fetchCards();
  }, [id]);

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const currentCard = queue[currentIdx];
  const total = queue.length;

  const handleKnow = () => {
    setDirection(1);
    setKnown(prev => [...prev, currentCard._id]);
    if (currentIdx + 1 >= total) setDone(true);
    else { setFlipped(false); setTimeout(() => setCurrentIdx(i => i + 1), 100); }
  };

  const handleLearning = () => {
    setDirection(1);
    setLearning(prev => [...prev, currentCard._id]);
    if (currentIdx + 1 >= total) setDone(true);
    else { setFlipped(false); setTimeout(() => setCurrentIdx(i => i + 1), 100); }
  };

  const handleRestart = (onlyLearning = false) => {
    const source = onlyLearning ? cards.filter(c => learning.includes(c._id)) : [...cards];
    if (!source.length) { navigate(`/flashcard/dashboard/${id}`); return; }
    setQueue(shuffleArray(source));
    setCurrentIdx(0);
    setFlipped(false);
    setKnown([]);
    setLearning([]);
    setDone(false);
  };

  const handleKeyDown = useCallback((e) => {
    if (done) return;
    if (e.key === " " || e.key === "ArrowDown") { e.preventDefault(); setFlipped(f => !f); }
    if (e.key === "ArrowRight" && flipped) handleKnow();
    if (e.key === "ArrowLeft" && flipped) handleLearning();
  }, [flipped, done, currentCard]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="fa-solid fa-spinner animate-spin text-3xl" style={{ color: "#4F46E5" }}></i>
    </div>
  );

  const knownPct = total > 0 ? Math.round((known.length / total) * 100) : 0;

  // Done screen
  if (done) {
    return (
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        <button onClick={() => navigate(`/flashcard/dashboard/${id}`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <i className="fa-solid fa-arrow-left"></i> Back to Deck
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ff-card p-10 max-w-xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#EEF2FF" }}>
            <i className="fa-solid fa-graduation-cap text-3xl" style={{ color: "#4F46E5" }}></i>
          </div>
          <h2 className="text-2xl text-gray-800 mb-2" style={{ fontWeight: 700 }}>Session Complete!</h2>
          <p className="text-gray-500 text-sm mb-8">You reviewed all {total} cards</p>

          {/* Score */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl" style={{ background: "#F0FDF4" }}>
              <p className="text-3xl mb-1" style={{ fontWeight: 700, color: "#22C55E" }}>{known.length}</p>
              <p className="text-sm text-gray-600">Know it</p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "#FFFBEB" }}>
              <p className="text-3xl mb-1" style={{ fontWeight: 700, color: "#F59E0B" }}>{learning.length}</p>
              <p className="text-sm text-gray-600">Still learning</p>
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={knownPct >= 80 ? "#22C55E" : knownPct >= 50 ? "#F59E0B" : "#EF4444"}
                  strokeWidth="3"
                  strokeDasharray={`${knownPct} ${100 - knownPct}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg" style={{ fontWeight: 700, color: "#374151" }}>{knownPct}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {learning.length > 0 && (
              <button onClick={() => handleRestart(true)} className="ff-btn ff-btn-primary flex-1">
                <i className="fa-solid fa-rotate-right text-sm"></i>
                Review {learning.length} Missed
              </button>
            )}
            <button onClick={() => handleRestart(false)} className="ff-btn ff-btn-secondary flex-1">
              <i className="fa-solid fa-shuffle text-sm"></i> Restart All
            </button>
            <button onClick={() => navigate(`/flashcard/dashboard/${id}`)} className="ff-btn ff-btn-ghost flex-1">
              Back to Deck
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(`/flashcard/dashboard/${id}`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <i className="fa-solid fa-times"></i> Exit
        </button>
        {deck && (
          <span className="text-sm text-gray-600" style={{ fontWeight: 500 }}>{deck.name}</span>
        )}
        <span className="text-sm text-gray-500">{currentIdx + 1} / {total}</span>
      </div>

      {/* Progress bar */}
      <div className="ff-progress-bar h-2 mb-6">
        <div className="ff-progress-fill h-2 transition-all duration-500"
          style={{ width: `${((currentIdx) / total) * 100}%` }}></div>
      </div>

      {/* Score chips */}
      <div className="flex items-center gap-3 justify-center mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#F0FDF4" }}>
          <i className="fa-solid fa-check text-xs" style={{ color: "#22C55E" }}></i>
          <span className="text-xs" style={{ fontWeight: 600, color: "#22C55E" }}>{known.length} Know</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "#FFFBEB" }}>
          <i className="fa-solid fa-book text-xs" style={{ color: "#F59E0B" }}></i>
          <span className="text-xs" style={{ fontWeight: 600, color: "#F59E0B" }}>{learning.length} Learning</span>
        </div>
      </div>

      {/* Flip Card */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-xl" style={{ perspective: "1200px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.2 }}>
              <div
                className="cursor-pointer select-none"
                style={{
                  height: "280px",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                onClick={() => setFlipped(f => !f)}>
                {/* Front */}
                <div className="ff-card absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <span className="ff-badge mb-4 text-xs" style={{ background: "#EEF2FF", color: "#4F46E5" }}>TERM</span>
                  <p className="text-xl text-gray-800" style={{ fontWeight: 600, lineHeight: 1.4 }}>
                    {currentCard?.term}
                  </p>
                  <p className="text-xs text-gray-400 mt-6 flex items-center gap-1">
                    <i className="fa-solid fa-hand-pointer"></i> Click or press Space to reveal
                  </p>
                </div>
                {/* Back */}
                <div className="ff-card absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                  }}>
                  <span className="ff-badge mb-4 text-xs" style={{ background: "#C7D2FE", color: "#4F46E5" }}>DEFINITION</span>
                  <p className="text-base text-gray-700" style={{ lineHeight: 1.6 }}>
                    {currentCard?.defination}
                  </p>
                  {currentCard?.term && (
                    <p className="text-xs mt-4" style={{ color: "#6366F1" }}>
                      <i className="fa-solid fa-tag mr-1"></i>{currentCard.term}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex justify-center gap-4">
            <button onClick={handleLearning}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl font-600 text-sm transition-all hover:scale-105"
              style={{ background: "#FFFBEB", color: "#D97706", fontWeight: 600, border: "2px solid #FDE68A" }}>
              <i className="fa-solid fa-book-open text-sm"></i> Still Learning
            </button>
            <button onClick={handleKnow}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl font-600 text-sm transition-all hover:scale-105"
              style={{ background: "#F0FDF4", color: "#16A34A", fontWeight: 600, border: "2px solid #BBF7D0" }}>
              <i className="fa-solid fa-check-circle text-sm"></i> Know It!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!flipped && (
        <p className="text-center text-xs text-gray-400 mt-4">
          <kbd className="bg-gray-100 rounded px-1.5 py-0.5 text-gray-600 mr-1">Space</kbd>
          flip &nbsp;·&nbsp;
          <kbd className="bg-gray-100 rounded px-1.5 py-0.5 text-gray-600 mr-1">←</kbd>
          still learning &nbsp;·&nbsp;
          <kbd className="bg-gray-100 rounded px-1.5 py-0.5 text-gray-600 mr-1">→</kbd>
          know it
        </p>
      )}
    </div>
  );
}

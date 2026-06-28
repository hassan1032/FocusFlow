import axios from "axios";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import baseURL from "../environment";

const HISTORY_KEY = "ff_summary_history";

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function readingTime(words) {
  const mins = Math.ceil(words / 200);
  return mins <= 1 ? "< 1 min read" : `~${mins} min read`;
}

export default function TextSummarize() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef(null);

  const wordCount = countWords(text);
  const charCount = text.length;
  const summaryWords = countWords(summary);

  const handleSummarize = async () => {
    if (!text.trim()) { toast.error("Please enter some text to summarize"); return; }
    if (wordCount < 30) { toast.error("Please enter at least 30 words for a meaningful summary"); return; }
    setLoading(true);
    setSummary("");
    try {
      const res = await axios.post(`${baseURL}/textSummary`, { text }, { withCredentials: true });
      const result = res.data.summary;
      setSummary(result);
      const newEntry = { id: Date.now(), input: text.slice(0, 200), output: result, words: wordCount, date: new Date().toLocaleDateString() };
      const updated = [newEntry, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (err) {
      toast.error(err.response?.data?.error || "Summarization failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
    } catch { toast.error("Copy failed"); }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
    textareaRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setText(t);
      textareaRef.current?.focus();
    } catch { toast.error("Paste not available – try Ctrl+V"); }
  };

  const compressionRatio = wordCount > 0 && summaryWords > 0
    ? Math.round((1 - summaryWords / wordCount) * 100)
    : 0;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Words",       value: wordCount,     icon: "fa-solid fa-align-left",   color: "#4F46E5" },
          { label: "Characters",  value: charCount,     icon: "fa-solid fa-font",          color: "#22C55E" },
          { label: "Reading Time",value: wordCount > 0 ? readingTime(wordCount) : "—",
            icon: "fa-solid fa-clock", color: "#F59E0B" },
          { label: "Compression", value: compressionRatio > 0 ? `${compressionRatio}%` : "—",
            icon: "fa-solid fa-compress", color: "#7C3AED" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-lg mt-1" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: s.color + "15" }}>
                <i className={s.icon} style={{ color: s.color, fontSize: "12px" }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input panel */}
        <div className="ff-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
              <i className="fa-solid fa-file-lines mr-2" style={{ color: "#4F46E5" }}></i>
              Original Text
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePaste}
                className="ff-btn ff-btn-ghost text-xs py-1 px-2">
                <i className="fa-solid fa-clipboard text-xs mr-1"></i>Paste
              </button>
              {text && (
                <button onClick={handleClear}
                  className="ff-btn ff-btn-ghost text-xs py-1 px-2">
                  <i className="fa-solid fa-xmark text-xs mr-1"></i>Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="ff-input resize-none flex-1"
            style={{ minHeight: "280px", fontSize: "14px", lineHeight: 1.7 }}
            placeholder="Paste or type the text you want to summarize...&#10;&#10;Works best with articles, essays, research papers, or any long-form content (30+ words)."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{wordCount} words · {charCount} chars</span>
            <button
              onClick={handleSummarize}
              disabled={loading || wordCount < 30}
              className="ff-btn ff-btn-primary">
              {loading ? (
                <><i className="fa-solid fa-spinner animate-spin text-sm mr-1"></i>Summarizing...</>
              ) : (
                <><i className="fa-solid fa-magic text-sm mr-1"></i>Summarize</>

              )}
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div className="ff-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
              <i className="fa-solid fa-star mr-2" style={{ color: "#22C55E" }}></i>
              AI Summary
            </h3>
            {summary && (
              <button onClick={() => handleCopy(summary)}
                className="ff-btn ff-btn-ghost text-xs py-1 px-2">
                <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"} text-xs mr-1`}
                  style={{ color: copied ? "#22C55E" : undefined }}></i>
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <div className="flex-1 relative" style={{ minHeight: "280px" }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "#EEF2FF" }}>
                    <i className="fa-solid fa-brain text-2xl animate-pulse" style={{ color: "#4F46E5" }}></i>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600" style={{ fontWeight: 500 }}>AI is reading your text...</p>
                    <p className="text-xs text-gray-400 mt-1">This may take a few seconds</p>
                  </div>
                  {/* Loading bar */}
                  <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full animate-pulse" style={{ background: "#4F46E5", width: "60%" }}></div>
                  </div>
                </motion.div>
              ) : summary ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full">
                  <div className="h-full flex flex-col">
                    <p className="text-sm text-gray-700 leading-relaxed flex-1" style={{ lineHeight: 1.8 }}>
                      {summary}
                    </p>
                    {/* Summary stats */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="ff-badge text-xs" style={{ background: "#F0FDF4", color: "#22C55E" }}>
                          <i className="fa-solid fa-compress mr-1 text-xs"></i>
                          {summaryWords} words
                        </span>
                      </div>
                      {compressionRatio > 0 && (
                        <span className="ff-badge text-xs" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                          <i className="fa-solid fa-arrow-down mr-1 text-xs"></i>
                          {compressionRatio}% shorter
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="fa-solid fa-magic text-2xl text-gray-300"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400" style={{ fontWeight: 500 }}>Your summary will appear here</p>
                    <p className="text-xs text-gray-300 mt-1">Paste text on the left and click Summarize</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowHistory(h => !h)}
            className="flex items-center gap-2 text-sm text-gray-600 mb-3 hover:text-gray-800 transition-colors">
            <i className={`fa-solid fa-chevron-${showHistory ? "up" : "down"} text-xs`}></i>
            <span style={{ fontWeight: 500 }}>Recent Summaries ({history.length})</span>
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-3">
                {history.map(entry => (
                  <div key={entry.id} className="ff-card p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => { setText(entry.input + "..."); setSummary(entry.output); }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">{entry.date} · {entry.words} words</p>
                        <p className="text-sm text-gray-600 truncate">{entry.input}</p>
                        <p className="text-xs text-gray-400 mt-1 truncate">{entry.output}</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleCopy(entry.output); }}
                        className="ff-btn ff-btn-ghost text-xs py-1 px-2 flex-shrink-0">
                        <i className="fa-solid fa-copy text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); setShowHistory(false); }}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors">
                  Clear history
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

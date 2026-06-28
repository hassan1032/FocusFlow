import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import TagInput from "../../components/Input/TagInput";
import baseURL from "../../environment";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { setError("Please enter a title"); return; }
    if (!content.trim()) { setError("Please enter some content"); return; }
    setError("");
    setLoading(true);

    try {
      const endpoint = type === "edit"
        ? `${baseURL}/api/note/edit/${noteData._id}`
        : `${baseURL}/api/note/add`;

      const res = await axios.post(endpoint, { title, content, tags }, { withCredentials: true });

      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ff-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ff-modal p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-600 text-gray-800" style={{ fontWeight: 600 }}>
            {type === "edit" ? "Edit Note" : "New Note"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-times text-gray-500"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Title *</label>
            <input
              className="ff-input"
              placeholder="Give your note a title..."
              value={title}
              onChange={e => { setTitle(e.target.value); setError(null); }}
            />
          </div>

          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Content *</label>
            <textarea
              className="ff-input resize-none"
              rows={6}
              placeholder="Start writing your note..."
              value={content}
              onChange={e => { setContent(e.target.value); setError(null); }}
            />
          </div>

          <div>
            <label className="text-sm font-500 text-gray-700 mb-1 block" style={{ fontWeight: 500 }}>Tags</label>
            <TagInput tags={tags} setTags={setTags} />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-100">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="ff-btn ff-btn-ghost flex-1">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="ff-btn ff-btn-primary flex-1">
            {loading ? (
              <><i className="fa-solid fa-spinner animate-spin text-sm"></i> Saving...</>
            ) : type === "edit" ? "Save Changes" : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNotes;

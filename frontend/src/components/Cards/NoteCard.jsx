import moment from "moment";
import React from "react";

const NOTE_COLORS = [
  "#EEF2FF", "#F0FDF4", "#FFFBEB", "#FEF2F2", "#FAF5FF",
  "#EFF6FF", "#FFF7ED", "#F0FDFA",
];

const NoteCard = ({ title, date, content, tags, isPinned, onPinNote, onEdit, onDelete, colorIndex = 0 }) => {
  const bgColor = NOTE_COLORS[colorIndex % NOTE_COLORS.length];

  return (
    <div
      className="group relative rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border border-transparent hover:border-indigo-100"
      style={{ background: bgColor, fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Pin indicator */}
      {isPinned && (
        <div className="absolute top-3 right-3">
          <i className="fa-solid fa-thumbtack text-indigo-400 text-xs rotate-45"></i>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h6 className="font-600 text-gray-800 text-sm leading-snug line-clamp-2 pr-6" style={{ fontWeight: 600 }}>
          {title}
        </h6>
      </div>

      {/* Date */}
      <span className="text-xs text-gray-400 mb-2 block">
        {moment(date).format("MMM D, YYYY")}
      </span>

      {/* Content */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3">
        {content}
      </p>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-gray-500">
              #{tag}
            </span>
          ))}
          {tags.length > 3 && <span className="text-xs text-gray-400">+{tags.length - 3}</span>}
        </div>
      )}

      {/* Actions (show on hover) */}
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onPinNote}
          className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          title={isPinned ? "Unpin" : "Pin"}
        >
          <i className={`fa-solid fa-thumbtack text-sm ${isPinned ? "text-indigo-500" : "text-gray-400"}`}></i>
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          title="Edit">
          <i className="fa-solid fa-pen text-sm text-gray-400"></i>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
          title="Delete">
          <i className="fa-solid fa-trash text-sm text-gray-400 hover:text-red-500"></i>
        </button>
      </div>
    </div>
  );
};

export default NoteCard;

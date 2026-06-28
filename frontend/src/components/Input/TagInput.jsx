import React, { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
    if (e.key === "," ) { e.preventDefault(); addTag(); }
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <span key={i}
              className="inline-flex items-center gap-1.5 ff-badge ff-badge-primary text-xs px-2.5 py-1">
              #{tag}
              <button onClick={() => removeTag(tag)}
                className="hover:text-indigo-800 transition-colors ml-0.5">
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ff-input flex-1 text-sm py-2"
          placeholder="Add tag and press Enter..."
        />
        <button type="button" onClick={addTag}
          className="ff-btn ff-btn-secondary py-2 px-3 text-sm flex-shrink-0">
          <i className="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default TagInput;

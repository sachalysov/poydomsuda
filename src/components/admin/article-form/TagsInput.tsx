"use client";

import { memo, useState } from "react";
import { X } from "lucide-react";

export const TagsInput = memo(function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const addTag = () => {
    const tag = input.trim().replace(/^#/, "");
    if (tag && !value.includes(tag) && value.length < 20) onChange([...value, tag]);
    setInput("");
  };

  return (
    <div className="article-tags">
      <div className="article-tags__list">
        {value.map((tag) => (
          <span key={tag}>
            #{tag}
            <button type="button" onClick={() => onChange(value.filter((item) => item !== tag))} aria-label={`Удалить ${tag}`}>
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        placeholder="Введите тег и нажмите Enter"
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag();
          }
          if (event.key === "Backspace" && !input && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={addTag}
      />
    </div>
  );
});

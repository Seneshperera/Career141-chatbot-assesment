import React, { useState, useRef } from "react";

const MAX_LENGTH = 4000;

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value.slice(0, MAX_LENGTH));
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const nearLimit = value.length > MAX_LENGTH * 0.9;

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 sm:px-4 py-3">
      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Type your message... (Enter to send, Shift+Enter for a new line)"
          className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 placeholder:text-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {disabled ? "..." : "Send"}
        </button>
      </div>
      <div className="max-w-3xl mx-auto flex justify-end mt-1">
        <span
          className={`text-[11px] ${
            nearLimit ? "text-red-500" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}

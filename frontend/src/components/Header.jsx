import React from "react";

export default function Header({ darkMode, onToggleDarkMode, onClearChat, messageCount }) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          C1
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            Career141 Chatbot
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 leading-tight">
            Powered by Gemini
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="text-xs px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Clear conversation"
          >
            Clear chat
          </button>
        )}
        <button
          onClick={onToggleDarkMode}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

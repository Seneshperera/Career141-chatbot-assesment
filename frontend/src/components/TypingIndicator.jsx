import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fadeInUp">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 shadow-sm">
        <span className="text-xs text-slate-400 dark:text-slate-400 mr-1">
          AI is thinking
        </span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounceDot [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounceDot [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounceDot" />
        </span>
      </div>
    </div>
  );
}

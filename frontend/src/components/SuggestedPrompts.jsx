import React from "react";

const PROMPTS = [
  "Explain what this chatbot demo is built with",
  "Write a short poem about debugging code",
  "Give me 3 tips for a technical interview",
  "Summarize the concept of REST APIs in simple terms",
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl mb-4">
        💬
      </div>
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-1">
        Welcome Tto Career141 Chatbot!
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-400 mb-6 max-w-sm">
        Ask anything below, or try one of these prompts to get going.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="text-left text-xs sm:text-sm text-slate-600 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 hover:border-indigo-400 hover:shadow-sm transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

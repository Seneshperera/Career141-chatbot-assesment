import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ role, text, isError }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };

  return (
    <div
      className={`flex w-full animate-fadeInUp ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`group relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : isError
            ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 rounded-bl-sm"
            : "bg-white text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-bl-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{text}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:my-2 prose-ul:my-1 prose-ol:my-1">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}

        {!isUser && !isError && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600"
            title="Copy response"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header.jsx";
import MessageBubble from "./components/MessageBubble.jsx";
import TypingIndicator from "./components/TypingIndicator.jsx";
import ChatInput from "./components/ChatInput.jsx";
import SuggestedPrompts from "./components/SuggestedPrompts.jsx";
import { sendChatMessage } from "./api.js";

export default function App() {
  const [messages, setMessages] = useState([]); // { role: 'user' | 'model', text, isError? }
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );
  const scrollRef = useRef(null);

  // Apply/remove the 'dark' class on <html> for Tailwind's dark: variants
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Auto-scroll to the latest message whenever the list changes
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const userMessage = { role: "user", text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      // Send recent history (excluding the message we just added, which
      // the backend appends itself) so the model has conversational context.
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const reply = await sendChatMessage(text, history);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: err.message || "Something went wrong. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

      <main
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto px-3 sm:px-6 py-4"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-3 min-h-full">
          {messages.length === 0 ? (
            <SuggestedPrompts onSelect={handleSend} />
          ) : (
            <>
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  role={msg.role}
                  text={msg.text}
                  isError={msg.isError}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
        </div>
      </main>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

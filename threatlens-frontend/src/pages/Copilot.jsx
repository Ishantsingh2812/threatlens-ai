import { useState } from "react";
import { sendCopilotMessage } from "../api/ThreatApi";

function Copilot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm ThreatLens Copilot 🛡️\n\nI can help you understand threats, logs, attack patterns, risk levels, and recommended security actions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Send message to backend Copilot API
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    // Show user's message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      // Call Spring Boot backend
      const data = await sendCopilotMessage(userMessage);

      // Show backend response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Copilot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Unable to connect to ThreatLens Copilot. Please make sure the Spring Boot backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Enter = send
  // Shift + Enter = new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. 🛡️ How can I help you investigate your security environment?",
      },
    ]);
  };

  const suggestions = [
    "What is a brute-force attack?",
    "How should I handle a critical threat?",
    "Explain SQL injection",
    "How many threats are detected?",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">

      {/* HEADER */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-xl">
              🛡️
            </div>

            <div>
              <h1 className="text-xl font-bold">
                ThreatLens Copilot
              </h1>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />

                <span className="text-xs text-green-400">
                  Online
                </span>
              </div>
            </div>

          </div>

          <button
            onClick={clearChat}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            Clear Chat
          </button>

        </div>

      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        <div className="mx-auto max-w-4xl space-y-6">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-3xl rounded-2xl px-5 py-4 ${
                  message.role === "user"
                    ? "bg-red-600 text-white"
                    : "border border-gray-800 bg-gray-900 text-gray-300"
                }`}
              >

                <div className="mb-2 flex items-center gap-2">

                  <span className="text-sm">
                    {message.role === "user"
                      ? "👤 You"
                      : "🛡️ ThreatLens"}
                  </span>

                </div>

                <p className="whitespace-pre-line text-sm leading-7">
                  {message.content}
                </p>

              </div>

            </div>

          ))}

          {/* Loading */}
          {loading && (

            <div className="flex justify-start">

              <div className="rounded-2xl border border-gray-800 bg-gray-900 px-5 py-4">

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-red-400" />

                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-red-400"
                    style={{ animationDelay: "150ms" }}
                  />

                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-red-400"
                    style={{ animationDelay: "300ms" }}
                  />

                  <span className="ml-2 text-sm text-gray-500">
                    Analyzing...
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* SUGGESTIONS */}
      <div className="border-t border-gray-800 bg-gray-950 px-4 pt-4">

        <div className="mx-auto flex max-w-4xl flex-wrap gap-2">

          {suggestions.map((suggestion) => (

            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-xs text-gray-400 transition hover:border-red-500/50 hover:text-white"
            >
              {suggestion}
            </button>

          ))}

        </div>

      </div>

      {/* INPUT */}
      <div className="bg-gray-950 px-4 pb-6 pt-3">

        <div className="mx-auto max-w-4xl">

          <div className="flex items-end gap-3 rounded-xl border border-gray-700 bg-gray-900 p-3 focus-within:border-red-500/50">

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ThreatLens Copilot about your security environment..."
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-gray-600"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

          <p className="mt-2 text-center text-xs text-gray-600">
            ThreatLens Copilot • Security Intelligence Assistant
          </p>

        </div>

      </div>

    </div>
  );
}

export default Copilot;
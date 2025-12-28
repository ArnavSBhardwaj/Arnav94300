"use client";

import { useMemo, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function ClientApp() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognition = useMemo(() => {
    if (typeof window === "undefined") return null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    return r;
  }, []);

  function speak(text: string) {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  }

  async function ask(question: string) {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setSources([]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer || "No response.");
    setSources(data.sources || []);
    setLoading(false);

    speak(data.answer || "");
  }

  function startListening() {
    if (!recognition) {
      alert("Speech recognition not supported. Use Chrome or Edge.");
      return;
    }
    setListening(true);
    recognition.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setQ(text);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Voice AI Concierge</h1>
      <p style={{ opacity: 0.7 }}>Fallback mode (no API billing)</p>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question…"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={() => ask(q)} disabled={loading}>
          {loading ? "Thinking…" : "Ask"}
        </button>
        <button onClick={startListening} disabled={listening}>
          {listening ? "Listening…" : "🎙️"}
        </button>
      </div>

      {answer && (
        <div style={{ marginTop: 20 }}>
          <p>{answer}</p>
          {sources.length > 0 && (
            <small>Sources: {sources.join(", ")}</small>
          )}
        </div>
      )}
    </main>
  );
}
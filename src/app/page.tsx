"use client";

import { useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function Home() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognition = useMemo(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = "en-US"; // <-- CHANGE to "de-DE" for German
    r.interimResults = true;
    r.continuous = false;
    return r;
  }, []);

  const spokenOnceRef = useRef(false);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }

  async function ask(question: string) {
    setLoading(true);
    setAnswer("");
    setSources([]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer || data.error || "No response.");
    setSources(data.sources || []);
    setLoading(false);

    speak(data.answer || "");
  }

  function startListening() {
    if (!recognition) {
      alert("Speech recognition not supported in this browser. Use Chrome/Edge.");
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
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Voice AI Concierge</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Ask by voice or text. Answers are grounded in your knowledge base.
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question…"
          style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button
          onClick={() => ask(q)}
          disabled={!q.trim() || loading}
          style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd" }}
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
        <button
          onClick={startListening}
          disabled={listening}
          style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd" }}
          title="Speak"
        >
          {listening ? "Listening…" : "🎙️"}
        </button>
      </div>

      {answer && (
        <div style={{ marginTop: 18, padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
          <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>

          {sources.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
              <b>Sources:</b>{" "}
              {sources.map((s, i) => (
                <span key={s.id}>
                  {s.source} ({Number(s.score).toFixed(3)})
                  {i < sources.length - 1 ? " · " : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.7 }}>
        Tip: If voice doesn’t work in your browser, use the text box (voice works best in Chrome/Edge).
      </div>
    </main>
  );
}

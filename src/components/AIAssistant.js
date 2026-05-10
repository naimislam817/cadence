import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AI_SUGGESTIONS } from "../data";

export default function AIAssistant({ notes, query, onQuery }) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [response, setResponse] = useState("");
  const [sugIdx, setSugIdx] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hey. I've been reading your notes. You're working on something interesting." }
  ]);

  useEffect(() => {
    const t = setInterval(() => setSugIdx(i => (i + 1) % AI_SUGGESTIONS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal.trim();
    setInputVal("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setTyping(true);

    // Call Anthropic API
    try {
      const noteContext = notes.map(n => `${n.title}: ${n.content}`).join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a thoughtful AI assistant embedded in ScratchyPad, a cinematic note-taking app. You have access to the user's notes. Be brief, insightful, and slightly poetic. Never be corporate. Here are their notes:\n\n${noteContext}`,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "I'm thinking...";
      setMessages(m => [...m, { role: "ai", text }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "The signal is weak tonight. Try again." }]);
    }
    setTyping(false);
  };

  return (
    <>
      {/* Floating AI button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        animate={{ boxShadow: open ? "0 0 40px rgba(201,168,76,.4)" : ["0 0 20px rgba(201,168,76,.15)", "0 0 35px rgba(201,168,76,.35)", "0 0 20px rgba(201,168,76,.15)"] }}
        transition={{ boxShadow: { repeat: Infinity, duration: 2.5 } }}
        style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 100,
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(8,8,16,.95)",
          border: "1px solid rgba(201,168,76,.35)",
          cursor: "pointer", color: "#c9a84c", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}
      >
        {open ? "✕" : "✦"}
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{
              position: "fixed", bottom: 90, left: 24, zIndex: 100,
              width: "min(340px, calc(100vw - 48px))",
              background: "rgba(8,8,16,.97)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(201,168,76,.18)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,.7), 0 0 60px rgba(201,168,76,.06)",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", flexDirection: "column", maxHeight: "60vh",
            }}
          >
            {/* Header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(201,168,76,.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#a8c96e", boxShadow: "0 0 10px rgba(168,201,110,.6)" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#f0e4c0" }}>AI Memory</div>
                <div style={{ fontSize: 10, color: "rgba(201,168,76,.4)" }}>{notes.length} notes indexed · thinking...</div>
              </div>
            </div>

            {/* Suggestion ticker */}
            <AnimatePresence mode="wait">
              <motion.div key={sugIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                style={{ padding: "10px 16px", borderBottom: "1px solid rgba(201,168,76,.05)", background: "rgba(201,168,76,.03)" }}>
                <div style={{ fontSize: 11, color: "rgba(201,168,76,.5)", letterSpacing: ".06em", marginBottom: 3 }}>AI INSIGHT</div>
                <div style={{ fontSize: 12, color: "rgba(240,228,192,.6)", lineHeight: 1.5, fontStyle: "italic" }}>{AI_SUGGESTIONS[sugIdx]}</div>
              </motion.div>
            </AnimatePresence>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "85%", padding: "9px 13px",
                    background: msg.role === "user" ? "rgba(201,168,76,.12)" : "rgba(255,255,255,.04)",
                    border: `1px solid ${msg.role === "user" ? "rgba(201,168,76,.2)" : "rgba(255,255,255,.06)"}`,
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: 12.5, color: msg.role === "user" ? "#f0e4c0" : "rgba(240,228,192,.75)",
                    lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div style={{ display: "flex", gap: 5, padding: "8px 12px" }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(201,168,76,.5)" }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(201,168,76,.08)", display: "flex", gap: 8 }}>
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask your notes anything…"
                style={{
                  flex: 1, padding: "9px 12px",
                  background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.12)",
                  borderRadius: 10, fontSize: 12.5, color: "#f0e4c0",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,.35)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,.12)"}
              />
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend}
                style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(201,168,76,.25)", background: "rgba(201,168,76,.1)", cursor: "pointer", color: "#c9a84c", fontSize: 14 }}>
                ↑
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

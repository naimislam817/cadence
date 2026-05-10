import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cursor from "./components/Cursor";
import Rain from "./components/Rain";
import Particles from "./components/Particles";
import MusicPlayer from "./components/MusicPlayer";
import AIAssistant from "./components/AIAssistant";
import NoteCard from "./components/NoteCard";
import NoteEditor from "./components/NoteEditor";
import { SAMPLE_NOTES, CINEMATIC_QUOTES, FOCUS_MODES, TAGS } from "./data";

const TAG_COLORS = { personal:"#c9a84c",work:"#7eb8c9",tech:"#a8c96e",philosophy:"#c97eb8",business:"#e07b54",design:"#7b8ce0",ideas:"#54b87e",research:"#e05454" };

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | app
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [editNote, setEditNote] = useState(null);
  const [focusMode, setFocusMode] = useState("midnight-jazz");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [heroPhase, setHeroPhase] = useState(0);
  const [quickCapture, setQuickCapture] = useState("");
  const [showCapture, setShowCapture] = useState(false);
  const searchRef = useRef(null);
  const fm = FOCUS_MODES.find(m => m.id === focusMode) || FOCUS_MODES[0];

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % CINEMATIC_QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let i = 0;
    const t = setInterval(() => { i++; if (i < phases.length) setHeroPhase(phases[i]); else clearInterval(t); }, 600);
    return () => clearInterval(t);
  }, []);

  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !search || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tag.includes(q);
    const matchTag = !activeTag || n.tag === activeTag;
    return matchSearch && matchTag;
  });

  const handleSaveNote = (updated) => {
    setNotes(ns => ns.map(n => n.id === updated.id ? updated : n));
  };

  const handleNewNote = () => {
    const n = { id: Date.now(), title: "", content: "", tag: "ideas", mood: "inspired", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }), color: "#c9a84c" };
    setEditNote(n);
    setNotes(ns => [n, ...ns]);
  };

  const handleQuickCapture = () => {
    if (!quickCapture.trim()) return;
    const n = { id: Date.now(), title: quickCapture.slice(0, 40) || "Quick capture", content: quickCapture, tag: "ideas", mood: "raw", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }), color: "#c9a84c" };
    setNotes(ns => [n, ...ns]);
    setQuickCapture(""); setShowCapture(false);
  };

  // ─── LANDING PAGE ───
  const LandingPage = () => (
    <div style={{ minHeight: "100vh", background: "#080810", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden", position: "relative" }}>
      {/* Background gradient orbs */}
      <div style={{ position: "fixed", top: "10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(126,184,201,.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <motion.nav initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#c9a84c", letterSpacing: ".04em" }}>
          <motion.span animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} style={{ fontSize: 14, opacity: 0.7 }}>◆</motion.span>
          ScratchyPad
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={() => setScreen("app")}
            style={{ padding: "9px 22px", border: "1px solid rgba(201,168,76,.3)", borderRadius: 10, background: "rgba(201,168,76,.06)", cursor: "pointer", color: "#c9a84c", fontSize: 13, fontFamily: "'DM Sans', sans-serif", letterSpacing: ".04em" }}>
            Open App →
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", zIndex: 3, textAlign: "center" }}>
        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: heroPhase >= 0 ? 1 : 0, y: heroPhase >= 0 ? 0 : 20 }} transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "6px 18px", border: "1px solid rgba(201,168,76,.2)", borderRadius: 40, background: "rgba(201,168,76,.05)", backdropFilter: "blur(8px)" }}>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#a8c96e", boxShadow: "0 0 8px rgba(168,201,110,.8)" }} />
          <span style={{ fontSize: 11, color: "rgba(201,168,76,.7)", letterSpacing: ".15em", textTransform: "uppercase" }}>AI Second Brain · Now Available</span>
        </motion.div>

        {/* Main headline */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: heroPhase >= 1 ? 1 : 0, y: heroPhase >= 1 ? 0 : 40 }} transition={{ duration: 0.7 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 10vw, 96px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-.02em", marginBottom: 4 }}>
            <span style={{ color: "#f0e4c0" }}>Capture</span>{" "}
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #f0e4c0, #c9a84c)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>chaos.</span>
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 10vw, 96px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-.02em", fontStyle: "italic" }}>
            <span style={{ color: "rgba(240,228,192,.4)" }}>Organize</span>{" "}
            <span style={{ color: "#c9a84c" }}>brilliance.</span>
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: heroPhase >= 2 ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontSize: "clamp(15px, 3vw, 20px)", color: "rgba(192,176,144,.6)", maxWidth: 540, lineHeight: 1.7, margin: "28px auto 0", fontWeight: 300 }}>
          An AI-powered workspace for creators, developers, and deep thinkers. Your thoughts, organized by intelligence.
        </motion.p>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: heroPhase >= 3 ? 1 : 0, y: heroPhase >= 3 ? 0 : 20 }} transition={{ duration: 0.6 }}
          style={{ display: "flex", gap: 12, marginTop: 44, flexWrap: "wrap", justifyContent: "center" }}>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(201,168,76,.3)" }} whileTap={{ scale: 0.97 }} onClick={() => setScreen("app")}
            style={{ padding: "14px 36px", background: "linear-gradient(135deg, #c9a84c, #a8872e)", border: "none", borderRadius: 12, cursor: "pointer", color: "#080810", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: ".04em", boxShadow: "0 4px 20px rgba(201,168,76,.25)" }}>
            Start for free →
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ padding: "14px 30px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, cursor: "pointer", color: "rgba(240,228,192,.7)", fontSize: 15, fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(8px)" }}>
            Watch demo ▶
          </motion.button>
        </motion.div>

        {/* Focus modes preview */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: heroPhase >= 3 ? 1 : 0, y: heroPhase >= 3 ? 0 : 30 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ display: "flex", gap: 8, marginTop: 52, flexWrap: "wrap", justifyContent: "center" }}>
          {FOCUS_MODES.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: `1px solid ${m.color}25`, borderRadius: 30, background: `${m.color}06`, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>
              <span style={{ fontSize: 11, color: m.color, letterSpacing: ".04em" }}>{m.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 3 }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: "rgba(201,168,76,.4)", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 16 }}>Why ScratchyPad</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 700, color: "#f0e4c0", lineHeight: 1.2 }}>
            Not just an app.<br />
            <span style={{ fontStyle: "italic", color: "rgba(201,168,76,.7)" }}>A digital sanctuary.</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { icon: "✦", title: "AI Memory Graph", desc: "Your notes connect like neurons. Ask anything, find everything. Semantic search that actually understands you.", color: "#c9a84c" },
            { icon: "◈", title: "Cinematic Workspace", desc: "Rain sounds. Jazz ambiance. Focus modes that match your mood. Work feels different when the environment breathes.", color: "#7eb8c9" },
            { icon: "◎", title: "Voice Capture", desc: "Speak your thoughts. AI transcribes, organizes, and links them to existing notes automatically.", color: "#a8c96e" },
            { icon: "⌘", title: "Smart Organization", desc: "Auto-tagging, mood detection, and pattern recognition. Your second brain, finally intelligent.", color: "#c97eb8" },
            { icon: "⚡", title: "Instant Capture", desc: "The thought won't wait. Neither should the app. Capture in under 2 seconds, organize later.", color: "#e07b54" },
            { icon: "◆", title: "Neo-noir Aesthetic", desc: "Blade Runner meets Notion. Dark, minimal, deeply beautiful. A workspace you actually want to open.", color: "#7b8ce0" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, borderColor: f.color + "40" }}
              style={{ padding: "24px 22px", background: "rgba(12,12,20,.6)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, backdropFilter: "blur(12px)", transition: "border-color .25s", cursor: "default" }}>
              <div style={{ fontSize: 24, color: f.color, marginBottom: 14, filter: `drop-shadow(0 0 8px ${f.color}60)` }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f0e4c0", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(192,176,144,.55)", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SAMPLE NOTES PREVIEW */}
      <div style={{ padding: "60px 24px 100px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 3 }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 5vw, 42px)", fontWeight: 700, color: "#f0e4c0" }}>
            Your thoughts, <span style={{ fontStyle: "italic", color: "#c9a84c" }}>alive.</span>
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {SAMPLE_NOTES.slice(0, 3).map((n, i) => (
            <NoteCard key={n.id} note={n} index={i} onClick={() => { setScreen("app"); setEditNote(n); }} />
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: "80px 24px 120px", textAlign: "center", position: "relative", zIndex: 3 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 7vw, 64px)", fontWeight: 900, color: "#f0e4c0", lineHeight: 1.1, marginBottom: 20 }}>
            The city doesn't sleep.<br />
            <span style={{ fontStyle: "italic", color: "#c9a84c" }}>Neither do your ideas.</span>
          </h2>
          <p style={{ fontSize: "clamp(14px, 3vw, 17px)", color: "rgba(192,176,144,.5)", marginBottom: 40, maxWidth: 500, margin: "0 auto 36px" }}>
            Join creators, developers, and thinkers who build their second brain with ScratchyPad.
          </p>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(201,168,76,.3)" }} whileTap={{ scale: 0.97 }} onClick={() => setScreen("app")}
            style={{ padding: "16px 44px", background: "linear-gradient(135deg, #c9a84c, #a8872e)", border: "none", borderRadius: 14, cursor: "pointer", color: "#080810", fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: ".04em", boxShadow: "0 4px 30px rgba(201,168,76,.2)" }}>
            Start writing tonight →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );

  // ─── MAIN APP ───
  const MainApp = () => (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: fm.bg || "#080810", overflow: "hidden", position: "relative", fontFamily: "'DM Sans', sans-serif", transition: "background 0.8s" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "5%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${fm.color}05 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0, transition: "all 0.8s" }} />

      {/* Header */}
      <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ flexShrink: 0, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(8,8,16,.9)", backdropFilter: "blur(16px)", position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setScreen("landing")}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#c9a84c", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, letterSpacing: ".04em", flexShrink: 0 }}>
          <span style={{ fontSize: 11, opacity: 0.6 }}>◆</span> ScratchyPad
        </motion.button>

        {/* Search */}
        <div style={{ flex: 1, position: "relative", maxWidth: 440 }}>
          <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search your mind…"
            style={{ width: "100%", padding: "9px 16px 9px 38px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, fontSize: 13, color: "rgba(240,228,192,.8)", fontFamily: "'DM Sans', sans-serif", transition: "border-color .2s" }}
            onFocus={e => e.target.style.borderColor = `${fm.color}40`}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.07)"} />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(201,168,76,.3)" }}>⌕</span>
        </div>

        {/* New note */}
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} onClick={handleNewNote}
          style={{ padding: "9px 18px", background: `${fm.color}12`, border: `1px solid ${fm.color}30`, borderRadius: 10, cursor: "pointer", color: fm.color, fontSize: 12, fontWeight: 500, letterSpacing: ".04em", flexShrink: 0, transition: "all .2s" }}>
          + New Note
        </motion.button>
      </motion.header>

      {/* Tag filter */}
      <div style={{ flexShrink: 0, padding: "8px 20px", borderBottom: "1px solid rgba(255,255,255,.03)", display: "flex", gap: 6, overflowX: "auto", background: "rgba(8,8,16,.7)", scrollbarWidth: "none" }}>
        <motion.button whileTap={{ scale: 0.93 }} onClick={() => setActiveTag(null)}
          style={{ padding: "5px 14px", border: `1px solid ${!activeTag ? "rgba(201,168,76,.4)" : "rgba(255,255,255,.07)"}`, borderRadius: 20, background: !activeTag ? "rgba(201,168,76,.08)" : "transparent", cursor: "pointer", color: !activeTag ? "#c9a84c" : "rgba(255,255,255,.3)", fontSize: 11, flexShrink: 0, transition: "all .2s" }}>
          All
        </motion.button>
        {TAGS.map(t => {
          const c = TAG_COLORS[t] || "#c9a84c";
          return (
            <motion.button key={t} whileTap={{ scale: 0.93 }} onClick={() => setActiveTag(activeTag === t ? null : t)}
              style={{ padding: "5px 14px", border: `1px solid ${activeTag === t ? c + "50" : "rgba(255,255,255,.06)"}`, borderRadius: 20, background: activeTag === t ? `${c}10` : "transparent", cursor: "pointer", color: activeTag === t ? c : "rgba(255,255,255,.3)", fontSize: 11, flexShrink: 0, transition: "all .2s" }}>
              {t}
            </motion.button>
          );
        })}
      </div>

      {/* Notes grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", position: "relative", zIndex: 1, WebkitOverflowScrolling: "touch" }}>
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80, color: "rgba(192,176,144,.3)", fontFamily: "'Playfair Display', serif", fontSize: 20, fontStyle: "italic" }}>
            No notes match your search
          </motion.div>
        ) : (
          <div style={{ columns: "var(--cols, 1)", columnGap: 14, ["--cols"]: "1" }}>
            <style>{`@media(min-width:600px){.notes-grid{columns:2!important}}@media(min-width:900px){.notes-grid{columns:3!important}}`}</style>
            <div className="notes-grid" style={{ columns: 1 }}>
              {filtered.map((n, i) => (
                <div key={n.id} style={{ breakInside: "avoid", marginBottom: 14 }}>
                  <NoteCard note={n} index={i} onClick={setEditNote} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick capture */}
      <AnimatePresence>
        {showCapture && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px", background: "rgba(8,8,16,.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(201,168,76,.15)", zIndex: 110, display: "flex", gap: 10 }}>
            <textarea autoFocus value={quickCapture} onChange={e => setQuickCapture(e.target.value)}
              placeholder="Capture this thought before it disappears…"
              rows={2}
              onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleQuickCapture(); if (e.key === "Escape") setShowCapture(false); }}
              style={{ flex: 1, background: "transparent", border: "none", fontSize: 15, color: "#f0e4c0", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.6 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleQuickCapture}
                style={{ padding: "8px 16px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 8, cursor: "pointer", color: "#c9a84c", fontSize: 12 }}>Save</motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCapture(false)}
                style={{ padding: "8px 16px", background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, cursor: "pointer", color: "rgba(255,255,255,.3)", fontSize: 12 }}>Cancel</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick capture trigger */}
      {!showCapture && (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => setShowCapture(true)}
          animate={{ boxShadow: [`0 0 20px ${fm.color}20`, `0 0 40px ${fm.color}40`, `0 0 20px ${fm.color}20`] }}
          transition={{ boxShadow: { repeat: Infinity, duration: 2.5 } }}
          style={{ position: "fixed", bottom: "max(84px, calc(84px + env(safe-area-inset-bottom)))", right: 24, zIndex: 90, width: 48, height: 48, borderRadius: "50%", border: `1.5px solid ${fm.color}60`, background: "rgba(8,8,16,.95)", cursor: "pointer", color: fm.color, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          ✎
        </motion.button>
      )}
    </div>
  );

  return (
    <>
      <Cursor />
      <Rain intensity={screen === "landing" ? 0.6 : 0.35} />
      <Particles count={screen === "landing" ? 50 : 25} color="#c9a84c" />

      <AnimatePresence mode="wait">
        {screen === "landing" ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div key="app" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ height: "100dvh" }}>
            <MainApp />
          </motion.div>
        )}
      </AnimatePresence>

      {screen === "app" && (
        <>
          <AIAssistant notes={notes} />
          <MusicPlayer mode={focusMode} onModeChange={setFocusMode} />
        </>
      )}

      <AnimatePresence>
        {editNote && (
          <NoteEditor key={editNote.id} note={editNote} onClose={() => setEditNote(null)} onSave={handleSaveNote} />
        )}
      </AnimatePresence>
    </>
  );
}

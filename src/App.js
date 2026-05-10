import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import QuoteBar from "./components/QuoteBar";
import StickyNote from "./components/StickyNote";
import Whiteboard from "./components/Whiteboard";
import TasksPanel from "./components/TasksPanel";
import LinksPanel from "./components/LinksPanel";
import DopamineToast from "./components/DopamineToast";
import { useProjects } from "./hooks/useProjects";
import { useParticles } from "./hooks/useParticles";
import { STICKY_SCHEMES, DOPAMINE_HITS } from "./data/constants";

export default function App() {
  const {
    projects, activeId, activeProject, setActiveId,
    addProject,
    addNote, updateNote, deleteNote,
    addTask, toggleTask, updateTask, deleteTask,
    addLink, deleteLink,
    saveCanvas,
  } = useProjects();

  const [activeTab, setActiveTab] = useState("notes");
  const [wbOpen, setWbOpen] = useState(false);
  const [dopamine, setDopamine] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const particleCanvasRef = useRef(null);
  const { spawn } = useParticles(particleCanvasRef);
  const mainRef = useRef(null);

  const switchProject = useCallback((id) => {
    if (id === activeId) return;
    if (mainRef.current) {
      mainRef.current.style.transition = "opacity .15s, transform .15s";
      mainRef.current.style.opacity = "0";
      mainRef.current.style.transform = "translateX(12px)";
      setTimeout(() => {
        setActiveId(id);
        setActiveTab("notes");
        if (mainRef.current) {
          mainRef.current.style.opacity = "1";
          mainRef.current.style.transform = "translateX(0)";
        }
      }, 160);
    } else {
      setActiveId(id);
      setActiveTab("notes");
    }
  }, [activeId, setActiveId]);

  const handleTaskToggle = useCallback((id, x, y) => {
    const task = activeProject.tasks.find((t) => t.id === id);
    if (!task || task.done) { toggleTask(id); return; }
    toggleTask(id);
    spawn(x, y);
    setDopamine(DOPAMINE_HITS[Math.floor(Math.random() * DOPAMINE_HITS.length)]);
    setQuoteIdx((q) => (q + 1) % 20);
  }, [activeProject.tasks, toggleTask, spawn]);

  const handleAddNote = () => {
    const canvas = document.getElementById("notes-canvas");
    const w = canvas ? canvas.offsetWidth : 800;
    const h = canvas ? canvas.offsetHeight : 500;
    const ci = activeProject.notes.length % STICKY_SCHEMES.length;
    addNote({
      id: Date.now(), text: "",
      x: 30 + Math.random() * Math.max(80, w - 240),
      y: 20 + Math.random() * Math.max(50, h - 210),
      colorIdx: ci, rot: Math.random() * 12 - 6, w: 188, h: 164,
    });
  };

  const doneTasks = activeProject.tasks.filter((t) => t.done).length;
  const totalTasks = activeProject.tasks.length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const TABS = [
    { id: "notes", label: "Notes", icon: "✦" },
    { id: "tasks", label: "Tasks", icon: "◎" },
    { id: "links", label: "Links", icon: "⌘" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#06060e", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <canvas ref={particleCanvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />
      <AnimatePresence>
        {dopamine && <DopamineToast key={dopamine.e + Date.now()} hit={dopamine} onDone={() => setDopamine(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {wbOpen && (
          <Whiteboard isOpen={wbOpen} onClose={() => setWbOpen(false)} canvas={activeProject.canvas} onSave={saveCanvas} />
        )}
      </AnimatePresence>
      <Sidebar projects={projects} activeId={activeId} onSelect={switchProject} onAdd={addProject} />
      <div ref={mainRef} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,.038) 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <QuoteBar />
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", zIndex: 10, padding: "0 22px", height: 56, display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(201,168,76,.07)", background: "rgba(6,6,14,.88)", backdropFilter: "blur(10px)", flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: activeProject.color, flex: 1, letterSpacing: ".03em" }}>
              {activeProject.name}
            </motion.div>
          </AnimatePresence>
          {totalTasks > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 82, height: 3, background: "rgba(201,168,76,.08)", borderRadius: 2, overflow: "hidden" }}>
                <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${activeProject.color}, #f0e4c0)`, boxShadow: `0 0 6px ${activeProject.color}` }} />
              </div>
              <span style={{ fontSize: 10, color: "rgba(201,168,76,.4)", letterSpacing: ".06em" }}>{pct}%</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 2, background: "rgba(201,168,76,.04)", padding: 3, borderRadius: 9, border: "1px solid rgba(201,168,76,.07)" }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ padding: "6px 14px", border: "none", borderRadius: 7, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, letterSpacing: ".06em", background: activeTab === t.id ? "rgba(201,168,76,.1)" : "transparent", color: activeTab === t.id ? "#c9a84c" : "rgba(240,228,192,.3)", fontWeight: activeTab === t.id ? 500 : 400, transition: "all .2s", borderBottom: activeTab === t.id ? `1px solid ${activeProject.color}60` : "1px solid transparent" }}>
                <span style={{ marginRight: 5, fontSize: 10 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={() => setWbOpen((v) => !v)}
            style={{ padding: "6px 16px", border: `1px solid ${wbOpen ? "rgba(201,168,76,.5)" : "rgba(201,168,76,.22)"}`, borderRadius: 7, background: wbOpen ? "rgba(201,168,76,.14)" : "rgba(201,168,76,.05)", color: wbOpen ? "#c9a84c" : "rgba(201,168,76,.65)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}>
            <span style={{ fontSize: 13 }}>◈</span> Board
          </motion.button>
        </motion.div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {activeTab === "notes" && (
              <motion.div key={`notes-${activeId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                id="notes-canvas" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                {activeProject.notes.map((n) => (
                  <StickyNote key={n.id} note={n} onUpdate={updateNote} onDelete={deleteNote} />
                ))}
                {activeProject.notes.length === 0 && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, pointerEvents: "none" }}>
                    <div style={{ fontSize: 32, opacity: 0.12 }}>✦</div>
                    <div style={{ color: "rgba(201,168,76,.18)", fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic" }}>No notes yet — add your first thought</div>
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} onClick={handleAddNote}
                  animate={{ boxShadow: ["0 0 18px rgba(201,168,76,.18)", "0 0 36px rgba(201,168,76,.45)", "0 0 18px rgba(201,168,76,.18)"] }}
                  transition={{ boxShadow: { repeat: Infinity, duration: 3 } }}
                  style={{ position: "absolute", bottom: 22, right: 22, zIndex: 50, width: 50, height: 50, borderRadius: "50%", border: `1.5px solid ${activeProject.color}`, background: "#06060e", color: activeProject.color, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 300 }}>
                  +
                </motion.button>
              </motion.div>
            )}
            {activeTab === "tasks" && (
              <motion.div key={`tasks-${activeId}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%" }}>
                <TasksPanel project={activeProject} quoteIdx={quoteIdx} onAdd={addTask} onToggle={handleTaskToggle} onUpdate={updateTask} onDelete={deleteTask} />
              </motion.div>
            )}
            {activeTab === "links" && (
              <motion.div key={`links-${activeId}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%" }}>
                <LinksPanel project={activeProject} onAdd={addLink} onDelete={deleteLink} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

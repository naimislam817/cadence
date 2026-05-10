import { useState, useCallback } from "react";
import { DEFAULT_PROJECTS } from "../data/constants";

export function useProjects() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeId, setActiveId] = useState(1);

  const activeProject = projects.find((p) => p.id === activeId) || projects[0];

  const updateProject = useCallback(
    (updater) => setProjects((ps) => ps.map((p) => (p.id === activeId ? updater(p) : p))),
    [activeId]
  );

  const addProject = useCallback((name, color) => {
    const p = { id: Date.now(), name, color, notes: [], tasks: [], links: [], canvas: null };
    setProjects((ps) => [...ps, p]);
    setActiveId(p.id);
  }, []);

  // Notes
  const addNote = useCallback((note) => updateProject((p) => ({ ...p, notes: [...p.notes, note] })), [updateProject]);
  const updateNote = useCallback((note) => updateProject((p) => ({ ...p, notes: p.notes.map((n) => (n.id === note.id ? note : n)) })), [updateProject]);
  const deleteNote = useCallback((id) => updateProject((p) => ({ ...p, notes: p.notes.filter((n) => n.id !== id) })), [updateProject]);

  // Tasks
  const addTask = useCallback((text) => updateProject((p) => ({ ...p, tasks: [...p.tasks, { id: Date.now(), text, done: false }] })), [updateProject]);
  const toggleTask = useCallback((id) => updateProject((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })), [updateProject]);
  const updateTask = useCallback((id, text) => updateProject((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, text } : t)) })), [updateProject]);
  const deleteTask = useCallback((id) => updateProject((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== id) })), [updateProject]);

  // Links
  const addLink = useCallback((label, url, icon) => updateProject((p) => ({ ...p, links: [...p.links, { id: Date.now(), label, url: url.startsWith("http") ? url : "https://" + url, icon: icon || "🔗" }] })), [updateProject]);
  const deleteLink = useCallback((id) => updateProject((p) => ({ ...p, links: p.links.filter((l) => l.id !== id) })), [updateProject]);

  // Canvas
  const saveCanvas = useCallback((dataUrl) => updateProject((p) => ({ ...p, canvas: dataUrl })), [updateProject]);

  return {
    projects, activeId, activeProject, setActiveId,
    addProject, updateProject,
    addNote, updateNote, deleteNote,
    addTask, toggleTask, updateTask, deleteTask,
    addLink, deleteLink,
    saveCanvas,
  };
}

export const PHILOSOPHER_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Emerson" },
  { text: "First say to yourself what you would be; then do what you have to do.", author: "Epictetus" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Whether you think you can or think you can't, you're right.", author: "Henry Ford" },
  { text: "Excellence is not a gift but a skill that takes practice.", author: "Plato" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The quality of a person's life is in direct proportion to their commitment to excellence.", author: "Vince Lombardi" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Darkness cannot drive out darkness; only light can do that.", author: "Martin Luther King Jr." },
];

export const DOPAMINE_HITS = [
  { e: "🧠", m: "Dopamine released! Your brain loves this." },
  { e: "⚡", m: "Neural reward triggered — you're unstoppable." },
  { e: "🔥", m: "That's what greatness looks like." },
  { e: "💥", m: "Serotonin spike detected. Keep going." },
  { e: "✨", m: "Your future self is thanking you right now." },
  { e: "🚀", m: "One step closer. The momentum is real." },
  { e: "🏆", m: "Champion energy. Task obliterated." },
  { e: "💎", m: "Excellence recognized by the universe." },
  { e: "🎯", m: "Locked in. That's the frequency." },
  { e: "🌊", m: "Flow state achieved. Ride it." },
];

export const PROJECT_COLORS = [
  "#c9a84c", "#e07b54", "#7eb8c9", "#a8c96e",
  "#c97eb8", "#54b87e", "#e05454", "#7b8ce0",
];

export const STICKY_SCHEMES = [
  { bg: "#1a160a", border: "#c9a84c", text: "#f0e0a0" },
  { bg: "#0a1218", border: "#7eb8c9", text: "#a0d8f0" },
  { bg: "#160a1a", border: "#c97eb8", text: "#f0a0e0" },
  { bg: "#0a1600", border: "#a8c96e", text: "#c8f090" },
  { bg: "#1a0e0a", border: "#e07b54", text: "#f0c4a0" },
  { bg: "#0a0e1a", border: "#7b8ce0", text: "#b0c0f0" },
];

export const DEFAULT_PROJECTS = [
  {
    id: 1,
    name: "Connecting Dots",
    color: "#c9a84c",
    notes: [
      { id: 1, text: "Fix Supabase pooler\nCheck CORS headers", x: 40, y: 50, colorIdx: 0, rot: -2.5, w: 188, h: 164 },
      { id: 2, text: "Reloadly API\nintegration plan", x: 260, y: 90, colorIdx: 1, rot: 1.8, w: 188, h: 164 },
      { id: 3, text: "UAE market\nSaaS + OTT research", x: 490, y: 40, colorIdx: 2, rot: -1.2, w: 188, h: 164 },
    ],
    tasks: [
      { id: 1, text: "Build checkout flow", done: true },
      { id: 2, text: "Integrate Reloadly API", done: false },
      { id: 3, text: "Admin dashboard polish", done: false },
      { id: 4, text: "Fix CORS on production", done: true },
    ],
    links: [
      { id: 1, label: "Supabase", url: "https://supabase.com", icon: "⚡" },
      { id: 2, label: "GitHub", url: "https://github.com", icon: "🐙" },
    ],
    canvas: null,
  },
  {
    id: 2,
    name: "Syntrix IT",
    color: "#7eb8c9",
    notes: [
      { id: 1, text: "Update portfolio\nAdd 3 case studies", x: 60, y: 70, colorIdx: 1, rot: 2, w: 188, h: 164 },
      { id: 2, text: "Instagram reel\nscript ready ✓", x: 290, y: 50, colorIdx: 0, rot: -2.5, w: 188, h: 164 },
    ],
    tasks: [
      { id: 1, text: "Publish Instagram reel", done: false },
      { id: 2, text: "Add Link My Ride case study", done: true },
    ],
    links: [{ id: 1, label: "syntrixit.com", url: "https://syntrixit.com", icon: "🌐" }],
    canvas: null,
  },
  {
    id: 3,
    name: "Client Pitch",
    color: "#a8c96e",
    notes: [],
    tasks: [],
    links: [],
    canvas: null,
  },
];

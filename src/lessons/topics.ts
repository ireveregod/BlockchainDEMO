export interface TopicMeta {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  accent: string;
  glow: string;
}

export const topics: TopicMeta[] = [
  {
    id: "integrity",
    title: "Integrity",
    tagline: "Why tampering with one block breaks the whole chain.",
    icon: "🔗",
    accent: "var(--glow-blue)",
    glow: "var(--glow-blue-dim)",
  },
  {
    id: "authentication",
    title: "Authentication",
    tagline: "How signatures prove who really sent a transaction.",
    icon: "🔑",
    accent: "var(--glow-green)",
    glow: "var(--glow-green-dim)",
  },
  {
    id: "availability",
    title: "Availability",
    tagline: "Why decentralization keeps the network running.",
    icon: "🌐",
    accent: "var(--glow-amber)",
    glow: "var(--glow-amber-dim)",
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    tagline: "The myth that blockchain data is private.",
    icon: "🕵️",
    accent: "var(--glow-purple)",
    glow: "rgba(177, 139, 255, 0.35)",
  },
  {
    id: "security-lab",
    title: "Security Lab",
    tagline: "Launch real attacks and watch the chain defend itself.",
    icon: "🧪",
    accent: "var(--glow-red)",
    glow: "var(--glow-red-dim)",
  },
];

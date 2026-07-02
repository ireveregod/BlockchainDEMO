import type { LessonStep } from "../../engine/types";

const allNodeIds = Array.from({ length: 10 }, (_, i) => `node-${i + 1}`);

export const availabilitySteps: LessonStep[] = [
  {
    id: "intro-bank",
    kind: "highlight",
    spotlight: { entityIds: ["bank-server"] },
    narration: {
      heading: "One Server, One Point of Failure",
      body: "Most traditional systems — like a bank — rely on a single central server to handle every request.",
    },
  },
  {
    id: "crash",
    kind: "animate",
    spotlight: { entityIds: ["bank-server"] },
    sceneActions: [{ type: "CRASH_BANK" }],
    narration: {
      heading: "The Server Crashes",
      body: "If that one server goes down — a hardware failure, an outage, an attack — every request fails with it. There's no one else to ask.",
    },
  },
  {
    id: "network-intro",
    kind: "explain",
    spotlight: { entityIds: allNodeIds },
    sceneActions: [{ type: "SHOW_NETWORK" }],
    narration: {
      heading: "Now Compare a Blockchain Network",
      body: "A blockchain network has no single server. The same data is held by many independent nodes, all around the world, all following the same rules.",
    },
  },
  {
    id: "dropout",
    kind: "interactive",
    spotlight: { entityIds: allNodeIds },
    narration: {
      heading: "Take Some Nodes Down",
      body: "Try knocking out several nodes at once — the way an outage, an attack, or just bad luck might in the real world.",
    },
    interactive: {
      controlId: "drop-nodes",
      ctaLabel: "Drop Random Nodes",
      onComplete: () => [{ type: "DROP_NODES" }],
    },
  },
  {
    id: "still-operational",
    kind: "principle",
    spotlight: { entityIds: allNodeIds },
    narration: {
      heading: "Network Still Operational",
      body: "The remaining nodes keep validating transactions and reach agreement without missing a beat. No customer notices the nodes that went down.",
    },
    principleBadge: { label: "Decentralization", icon: "🌐" },
  },
  {
    id: "summary",
    kind: "summary",
    spotlight: { entityIds: allNodeIds },
    narration: {
      heading: "Resilience Through Redundancy",
      body: "Availability on a blockchain doesn't depend on any single machine staying up. As long as enough nodes remain online, the network keeps running.",
    },
    principleBadge: { label: "Redundancy", icon: "🛰️" },
  },
];

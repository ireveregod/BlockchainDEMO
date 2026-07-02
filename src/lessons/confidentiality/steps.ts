import type { LessonStep } from "../../engine/types";

const explorerIds = ["explorer-row-1", "explorer-row-2", "explorer-row-3"];
const privacyIds = ["privacy-encryption", "privacy-zk", "privacy-networks"];

export const confidentialitySteps: LessonStep[] = [
  {
    id: "myth",
    kind: "highlight",
    spotlight: { entityIds: ["myth-claim"] },
    narration: {
      heading: "A Common Misconception",
      body: "\"Blockchain = Encrypted\" is one of the most common assumptions people make about this technology. It's wrong.",
    },
  },
  {
    id: "explorer",
    kind: "animate",
    spotlight: { entityIds: explorerIds },
    narration: {
      heading: "Look Inside a Public Explorer",
      body: "Anyone can open a public block explorer and see every transaction, every wallet address, and every block — in plain text, with no login required.",
    },
  },
  {
    id: "guarantee-integrity",
    kind: "explain",
    spotlight: { entityIds: ["guarantee-integrity"] },
    sceneActions: [{ type: "REVEAL_GUARANTEE", index: 0 }],
    narration: {
      heading: "What Blockchain Actually Guarantees: Integrity",
      body: "Once data is recorded, it can't be silently altered without everyone noticing.",
    },
  },
  {
    id: "guarantee-authenticity",
    kind: "explain",
    spotlight: { entityIds: ["guarantee-authenticity"] },
    sceneActions: [{ type: "REVEAL_GUARANTEE", index: 1 }],
    narration: {
      heading: "...Authenticity",
      body: "Only the real holder of a private key can authorize a transaction from their address.",
    },
  },
  {
    id: "guarantee-availability",
    kind: "explain",
    spotlight: { entityIds: ["guarantee-availability"] },
    sceneActions: [{ type: "REVEAL_GUARANTEE", index: 2 }],
    narration: {
      heading: "...Availability",
      body: "The network keeps running even when individual machines fail.",
    },
  },
  {
    id: "privacy-tech",
    kind: "principle",
    spotlight: { entityIds: privacyIds },
    narration: {
      heading: "Privacy Is Added, Not Assumed",
      body: "Real confidentiality on a blockchain comes from extra technology layered on top: encryption, zero-knowledge proofs, and privacy-focused networks — not from the blockchain itself.",
    },
    principleBadge: { label: "Privacy by Design, Not by Default", icon: "🕶️" },
  },
  {
    id: "summary",
    kind: "summary",
    spotlight: { entityIds: [...explorerIds, ...privacyIds] },
    narration: {
      heading: "Public by Default, Private by Choice",
      body: "Most blockchains are transparent ledgers, not private ones. If confidentiality matters for your use case, it has to be designed in deliberately.",
    },
    principleBadge: { label: "Transparent Ledger", icon: "📖" },
  },
];

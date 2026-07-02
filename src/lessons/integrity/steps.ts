import type { LessonStep } from "../../engine/types";

export const integritySteps: LessonStep[] = [
  {
    id: "intro-block",
    kind: "highlight",
    spotlight: { entityIds: ["block-1"] },
    narration: {
      heading: "A Block Stores a Transaction",
      body: "This block holds a transfer from Alice to Bob — 10 BTC. Every block on the chain holds a batch of transactions just like this one.",
    },
  },
  {
    id: "hash-reveal",
    kind: "animate",
    spotlight: { entityIds: ["block-1"] },
    sceneActions: [{ type: "RECOMPUTE_HASH", blockId: "block-1" }],
    narration: {
      heading: "Every Block Gets a Fingerprint",
      body: "The block's contents are run through a hash function, producing a unique fingerprint. Change even one character of the input, and the fingerprint comes out completely different.",
    },
  },
  {
    id: "connection",
    kind: "explain",
    spotlight: { entityIds: ["block-1", "connector-1-2", "block-2"] },
    narration: {
      heading: "Linking Block to Block",
      body: "That fingerprint is copied into the next block's \"Previous Hash\" field — cryptographically linking the two blocks together.",
    },
  },
  {
    id: "block2-prevhash",
    kind: "highlight",
    spotlight: { entityIds: ["block-2"] },
    narration: {
      heading: "The Chain Remembers",
      body: "Block 2's Previous Hash matches Block 1's Hash exactly. This link is what turns a list of blocks into a chain.",
    },
  },
  {
    id: "tamper",
    kind: "interactive",
    spotlight: { entityIds: ["block-1"] },
    narration: {
      heading: "What If Someone Tampers With It?",
      body: "Try rewriting history: change Alice's payment to Bob from 10 BTC to 1000 BTC, after the fact.",
    },
    interactive: {
      controlId: "tamper-tx",
      ctaLabel: "Tamper: change 10 BTC → 1000 BTC",
      onComplete: () => [
        { type: "EDIT_TX", blockId: "block-1", amount: 1000 },
        { type: "RECOMPUTE_HASH", blockId: "block-1" },
        { type: "CASCADE_INVALIDATE", fromBlockId: "block-1" },
      ],
    },
  },
  {
    id: "compromised",
    kind: "principle",
    spotlight: { entityIds: ["block-1", "connector-1-2", "block-2", "connector-2-3", "block-3"] },
    narration: {
      heading: "Integrity Compromised",
      body: "Block 1's hash changed the instant its data changed. Block 2's Previous Hash field still points to the old value, so it no longer matches — and that single mismatch cascades down every block that follows.",
    },
    principleBadge: { label: "Immutability", icon: "🔒" },
  },
  {
    id: "repair",
    kind: "interactive",
    spotlight: { entityIds: ["block-1", "block-2", "block-3"] },
    narration: {
      heading: "Repairing the Chain",
      body: "Repairing this chain means recomputing every affected block's hash, in order, until each Previous Hash field lines up again — exactly what mining does.",
    },
    interactive: {
      controlId: "repair-chain",
      ctaLabel: "Repair Chain",
      onComplete: () => [
        { type: "REPAIR_START" },
        { type: "REPAIR_BLOCK", blockId: "block-1" },
        { type: "REPAIR_BLOCK", blockId: "block-2" },
        { type: "REPAIR_BLOCK", blockId: "block-3" },
        { type: "REPAIR_COMPLETE" },
      ],
    },
  },
  {
    id: "summary",
    kind: "summary",
    spotlight: { entityIds: ["block-0", "block-1", "connector-1-2", "block-2", "connector-2-3", "block-3"] },
    narration: {
      heading: "Tamper-Evident, Not Tamper-Proof",
      body: "Blockchain data can technically be changed, but unauthorized changes become immediately visible — because every block's hash depends on the one before it. That's why blockchain is called tamper-evident.",
    },
    principleBadge: { label: "Tamper-Evidence", icon: "🛡️" },
  },
];

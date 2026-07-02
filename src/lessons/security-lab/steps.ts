import type { LessonStep } from "../../engine/types";

const chainIds = ["block-0", "block-1", "block-2", "block-3"];
const networkIds = ["wallet", "node-1", "node-2", "node-3", "node-4", "node-5"];

export const securityLabSteps: LessonStep[] = [
  {
    id: "healthy-chain",
    kind: "highlight",
    spotlight: { entityIds: chainIds },
    narration: {
      heading: "Welcome to the Security Lab",
      body: "This is a healthy, fully-verified blockchain — every hash matches the one before it. Let's see what happens when it comes under attack.",
    },
  },
  {
    id: "launch-tamper",
    kind: "interactive",
    spotlight: { entityIds: ["block-1"] },
    narration: {
      heading: "Attack 1: Rewrite History",
      body: "An attacker tries to alter a transaction that's already been recorded — changing Alice's 10 BTC payment into 1000 BTC.",
    },
    interactive: {
      controlId: "launch-tamper",
      ctaLabel: "Launch Tampering Attack",
      onComplete: () => [
        { type: "EDIT_TX", blockId: "block-1", amount: 1000 },
        { type: "RECOMPUTE_HASH", blockId: "block-1" },
        { type: "CASCADE_INVALIDATE", fromBlockId: "block-1" },
      ],
    },
  },
  {
    id: "tamper-detected",
    kind: "principle",
    spotlight: { entityIds: ["block-1", "block-2", "block-3"] },
    narration: {
      heading: "Detected: Hash Mismatch",
      body: "The moment the data changed, the hash changed with it — and every block downstream stopped matching. The network can see exactly where the chain was broken.",
    },
    principleBadge: { label: "Tamper Detection", icon: "🔍" },
  },
  {
    id: "mitigate-tamper",
    kind: "interactive",
    spotlight: { entityIds: ["block-1", "block-2", "block-3"] },
    narration: {
      heading: "Mitigation: Reject and Repair",
      body: "Honest nodes reject the tampered chain outright. Recomputing every affected hash in order is the only way to make it valid again — and it's computationally expensive by design.",
    },
    interactive: {
      controlId: "repair-lab-chain",
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
    id: "chain-restored",
    kind: "explain",
    spotlight: { entityIds: chainIds },
    narration: {
      heading: "Attack 1 Defeated",
      body: "The chain is consistent again. Tampering wasn't prevented — it was made instantly visible and expensive to cover up.",
    },
    principleBadge: { label: "Resilience", icon: "🔗" },
  },
  {
    id: "switch-to-network",
    kind: "explain",
    spotlight: { entityIds: networkIds },
    sceneActions: [{ type: "SET_VIEW", view: "network" }],
    narration: {
      heading: "Attack 2: Forge a Signature",
      body: "Now let's try a different attack: broadcasting a transaction without holding the private key that's supposed to authorize it.",
    },
  },
  {
    id: "launch-forgery",
    kind: "interactive",
    spotlight: { entityIds: networkIds },
    narration: {
      heading: "Impersonating Alice",
      body: "An attacker signs a transaction with the wrong key and broadcasts it, hoping the network won't check closely.",
    },
    interactive: {
      controlId: "launch-forgery",
      ctaLabel: "Launch Forged Signature Attack",
      onComplete: () => [
        { type: "RESET_VERIFICATION" },
        { type: "SIGN_WRONG_KEY" },
        { type: "PROPAGATE" },
        { type: "VERIFY_RESULT", result: "invalid" },
      ],
    },
  },
  {
    id: "forgery-detected",
    kind: "principle",
    spotlight: { entityIds: networkIds },
    narration: {
      heading: "Attack 2 Defeated",
      body: "Every node independently checks the signature against the sender's public key. Without the real private key, the signature can't be forged — every node rejects it.",
    },
    principleBadge: { label: "Cryptographic Verification", icon: "🔏" },
  },
  {
    id: "summary",
    kind: "summary",
    spotlight: { entityIds: networkIds },
    narration: {
      heading: "Defense in Depth",
      body: "Neither attack needed a firewall or an administrator watching a dashboard. Hash chaining made tampering visible, and public-key signatures made forgery mathematically impossible — the security comes from the design itself.",
    },
    principleBadge: { label: "Defense in Depth", icon: "🛡️" },
  },
];

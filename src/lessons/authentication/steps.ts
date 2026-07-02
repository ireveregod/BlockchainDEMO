import type { LessonStep } from "../../engine/types";

const allNodeIds = ["node-1", "node-2", "node-3", "node-4", "node-5"];

export const authenticationSteps: LessonStep[] = [
  {
    id: "intro-wallet",
    kind: "highlight",
    spotlight: { entityIds: ["wallet"] },
    narration: {
      heading: "A Wallet Holds a Private Key",
      body: "This wallet holds a private key — a secret number that proves ownership of a blockchain address. Nobody else has it, and it never leaves the wallet.",
    },
  },
  {
    id: "generate-key",
    kind: "animate",
    spotlight: { entityIds: ["wallet"] },
    sceneActions: [{ type: "GENERATE_KEY" }],
    narration: {
      heading: "Generating a Keypair",
      body: "The private key mathematically produces a matching public key. The public key can be shared with anyone; the private key never can.",
    },
  },
  {
    id: "sign",
    kind: "animate",
    spotlight: { entityIds: ["wallet"] },
    sceneActions: [{ type: "SIGN" }],
    narration: {
      heading: "Signing the Transaction",
      body: "The wallet uses the private key to produce a digital signature for this transaction — proof that whoever holds the key authorized it.",
    },
  },
  {
    id: "propagate",
    kind: "animate",
    spotlight: { entityIds: ["wallet", ...allNodeIds] },
    sceneActions: [{ type: "PROPAGATE" }],
    narration: {
      heading: "Broadcasting to the Network",
      body: "The signed transaction travels to every node on the network. Each node will independently check the signature — no central authority is trusted.",
    },
  },
  {
    id: "verify-valid",
    kind: "principle",
    spotlight: { entityIds: allNodeIds },
    sceneActions: [{ type: "VERIFY_RESULT", result: "valid" }],
    narration: {
      heading: "Signature Valid",
      body: "Each node uses the sender's public key to confirm the signature matches. Because it does, every node accepts the transaction — independently and in agreement.",
    },
    principleBadge: { label: "Public-Key Cryptography", icon: "🔑" },
  },
  {
    id: "wrong-key-attempt",
    kind: "interactive",
    spotlight: { entityIds: ["wallet", ...allNodeIds] },
    narration: {
      heading: "What If You Don't Have the Key?",
      body: "Now try broadcasting a transaction signed with the wrong private key — impersonating Alice without actually having her secret.",
    },
    interactive: {
      controlId: "wrong-key",
      ctaLabel: "Attempt With the Wrong Key",
      onComplete: () => [
        { type: "RESET_VERIFICATION" },
        { type: "SIGN_WRONG_KEY" },
        { type: "PROPAGATE" },
        { type: "VERIFY_RESULT", result: "invalid" },
      ],
    },
  },
  {
    id: "summary",
    kind: "summary",
    spotlight: { entityIds: ["wallet", ...allNodeIds] },
    narration: {
      heading: "Authenticity Without Passwords",
      body: "Blockchain authentication doesn't rely on usernames or passwords at all — it relies on math. Only the holder of a private key can produce a signature that key's matching public key will validate.",
    },
    principleBadge: { label: "Non-Repudiation", icon: "🛡️" },
  },
];

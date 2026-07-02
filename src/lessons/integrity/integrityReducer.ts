import type { SceneAction } from "../../engine/types";
import type { BlockData } from "../../components/blockchain/Block";
import { fakeHash } from "../../engine/hash";

export type ChainStatus = "healthy" | "compromised" | "repairing" | "restored";

export interface IntegrityState {
  blocks: BlockData[];
  chainStatus: ChainStatus;
}

function computeHash(prevHash: string | null, tx: BlockData["tx"], index: number): string {
  return fakeHash(`${prevHash ?? "genesis"}|${tx?.from ?? ""}|${tx?.to ?? ""}|${tx?.amount ?? 0}|${index}`);
}

function makeInitialBlocks(): BlockData[] {
  const genesisHash = computeHash(null, null, 0);
  const tx1 = { from: "Alice", to: "Bob", amount: 10 };
  const hash1 = computeHash(genesisHash, tx1, 1);
  const tx2 = { from: "Bob", to: "Carol", amount: 3 };
  const hash2 = computeHash(hash1, tx2, 2);
  const tx3 = { from: "Carol", to: "Dave", amount: 7 };
  const hash3 = computeHash(hash2, tx3, 3);

  return [
    { id: "block-0", index: 0, tx: null, hash: genesisHash, prevHash: null, status: "normal", hashTrigger: 0, shakeTrigger: 0 },
    { id: "block-1", index: 1, tx: tx1, hash: hash1, prevHash: genesisHash, status: "normal", hashTrigger: 0, shakeTrigger: 0 },
    { id: "block-2", index: 2, tx: tx2, hash: hash2, prevHash: hash1, status: "normal", hashTrigger: 0, shakeTrigger: 0 },
    { id: "block-3", index: 3, tx: tx3, hash: hash3, prevHash: hash2, status: "normal", hashTrigger: 0, shakeTrigger: 0 },
  ];
}

export const integrityInitialState: IntegrityState = {
  blocks: makeInitialBlocks(),
  chainStatus: "healthy",
};

export function connectorState(a: BlockData, b: BlockData, chainStatus: ChainStatus): "normal" | "red" | "green" {
  if (b.prevHash !== a.hash) return "red";
  return chainStatus === "restored" ? "green" : "normal";
}

export function integrityReducer(state: IntegrityState, action: SceneAction): IntegrityState {
  switch (action.type) {
    case "RECOMPUTE_HASH": {
      const blockId = action.blockId as string;
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === blockId
            ? { ...b, hash: computeHash(b.prevHash, b.tx, b.index), hashTrigger: b.hashTrigger + 1 }
            : b
        ),
      };
    }
    case "EDIT_TX": {
      const blockId = action.blockId as string;
      const amount = action.amount as number;
      return {
        ...state,
        blocks: state.blocks.map((b) => (b.id === blockId && b.tx ? { ...b, tx: { ...b.tx, amount } } : b)),
      };
    }
    case "CASCADE_INVALIDATE": {
      const fromBlockId = action.fromBlockId as string;
      const fromIndex = state.blocks.find((b) => b.id === fromBlockId)?.index ?? 0;
      return {
        ...state,
        chainStatus: "compromised",
        blocks: state.blocks.map((b) =>
          b.index >= fromIndex ? { ...b, status: "invalid", shakeTrigger: b.shakeTrigger + 1 } : b
        ),
      };
    }
    case "REPAIR_START":
      return { ...state, chainStatus: "repairing" };
    case "REPAIR_BLOCK": {
      const blockId = action.blockId as string;
      const blocks = [...state.blocks];
      const idx = blocks.findIndex((b) => b.id === blockId);
      if (idx === -1) return state;
      const prevBlock = idx > 0 ? blocks[idx - 1] : null;
      const newPrevHash = prevBlock ? prevBlock.hash : null;
      const newHash = computeHash(newPrevHash, blocks[idx].tx, blocks[idx].index);
      blocks[idx] = {
        ...blocks[idx],
        prevHash: newPrevHash,
        hash: newHash,
        status: "valid",
        hashTrigger: blocks[idx].hashTrigger + 1,
      };
      return { ...state, blocks };
    }
    case "REPAIR_COMPLETE":
      return { ...state, chainStatus: "restored" };
    default:
      return state;
  }
}

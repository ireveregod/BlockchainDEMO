import { fakeHash } from "../engine/hash";
import type { SimBlock, SimNode, SimulationState, Transaction } from "./types";

export type SimAction =
  | { type: "ADD_TRANSACTION"; tx: Transaction }
  | { type: "MINE_BLOCK" }
  | { type: "SET_NODES_STATE"; state: SimNode["state"] }
  | { type: "TOGGLE_NODE"; nodeId: string }
  | { type: "TAMPER_BLOCK"; blockId: string; txIndex: number; amount: number }
  | { type: "REPAIR_CHAIN" };

function computeBlockHash(prevHash: string | null, txs: Transaction[], index: number): string {
  const txSig = txs.map((t) => `${t.from}>${t.to}:${t.amount}`).join("|");
  return fakeHash(`${prevHash ?? "genesis"}|${txSig}|${index}`);
}

const WALLET_NAMES = ["Alice", "Bob", "Carol", "Dave", "Eve"];

function makeGenesisBlock(): SimBlock {
  const hash = computeBlockHash(null, [], 0);
  return { id: "block-0", index: 0, txs: [], hash, prevHash: null, status: "valid", hashTrigger: 0, shakeTrigger: 0 };
}

export function makeInitialState(): SimulationState {
  return {
    blocks: [makeGenesisBlock()],
    pendingTxs: [],
    nodes: Array.from({ length: 6 }, (_, i) => ({ id: `node-${i + 1}`, label: `Node ${i + 1}`, state: "idle" as const })),
    wallets: WALLET_NAMES.map((name, i) => ({ id: `wallet-${i}`, name, balance: 100, keyValid: true })),
    tick: 0,
  };
}

export function simulationReducer(state: SimulationState, action: SimAction): SimulationState {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, pendingTxs: [...state.pendingTxs, action.tx], tick: state.tick + 1 };

    case "MINE_BLOCK": {
      if (state.pendingTxs.length === 0) return state;
      const prevBlock = state.blocks[state.blocks.length - 1];
      const index = state.blocks.length;
      const hash = computeBlockHash(prevBlock.hash, state.pendingTxs, index);
      const newBlock: SimBlock = {
        id: `block-${index}`,
        index,
        txs: state.pendingTxs,
        hash,
        prevHash: prevBlock.hash,
        status: "valid",
        hashTrigger: 1,
        shakeTrigger: 0,
      };
      return { ...state, blocks: [...state.blocks, newBlock], pendingTxs: [], tick: state.tick + 1 };
    }

    case "SET_NODES_STATE":
      return {
        ...state,
        nodes: state.nodes.map((n) => (n.state === "offline" ? n : { ...n, state: action.state })),
      };

    case "TOGGLE_NODE":
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.nodeId ? { ...n, state: n.state === "offline" ? "idle" : "offline" } : n
        ),
      };

    case "TAMPER_BLOCK": {
      const { blockId, txIndex, amount } = action;
      const idx = state.blocks.findIndex((b) => b.id === blockId);
      if (idx === -1) return state;
      const blocks = state.blocks.map((b) => ({ ...b, txs: [...b.txs] }));
      const target = blocks[idx];
      if (!target.txs[txIndex]) return state;
      target.txs[txIndex] = { ...target.txs[txIndex], amount };
      target.hash = computeBlockHash(target.prevHash, target.txs, target.index);
      target.hashTrigger += 1;
      for (let i = idx; i < blocks.length; i++) {
        blocks[i] = { ...blocks[i], status: "invalid", shakeTrigger: blocks[i].shakeTrigger + 1 };
      }
      return { ...state, blocks };
    }

    case "REPAIR_CHAIN": {
      const blocks = state.blocks.map((b) => ({ ...b }));
      for (let i = 1; i < blocks.length; i++) {
        const prev = blocks[i - 1];
        const recomputed = computeBlockHash(prev.hash, blocks[i].txs, blocks[i].index);
        if (blocks[i].prevHash !== prev.hash || blocks[i].hash !== recomputed) {
          blocks[i] = { ...blocks[i], prevHash: prev.hash, hash: recomputed, hashTrigger: blocks[i].hashTrigger + 1 };
        }
        blocks[i].status = "valid";
      }
      blocks[0].status = "valid";
      return { ...state, blocks };
    }

    default:
      return state;
  }
}

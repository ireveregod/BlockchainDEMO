import { useCallback, useEffect, useReducer, useRef } from "react";
import { makeInitialState, simulationReducer } from "./simulationReducer";
import type { CalloutTone } from "./CalloutContext";
import type { SimulationState, Transaction } from "./types";

type PushCallout = (anchorId: string, text: string, tone?: CalloutTone) => void;

const TX_INTERVAL_MS = 4200;
const MINE_INTERVAL_MS = 7000;

function randomAmount() {
  return Math.round((1 + Math.random() * 19) * 10) / 10;
}

function pickTwoDistinct<T>(items: T[]): [T, T] {
  const a = items[Math.floor(Math.random() * items.length)];
  let b = items[Math.floor(Math.random() * items.length)];
  while (b === a && items.length > 1) {
    b = items[Math.floor(Math.random() * items.length)];
  }
  return [a, b];
}

export function useSimulationEngine(pushCallout: PushCallout) {
  const [state, dispatch] = useReducer(simulationReducer, undefined, makeInitialState);
  const stateRef = useRef<SimulationState>(state);
  stateRef.current = state;

  const settleNodesAfterActivity = useCallback((finalState: "valid" | "invalid") => {
    setTimeout(() => dispatch({ type: "SET_NODES_STATE", state: finalState }), 650);
    setTimeout(() => dispatch({ type: "SET_NODES_STATE", state: "idle" }), 1500);
  }, []);

  const sendTransaction = useCallback(
    (from: string, to: string, amount: number) => {
      const tx: Transaction = { id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, from, to, amount };
      dispatch({ type: "ADD_TRANSACTION", tx });
      const wallet = stateRef.current.wallets.find((w) => w.name === from);
      if (wallet) pushCallout(wallet.id, `${from} → ${to}: ${amount} BTC`, "info");
    },
    [pushCallout]
  );

  const mineNow = useCallback(() => {
    const s = stateRef.current;
    if (s.pendingTxs.length === 0) return;
    const nextIndex = s.blocks.length;
    dispatch({ type: "MINE_BLOCK" });
    dispatch({ type: "SET_NODES_STATE", state: "verifying" });
    pushCallout(`block-${nextIndex}`, `Block #${nextIndex} mined`, "success");
    settleNodesAfterActivity("valid");
  }, [pushCallout, settleNodesAfterActivity]);

  const tamperBlock = useCallback(
    (blockId: string, txIndex: number, amount: number) => {
      dispatch({ type: "TAMPER_BLOCK", blockId, txIndex, amount });
      pushCallout(blockId, "Hash changed — chain broken from here", "danger");
    },
    [pushCallout]
  );

  const repairChain = useCallback(() => {
    dispatch({ type: "REPAIR_CHAIN" });
    const lastBlock = stateRef.current.blocks[stateRef.current.blocks.length - 1];
    if (lastBlock) pushCallout(lastBlock.id, "Chain repaired — every hash lines up again", "success");
  }, [pushCallout]);

  const toggleNode = useCallback(
    (nodeId: string) => {
      const node = stateRef.current.nodes.find((n) => n.id === nodeId);
      dispatch({ type: "TOGGLE_NODE", nodeId });
      if (node) {
        pushCallout(nodeId, node.state === "offline" ? `${node.label} back online` : `${node.label} went offline`, "warning");
      }
    },
    [pushCallout]
  );

  const forgeAttempt = useCallback(() => {
    const [victim] = stateRef.current.wallets;
    dispatch({ type: "SET_NODES_STATE", state: "verifying" });
    pushCallout(victim.id, "Signing without the private key…", "warning");
    setTimeout(() => {
      dispatch({ type: "SET_NODES_STATE", state: "invalid" });
      pushCallout(victim.id, "Invalid signature — rejected by every node", "danger");
    }, 650);
    setTimeout(() => dispatch({ type: "SET_NODES_STATE", state: "idle" }), 1600);
  }, [pushCallout]);

  // Autonomous loop: periodically generate transactions and mine them.
  useEffect(() => {
    const txTimer = setInterval(() => {
      const s = stateRef.current;
      const [from, to] = pickTwoDistinct(s.wallets);
      const tx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        from: from.name,
        to: to.name,
        amount: randomAmount(),
      };
      dispatch({ type: "ADD_TRANSACTION", tx });
      pushCallout(from.id, `${from.name} → ${to.name}: ${tx.amount} BTC`, "info");
    }, TX_INTERVAL_MS);

    const mineTimer = setInterval(() => {
      const s = stateRef.current;
      if (s.pendingTxs.length === 0) return;
      const nextIndex = s.blocks.length;
      dispatch({ type: "MINE_BLOCK" });
      dispatch({ type: "SET_NODES_STATE", state: "verifying" });
      pushCallout(`block-${nextIndex}`, `Block #${nextIndex} mined`, "success");
      setTimeout(() => dispatch({ type: "SET_NODES_STATE", state: "valid" }), 650);
      setTimeout(() => dispatch({ type: "SET_NODES_STATE", state: "idle" }), 1500);
    }, MINE_INTERVAL_MS);

    return () => {
      clearInterval(txTimer);
      clearInterval(mineTimer);
    };
  }, [pushCallout]);

  return { state, sendTransaction, mineNow, tamperBlock, repairChain, toggleNode, forgeAttempt };
}

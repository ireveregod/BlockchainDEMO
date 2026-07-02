import { useState } from "react";
import type { SimulationState } from "./types";

export function ControlPanel({
  state,
  onSendTransaction,
  onMineNow,
  onForgeAttempt,
  onRepairChain,
}: {
  state: SimulationState;
  onSendTransaction: (from: string, to: string, amount: number) => void;
  onMineNow: () => void;
  onForgeAttempt: () => void;
  onRepairChain: () => void;
}) {
  const [from, setFrom] = useState(state.wallets[0]?.name ?? "");
  const [to, setTo] = useState(state.wallets[1]?.name ?? "");
  const [amount, setAmount] = useState(10);
  const hasInvalidBlock = state.blocks.some((b) => b.status === "invalid");

  return (
    <div className="control-panel">
      <div className="control-panel__group">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {state.wallets.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
        <span className="control-panel__arrow">→</span>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {state.wallets.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="control-panel__amount"
          value={amount}
          min={1}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button
          className="btn btn--primary"
          disabled={from === to}
          onClick={() => onSendTransaction(from, to, amount)}
        >
          Send Transaction
        </button>
      </div>

      <div className="control-panel__group">
        <button className="btn" disabled={state.pendingTxs.length === 0} onClick={onMineNow}>
          ⛏ Mine Now {state.pendingTxs.length > 0 ? `(${state.pendingTxs.length})` : ""}
        </button>
        <button className="btn btn--danger-ghost" onClick={onForgeAttempt}>
          Forge Signature
        </button>
        {hasInvalidBlock && (
          <button className="btn btn--accent" onClick={onRepairChain}>
            Repair Chain
          </button>
        )}
      </div>

      <p className="control-panel__hint">
        Click a transaction on a mined block to tamper with it. Click a node to take it offline.
      </p>
    </div>
  );
}

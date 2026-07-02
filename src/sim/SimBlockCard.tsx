import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useRegisterEntity } from "../engine/spotlight/SceneRegistry";
import { shakeKeyframes, shakeTransition } from "../styles/theme";
import { HashText } from "../components/blockchain/HashText";
import type { SimBlock } from "./types";

const statusClass: Record<SimBlock["status"], string> = {
  valid: "block--normal",
  invalid: "block--invalid",
  mining: "block--mining",
};

export function SimBlockCard({
  data,
  style,
  onTamper,
}: {
  data: SimBlock;
  style?: React.CSSProperties;
  onTamper?: (txIndex: number, amount: number) => void;
}) {
  const ref = useRegisterEntity(data.id);
  const shakeControls = useAnimationControls();
  const lastShake = useRef(data.shakeTrigger);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftAmount, setDraftAmount] = useState("");

  useEffect(() => {
    if (data.shakeTrigger !== lastShake.current) {
      lastShake.current = data.shakeTrigger;
      shakeControls.start({ x: shakeKeyframes.x, transition: shakeTransition });
    }
  }, [data.shakeTrigger, shakeControls]);

  const startEdit = (i: number, currentAmount: number) => {
    if (!onTamper) return;
    setEditingIndex(i);
    setDraftAmount(String(currentAmount));
  };

  const confirmEdit = (i: number) => {
    const amount = Number(draftAmount);
    if (!Number.isNaN(amount) && amount > 0) onTamper?.(i, amount);
    setEditingIndex(null);
  };

  return (
    <motion.div ref={ref as React.Ref<HTMLDivElement>} className={`block ${statusClass[data.status]}`} style={style} animate={shakeControls}>
      <div className="block__header">Block #{data.index}</div>

      {data.txs.length === 0 ? (
        <div className="block__field">
          <span className="block__value block__value--muted">genesis — no transactions</span>
        </div>
      ) : (
        data.txs.map((tx, i) => (
          <div className="block__field" key={tx.id}>
            <span className="block__label">Transaction</span>
            {editingIndex === i ? (
              <span className="block__edit-row">
                <span className="mono">
                  {tx.from} → {tx.to} ·
                </span>
                <input
                  className="block__edit-input"
                  type="number"
                  value={draftAmount}
                  autoFocus
                  onChange={(e) => setDraftAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit(i)}
                />
                <button className="block__edit-confirm" onClick={() => confirmEdit(i)}>
                  ✓
                </button>
              </span>
            ) : (
              <span
                className={`block__value ${onTamper ? "block__value--editable" : ""}`}
                onClick={() => startEdit(i, tx.amount)}
                title={onTamper ? "Click to tamper with this transaction" : undefined}
              >
                {tx.from} → {tx.to} · {tx.amount} BTC {onTamper && <span className="block__edit-icon">✎</span>}
              </span>
            )}
          </div>
        ))
      )}

      <div className="block__field">
        <span className="block__label">Hash</span>
        <HashText value={data.hash} trigger={data.hashTrigger} className="block__hash" />
      </div>
      <div className="block__field">
        <span className="block__label">Prev Hash</span>
        {data.prevHash ? (
          <HashText value={data.prevHash} trigger={data.hashTrigger} className="block__hash block__hash--prev" />
        ) : (
          <span className="block__value block__value--muted">none</span>
        )}
      </div>
    </motion.div>
  );
}

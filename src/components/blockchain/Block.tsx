import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRegisterEntity } from "../../engine/spotlight/SceneRegistry";
import { useExploreClick, useSpotlight } from "../../engine/spotlight/SpotlightContext";
import { shakeKeyframes, shakeTransition } from "../../styles/theme";
import { HashText } from "./HashText";

export type BlockStatus = "normal" | "invalid" | "mining" | "valid";

export interface BlockData {
  id: string;
  index: number;
  tx: { from: string; to: string; amount: number } | null;
  hash: string;
  prevHash: string | null;
  status: BlockStatus;
  hashTrigger: number;
  shakeTrigger: number;
}

const statusClass: Record<BlockStatus, string> = {
  normal: "block--normal",
  invalid: "block--invalid",
  mining: "block--mining",
  valid: "block--valid",
};

const pulseClass: Record<BlockStatus, string> = {
  normal: "",
  invalid: "glow-pulse--red",
  mining: "glow-pulse--amber",
  valid: "glow-pulse--green",
};

export function Block({ data, style }: { data: BlockData; style?: React.CSSProperties }) {
  const ref = useRegisterEntity(data.id);
  const isActive = useSpotlight(data.id);
  const onExploreClick = useExploreClick(data.id);
  const shakeControls = useAnimationControls();
  const lastShake = useRef(data.shakeTrigger);

  useEffect(() => {
    if (data.shakeTrigger !== lastShake.current) {
      lastShake.current = data.shakeTrigger;
      shakeControls.start({ x: shakeKeyframes.x, transition: shakeTransition });
    }
  }, [data.shakeTrigger, shakeControls]);

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`block spotlight-entity ${isActive ? "is-active" : "is-dimmed"} ${statusClass[data.status]} ${
        isActive ? `glow-pulse ${pulseClass[data.status]}` : ""
      } ${onExploreClick ? "is-explorable" : ""}`}
      style={style}
      onClick={onExploreClick}
    >
      <motion.div animate={shakeControls}>
        <div className="block__header">Block #{data.index}</div>
        <div className="block__field">
          <span className="block__label">Transaction</span>
          {data.tx ? (
            <span className="block__value">
              {data.tx.from} → {data.tx.to} · {data.tx.amount} BTC
            </span>
          ) : (
            <span className="block__value block__value--muted">— empty —</span>
          )}
        </div>
        <div className="block__field">
          <span className="block__label">Hash</span>
          <HashText value={data.hash} trigger={data.hashTrigger} className="block__hash" />
        </div>
        <div className="block__field">
          <span className="block__label">Prev Hash</span>
          {data.prevHash ? (
            <HashText value={data.prevHash} trigger={data.hashTrigger} className="block__hash block__hash--prev" />
          ) : (
            <span className="block__value block__value--muted">genesis</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

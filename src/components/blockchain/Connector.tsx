import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";
import { useSceneRegistry } from "../../engine/spotlight/SceneRegistry";
import { useSpotlight } from "../../engine/spotlight/SpotlightContext";
import { shakeTransition } from "../../styles/theme";

export type ConnectorState = "normal" | "red" | "green";

interface ConnectorProps {
  id: string;
  from: string;
  to: string;
  state: ConnectorState;
  shakeTrigger?: number;
}

const strokeByState: Record<ConnectorState, string> = {
  normal: "var(--glow-blue)",
  red: "var(--glow-red)",
  green: "var(--glow-green)",
};

export function Connector({ id, from, to, state, shakeTrigger = 0 }: ConnectorProps) {
  const { getRect, version } = useSceneRegistry();
  const isActive = useSpotlight(id);
  const controls = useAnimationControls();
  const lastShake = useRef(shakeTrigger);

  useEffect(() => {
    if (shakeTrigger !== lastShake.current) {
      lastShake.current = shakeTrigger;
      controls.start({ y: [0, -3, 3, -2, 0], transition: shakeTransition });
    }
  }, [shakeTrigger, controls]);

  const fromRect = getRect(from);
  const toRect = getRect(to);
  if (!fromRect || !toRect) return null;

  const x1 = fromRect.x + fromRect.width;
  const y1 = fromRect.y + fromRect.height / 2;
  const x2 = toRect.x;
  const y2 = toRect.y + toRect.height / 2;
  const midX = (x1 + x2) / 2;

  return (
    <motion.svg
      key={version}
      className={`connector ${isActive ? "connector--active" : "connector--dim"}`}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      animate={controls}
    >
      <motion.path
        d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
        fill="none"
        stroke={strokeByState[state]}
        strokeWidth={isActive ? 3 : 2}
        strokeLinecap="round"
        markerEnd={`url(#arrow-${id}-${state})`}
        animate={{ stroke: strokeByState[state] }}
        transition={{ duration: 0.4 }}
      />
      <defs>
        {(["normal", "red", "green"] as ConnectorState[]).map((s) => (
          <marker
            key={s}
            id={`arrow-${id}-${s}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeByState[s]} />
          </marker>
        ))}
      </defs>
    </motion.svg>
  );
}

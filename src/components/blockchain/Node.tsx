import { useRegisterEntity } from "../../engine/spotlight/SceneRegistry";
import { useExploreClick, useSpotlight } from "../../engine/spotlight/SpotlightContext";

export type NodeState = "idle" | "verifying" | "valid" | "invalid" | "offline";

export interface NodeData {
  id: string;
  label: string;
  state: NodeState;
  x: number;
  y: number;
}

const stateClass: Record<NodeState, string> = {
  idle: "node--idle",
  verifying: "node--verifying",
  valid: "node--valid",
  invalid: "node--invalid",
  offline: "node--offline",
};

const pulseClass: Record<NodeState, string> = {
  idle: "",
  verifying: "glow-pulse--amber",
  valid: "glow-pulse--green",
  invalid: "glow-pulse--red",
  offline: "",
};

const stateIcon: Record<NodeState, string> = {
  idle: "",
  verifying: "⋯",
  valid: "✓",
  invalid: "✕",
  offline: "⏻",
};

export function Node({ data, onClick }: { data: NodeData; onClick?: () => void }) {
  const ref = useRegisterEntity(data.id);
  const isActive = useSpotlight(data.id);
  const onExploreClick = useExploreClick(data.id);
  const handleClick = onClick ?? onExploreClick;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`node spotlight-entity ${isActive ? "is-active" : "is-dimmed"} ${stateClass[data.state]} ${
        isActive && data.state !== "offline" ? `glow-pulse ${pulseClass[data.state]}` : ""
      } ${handleClick ? "is-explorable" : ""}`}
      style={{ position: "absolute", left: data.x, top: data.y }}
      onClick={handleClick}
    >
      <span className="node__icon">{stateIcon[data.state]}</span>
      <span className="node__label">{data.label}</span>
    </div>
  );
}

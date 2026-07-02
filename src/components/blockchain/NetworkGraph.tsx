import { Node, type NodeData } from "./Node";
import { Connector } from "./Connector";

export type NetworkLayout = "ring" | "grid";

interface NetworkGraphProps {
  nodes: Omit<NodeData, "x" | "y">[];
  layout: NetworkLayout;
  width?: number;
  height?: number;
  /** Optional explicit edges (entity id pairs); if omitted, ring layout connects neighbors. */
  edges?: Array<{ id: string; from: string; to: string; state: "normal" | "red" | "green" }>;
  center?: { id: string; label: string; state: NodeData["state"] };
  onNodeClick?: (nodeId: string) => void;
}

function ringPositions(count: number, width: number, height: number, radius: number) {
  const cx = width / 2;
  const cy = height / 2;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * radius - 28, y: cy + Math.sin(angle) * radius - 28 };
  });
}

function gridPositions(count: number, width: number) {
  const cols = Math.ceil(Math.sqrt(count));
  const spacingX = width / cols;
  const spacingY = 90;
  return Array.from({ length: count }, (_, i) => ({
    x: (i % cols) * spacingX + spacingX / 2 - 28,
    y: Math.floor(i / cols) * spacingY + 20,
  }));
}

export function NetworkGraph({ nodes, layout, width = 560, height = 420, edges, center, onNodeClick }: NetworkGraphProps) {
  const radius = Math.min(width, height) / 2 - 60;
  const positions =
    layout === "ring" ? ringPositions(nodes.length, width, height, radius) : gridPositions(nodes.length, width);

  const placedNodes: NodeData[] = nodes.map((n, i) => ({ ...n, ...positions[i] }));

  return (
    <div className="network-graph" style={{ position: "relative", width, height }}>
      {edges?.map((e) => <Connector key={e.id} id={e.id} from={e.from} to={e.to} state={e.state} />)}
      {center && layout === "ring" && (
        <Node data={{ id: center.id, label: center.label, state: center.state, x: width / 2 - 28, y: height / 2 - 28 }} />
      )}
      {placedNodes.map((n) => (
        <Node key={n.id} data={n} onClick={onNodeClick ? () => onNodeClick(n.id) : undefined} />
      ))}
    </div>
  );
}

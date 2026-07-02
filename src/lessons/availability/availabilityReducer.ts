import type { SceneAction } from "../../engine/types";
import type { NodeState } from "../../components/blockchain/Node";

export interface AvailabilityNodeData {
  id: string;
  label: string;
  state: NodeState;
}

export interface AvailabilityState {
  bankStatus: "up" | "crashed";
  view: "bank" | "network";
  nodes: AvailabilityNodeData[];
}

const NODE_COUNT = 10;
const DROPPED_INDEXES = new Set([1, 3, 6, 8]);

function makeNodes(dropped: boolean): AvailabilityNodeData[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => ({
    id: `node-${i + 1}`,
    label: `N${i + 1}`,
    state: dropped && DROPPED_INDEXES.has(i) ? "offline" : "idle",
  }));
}

export const availabilityInitialState: AvailabilityState = {
  bankStatus: "up",
  view: "bank",
  nodes: makeNodes(false),
};

export function availabilityReducer(state: AvailabilityState, action: SceneAction): AvailabilityState {
  switch (action.type) {
    case "CRASH_BANK":
      return { ...state, bankStatus: "crashed" };
    case "SHOW_NETWORK":
      return { ...state, view: "network" };
    case "DROP_NODES":
      return { ...state, nodes: makeNodes(true) };
    case "RESTORE_NODES":
      return { ...state, nodes: makeNodes(false) };
    default:
      return state;
  }
}

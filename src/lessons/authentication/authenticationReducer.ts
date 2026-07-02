import type { SceneAction } from "../../engine/types";
import type { NodeState } from "../../components/blockchain/Node";

export interface AuthNodeData {
  id: string;
  label: string;
  state: NodeState;
}

export interface AuthState {
  keyGenerated: boolean;
  signed: boolean;
  usedWrongKey: boolean;
  verdict: "idle" | "verifying" | "valid" | "invalid";
  nodes: AuthNodeData[];
}

function makeNodes(state: NodeState = "idle"): AuthNodeData[] {
  return [
    { id: "node-1", label: "Node A", state },
    { id: "node-2", label: "Node B", state },
    { id: "node-3", label: "Node C", state },
    { id: "node-4", label: "Node D", state },
    { id: "node-5", label: "Node E", state },
  ];
}

export const authenticationInitialState: AuthState = {
  keyGenerated: false,
  signed: false,
  usedWrongKey: false,
  verdict: "idle",
  nodes: makeNodes("idle"),
};

export function authenticationReducer(state: AuthState, action: SceneAction): AuthState {
  switch (action.type) {
    case "GENERATE_KEY":
      return { ...state, keyGenerated: true };
    case "SIGN":
      return { ...state, signed: true, usedWrongKey: false };
    case "SIGN_WRONG_KEY":
      return { ...state, signed: true, usedWrongKey: true };
    case "PROPAGATE":
      return { ...state, verdict: "verifying", nodes: makeNodes("verifying") };
    case "VERIFY_RESULT": {
      const result = action.result as "valid" | "invalid";
      return { ...state, verdict: result, nodes: makeNodes(result) };
    }
    case "RESET_VERIFICATION":
      return { ...state, verdict: "idle", nodes: makeNodes("idle") };
    default:
      return state;
  }
}

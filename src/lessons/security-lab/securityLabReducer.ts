import type { SceneAction } from "../../engine/types";
import { integrityInitialState, integrityReducer, type IntegrityState } from "../integrity/integrityReducer";
import { authenticationInitialState, authenticationReducer, type AuthState } from "../authentication/authenticationReducer";

export interface SecurityLabState {
  view: "chain" | "network";
  integrity: IntegrityState;
  auth: AuthState;
}

export const securityLabInitialState: SecurityLabState = {
  view: "chain",
  integrity: integrityInitialState,
  auth: authenticationInitialState,
};

/**
 * Composes the Integrity and Authentication reducers as reusable "attack modules" —
 * every scene action from either lesson is valid here; each sub-reducer ignores
 * action types it doesn't recognize (see their `default` cases).
 */
export function securityLabReducer(state: SecurityLabState, action: SceneAction): SecurityLabState {
  if (action.type === "SET_VIEW") {
    return { ...state, view: action.view as "chain" | "network" };
  }
  return {
    ...state,
    integrity: integrityReducer(state.integrity, action),
    auth: authenticationReducer(state.auth, action),
  };
}

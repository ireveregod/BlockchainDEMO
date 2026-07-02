import type { SceneAction } from "../../engine/types";

export interface ConfidentialityState {
  revealedGuarantees: boolean[];
}

export const confidentialityInitialState: ConfidentialityState = {
  revealedGuarantees: [false, false, false],
};

export function confidentialityReducer(state: ConfidentialityState, action: SceneAction): ConfidentialityState {
  switch (action.type) {
    case "REVEAL_GUARANTEE": {
      const index = action.index as number;
      const revealedGuarantees = [...state.revealedGuarantees];
      revealedGuarantees[index] = true;
      return { ...state, revealedGuarantees };
    }
    default:
      return state;
  }
}

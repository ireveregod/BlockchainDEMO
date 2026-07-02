import type { Lesson } from "../../engine/types";
import { confidentialityInitialState, confidentialityReducer, type ConfidentialityState } from "./confidentialityReducer";
import { confidentialitySteps } from "./steps";

export const confidentialityLesson: Lesson<ConfidentialityState> = {
  id: "confidentiality",
  title: "Confidentiality",
  tagline: "The myth that blockchain data is private.",
  accent: "var(--glow-purple)",
  steps: confidentialitySteps,
  initialSceneState: confidentialityInitialState,
  sceneReducer: confidentialityReducer,
};

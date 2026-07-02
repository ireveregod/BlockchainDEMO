import type { Lesson } from "../../engine/types";
import { integrityInitialState, integrityReducer, type IntegrityState } from "./integrityReducer";
import { integritySteps } from "./steps";

export const integrityLesson: Lesson<IntegrityState> = {
  id: "integrity",
  title: "Integrity",
  tagline: "Why tampering with one block breaks the whole chain.",
  accent: "var(--glow-blue)",
  steps: integritySteps,
  initialSceneState: integrityInitialState,
  sceneReducer: integrityReducer,
};

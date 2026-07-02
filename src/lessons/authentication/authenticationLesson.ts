import type { Lesson } from "../../engine/types";
import { authenticationInitialState, authenticationReducer, type AuthState } from "./authenticationReducer";
import { authenticationSteps } from "./steps";

export const authenticationLesson: Lesson<AuthState> = {
  id: "authentication",
  title: "Authentication",
  tagline: "How signatures prove who really sent a transaction.",
  accent: "var(--glow-green)",
  steps: authenticationSteps,
  initialSceneState: authenticationInitialState,
  sceneReducer: authenticationReducer,
};

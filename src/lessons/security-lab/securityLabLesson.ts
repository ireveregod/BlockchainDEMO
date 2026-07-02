import type { Lesson } from "../../engine/types";
import { securityLabInitialState, securityLabReducer, type SecurityLabState } from "./securityLabReducer";
import { securityLabSteps } from "./steps";

export const securityLabLesson: Lesson<SecurityLabState> = {
  id: "security-lab",
  title: "Security Lab",
  tagline: "Launch real attacks and watch the chain defend itself.",
  accent: "var(--glow-red)",
  steps: securityLabSteps,
  initialSceneState: securityLabInitialState,
  sceneReducer: securityLabReducer,
};

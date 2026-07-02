import type { Lesson } from "../../engine/types";
import { availabilityInitialState, availabilityReducer, type AvailabilityState } from "./availabilityReducer";
import { availabilitySteps } from "./steps";

export const availabilityLesson: Lesson<AvailabilityState> = {
  id: "availability",
  title: "Availability",
  tagline: "Why decentralization keeps the network running.",
  accent: "var(--glow-amber)",
  steps: availabilitySteps,
  initialSceneState: availabilityInitialState,
  sceneReducer: availabilityReducer,
};

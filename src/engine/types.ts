export type EntityId = string;

export interface CameraTarget {
  x: number;
  y: number;
  scale: number;
}

export interface SpotlightTarget {
  entityIds: EntityId[];
  camera?: CameraTarget;
}

export interface SceneAction {
  type: string;
  [key: string]: unknown;
}

export interface LessonStep {
  id: string;
  kind: "highlight" | "animate" | "explain" | "principle" | "summary" | "interactive";
  spotlight: SpotlightTarget;
  narration: {
    heading: string;
    body: string;
  };
  principleBadge?: {
    label: string;
    icon?: string;
  };
  /** Scene actions dispatched into the lesson reducer when this step becomes active. */
  sceneActions?: SceneAction[];
  /** Present when the step pauses and waits for a user-driven control before advancing. */
  interactive?: {
    controlId: string;
    ctaLabel: string;
    onComplete: (payload: unknown) => SceneAction[];
  };
}

export interface Lesson<TState = unknown> {
  id: string;
  title: string;
  tagline: string;
  accent: string;
  steps: LessonStep[];
  initialSceneState: TState;
  sceneReducer: (state: TState, action: SceneAction) => TState;
}

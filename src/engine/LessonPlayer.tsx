import { useCallback, useMemo, useReducer, useState, type ComponentType } from "react";
import type { CameraTarget, EntityId, Lesson } from "./types";
import { SpotlightContext, type SpotlightState } from "./spotlight/SpotlightContext";
import { SceneRegistryProvider, useSceneRegistry } from "./spotlight/SceneRegistry";
import { SceneViewport } from "./SceneViewport";
import { StepController } from "./StepController";
import { NarrationPanel } from "./NarrationPanel";

export interface SceneComponentProps<TState> {
  state: TState;
  dispatchInteractive: (payload: unknown) => void;
}

interface LessonPlayerProps<TState> {
  lesson: Lesson<TState>;
  sceneComponent: ComponentType<SceneComponentProps<TState>>;
}

/**
 * Replays a lesson's reducer from the initial state through step `index` (inclusive).
 * At each step, first applies that step's predefined `sceneActions`, then any
 * interactive actions the user triggered while on that step — so an action
 * recorded at step N (e.g. clicking "Tamper") stays applied for every step >= N,
 * not just the step it was triggered on.
 */
function computeStateAtStep<TState>(
  lesson: Lesson<TState>,
  index: number,
  interactiveLog: Record<number, import("./types").SceneAction[]>
): TState {
  let state = lesson.initialSceneState;
  for (let i = 0; i <= index; i++) {
    const actions = lesson.steps[i]?.sceneActions ?? [];
    for (const action of actions) {
      state = lesson.sceneReducer(state, action);
    }
    const interactiveActions = interactiveLog[i] ?? [];
    for (const action of interactiveActions) {
      state = lesson.sceneReducer(state, action);
    }
  }
  return state;
}

export function LessonPlayer<TState>({ lesson, sceneComponent: SceneComponent }: LessonPlayerProps<TState>) {
  return (
    <SceneRegistryProvider>
      <LessonPlayerInner lesson={lesson} SceneComponent={SceneComponent} />
    </SceneRegistryProvider>
  );
}

function LessonPlayerInner<TState>({
  lesson,
  SceneComponent,
}: {
  lesson: Lesson<TState>;
  SceneComponent: ComponentType<SceneComponentProps<TState>>;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<"guided" | "explore">("guided");
  const [exploreTarget, setExploreTarget] = useState<EntityId | null>(null);
  const [extraActionsAtStep, dispatchExtra] = useReducer(
    (
      map: Record<number, unknown[]>,
      entry: { index: number; payload: unknown } | { reset: true }
    ) => {
      if ("reset" in entry) return {};
      return { ...map, [entry.index]: [...(map[entry.index] ?? []), entry.payload] };
    },
    {}
  );
  const { getRect, version } = useSceneRegistry();

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;

  const sceneState = useMemo(() => {
    return computeStateAtStep(
      lesson,
      stepIndex,
      extraActionsAtStep as Record<number, import("./types").SceneAction[]>
    );
  }, [lesson, stepIndex, extraActionsAtStep]);

  const camera = useMemo<CameraTarget | null>(() => {
    void version; // recompute when registered entity rects change
    const spotlight = mode === "explore" ? null : step.spotlight;
    if (mode === "explore") {
      if (!exploreTarget) return null;
      const rect = getRect(exploreTarget);
      if (!rect) return null;
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, scale: 1.3 };
    }
    if (!spotlight) return null;
    if (spotlight.camera) return spotlight.camera;
    const rects = spotlight.entityIds.map((id) => getRect(id)).filter((r): r is NonNullable<typeof r> => !!r);
    if (rects.length === 0) return null;
    const minX = Math.min(...rects.map((r) => r.x));
    const minY = Math.min(...rects.map((r) => r.y));
    const maxX = Math.max(...rects.map((r) => r.x + r.width));
    const maxY = Math.max(...rects.map((r) => r.y + r.height));
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, scale: 1 };
  }, [mode, exploreTarget, step, getRect, version]);

  const activeIds = useMemo(() => {
    if (mode === "explore") {
      return exploreTarget ? new Set([exploreTarget]) : new Set<EntityId>();
    }
    return new Set(step.spotlight.entityIds);
  }, [mode, exploreTarget, step]);

  const spotlightValue: SpotlightState = useMemo(
    () => ({
      activeIds,
      camera,
      mode,
      setExploreTarget: (id) => setExploreTarget(id),
    }),
    [activeIds, camera, mode]
  );

  const goNext = useCallback(() => {
    if (!isLastStep) setStepIndex((i) => i + 1);
  }, [isLastStep]);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const goTo = useCallback((index: number) => {
    setStepIndex(Math.max(0, Math.min(lesson.steps.length - 1, index)));
  }, [lesson.steps.length]);

  const replay = useCallback(() => {
    setStepIndex(0);
    setMode("guided");
    setExploreTarget(null);
    dispatchExtra({ reset: true });
  }, []);

  const dispatchInteractive = useCallback(
    (payload: unknown) => {
      if (!step.interactive) return;
      const actions = step.interactive.onComplete(payload);
      for (const action of actions) dispatchExtra({ index: stepIndex, payload: action });
    },
    [step, stepIndex]
  );

  const toggleExplore = useCallback(() => {
    setMode((m) => (m === "guided" ? "explore" : "guided"));
    setExploreTarget(null);
  }, []);

  return (
    <SpotlightContext.Provider value={spotlightValue}>
      <div className="lesson-player">
        <SceneViewport>
          <SceneComponent state={sceneState} dispatchInteractive={dispatchInteractive} />
        </SceneViewport>

        <NarrationPanel
          heading={step.narration.heading}
          body={step.narration.body}
          principleBadge={step.principleBadge}
          stepIndex={stepIndex}
          totalSteps={lesson.steps.length}
          interactive={mode === "guided" ? step.interactive : undefined}
          onInteractiveComplete={dispatchInteractive}
        />

        <StepController
          current={stepIndex}
          total={lesson.steps.length}
          canGoBack={stepIndex > 0}
          canGoNext={!isLastStep}
          mode={mode}
          onNext={goNext}
          onBack={goBack}
          onJump={goTo}
          onReplay={replay}
          onToggleExplore={toggleExplore}
        />
      </div>
    </SpotlightContext.Provider>
  );
}

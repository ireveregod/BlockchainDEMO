interface StepControllerProps {
  current: number;
  total: number;
  canGoBack: boolean;
  canGoNext: boolean;
  mode: "guided" | "explore";
  onNext: () => void;
  onBack: () => void;
  onJump: (index: number) => void;
  onReplay: () => void;
  onToggleExplore: () => void;
}

export function StepController({
  current,
  total,
  canGoBack,
  canGoNext,
  mode,
  onNext,
  onBack,
  onJump,
  onReplay,
  onToggleExplore,
}: StepControllerProps) {
  return (
    <div className="step-controller">
      <div className="step-controller__dots">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            className={`step-dot ${i === current ? "step-dot--active" : ""}`}
            aria-label={`Go to step ${i + 1}`}
            onClick={() => onJump(i)}
          />
        ))}
      </div>

      <div className="step-controller__actions">
        <button className="btn btn--ghost" onClick={onReplay}>
          ↺ Replay
        </button>
        <button className="btn btn--ghost" onClick={onBack} disabled={!canGoBack || mode === "explore"}>
          ← Back
        </button>
        {canGoNext ? (
          <button className="btn btn--primary" onClick={onNext} disabled={mode === "explore"}>
            Next →
          </button>
        ) : (
          <button className="btn btn--primary" onClick={onReplay} disabled={mode === "explore"}>
            Restart Lesson
          </button>
        )}
        <button
          className={`btn btn--ghost ${mode === "explore" ? "btn--active" : ""}`}
          onClick={onToggleExplore}
        >
          {mode === "explore" ? "Exit Explore" : "Free Explore"}
        </button>
      </div>
    </div>
  );
}

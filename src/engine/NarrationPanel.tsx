import { motion } from "framer-motion";
import { PrincipleBadge } from "../components/ui/PrincipleBadge";
import type { LessonStep } from "./types";

interface NarrationPanelProps {
  heading: string;
  body: string;
  principleBadge?: { label: string; icon?: string };
  stepIndex: number;
  totalSteps: number;
  interactive?: LessonStep["interactive"];
  onInteractiveComplete: (payload: unknown) => void;
}

export function NarrationPanel({
  heading,
  body,
  principleBadge,
  stepIndex,
  totalSteps,
  interactive,
  onInteractiveComplete,
}: NarrationPanelProps) {
  return (
    <div className="narration-panel">
      <div className="narration-panel__progress">
        Step {stepIndex + 1} of {totalSteps}
      </div>
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <h2 className="narration-panel__heading">{heading}</h2>
        <p className="narration-panel__body">{body}</p>
        {principleBadge && <PrincipleBadge label={principleBadge.label} icon={principleBadge.icon} />}
        {interactive && (
          <button className="btn btn--accent narration-panel__cta" onClick={() => onInteractiveComplete(undefined)}>
            {interactive.ctaLabel}
          </button>
        )}
      </motion.div>
    </div>
  );
}

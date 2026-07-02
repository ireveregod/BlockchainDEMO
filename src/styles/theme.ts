export const spotlightSpring = { type: "spring" as const, stiffness: 90, damping: 20 };

export const shakeKeyframes = { x: [0, -6, 6, -5, 5, -2, 2, 0] };
export const shakeTransition = { duration: 0.5, ease: "easeInOut" as const };

export const stateColor = {
  normal: "var(--glow-blue)",
  valid: "var(--glow-green)",
  invalid: "var(--glow-red)",
  mining: "var(--glow-amber)",
} as const;

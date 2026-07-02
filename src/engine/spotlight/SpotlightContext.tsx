import { createContext, useContext } from "react";
import type { CameraTarget, EntityId } from "../types";

export interface SpotlightState {
  /** Empty set = nothing is dimmed (free-explore default / no active step). */
  activeIds: Set<EntityId>;
  camera: CameraTarget | null;
  mode: "guided" | "explore";
  /** In explore mode, clicking an entity sets it as the sole spotlighted target. */
  setExploreTarget: (id: EntityId | null) => void;
}

export const SpotlightContext = createContext<SpotlightState>({
  activeIds: new Set(),
  camera: null,
  mode: "guided",
  setExploreTarget: () => {},
});

/** Returns whether this entity should render in its "active" (spotlighted) visual state. */
export function useSpotlight(entityId: EntityId): boolean {
  const { activeIds } = useContext(SpotlightContext);
  if (activeIds.size === 0) return true;
  return activeIds.has(entityId);
}

export function useSpotlightState() {
  return useContext(SpotlightContext);
}

/**
 * Returns an onClick handler that, in free-explore mode, sets this entity as the
 * sole spotlight target. Returns undefined in guided mode so entities stay inert.
 */
export function useExploreClick(entityId: EntityId): (() => void) | undefined {
  const { mode, setExploreTarget, activeIds } = useContext(SpotlightContext);
  if (mode !== "explore") return undefined;
  return () => setExploreTarget(activeIds.has(entityId) ? null : entityId);
}

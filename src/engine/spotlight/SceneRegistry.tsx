import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { EntityId } from "../types";

export interface EntityRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SceneRegistryValue {
  register: (id: EntityId, el: HTMLElement | SVGElement | null) => void;
  getRect: (id: EntityId) => EntityRect | null;
  /** Bumped whenever a registered element moves/resizes, so consumers (Connector, camera) re-read rects. */
  version: number;
  worldRef: React.RefObject<HTMLDivElement | null>;
}

const SceneRegistryContext = createContext<SceneRegistryValue | null>(null);

export function SceneRegistryProvider({ children }: { children: ReactNode }) {
  const elements = useRef(new Map<EntityId, HTMLElement | SVGElement>());
  const worldRef = useRef<HTMLDivElement>(null);
  const [version, setVersion] = useState(0);

  const register = useCallback((id: EntityId, el: HTMLElement | SVGElement | null) => {
    if (el) {
      elements.current.set(id, el);
    } else {
      elements.current.delete(id);
    }
    setVersion((v) => v + 1);
  }, []);

  const getRect = useCallback((id: EntityId): EntityRect | null => {
    const el = elements.current.get(id);
    const world = worldRef.current;
    if (!el || !world) return null;
    const elRect = el.getBoundingClientRect();
    const worldRect = world.getBoundingClientRect();
    return {
      x: elRect.left - worldRect.left,
      y: elRect.top - worldRect.top,
      width: elRect.width,
      height: elRect.height,
    };
  }, []);

  useEffect(() => {
    const onResize = () => setVersion((v) => v + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <SceneRegistryContext.Provider value={{ register, getRect, version, worldRef }}>
      {children}
    </SceneRegistryContext.Provider>
  );
}

export function useSceneRegistry() {
  const ctx = useContext(SceneRegistryContext);
  if (!ctx) throw new Error("useSceneRegistry must be used within a SceneRegistryProvider");
  return ctx;
}

/** Attach to any entity that can be spotlighted, connected, or camera-targeted. */
export function useRegisterEntity(id: EntityId) {
  const { register } = useSceneRegistry();
  return useCallback((el: HTMLElement | SVGElement | null) => register(id, el), [register, id]);
}

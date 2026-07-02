import { motion } from "framer-motion";
import { useRef, useState, useLayoutEffect, type ReactNode } from "react";
import { useSpotlightState } from "./spotlight/SpotlightContext";
import { useSceneRegistry } from "./spotlight/SceneRegistry";
import { spotlightSpring } from "../styles/theme";

const DEFAULT_CAMERA = { x: 0, y: 0, scale: 1 };

/**
 * Wraps lesson scene content in a single transform layer that pans/zooms toward
 * the active step's camera target. No canvas/SVG-world needed — this is plain
 * DOM transform math against a fixed-size "world" div, translated so the target
 * point lands at the center of the visible viewport.
 */
export function SceneViewport({ children }: { children: ReactNode }) {
  const { camera } = useSpotlightState();
  const { worldRef } = useSceneRegistry();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const target = camera ?? DEFAULT_CAMERA;

  useLayoutEffect(() => {
    const measure = () => {
      const el = viewportRef.current;
      if (!el) return;
      setCenter({ x: el.clientWidth / 2, y: el.clientHeight / 2 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="scene-viewport" ref={viewportRef}>
      <motion.div
        ref={worldRef}
        className="scene-world"
        animate={{
          x: center.x - target.x * target.scale,
          y: center.y - target.y * target.scale,
          scale: target.scale,
        }}
        style={{ transformOrigin: "0 0" }}
        transition={spotlightSpring}
      >
        {children}
      </motion.div>
    </div>
  );
}

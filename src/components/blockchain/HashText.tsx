import { useEffect, useRef, useState } from "react";

const HEX_CHARS = "0123456789abcdef";

function randomHex(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  return out;
}

interface HashTextProps {
  value: string;
  /** Bump this number to re-trigger the scramble-to-value effect. */
  trigger: number;
  animate?: boolean;
  className?: string;
}

/**
 * Renders a hash value; when `trigger` changes, characters scramble randomly
 * before converging left-to-right on the final value. Plain interval-driven
 * text mutation — not a Framer Motion concern.
 */
export function HashText({ value, trigger, animate = true, className }: HashTextProps) {
  const [display, setDisplay] = useState(value);
  const frame = useRef(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!animate || firstRun.current) {
      firstRun.current = false;
      setDisplay(value);
      return;
    }
    const totalFrames = 14;
    frame.current = 0;
    const interval = setInterval(() => {
      frame.current += 1;
      const settledChars = Math.floor((frame.current / totalFrames) * value.length);
      const settled = value.slice(0, settledChars);
      const scrambled = randomHex(value.length - settledChars);
      setDisplay(settled + scrambled);
      if (frame.current >= totalFrames) {
        setDisplay(value);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, value, animate]);

  return <span className={`hash-text mono ${className ?? ""}`}>{display}</span>;
}

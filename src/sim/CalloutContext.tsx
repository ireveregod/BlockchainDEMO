import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useSceneRegistry } from "../engine/spotlight/SceneRegistry";

export type CalloutTone = "info" | "success" | "danger" | "warning";

interface CalloutItem {
  id: string;
  anchorId: string;
  text: string;
  tone: CalloutTone;
  leaving: boolean;
}

interface CalloutContextValue {
  pushCallout: (anchorId: string, text: string, tone?: CalloutTone) => void;
}

const CalloutContext = createContext<CalloutContextValue>({ pushCallout: () => {} });

const LIFETIME_MS = 3200;
const LEAVE_MS = 350;

export function CalloutProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CalloutItem[]>([]);
  const counter = useRef(0);

  const pushCallout = useCallback((anchorId: string, text: string, tone: CalloutTone = "info") => {
    const id = `callout-${counter.current++}`;
    setItems((prev) => [...prev, { id, anchorId, text, tone, leaving: false }]);

    setTimeout(() => {
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, leaving: true } : c)));
    }, LIFETIME_MS - LEAVE_MS);

    setTimeout(() => {
      setItems((prev) => prev.filter((c) => c.id !== id));
    }, LIFETIME_MS);
  }, []);

  return (
    <CalloutContext.Provider value={{ pushCallout }}>
      {children}
      <CalloutLayer items={items} />
    </CalloutContext.Provider>
  );
}

export function useCallouts() {
  return useContext(CalloutContext);
}

function CalloutLayer({ items }: { items: CalloutItem[] }) {
  const { getRect, version } = useSceneRegistry();
  void version;

  return (
    <>
      {items.map((item) => {
        const rect = getRect(item.anchorId);
        if (!rect) return null;
        return (
          <div
            key={item.id}
            className={`callout callout--${item.tone} ${item.leaving ? "callout--leaving" : "callout--entering"}`}
            style={{ left: rect.x + rect.width / 2, top: rect.y }}
          >
            {item.text}
          </div>
        );
      })}
    </>
  );
}

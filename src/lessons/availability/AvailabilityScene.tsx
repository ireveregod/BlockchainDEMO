import { motion } from "framer-motion";
import { useRegisterEntity } from "../../engine/spotlight/SceneRegistry";
import { useExploreClick, useSpotlight } from "../../engine/spotlight/SpotlightContext";
import { NetworkGraph } from "../../components/blockchain/NetworkGraph";
import type { SceneComponentProps } from "../../engine/LessonPlayer";
import type { AvailabilityState } from "./availabilityReducer";

function BankServer({ crashed }: { crashed: boolean }) {
  const ref = useRegisterEntity("bank-server");
  const isActive = useSpotlight("bank-server");
  const onExploreClick = useExploreClick("bank-server");

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`server-box spotlight-entity ${isActive ? "is-active" : "is-dimmed"} ${
        crashed ? "server-box--crashed" : ""
      } ${isActive && !crashed ? "glow-pulse" : ""} ${isActive && crashed ? "glow-pulse glow-pulse--red" : ""} ${
        onExploreClick ? "is-explorable" : ""
      }`}
      style={{ left: 220, top: 160 }}
      onClick={onExploreClick}
    >
      <strong>Central Bank Server</strong>
      <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{crashed ? "OFFLINE" : "Handling requests…"}</span>
    </div>
  );
}

export function AvailabilityScene({ state }: SceneComponentProps<AvailabilityState>) {
  const { bankStatus, view, nodes } = state;
  const offlineCount = nodes.filter((n) => n.state === "offline").length;

  if (view === "bank") {
    return (
      <>
        <BankServer crashed={bankStatus === "crashed"} />
        {bankStatus === "crashed" && (
          <motion.div
            className="scene-status scene-status--danger"
            style={{ left: 220, top: 300 }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Service unavailable
          </motion.div>
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ position: "absolute", left: 80, top: 20 }}>
        <NetworkGraph nodes={nodes} layout="ring" width={560} height={480} />
      </div>
      {offlineCount > 0 && (
        <motion.div
          className="scene-status scene-status--success"
          style={{ left: 80, top: 520 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Network still operational — {offlineCount} of {nodes.length} nodes offline
        </motion.div>
      )}
    </>
  );
}

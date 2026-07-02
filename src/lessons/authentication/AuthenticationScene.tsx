import { motion } from "framer-motion";
import { useRegisterEntity } from "../../engine/spotlight/SceneRegistry";
import { useExploreClick, useSpotlight } from "../../engine/spotlight/SpotlightContext";
import { Connector } from "../../components/blockchain/Connector";
import { NetworkGraph } from "../../components/blockchain/NetworkGraph";
import type { SceneComponentProps } from "../../engine/LessonPlayer";
import type { AuthState } from "./authenticationReducer";

const WALLET_X = 60;
const WALLET_Y = 220;
const NETWORK_X = 460;
const NETWORK_Y = 10;
const NETWORK_SIZE = 460;

function WalletBox({ keyGenerated, signed, usedWrongKey }: { keyGenerated: boolean; signed: boolean; usedWrongKey: boolean }) {
  const ref = useRegisterEntity("wallet");
  const isActive = useSpotlight("wallet");
  const onExploreClick = useExploreClick("wallet");

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`server-box spotlight-entity ${isActive ? "is-active" : "is-dimmed"} ${isActive ? "glow-pulse" : ""} ${
        usedWrongKey && signed ? "glow-pulse--red" : ""
      } ${onExploreClick ? "is-explorable" : ""}`}
      style={{ left: WALLET_X, top: WALLET_Y, height: 130 }}
      onClick={onExploreClick}
    >
      <strong>{usedWrongKey ? "Attacker Wallet" : "Alice's Wallet"}</strong>
      <span className="mono" style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
        {keyGenerated ? (usedWrongKey ? "key: 0xWRONG…" : "key: 0x9f2a…") : "no key yet"}
      </span>
      {signed && (
        <span className="mono" style={{ fontSize: "0.7rem", color: usedWrongKey ? "var(--glow-red)" : "var(--glow-green)" }}>
          ✎ signed
        </span>
      )}
    </div>
  );
}

export function AuthenticationScene({ state }: SceneComponentProps<AuthState>) {
  const { keyGenerated, signed, usedWrongKey, verdict, nodes } = state;
  const showLinks = verdict !== "idle";

  return (
    <>
      <WalletBox keyGenerated={keyGenerated} signed={signed} usedWrongKey={usedWrongKey} />

      <div style={{ position: "absolute", left: NETWORK_X, top: NETWORK_Y }}>
        <NetworkGraph nodes={nodes} layout="ring" width={NETWORK_SIZE} height={NETWORK_SIZE} />
      </div>

      {showLinks &&
        nodes.map((n) => (
          <Connector
            key={`wallet-${n.id}`}
            id={`link-wallet-${n.id}`}
            from="wallet"
            to={n.id}
            state={verdict === "valid" ? "green" : verdict === "invalid" ? "red" : "normal"}
          />
        ))}

      {verdict === "valid" && (
        <motion.div
          className="scene-status scene-status--success"
          style={{ left: WALLET_X, top: WALLET_Y + 150 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Signature Valid
        </motion.div>
      )}
      {verdict === "invalid" && (
        <motion.div
          className="scene-status scene-status--danger"
          style={{ left: WALLET_X, top: WALLET_Y + 150 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Invalid Signature
        </motion.div>
      )}
    </>
  );
}

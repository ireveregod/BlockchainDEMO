import { useRegisterEntity } from "../../engine/spotlight/SceneRegistry";
import { useExploreClick, useSpotlight } from "../../engine/spotlight/SpotlightContext";
import type { SceneComponentProps } from "../../engine/LessonPlayer";
import type { ConfidentialityState } from "./confidentialityReducer";

function SpotlightBox({
  id,
  x,
  y,
  width,
  className,
  children,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRegisterEntity(id);
  const isActive = useSpotlight(id);
  const onExploreClick = useExploreClick(id);
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`spotlight-entity ${isActive ? "is-active" : "is-dimmed"} ${className ?? ""} ${
        onExploreClick ? "is-explorable" : ""
      }`}
      style={{ position: "absolute", left: x, top: y, width }}
      onClick={onExploreClick}
    >
      {children}
    </div>
  );
}

const explorerRows = [
  { from: "0x71C7…9e2A", to: "0x9F3a…c41D", amount: "2.50 ETH" },
  { from: "bc1qxy…lh0w", to: "bc1qar…59tx", amount: "0.184 BTC" },
  { from: "0x4B2e…88Fa", to: "0x1Ad0…22Cc", amount: "1,204 USDC" },
];

const guarantees = [
  { id: "guarantee-integrity", label: "Integrity", icon: "🔗" },
  { id: "guarantee-authenticity", label: "Authenticity", icon: "🔑" },
  { id: "guarantee-availability", label: "Availability", icon: "🌐" },
];

const privacyTech = [
  { id: "privacy-encryption", label: "Encryption", body: "Scrambles transaction contents for those without the key." },
  { id: "privacy-zk", label: "Zero-Knowledge Proofs", body: "Proves a statement is true without revealing the data behind it." },
  { id: "privacy-networks", label: "Privacy Networks", body: "Purpose-built chains that hide sender, receiver, or amount by default." },
];

export function ConfidentialityScene({ state }: SceneComponentProps<ConfidentialityState>) {
  const { revealedGuarantees } = state;

  return (
    <>
      <SpotlightBox id="myth-claim" x={60} y={40} width={480} className="scene-status scene-status--danger" >
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>“Blockchain = Encrypted” ✕</div>
      </SpotlightBox>

      {explorerRows.map((row, i) => (
        <SpotlightBox key={`explorer-row-${i + 1}`} id={`explorer-row-${i + 1}`} x={60} y={140 + i * 115} width={520} className="block" >
          <div className="block__field">
            <span className="block__label">From → To</span>
            <span className="block__value mono">
              {row.from} → {row.to}
            </span>
          </div>
          <div className="block__field">
            <span className="block__label">Amount</span>
            <span className="block__value">{row.amount}</span>
          </div>
        </SpotlightBox>
      ))}

      {guarantees.map((g, i) => (
        <SpotlightBox
          key={g.id}
          id={g.id}
          x={60 + i * 200}
          y={510}
          width={170}
          className={`server-box ${revealedGuarantees[i] ? "glow-pulse glow-pulse--green" : ""}`}
        >
          <div style={{ fontSize: "1.4rem" }}>{revealedGuarantees[i] ? g.icon : "?"}</div>
          <strong>{revealedGuarantees[i] ? g.label : "———"}</strong>
        </SpotlightBox>
      ))}

      {privacyTech.map((p, i) => (
        <SpotlightBox key={p.id} id={p.id} x={60 + i * 200} y={670} width={180} className="server-box">
          <strong>{p.label}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{p.body}</span>
        </SpotlightBox>
      ))}
    </>
  );
}

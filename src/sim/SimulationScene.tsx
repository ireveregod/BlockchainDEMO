import { useEffect, useRef } from "react";
import { SimBlockCard } from "./SimBlockCard";
import { Connector } from "../components/blockchain/Connector";
import { NetworkGraph } from "../components/blockchain/NetworkGraph";
import { useRegisterEntity, useSceneRegistry } from "../engine/spotlight/SceneRegistry";
import type { SimulationState } from "./types";

const BLOCK_GAP = 300;
const BLOCK_TOP = 40;

function WalletBox({ id, name, pendingCount }: { id: string; name: string; pendingCount: number }) {
  const ref = useRegisterEntity(id);
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="wallet-chip">
      <strong>{name}</strong>
      {pendingCount > 0 && <span className="wallet-chip__badge">{pendingCount} pending</span>}
    </div>
  );
}

export function SimulationScene({
  state,
  onTamperBlock,
  onToggleNode,
}: {
  state: SimulationState;
  onTamperBlock: (blockId: string, txIndex: number, amount: number) => void;
  onToggleNode: (nodeId: string) => void;
}) {
  const { worldRef } = useSceneRegistry();
  const chainStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chainStripRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  }, [state.blocks.length]);

  return (
    <div className="sim-scene" ref={worldRef}>
      <div className="sim-scene__chain-label">Blockchain ({state.blocks.length} blocks)</div>
      <div className="chain-strip" ref={chainStripRef}>
        <div className="chain-strip__world" style={{ width: Math.max(1200, state.blocks.length * BLOCK_GAP + 260) }}>
          {state.blocks.slice(0, -1).map((b, i) => {
            const next = state.blocks[i + 1];
            const mismatch = next.prevHash !== b.hash;
            return (
              <Connector
                key={`connector-${b.index}-${next.index}`}
                id={`connector-${b.index}-${next.index}`}
                from={b.id}
                to={next.id}
                state={mismatch ? "red" : "green"}
              />
            );
          })}
          {state.blocks.map((b, i) => (
            <SimBlockCard
              key={b.id}
              data={b}
              style={{ left: 40 + i * BLOCK_GAP, top: BLOCK_TOP }}
              onTamper={b.txs.length > 0 ? (txIndex, amount) => onTamperBlock(b.id, txIndex, amount) : undefined}
            />
          ))}
        </div>
      </div>

      <div className="sim-scene__lower">
        <div className="sim-scene__network">
          <div className="sim-scene__panel-label">Validating Network</div>
          <NetworkGraph nodes={state.nodes} layout="ring" width={420} height={340} onNodeClick={onToggleNode} />
        </div>
        <div className="sim-scene__wallets">
          <div className="sim-scene__panel-label">Wallets</div>
          <div className="wallet-list">
            {state.wallets.map((w) => (
              <WalletBox
                key={w.id}
                id={w.id}
                name={w.name}
                pendingCount={state.pendingTxs.filter((t) => t.from === w.name).length}
              />
            ))}
          </div>
          {state.pendingTxs.length > 0 && (
            <div className="pending-pool">
              <div className="sim-scene__panel-label">Pending ({state.pendingTxs.length})</div>
              {state.pendingTxs.map((tx) => (
                <div key={tx.id} className="pending-pool__tx mono">
                  {tx.from} → {tx.to} · {tx.amount} BTC
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

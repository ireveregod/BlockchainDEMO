import { motion } from "framer-motion";
import { Block } from "../../components/blockchain/Block";
import { Connector } from "../../components/blockchain/Connector";
import type { SceneComponentProps } from "../../engine/LessonPlayer";
import { connectorState, type IntegrityState } from "./integrityReducer";

const BLOCK_X_GAP = 300;
const BLOCK_Y = 120;
const START_X = 80;

export function IntegrityScene({ state }: SceneComponentProps<IntegrityState>) {
  const { blocks, chainStatus } = state;

  return (
    <>
      {blocks.slice(0, -1).map((b, i) => {
        const next = blocks[i + 1];
        return (
          <Connector
            key={`connector-${b.index}-${next.index}`}
            id={`connector-${b.index}-${next.index}`}
            from={b.id}
            to={next.id}
            state={connectorState(b, next, chainStatus)}
          />
        );
      })}

      {blocks.map((b, i) => (
        <Block key={b.id} data={b} style={{ left: START_X + i * BLOCK_X_GAP, top: BLOCK_Y }} />
      ))}

      {chainStatus === "compromised" && (
        <motion.div
          className="scene-status scene-status--danger"
          style={{ left: START_X, top: BLOCK_Y + 220 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blockchain integrity compromised
        </motion.div>
      )}
      {chainStatus === "restored" && (
        <motion.div
          className="scene-status scene-status--success"
          style={{ left: START_X, top: BLOCK_Y + 220 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blockchain restored
        </motion.div>
      )}
    </>
  );
}

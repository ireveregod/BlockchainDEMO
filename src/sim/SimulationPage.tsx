import { Link } from "react-router-dom";
import { CalloutProvider, useCallouts } from "./CalloutContext";
import { SceneRegistryProvider } from "../engine/spotlight/SceneRegistry";
import { SimulationScene } from "./SimulationScene";
import { ControlPanel } from "./ControlPanel";
import { useSimulationEngine } from "./useSimulationEngine";

function SimulationInner() {
  const { pushCallout } = useCallouts();
  const { state, sendTransaction, mineNow, tamperBlock, repairChain, toggleNode, forgeAttempt } =
    useSimulationEngine(pushCallout);

  return (
    <>
      <SimulationScene state={state} onTamperBlock={tamperBlock} onToggleNode={toggleNode} />
      <ControlPanel
        state={state}
        onSendTransaction={sendTransaction}
        onMineNow={mineNow}
        onForgeAttempt={forgeAttempt}
        onRepairChain={repairChain}
      />
    </>
  );
}

export function SimulationPage() {
  return (
    <div className="sim-page">
      <div className="top-nav">
        <Link className="top-nav__brand" to="/">
          Blockchain, Explained
        </Link>
        <span className="top-nav__subtitle">A running network you can reach into</span>
        <Link className="top-nav__back" to="/" style={{ marginLeft: "auto" }}>
          ← All topics
        </Link>
      </div>
      <SceneRegistryProvider>
        <CalloutProvider>
          <SimulationInner />
        </CalloutProvider>
      </SceneRegistryProvider>
    </div>
  );
}

import { IntegrityScene } from "../integrity/IntegrityScene";
import { AuthenticationScene } from "../authentication/AuthenticationScene";
import type { SceneComponentProps } from "../../engine/LessonPlayer";
import type { SecurityLabState } from "./securityLabReducer";

/** Reuses the Integrity and Authentication lessons' own scene components as attack modules. */
export function SecurityLabScene({ state, dispatchInteractive }: SceneComponentProps<SecurityLabState>) {
  if (state.view === "network") {
    return <AuthenticationScene state={state.auth} dispatchInteractive={dispatchInteractive} />;
  }
  return <IntegrityScene state={state.integrity} dispatchInteractive={dispatchInteractive} />;
}

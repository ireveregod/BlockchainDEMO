import type { Lesson } from "../engine/types";
import type { ComponentType } from "react";
import type { SceneComponentProps } from "../engine/LessonPlayer";
import { integrityLesson } from "./integrity/integrityLesson";
import { IntegrityScene } from "./integrity/IntegrityScene";
import { authenticationLesson } from "./authentication/authenticationLesson";
import { AuthenticationScene } from "./authentication/AuthenticationScene";
import { availabilityLesson } from "./availability/availabilityLesson";
import { AvailabilityScene } from "./availability/AvailabilityScene";
import { securityLabLesson } from "./security-lab/securityLabLesson";
import { SecurityLabScene } from "./security-lab/SecurityLabScene";
import { confidentialityLesson } from "./confidentiality/confidentialityLesson";
import { ConfidentialityScene } from "./confidentiality/ConfidentialityScene";

export interface LessonEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lesson: Lesson<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene: ComponentType<SceneComponentProps<any>>;
}

export const lessonRegistry: Record<string, LessonEntry> = {
  integrity: { lesson: integrityLesson, scene: IntegrityScene },
  authentication: { lesson: authenticationLesson, scene: AuthenticationScene },
  availability: { lesson: availabilityLesson, scene: AvailabilityScene },
  "security-lab": { lesson: securityLabLesson, scene: SecurityLabScene },
  confidentiality: { lesson: confidentialityLesson, scene: ConfidentialityScene },
};

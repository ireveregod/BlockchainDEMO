import { Link, Navigate, useParams } from "react-router-dom";
import { lessonRegistry } from "../lessons";
import { LessonPlayer } from "../engine/LessonPlayer";

export function LessonPage() {
  const { lessonId } = useParams();
  const entry = lessonId ? lessonRegistry[lessonId] : undefined;

  if (!entry) return <Navigate to="/" replace />;

  return (
    <div className="lesson-page">
      <div className="top-nav">
        <Link className="top-nav__brand" to="/">
          Blockchain, Explained
        </Link>
        <Link className="top-nav__back" to="/">
          ← All topics
        </Link>
      </div>
      <LessonPlayer lesson={entry.lesson} sceneComponent={entry.scene} />
    </div>
  );
}

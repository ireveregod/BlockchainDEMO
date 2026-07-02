import { Link } from "react-router-dom";
import { topics } from "../lessons/topics";
import { lessonRegistry } from "../lessons";

const simulationCard = {
  id: "simulation",
  title: "Live Simulation",
  tagline: "A running blockchain network you can reach into — tamper a block, kill a node, forge a signature.",
  icon: "📡",
  accent: "var(--glow-green)",
  glow: "var(--glow-green-dim)",
};

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing__intro">
        <h1>Blockchain, Explained</h1>
        <p>
          Five short, guided lessons — each one a spotlighted walkthrough of a core security idea. Pick a topic and
          watch it happen, step by step. Or jump into the live simulation and drive it yourself.
        </p>
      </div>

      <div className="topic-grid">
        {topics.map((t) => {
          const available = Boolean(lessonRegistry[t.id]);
          const card = (
            <div
              className="topic-card"
              style={{ ["--topic-color" as string]: t.accent, ["--topic-glow" as string]: t.glow }}
            >
              <div className="topic-card__icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.tagline}</p>
              {!available && <p style={{ marginTop: 8, color: "var(--text-muted)" }}>Coming soon</p>}
            </div>
          );
          return available ? (
            <Link key={t.id} to={`/lesson/${t.id}`} style={{ display: "block" }}>
              {card}
            </Link>
          ) : (
            <div key={t.id} style={{ opacity: 0.6, cursor: "default" }}>
              {card}
            </div>
          );
        })}

        <Link
          key={simulationCard.id}
          to="/simulation"
          style={{ display: "block" }}
        >
          <div
            className="topic-card"
            style={{ ["--topic-color" as string]: simulationCard.accent, ["--topic-glow" as string]: simulationCard.glow }}
          >
            <div className="topic-card__icon">{simulationCard.icon}</div>
            <h3>{simulationCard.title}</h3>
            <p>{simulationCard.tagline}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── PredictionCard.jsx ───────────────────────────────────────────────────────
import { getRiskColor } from "../utils/studentFormConfig";
import ProbabilityChart from "./ProbabilityChart";

export default function PredictionCard({ result, onReset }) {
  if (!result) return null;

  const { risk_level, probabilities, recommendation, recommendation_source } = result;
  const colors = getRiskColor(risk_level);

  return (
    <div className="pred-card" style={{ "--risk-color": colors.border }}>
      {/* Header */}
      <div className="pred-card__header">
        <div>
          <p className="pred-card__sub">Assessment Complete</p>
          <h2 className="pred-card__heading">Student Risk Profile</h2>
        </div>
        <button className="btn btn--ghost" onClick={onReset}>
          ↩ New Assessment
        </button>
      </div>

      {/* Risk badge */}
      <div className="pred-card__badge-row">
        <div
          className="risk-badge"
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1.5px solid ${colors.border}`,
            boxShadow: `0 0 20px ${colors.border}33`,
          }}
        >
          <span className="risk-badge__dot" style={{ background: colors.border }} />
          {risk_level}
        </div>
        {recommendation_source && (
          <span className="pred-card__source">
            via <em>{recommendation_source}</em>
          </span>
        )}
      </div>

      {/* Probability chart */}
      <ProbabilityChart probabilities={probabilities} />

      {/* Recommendation */}
      <div className="pred-card__rec">
        <h3 className="pred-card__rec-title">Recommendation</h3>
        <div
          className="pred-card__rec-body"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {recommendation}
        </div>
      </div>
    </div>
  );
}

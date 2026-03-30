// ─── ProbabilityChart.jsx ─────────────────────────────────────────────────────
import { getRiskColor } from "../utils/studentFormConfig";

const ORDER = ["High Risk", "Medium Risk", "Low Risk"];

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;

  const entries = ORDER.filter((k) => k in probabilities).map((k) => ({
    label: k,
    value: probabilities[k],
    pct: Math.round(probabilities[k] * 100),
  }));

  return (
    <div className="prob-chart">
      <h3 className="prob-chart__title">Class Probabilities</h3>
      <div className="prob-chart__bars">
        {entries.map(({ label, pct }, i) => {
          const colors = getRiskColor(label);
          return (
            <div key={label} className="prob-bar">
              <div className="prob-bar__meta">
                <span className="prob-bar__label">{label}</span>
                <span className="prob-bar__pct" style={{ color: colors.text }}>
                  {pct}%
                </span>
              </div>
              <div className="prob-bar__track">
                {/* --bar-target lets the keyframe animate TO the correct width */}
                <div
                  className="prob-bar__fill"
                  style={{
                    "--bar-target": `${pct}%`,
                    animationDelay: `${i * 120}ms`,
                    background: colors.border,
                    boxShadow: `0 0 8px ${colors.border}55`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

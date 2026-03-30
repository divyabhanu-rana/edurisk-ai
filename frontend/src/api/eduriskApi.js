// ─── EduRisk AI – API Layer ───────────────────────────────────────────────────
// Reads VITE_API_BASE_URL from .env; falls back to localhost:8000.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * POST /predict
 * @param {Object} payload  – flat object matching backend schema exactly
 * @returns {Promise<{ risk_level, probabilities, recommendation, recommendation_source }>}
 */
export async function predictRisk(payload) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      detail = err.detail || err.message || detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }

  return response.json();
}

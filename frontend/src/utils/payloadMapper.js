// ─── payloadMapper.js ─────────────────────────────────────────────────────────
// Transforms raw form state into the exact JSON payload /predict expects.
// Keeps eduriskApi.js and StudentForm.jsx free of any transformation logic.

import { NUMERIC_FIELDS } from "./studentFormConfig";

/**
 * Maps raw form values → clean backend payload.
 *
 * Rules applied:
 *  - All numeric field values are cast to Number (guards against string inputs)
 *  - All categorical / boolean fields are kept as strings (backend expects them)
 *  - Unknown keys are stripped — only known fields pass through
 *
 * @param {Object} rawValues  – form state object (all values may be strings)
 * @returns {Object}          – payload safe to POST to /predict
 */
export function mapToPayload(rawValues) {
  const numericKeys = new Set(NUMERIC_FIELDS.map((f) => f.key));
  const payload = {};

  for (const [key, value] of Object.entries(rawValues)) {
    if (numericKeys.has(key)) {
      const n = Number(value);
      // Fallback to 0 if somehow NaN slips through (validation should catch it first)
      payload[key] = isNaN(n) ? 0 : n;
    } else {
      // Categorical and boolean fields stay as strings ("yes"/"no", "GP", etc.)
      payload[key] = value;
    }
  }

  return payload;
}

/**
 * Quick sanity-check — returns true if payload has all expected keys.
 * Useful for debugging schema mismatches during development.
 *
 * @param {Object} payload
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validatePayloadShape(payload) {
  const EXPECTED_KEYS = [
    "school","sex","address","famsize","Pstatus",
    "Mjob","Fjob","reason","guardian","subject",
    "schoolsup","famsup","paid","activities","nursery",
    "higher","internet","romantic",
    "age","Medu","Fedu","traveltime","studytime","failures",
    "famrel","freetime","goout","Dalc","Walc","health",
    "absences","G1","G2",
  ];

  const missing = EXPECTED_KEYS.filter((k) => !(k in payload));
  return { valid: missing.length === 0, missing };
}

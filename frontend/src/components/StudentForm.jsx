// ─── StudentForm.jsx ──────────────────────────────────────────────────────────
import { useState } from "react";
import {
  CATEGORICAL_FIELDS,
  BOOLEAN_FIELDS,
  NUMERIC_FIELDS,
  DEFAULT_VALUES,
} from "../utils/studentFormConfig";
import { mapToPayload } from "../utils/payloadMapper";

export default function StudentForm({ onSubmit, loading }) {
  const [values, setValues] = useState({ ...DEFAULT_VALUES });
  const [errors, setErrors] = useState({});

  // ── Handlers ──────────────────────────────────────────────────────────────
  const set = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    NUMERIC_FIELDS.forEach(({ key, min, max }) => {
      const v = Number(values[key]);
      if (isNaN(v) || values[key] === "" || values[key] === null) {
        errs[key] = "Required";
      } else if (v < min || v > max) {
        errs[key] = `Must be ${min}–${max}`;
      }
    });
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // scroll to first error
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // Map raw form state -> clean typed payload via payloadMapper
    onSubmit(mapToPayload(values));
  };

  // ── Sections ──────────────────────────────────────────────────────────────
  const catGroups = [
    {
      title: "School & Demographics",
      keys: ["school", "sex", "address", "famsize", "Pstatus", "subject"],
    },
    {
      title: "Family & Guardian",
      keys: ["Mjob", "Fjob", "guardian", "reason"],
    },
  ];

  const numGroups = [
    {
      title: "Personal Details",
      keys: ["age"],
    },
    {
      title: "Academic Performance",
      keys: ["failures", "absences", "G1", "G2"],
    },
    {
      title: "Family Background",
      keys: ["Medu", "Fedu", "famrel"],
    },
    {
      title: "Lifestyle & Habits",
      keys: ["traveltime", "studytime", "freetime", "goout", "Dalc", "Walc", "health"],
    },
  ];

  const getField = (key) => NUMERIC_FIELDS.find((f) => f.key === key);
  const getCatField = (key) => CATEGORICAL_FIELDS.find((f) => f.key === key);

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      {/* ── All sections wrapped so :last-child selector works correctly ── */}
      <div className="form-sections">
        {/* Categorical fields */}
        {catGroups.map((group) => (
          <div className="form-section" key={group.title}>
            <h3 className="form-section__title">{group.title}</h3>
            <div className="form-grid">
              {group.keys.map((key) => {
                const field = getCatField(key);
                if (!field) return null;
                return (
                  <div className="form-field" key={key} id={`field-${key}`}>
                    <label className="form-label">{field.label}</label>
                    <select
                      className="form-select"
                      value={values[key]}
                      onChange={(e) => set(key, e.target.value)}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Boolean fields */}
        <div className="form-section">
          <h3 className="form-section__title">Support & Activities</h3>
          <div className="form-grid form-grid--bool">
            {BOOLEAN_FIELDS.map(({ key, label }) => (
              <div className="form-field form-field--bool" key={key} id={`field-${key}`}>
                <span className="form-label">{label}</span>
                <div className="toggle-group">
                  {["yes", "no"].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      className={`toggle-btn ${values[key] === opt ? "toggle-btn--active" : ""}`}
                      onClick={() => set(key, opt)}
                    >
                      {opt === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Numeric fields */}
        {numGroups.map((group) => (
          <div className="form-section" key={group.title}>
            <h3 className="form-section__title">{group.title}</h3>
            <div className="form-grid">
              {group.keys.map((key) => {
                const field = getField(key);
                if (!field) return null;
                return (
                  <div className="form-field" key={key} id={`field-${key}`}>
                    <label className="form-label">
                      {field.label}
                      <span className="form-hint">{field.hint}</span>
                    </label>
                    <input
                      type="number"
                      className={`form-input ${errors[key] ? "form-input--error" : ""}`}
                      value={values[key]}
                      min={field.min}
                      max={field.max}
                      onChange={(e) => set(key, e.target.value)}
                    />
                    {errors[key] && (
                      <span className="form-error">{errors[key]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>{/* end .form-sections */}

      {/* ── Submit ─────────────────────────────────────────────────────── */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analysing…
            </>
          ) : (
            "Run Risk Assessment →"
          )}
        </button>
      </div>
    </form>
  );
}
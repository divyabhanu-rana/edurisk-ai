// ─── Home.jsx ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import StudentForm from "../components/StudentForm";
import PredictionCard from "../components/PredictionCard";
import { predictRisk } from "../api/eduriskApi";

export default function Home() {
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);
  const [error,   setError]     = useState(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await predictRisk(payload);
      setResult(data);
      // Scroll to result smoothly
      setTimeout(() => {
        document.getElementById("result-anchor")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <header className="hero">
        <div className="hero__badge">AI-Powered</div>
        <h1 className="hero__title">
          EduRisk <span className="hero__accent">AI</span>
        </h1>
        <p className="hero__sub">
          Student Academic Risk Assessment &amp; Personalised Recommendations
        </p>
        <div className="hero__divider" />
      </header>

      <main className="main">
        {/* ── Error banner ──────────────────────────────────────────────── */}
        {error && (
          <div className="error-banner" role="alert">
            <span className="error-banner__icon">⚠</span>
            <div>
              <strong>Prediction failed</strong>
              <p>{error}</p>
            </div>
            <button
              className="error-banner__close"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Show form only if no result yet ───────────────────────────── */}
        {!result && (
          <section className="form-wrapper">
            <div className="form-wrapper__intro">
              <h2 className="form-wrapper__heading">Student Profile</h2>
              <p className="form-wrapper__desc">
                Fill in the student's academic and personal details below. All
                fields are required for an accurate prediction.
              </p>
            </div>
            <StudentForm onSubmit={handleSubmit} loading={loading} />
          </section>
        )}

        {/* ── Result ────────────────────────────────────────────────────── */}
        {result && (
          <div id="result-anchor">
            <PredictionCard result={result} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="footer">
        EduRisk AI · Powered by Machine Learning &amp; DeepSeek
      </footer>
    </div>
  );
}

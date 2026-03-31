# EduRisk AI

EduRisk AI is an end-to-end AI system that predicts student academic risk (**Low / Medium / High**) from academic and behavioral inputs, and generates personalized study recommendations.

Developed as part of the **Intel Unnati Generative AI Major Project** at **CHRIST (Deemed to be University), Delhi NCR**.

---

## ⚡ Quick Overview

- **Frontend:** React + Vite (Netlify)
- **Backend:** FastAPI (Railway)
- **ML Model:** Random Forest (scikit-learn pipeline)
- **Prediction API:** `POST /predict`

### Current Performance
- **Accuracy:** 0.8421
- **F1 Macro:** 0.8338
- **F1 Weighted:** 0.8410

---

## 🚀 Features

- Multi-class risk prediction: Low / Medium / High
- REST API-based inference workflow
- Personalized recommendation generation
- Report-ready evaluation outputs:
  - classification metrics
  - confusion matrix
  - feature importance (CSV + plot)

---

## 🧱 Tech Stack

### Frontend
- React 18
- Vite 5

### Backend
- FastAPI
- Uvicorn
- pandas, numpy
- scikit-learn
- joblib
- pydantic
- OpenAI SDK (optional recommendation enhancement)

---

## 📁 Project Structure

```text
edurisk-ai/
├── backend/
│   ├── app.py
│   ├── predictor.py
│   ├── schema.py
│   ├── requirements.txt
│   └── __init__.py
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .env.example
├── data/
├── docs/
├── models/
├── notebooks/
├── report_outputs/
├── utils/
├── .env
├── .env.example
├── requirements.txt
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production (Netlify), set:
```env
VITE_API_BASE_URL=https://edurisk-ai-production-283a.up.railway.app
```

### Backend (`.env` at project root or Railway variables)
```env
OPENAI_API_KEY=your_key_here
```

> Never commit real secrets/API keys to GitHub.

---

## ▶️ Local Setup

### 1) Clone and create virtual environment
```bash
git clone <your-repo-url>
cd edurisk-ai
python -m venv .venv
```

Activate venv:

- **Windows (PowerShell)**
```bash
.venv\Scripts\Activate.ps1
```

- **macOS/Linux**
```bash
source .venv/bin/activate
```

### 2) Run backend
```bash
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

Backend URL: `http://127.0.0.1:8000`  
Swagger docs: `http://127.0.0.1:8000/docs`

### 3) Run frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

---

## 🔌 API Reference

### `POST /predict`
Returns model inference output, including:
- predicted risk level
- probability/confidence details (if exposed)
- recommendation text (if enabled in backend)

Interactive docs: `http://127.0.0.1:8000/docs`

---

## 📊 Evaluation Summary (Latest)

From held-out test set (n=209):

- **Accuracy:** 0.8421  
- **Macro F1:** 0.8338  
- **Weighted F1:** 0.8410  

Per-class:
- **High Risk** — P: 0.8684, R: 0.7174, F1: 0.7857, Support: 46
- **Low Risk** — P: 0.9400, R: 0.7966, F1: 0.8624, Support: 59
- **Medium Risk** — P: 0.7934, R: 0.9231, F1: 0.8533, Support: 104

Artifacts generated in `report_outputs/`:
- `model_metrics.txt`
- `confusion_matrix.png`
- `feature_importance.csv`
- `feature_importance_top15.png`

---

## 🌐 Deployment

- **Frontend:** Netlify
- **Backend:** Railway
- **Configuration:** frontend uses `VITE_API_BASE_URL` for backend URL
- **Security:** API keys via environment variables only
- **CORS:** FastAPI configured for Netlify origin + local dev origins

---

## 👥 Contributors

- **Divyabhanu Rana** — [@divyabhanu-rana](https://github.com/divyabhanu-rana)
- **Rohan Raphael Arora** — [@rohanraphaelarora](https://github.com/rohanraphaelarora)

---

## 🛠 Troubleshooting

- If frontend cannot call backend:
  - verify `VITE_API_BASE_URL`
  - ensure backend is running and `/docs` opens
  - verify CORS allowlist includes frontend origin
- If model artifact fails to load:
  - check scikit-learn version compatibility with `.pkl` files

---

## 📄 License

Licensed under the terms in the [LICENSE](./LICENSE) file.

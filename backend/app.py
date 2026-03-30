from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.schema import StudentInput
from backend.predictor import predict_risk

app = FastAPI(
    title="EduRisk AI Backend",
    version="1.0.0",
    description="Predict student academic risk level and generate study recommendations."
)

# Allow frontend (Vite) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://edurisk-ai.netlify.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "EduRisk AI Backend",
        "message": "API is running. Use POST /predict for predictions."
    }


@app.post("/predict")
def predict(student: StudentInput):
    try:
        result = predict_risk(student.model_dump())
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
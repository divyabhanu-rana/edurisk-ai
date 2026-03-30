import os
import re
import json
import joblib
import pandas as pd
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "student_risk_model.pkl"

model = None
if MODEL_PATH.exists():
    model = joblib.load(MODEL_PATH)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

client = None
if DEEPSEEK_API_KEY:
    client = OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com/v1",
    )


def clean_llm_text(text: str) -> str:
    if not text:
        return text
    text = text.replace("\\n", "\n")
    text = text.replace("###", "").replace("##", "").replace("#", "").replace("**", "")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def rule_based_recommendation(risk_level: str) -> str:
    if risk_level == "High Risk":
        return ("High Risk: Follow a strict schedule (2-3 hrs/day), reduce absences, revise weak topics first, "
                "solve previous-year papers, and review mistakes weekly.")
    if risk_level == "Medium Risk":
        return ("Medium Risk: Study consistently (1.5-2 hrs/day), maintain weekly revision targets, "
                "and improve test practice + error tracking.")
    return ("Low Risk: Maintain current routine, keep revising regularly, and solve advanced problems "
            "to sustain top performance.")


def llm_recommendation(payload: dict, risk_level: str, probabilities: dict) -> tuple[str, str]:
    if client is None:
        return rule_based_recommendation(risk_level), "rule_based"

    prompt = f"""
You are an academic mentor AI.

Given this student profile and predicted academic risk:
1) Provide 5 actionable study recommendations
2) Provide a concise Mon-Sun plan
3) End with one motivational sentence

Risk level: {risk_level}
Class probabilities: {json.dumps(probabilities)}
Student data: {json.dumps(payload)}
"""

    try:
        response = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=[
                {"role": "system", "content": "You are a practical academic advisor. Return plain text only (no markdown, no hashtags)."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        text = clean_llm_text((response.choices[0].message.content or "").strip())
        if text:
            return text, "deepseek"
        return rule_based_recommendation(risk_level), "rule_based"
    except Exception:
        return rule_based_recommendation(risk_level), "rule_based"


def predict_risk(payload: dict) -> dict:
    if model is None:
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Ensure model artifact is present in deployment.")

    df = pd.DataFrame([payload])

    pred = model.predict(df)[0]
    proba = model.predict_proba(df)[0]
    classes = model.classes_.tolist()

    probabilities = {cls: float(p) for cls, p in zip(classes, proba)}
    probabilities = dict(sorted(probabilities.items(), key=lambda x: x[1], reverse=True))

    recommendation, source = llm_recommendation(payload, pred, probabilities)

    return {
        "risk_level": pred,
        "probabilities": probabilities,
        "recommendation": recommendation,
        "recommendation_source": source,
    }
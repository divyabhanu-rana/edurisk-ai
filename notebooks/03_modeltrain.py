import os
import sys
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score
)
from sklearn.pipeline import Pipeline

# -------------------------------------------------
# Allow imports from project root (for utils import)
# -------------------------------------------------
sys.path.append(os.path.abspath("."))

from utils.plot_utils import save_plot

# =========================================
# CONFIG
# =========================================
PROCESSED_DIR = "data/processed"
MODELS_DIR = "models"

TRAIN_FILE = os.path.join(PROCESSED_DIR, "train_split.csv")
TEST_FILE = os.path.join(PROCESSED_DIR, "test_split.csv")
PREPROCESSOR_FILE = os.path.join(MODELS_DIR, "preprocessor.pkl")
METADATA_FILE = os.path.join(MODELS_DIR, "metadata.pkl")

TARGET_COL = "risk_level"

MODEL_OUTPUT = os.path.join(MODELS_DIR, "student_risk_model.pkl")
REPORT_OUTPUT = os.path.join(MODELS_DIR, "model_metrics.txt")
FEATURE_IMPORTANCE_CSV = os.path.join(MODELS_DIR, "feature_importance.csv")

RANDOM_STATE = 42

os.makedirs(MODELS_DIR, exist_ok=True)

# =========================================
# LOAD DATA + ARTIFACTS
# =========================================
train_df = pd.read_csv(TRAIN_FILE)
test_df = pd.read_csv(TEST_FILE)

preprocessor = joblib.load(PREPROCESSOR_FILE)
_ = joblib.load(METADATA_FILE)  # loaded for consistency; can be used later

X_train = train_df.drop(columns=[TARGET_COL])
y_train = train_df[TARGET_COL]

X_test = test_df.drop(columns=[TARGET_COL])
y_test = test_df[TARGET_COL]

print(f"Train shape: {X_train.shape}, Test shape: {X_test.shape}")
print(f"Classes in train: {sorted(y_train.unique())}")

# =========================================
# BUILD MODEL PIPELINE
# =========================================
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    class_weight="balanced",
    random_state=RANDOM_STATE,
    n_jobs=-1
)

model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", rf)
])

# =========================================
# TRAIN
# =========================================
model.fit(X_train, y_train)
print("Model training completed ✅")

# =========================================
# EVALUATE
# =========================================
y_pred = model.predict(X_test)

acc = accuracy_score(y_test, y_pred)
f1_macro = f1_score(y_test, y_pred, average="macro")
f1_weighted = f1_score(y_test, y_pred, average="weighted")
report = classification_report(y_test, y_pred, digits=4)

print("\n===== Evaluation =====")
print(f"Accuracy     : {acc:.4f}")
print(f"F1 (Macro)   : {f1_macro:.4f}")
print(f"F1 (Weighted): {f1_weighted:.4f}")
print("\nClassification Report:\n")
print(report)

# =========================================
# CONFUSION MATRIX PLOT
# =========================================
class_order = ["High Risk", "Medium Risk", "Low Risk"]
cm = confusion_matrix(y_test, y_pred, labels=class_order)

plt.figure(figsize=(6, 5))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=class_order,
    yticklabels=class_order
)
plt.title("Confusion Matrix - Student Risk Model")
plt.xlabel("Predicted")
plt.ylabel("Actual")
save_plot("confusion_matrix.png")  # -> docs/screenshots/confusion_matrix.png

# =========================================
# FEATURE IMPORTANCE (CSV + PLOT)
# =========================================
feature_names = model.named_steps["preprocessor"].get_feature_names_out()
importances = model.named_steps["classifier"].feature_importances_

fi_df = pd.DataFrame({
    "feature": feature_names,
    "importance": importances
}).sort_values("importance", ascending=False)

fi_df.to_csv(FEATURE_IMPORTANCE_CSV, index=False)
print(f"Saved CSV: {FEATURE_IMPORTANCE_CSV}")

# Top-15 bar chart
top_n = 15
top_fi = fi_df.head(top_n).iloc[::-1]  # reverse for horizontal plotting

plt.figure(figsize=(10, 6))
plt.barh(top_fi["feature"], top_fi["importance"])
plt.title(f"Top {top_n} Feature Importances")
plt.xlabel("Importance")
plt.ylabel("Feature")
save_plot("feature_importance_top15.png")  # -> docs/screenshots/feature_importance_top15.png

# =========================================
# SAVE MODEL + METRICS
# =========================================
joblib.dump(model, MODEL_OUTPUT)
print(f"Saved model: {MODEL_OUTPUT}")

with open(REPORT_OUTPUT, "w", encoding="utf-8") as f:
    f.write("EduRisk AI - Model Evaluation\n")
    f.write("=============================\n")
    f.write(f"Accuracy: {acc:.4f}\n")
    f.write(f"F1 Macro: {f1_macro:.4f}\n")
    f.write(f"F1 Weighted: {f1_weighted:.4f}\n\n")
    f.write("Classification Report:\n")
    f.write(report)
    f.write("\nTop 20 Features by Importance:\n")
    f.write(fi_df.head(20).to_string(index=False))

print(f"Saved metrics report: {REPORT_OUTPUT}")
print("\n03_model_training completed ✅")
import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

# =========================================
# CONFIG
# =========================================
PROCESSED_DIR = "data/processed"
MODELS_DIR = "models"

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

INPUT_FILE = os.path.join(PROCESSED_DIR, "cleaned_data.csv")
TARGET_COL = "risk_level"

RANDOM_STATE = 42
TEST_SIZE = 0.2

# =========================================
# LOAD CLEANED DATA
# =========================================
df = pd.read_csv(INPUT_FILE)
print(f"Loaded cleaned data: {df.shape}")

# =========================================
# FEATURE/TARGET SPLIT
# =========================================
# Avoid leakage: drop G3 because target is derived from G3
drop_cols = [TARGET_COL, "G3"]
X = df.drop(columns=drop_cols)
y = df[TARGET_COL].copy()

cat_cols = X.select_dtypes(include=["object"]).columns.tolist()
num_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

print(f"Categorical columns ({len(cat_cols)}): {cat_cols}")
print(f"Numerical columns ({len(num_cols)}): {num_cols}")

# =========================================
# TRAIN / TEST SPLIT
# =========================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=TEST_SIZE,
    random_state=RANDOM_STATE,
    stratify=y
)

print(f"X_train: {X_train.shape}, X_test: {X_test.shape}")

# =========================================
# PREPROCESSING PIPELINE
# =========================================
numeric_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_pipeline, num_cols),
        ("cat", categorical_pipeline, cat_cols),
    ],
    remainder="drop"
)

# Fit on train only
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

print("Processed train shape:", X_train_processed.shape)
print("Processed test shape :", X_test_processed.shape)

# =========================================
# SAVE ARTIFACTS
# =========================================
# Save raw train/test splits with target
train_df = X_train.copy()
train_df[TARGET_COL] = y_train.values

test_df = X_test.copy()
test_df[TARGET_COL] = y_test.values

train_path = os.path.join(PROCESSED_DIR, "train_split.csv")
test_path = os.path.join(PROCESSED_DIR, "test_split.csv")

train_df.to_csv(train_path, index=False)
test_df.to_csv(test_path, index=False)

# Save transformed matrices (optional but useful)
joblib.dump(X_train_processed, os.path.join(PROCESSED_DIR, "X_train_processed.pkl"))
joblib.dump(X_test_processed, os.path.join(PROCESSED_DIR, "X_test_processed.pkl"))
joblib.dump(y_train, os.path.join(PROCESSED_DIR, "y_train.pkl"))
joblib.dump(y_test, os.path.join(PROCESSED_DIR, "y_test.pkl"))

# Save preprocessor
preprocessor_path = os.path.join(MODELS_DIR, "preprocessor.pkl")
joblib.dump(preprocessor, preprocessor_path)

# Save metadata for backend/frontend
metadata = {
    "target_col": TARGET_COL,
    "feature_columns": X.columns.tolist(),
    "categorical_cols": cat_cols,
    "numerical_cols": num_cols,
    "dropped_columns": drop_cols,
    "class_labels": ["High Risk", "Medium Risk", "Low Risk"]
}
metadata_path = os.path.join(MODELS_DIR, "metadata.pkl")
joblib.dump(metadata, metadata_path)

print("\nSaved files:")
print(f"- {train_path}")
print(f"- {test_path}")
print(f"- {os.path.join(PROCESSED_DIR, 'X_train_processed.pkl')}")
print(f"- {os.path.join(PROCESSED_DIR, 'X_test_processed.pkl')}")
print(f"- {os.path.join(PROCESSED_DIR, 'y_train.pkl')}")
print(f"- {os.path.join(PROCESSED_DIR, 'y_test.pkl')}")
print(f"- {preprocessor_path}")
print(f"- {metadata_path}")

print("\n02_feature_engineering completed ✅")
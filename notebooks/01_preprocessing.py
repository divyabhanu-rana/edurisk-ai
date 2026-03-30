import os
import numpy as np
import pandas as pd

# =========================================
# CONFIG
# =========================================
RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
os.makedirs(PROCESSED_DIR, exist_ok=True)

# "mat" | "por" | "both"
DATA_CHOICE = "both"

# =========================================
# LOAD DATA
# =========================================
mat_path = os.path.join(RAW_DIR, "student-mat.csv")
por_path = os.path.join(RAW_DIR, "student-por.csv")

if DATA_CHOICE == "mat":
    df = pd.read_csv(mat_path, sep=";")
elif DATA_CHOICE == "por":
    df = pd.read_csv(por_path, sep=";")
elif DATA_CHOICE == "both":
    df_mat = pd.read_csv(mat_path, sep=";")
    df_mat["subject"] = "mat"

    df_por = pd.read_csv(por_path, sep=";")
    df_por["subject"] = "por"

    df = pd.concat([df_mat, df_por], ignore_index=True)
else:
    raise ValueError("DATA_CHOICE must be one of: 'mat', 'por', 'both'")

print(f"Loaded shape: {df.shape}")

# =========================================
# BASIC CLEANING
# =========================================
df = df.drop_duplicates().reset_index(drop=True)

for col in ["G1", "G2", "G3"]:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# =========================================
# TARGET CREATION
# =========================================
def g3_to_risk(g3):
    if pd.isna(g3):
        return np.nan
    if g3 < 10:
        return "High Risk"
    elif g3 < 14:
        return "Medium Risk"
    else:
        return "Low Risk"

df["risk_level"] = df["G3"].apply(g3_to_risk)

# Drop rows with missing target
df = df.dropna(subset=["risk_level"]).reset_index(drop=True)

print("risk_level distribution:")
print(df["risk_level"].value_counts())

# =========================================
# SAVE CLEANED DATA
# =========================================
output_path = os.path.join(PROCESSED_DIR, "cleaned_data.csv")
df.to_csv(output_path, index=False)

print(f"Saved: {output_path}")
print("01_preprocessing completed ✅")
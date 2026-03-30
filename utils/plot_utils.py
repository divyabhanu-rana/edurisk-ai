import os
import matplotlib.pyplot as plt

def save_plot(filename: str, folder: str = "docs/screenshots", dpi: int = 200):
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, filename)
    plt.tight_layout()
    plt.savefig(path, dpi=dpi, bbox_inches="tight")
    plt.close()
    print(f"Saved plot: {path}")
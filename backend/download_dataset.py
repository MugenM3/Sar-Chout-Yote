"""
download_dataset.py
-------------------
Script to download the PlantVillage dataset from Kaggle using the Kaggle API.

USAGE:
    1. Create a Kaggle account at https://www.kaggle.com
    2. Go to Account → API → Create New API Token → Downloads kaggle.json
    3. Place kaggle.json at: C:\\Users\\<yourname>\\.kaggle\\kaggle.json
    4. Run this script:
           python download_dataset.py
"""

import os
import sys
import zipfile
import shutil
from pathlib import Path

# ── Configuration ──────────────────────────────────────────────────────────────
DATASET_SLUG = "abdallahalidev/plantvillage-dataset"
BASE_DIR     = Path(__file__).parent
DATA_DIR     = BASE_DIR / "data"
EXTRACT_DIR  = DATA_DIR / "raw"
FINAL_DIR    = DATA_DIR / "plantvillage"


def check_kaggle_credentials():
    """Check that kaggle.json credentials exist."""
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if not kaggle_json.exists():
        print("❌ kaggle.json not found!")
        print("\nTo fix this:")
        print("  1. Go to https://www.kaggle.com → Account → API")
        print("  2. Click 'Create New API Token'")
        print(f"  3. Move the downloaded kaggle.json to: {kaggle_json}")
        sys.exit(1)
    print(f"✅ Kaggle credentials found at: {kaggle_json}")


def download_dataset():
    """Download PlantVillage dataset from Kaggle."""
    try:
        import kaggle
    except ImportError:
        print("Installing kaggle package ...")
        os.system(f"{sys.executable} -m pip install kaggle -q")
        import kaggle

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"\n📥 Downloading PlantVillage dataset from Kaggle ...")
    print(f"   Dataset: {DATASET_SLUG}")
    print(f"   This may take several minutes (~2 GB) ...\n")

    # Use Kaggle API to download
    from kaggle.api.kaggle_api_extended import KaggleApiExtended
    api = KaggleApiExtended()
    api.authenticate()
    api.dataset_download_files(
        DATASET_SLUG,
        path=str(EXTRACT_DIR),
        unzip=False,
        quiet=False
    )
    print("✅ Download complete!")


def extract_dataset():
    """Extract the downloaded zip file."""
    zip_files = list(EXTRACT_DIR.glob("*.zip"))
    if not zip_files:
        print("❌ No zip file found in data/raw/")
        sys.exit(1)

    zip_path = zip_files[0]
    print(f"\n📦 Extracting: {zip_path.name} ...")

    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(EXTRACT_DIR)

    print("✅ Extraction complete!")


def organize_dataset():
    """
    Find the extracted folder with class subdirectories and move to data/plantvillage/.
    PlantVillage zip contains a structure like:
      plantvillage-dataset/
        color/
          Apple___Apple_scab/  ← these are the class folders
          ...
    We want: data/plantvillage/Apple___Apple_scab/ ...
    """
    print(f"\n🗂️  Organizing dataset to: {FINAL_DIR}")

    # Look for the 'color' folder (PlantVillage has segmented/color/grayscale)
    color_dir = None
    for root, dirs, _ in os.walk(EXTRACT_DIR):
        for d in dirs:
            full = Path(root) / d
            # Find a directory that contains class-named subdirectories
            subdirs = [s.name for s in full.iterdir() if s.is_dir()]
            if any('___' in s for s in subdirs):
                color_dir = full
                break
        if color_dir:
            break

    if not color_dir:
        # Fallback: look for any folder with apple/tomato class names
        print("⚠️  Could not auto-detect dataset folder. "
              f"Please manually copy class folders to: {FINAL_DIR}")
        return

    # Move class folders to FINAL_DIR
    if FINAL_DIR.exists():
        shutil.rmtree(FINAL_DIR)
    shutil.copytree(color_dir, FINAL_DIR)

    # Count classes
    classes = [d for d in FINAL_DIR.iterdir() if d.is_dir()]
    total_images = sum(len(list(c.glob('*.*'))) for c in classes)

    print(f"✅ Dataset organized!")
    print(f"   Classes : {len(classes)}")
    print(f"   Images  : {total_images:,}")
    print(f"   Location: {FINAL_DIR}")


def main():
    print("=" * 60)
    print("🌿 PlantVillage Dataset Downloader")
    print("=" * 60)

    check_kaggle_credentials()
    download_dataset()
    extract_dataset()
    organize_dataset()

    print("\n" + "=" * 60)
    print("🎉 Dataset ready! Now train the model:")
    print("   python model/train_model.py")
    print("=" * 60)


if __name__ == "__main__":
    main()

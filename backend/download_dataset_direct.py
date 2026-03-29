import os
import sys
import json
import base64
import urllib.request
import urllib.error
from pathlib import Path

# Setup paths
BASE_DIR = Path(r"c:\Project\Plant")
DATA_DIR = BASE_DIR / "data"
EXTRACT_DIR = DATA_DIR / "raw"
DATASET_SLUG = "abdallahalidev/plantvillage-dataset"
ZIP_FILE = EXTRACT_DIR / "dataset.zip"

def get_kaggle_credentials():
    creds_path = Path.home() / ".kaggle" / "kaggle.json"
    if not creds_path.exists():
        print(f"❌ Could not find {creds_path}")
        sys.exit(1)
        
    with open(creds_path, 'r') as f:
        creds = json.load(f)
    return creds['username'], creds['key']

def download_dataset():
    print("🌿 Downloading PlantVillage dataset using direct Kaggle REST API...")
    username, key = get_kaggle_credentials()
    
    # Create auth header
    auth_str = f"{username}:{key}"
    auth_bytes = auth_str.encode('ascii')
    base64_bytes = base64.b64encode(auth_bytes)
    base64_str = base64_bytes.decode('ascii')
    
    # Construct URL
    owner, dataset = DATASET_SLUG.split('/')
    url = f"https://www.kaggle.com/api/v1/datasets/download/{owner}/{dataset}"
    
    req = urllib.request.Request(url)
    req.add_header('Authorization', f'Basic {base64_str}')
    
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)
    
    try:
        print(f"Downloading from {url}...")
        print("This is a 2GB file, so it will take a few minutes. Please wait...")
        urllib.request.urlretrieve(url, ZIP_FILE)
        print("✅ Download complete!")
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} - {e.reason}")
        if e.code == 401 or e.code == 403:
            print("Please check your kaggle.json credentials!")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    download_dataset()
    
    import zipfile
    import shutil
    
    print("\n📦 Extracting zip file...")
    with zipfile.ZipFile(ZIP_FILE, 'r') as zf:
        zf.extractall(EXTRACT_DIR)
        
    print("\n🗂️ Organizing folders...")
    FINAL_DIR = DATA_DIR / "plantvillage"
    
    color_dir = None
    for root, dirs, _ in os.walk(EXTRACT_DIR):
        for d in dirs:
            full = Path(root) / d
            subdirs = [s.name for s in full.iterdir() if s.is_dir()]
            if any('___' in s for s in subdirs):
                color_dir = full
                break
        if color_dir:
            break
            
    if color_dir:
        if FINAL_DIR.exists():
            shutil.rmtree(FINAL_DIR)
        shutil.copytree(color_dir, FINAL_DIR)
        print(f"✅ Dataset ready at {FINAL_DIR}")
        print("You can now run: python model/train_model.py")
    else:
        print("⚠️ Could not auto-detect class folders inside zip.")

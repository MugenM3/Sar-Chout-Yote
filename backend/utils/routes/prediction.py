"""
routes/prediction.py
--------------------
API route handlers for the /predict and /diseases endpoints.
Uses FastAPI APIRouter for modular route registration.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from utils.preprocess import preprocess_image, validate_image_file
from model.predict import predict_disease
from diseases import CLASS_NAMES, DISEASE_DATABASE, get_disease_info

logger = logging.getLogger(__name__)

# Create APIRouter — will be included in main.py
router = APIRouter()


# ── Pydantic Response Models ──────────────────────────────────────────────────

class PredictionResponse(BaseModel):
    """Schema for the prediction API response."""
    disease: str                 # Human-readable disease name
    affected_crop: str           # Which crop is affected
    confidence: float            # Confidence percentage (0–100)
    status: str                  # "Healthy" or "Diseased"
    symptoms: str                # Disease symptoms description
    solution: str                # Treatment/solution
    prevention: str              # Prevention tips
    severity: str                # Low / Medium / High / None
    is_demo: bool                # True if model not trained yet
    class_key: str               # Raw PlantVillage class name


class DiseaseEntry(BaseModel):
    """Schema for a single disease database entry."""
    class_key: str
    disease_name: str
    affected_crop: str
    severity: str


# ── POST /predict ─────────────────────────────────────────────────────────────

@router.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Accept a leaf image, run disease detection, and return structured results.

    - Accepts: jpg, jpeg, png, bmp, webp (max 5 MB)
    - Returns: disease info, confidence score, and treatment advice
    """
    logger.info(f"Received prediction request: {file.filename}")

    # ── Read file bytes ────────────────────────────────────────────────────────
    file_bytes = await file.read()

    # ── Validate file format and size ─────────────────────────────────────────
    try:
        validate_image_file(file.filename, len(file_bytes))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ── Preprocess image ──────────────────────────────────────────────────────
    try:
        img_array = preprocess_image(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Image processing error: {str(e)}")

    # ── Run model prediction ──────────────────────────────────────────────────
    try:
        result = predict_disease(img_array)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    # ── Low confidence warning ─────────────────────────────────────────────────
    if result["confidence"] < 50.0:
        logger.warning(f"Low confidence prediction: {result['confidence']:.1f}%")

    # ── Map prediction to disease info ─────────────────────────────────────────
    class_key = result["class_name"]
    disease_info = get_disease_info(class_key)

    # Determine healthy vs diseased status
    is_healthy = "healthy" in class_key.lower()
    status = "Healthy ✅" if is_healthy else "Diseased ❌"

    logger.info(
        f"Prediction: {disease_info['disease_name']} | "
        f"Confidence: {result['confidence']:.1f}% | "
        f"Status: {status}"
    )

    return PredictionResponse(
        disease=disease_info["disease_name"],
        affected_crop=disease_info["affected_crop"],
        confidence=result["confidence"],
        status=status,
        symptoms=disease_info["symptoms"],
        solution=disease_info["solution"],
        prevention=disease_info["prevention"],
        severity=disease_info["severity"],
        is_demo=result["is_demo"],
        class_key=class_key
    )


# ── GET /diseases ─────────────────────────────────────────────────────────────

@router.get("/diseases", response_model=list[DiseaseEntry])
async def get_diseases():
    """
    Return the full list of all 38 detectable PlantVillage disease classes.
    Useful for displaying a reference list in the frontend or API consumers.
    """
    return [
        DiseaseEntry(
            class_key=key,
            disease_name=info["disease_name"],
            affected_crop=info["affected_crop"],
            severity=info["severity"]
        )
        for key, info in DISEASE_DATABASE.items()
    ]

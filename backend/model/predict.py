"""
model/predict.py
----------------
Prediction logic for crop disease detection.
Loads the trained Keras model once at startup and provides a prediction function.
Falls back to a mock response if the model file is not found (demo mode).
"""

import numpy as np
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Path to the saved Keras model
MODEL_PATH = Path(__file__).parent / "crop_model.h5"

# Global model cache — loaded once, reused for every prediction
_model = None


def load_model():
    """
    Load the Keras model from disk into memory (singleton pattern).
    Called once at application startup.

    Returns:
        model or None: Keras model if found, None if in demo mode
    """
    global _model

    if _model is not None:
        return _model  # Already loaded — return cached model

    if MODEL_PATH.exists():
        try:
            import tensorflow as tf
            logger.info(f"Loading model from {MODEL_PATH} ...")
            _model = tf.keras.models.load_model(str(MODEL_PATH))
            logger.info("✅ Model loaded successfully.")
            return _model
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return None
    else:
        logger.warning(
            f"⚠️  Model file not found at {MODEL_PATH}. "
            "Running in DEMO mode with mock predictions. "
            "Train the model with: python model/train_model.py"
        )
        return None


def predict_disease(img_array: np.ndarray) -> dict:
    """
    Run disease prediction on a preprocessed image array.

    Args:
        img_array (np.ndarray): Preprocessed image, shape (1, 224, 224, 3)

    Returns:
        dict: {
            "class_name": str,       # PlantVillage class key
            "confidence": float,     # Confidence percentage (0–100)
            "is_demo": bool          # True if using mock prediction
        }
    """
    from diseases import CLASS_NAMES

    model = load_model()

    if model is None:
        # ── DEMO MODE ──────────────────────────────────────────────────────────
        # Return a realistic mock prediction when no model is trained yet.
        # This allows full end-to-end UI testing without a trained model.
        import random
        demo_class = random.choice([
            "Tomato___Late_blight",
            "Apple___Apple_scab",
            "Potato___Early_blight",
            "Corn_(maize)___Common_rust_",
            "Tomato___healthy",
        ])
        confidence = round(random.uniform(72.0, 96.5), 2)
        logger.info(f"[DEMO] Predicted: {demo_class} ({confidence}%)")
        return {
            "class_name": demo_class,
            "confidence": confidence,
            "is_demo": True
        }

    # ── REAL MODEL PREDICTION ──────────────────────────────────────────────────
    try:
        predictions = model.predict(img_array, verbose=0)   # shape (1, 38)
        class_index = int(np.argmax(predictions[0]))         # index of highest probability
        confidence = float(np.max(predictions[0])) * 100    # convert to percentage

        if class_index >= len(CLASS_NAMES):
            raise ValueError(f"Class index {class_index} out of range for {len(CLASS_NAMES)} classes")

        class_name = CLASS_NAMES[class_index]
        logger.info(f"Predicted: {class_name} ({confidence:.2f}%)")

        return {
            "class_name": class_name,
            "confidence": round(confidence, 2),
            "is_demo": False
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise RuntimeError(f"Prediction failed: {str(e)}")

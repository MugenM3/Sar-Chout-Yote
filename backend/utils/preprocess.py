"""
utils/preprocess.py
-------------------
Image preprocessing pipeline for crop disease detection.
Handles resizing, color conversion, normalization, and batch dimension expansion.
"""

import numpy as np
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)

# Target input size required by MobileNetV2 / EfficientNetB0
IMAGE_SIZE = (224, 224)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess raw image bytes into a model-ready numpy array.

    Steps:
    1. Load image from bytes using PIL
    2. Convert to RGB (handles RGBA / grayscale / palette images)
    3. Resize to 224x224 pixels
    4. Normalize pixel values from [0, 255] → [0.0, 1.0]
    5. Convert to float32 numpy array
    6. Expand dims to add batch dimension → shape (1, 224, 224, 3)

    Args:
        image_bytes (bytes): Raw image file bytes (jpg, png, etc.)

    Returns:
        np.ndarray: Preprocessed array of shape (1, 224, 224, 3), dtype float32

    Raises:
        ValueError: If the image cannot be read or is invalid
    """
    try:
        # Step 1: Open image from bytes
        image = Image.open(io.BytesIO(image_bytes))

        # Step 2: Convert to RGB (in case of RGBA, L, P mode images)
        image = image.convert("RGB")

        # Step 3: Resize to model input size (224x224)
        image = image.resize(IMAGE_SIZE, Image.LANCZOS)

        # Step 4 & 5: Convert to numpy float32 and normalize to [0, 1]
        img_array = np.array(image, dtype=np.float32) / 255.0

        # Step 6: Add batch dimension → (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)

        logger.debug(f"Preprocessed image shape: {img_array.shape}, dtype: {img_array.dtype}")
        return img_array

    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        raise ValueError(f"Could not process image: {str(e)}")


def validate_image_file(filename: str, file_size: int) -> None:
    """
    Validate file format and size before processing.

    Args:
        filename (str): Original uploaded filename
        file_size (int): File size in bytes

    Raises:
        ValueError: If file format or size is invalid
    """
    # Check allowed extensions
    allowed_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in allowed_extensions:
        raise ValueError(
            f"Invalid file format '{ext}'. Allowed: {', '.join(allowed_extensions)}"
        )

    # Check file size limit (5 MB)
    max_size_bytes = 5 * 1024 * 1024  # 5 MB
    if file_size > max_size_bytes:
        size_mb = file_size / (1024 * 1024)
        raise ValueError(
            f"File too large ({size_mb:.1f} MB). Maximum allowed size is 5 MB."
        )

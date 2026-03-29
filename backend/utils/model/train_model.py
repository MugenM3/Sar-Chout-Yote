"""
model/train_model.py
--------------------
Training script for Crop Disease Detection CNN.
Uses Transfer Learning with MobileNetV2 (pretrained on ImageNet).
Dataset: PlantVillage (38 disease classes, ~87,000 images)

HOW TO USE:
1. Download PlantVillage dataset from Kaggle:
   kaggle datasets download -d abdallahalidev/plantvillage-dataset
   Unzip to: data/plantvillage/

2. Run this script:
   python model/train_model.py

3. Trained model saved to: model/crop_model.h5
"""

import os
import sys
import logging
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, TensorBoard
)
from pathlib import Path

# ── Logging Setup ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# ── Configuration ──────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent.parent           # c:\Project\Plant\
DATA_DIR    = BASE_DIR / "data" / "plantvillage"    # unzipped dataset folder
MODEL_DIR   = BASE_DIR / "model"
MODEL_PATH  = MODEL_DIR / "crop_model.h5"
LOG_DIR     = BASE_DIR / "logs"

IMAGE_SIZE  = (224, 224)   # MobileNetV2 input size
BATCH_SIZE  = 32
EPOCHS      = 20
NUM_CLASSES = 38           # PlantVillage has 38 disease/healthy classes
LEARNING_RATE = 1e-4

# ── Dataset check ──────────────────────────────────────────────────────────────
if not DATA_DIR.exists():
    logger.error(
        f"\n❌ Dataset not found at: {DATA_DIR}\n"
        "Please download PlantVillage from Kaggle:\n"
        "  1. pip install kaggle\n"
        "  2. kaggle datasets download -d abdallahalidev/plantvillage-dataset\n"
        "  3. Unzip and move the folder to: data/plantvillage/\n"
        "     (so that data/plantvillage/Apple___Apple_scab/ etc. exist)\n"
    )
    sys.exit(1)


def build_data_generators():
    """
    Create train and validation ImageDataGenerators with augmentation.

    Train split: 80%  — with heavy augmentation
    Val   split: 20%  — no augmentation (only normalization)
    """
    logger.info("Building data generators ...")

    # Training generator: normalize + augmentation
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,           # Normalize pixel values 0→1
        validation_split=0.2,           # 80/20 train/val split
        rotation_range=30,              # Randomly rotate ±30°
        width_shift_range=0.15,         # Horizontal shift ±15%
        height_shift_range=0.15,        # Vertical shift ±15%
        shear_range=0.1,                # Shear transformation
        zoom_range=0.2,                 # Random zoom ±20%
        horizontal_flip=True,           # Mirror images
        fill_mode="nearest"             # Fill empty pixels with nearest
    )

    # Validation generator: only normalize (no augmentation)
    val_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=0.2
    )

    # Flow from directory — reads class names from subfolder names
    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        shuffle=True,
        seed=42
    )

    val_generator = val_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
        seed=42
    )

    logger.info(
        f"Train samples: {train_generator.samples} | "
        f"Val samples: {val_generator.samples} | "
        f"Classes: {train_generator.num_classes}"
    )

    # Save class name → index mapping for inference
    class_indices_path = MODEL_DIR / "class_indices.txt"
    with open(class_indices_path, "w") as f:
        for class_name, idx in sorted(train_generator.class_indices.items(), key=lambda x: x[1]):
            f.write(f"{idx}: {class_name}\n")
    logger.info(f"Class indices saved to {class_indices_path}")

    return train_generator, val_generator


def build_model(num_classes: int) -> tf.keras.Model:
    """
    Build transfer learning model using MobileNetV2.

    Architecture:
    - MobileNetV2 (ImageNet weights) as feature extractor — top layers removed
    - First 100 layers frozen (pretrained embeddings)
    - GlobalAveragePooling2D — reduces spatial dims to vector
    - Dropout(0.3) — regularization
    - Dense(256, relu) — custom classification head
    - Dropout(0.2)
    - Dense(num_classes, softmax) — output layer
    """
    logger.info("Building MobileNetV2 transfer learning model ...")

    # Load MobileNetV2 without top classification layer
    base_model = MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),   # (224, 224, 3)
        include_top=False,              # Remove original ImageNet classifier
        weights="imagenet"              # Use pretrained ImageNet weights
    )

    # Freeze the base model layers (use as feature extractor)
    # We'll unfreeze some top layers later for fine-tuning
    base_model.trainable = True
    for layer in base_model.layers[:-30]:   # Freeze all but last 30 layers
        layer.trainable = False

    logger.info(
        f"Base model: {base_model.name} | "
        f"Total layers: {len(base_model.layers)} | "
        f"Trainable: {sum(1 for l in base_model.layers if l.trainable)}"
    )

    # Build the full model
    model = models.Sequential([
        base_model,                                         # MobileNetV2 feature extractor
        layers.GlobalAveragePooling2D(),                   # Spatial → vector (1280,)
        layers.BatchNormalization(),                        # Normalize activations
        layers.Dropout(0.3),                               # Prevent overfitting
        layers.Dense(256, activation="relu"),              # Custom head
        layers.BatchNormalization(),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation="softmax")    # Output: 38 class probabilities
    ])

    # Compile with Adam optimizer and categorical crossentropy loss
    model.compile(
        optimizer=optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",                   # Multi-class classification
        metrics=["accuracy", "top_k_categorical_accuracy"] # Top-1 and Top-5 accuracy
    )

    model.summary()
    return model


def train():
    """
    Full training pipeline:
    1. Load data generators
    2. Build model
    3. Train with callbacks (early stopping, checkpoint, LR reduction)
    4. Evaluate on validation set
    5. Save final model
    """
    logger.info("=" * 60)
    logger.info("🌿 Crop Disease Detection — Model Training")
    logger.info("=" * 60)

    # Check GPU availability
    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        logger.info(f"✅ GPU detected: {[g.name for g in gpus]}")
    else:
        logger.warning("⚠️  No GPU detected — training on CPU (slower)")

    # ── 1. Data ────────────────────────────────────────────────────────────────
    train_gen, val_gen = build_data_generators()

    # ── 2. Model ───────────────────────────────────────────────────────────────
    model = build_model(num_classes=train_gen.num_classes)

    # ── 3. Callbacks ───────────────────────────────────────────────────────────
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    callbacks = [
        # Stop training if val_accuracy stops improving for 5 epochs
        EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        # Save the best model checkpoint
        ModelCheckpoint(
            filepath=str(MODEL_PATH),
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1
        ),
        # Reduce learning rate when plateau is hit
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        # TensorBoard logs for visualization
        TensorBoard(log_dir=str(LOG_DIR), histogram_freq=1)
    ]

    # ── 4. Train ───────────────────────────────────────────────────────────────
    logger.info(f"Starting training for up to {EPOCHS} epochs ...")
    history = model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )

    # ── 5. Evaluate ────────────────────────────────────────────────────────────
    logger.info("\nEvaluating on validation set ...")
    val_loss, val_acc, val_top5 = model.evaluate(val_gen, verbose=1)
    logger.info(f"\n📊 Final Results:")
    logger.info(f"   Validation Loss:         {val_loss:.4f}")
    logger.info(f"   Validation Accuracy:     {val_acc * 100:.2f}%")
    logger.info(f"   Validation Top-5 Acc:    {val_top5 * 100:.2f}%")

    # ── 6. Save ────────────────────────────────────────────────────────────────
    model.save(str(MODEL_PATH))
    logger.info(f"\n✅ Model saved to: {MODEL_PATH}")
    logger.info("Training complete! You can now run the web app.")

    return history


if __name__ == "__main__":
    train()

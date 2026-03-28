"""
Crop Disease Detection - Hugging Face Version
Dataset: A2H0H0R1/plant-disease-new
"""

import tensorflow as tf
import numpy as np
from datasets import load_dataset
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2

# =========================
# 1. LOAD DATASET
# =========================
print("Loading dataset...")

ds = load_dataset("A2H0H0R1/plant-disease-new")

train_ds = ds["train"]

# split train → train/val
split = train_ds.train_test_split(test_size=0.2, seed=42)
train_data = split["train"]
val_data = split["test"]

num_classes = len(set(train_ds["label"]))
print("Classes:", num_classes)

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

# =========================
# 2. PREPROCESS FUNCTION
# =========================
def preprocess(example):
    image = example["image"].convert("RGB").resize(IMAGE_SIZE)
    image = np.array(image) / 255.0
    label = example["label"]
    return image, label

def gen(data):
    for item in data:
        yield preprocess(item)

# =========================
# 3. TF DATASETS
# =========================
train_tf = tf.data.Dataset.from_generator(
    lambda: gen(train_data),
    output_signature=(
        tf.TensorSpec(shape=(224,224,3), dtype=tf.float32),
        tf.TensorSpec(shape=(), dtype=tf.int64)
    )
).shuffle(1000).batch(BATCH_SIZE)

val_tf = tf.data.Dataset.from_generator(
    lambda: gen(val_data),
    output_signature=(
        tf.TensorSpec(shape=(224,224,3), dtype=tf.float32),
        tf.TensorSpec(shape=(), dtype=tf.int64)
    )
).batch(BATCH_SIZE)

# =========================
# 4. MODEL (MobileNetV2)
# =========================
base_model = MobileNetV2(
    input_shape=(224,224,3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False  # IMPORTANT (start frozen)

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(num_classes, activation="softmax")
])

# =========================
# 5. COMPILE
# =========================
model.compile(
    optimizer=optimizers.Adam(1e-4),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =========================
# 6. TRAIN
# =========================
print("Training started...")

model.fit(
    train_tf,
    validation_data=val_tf,
    epochs=10
)

# =========================
# 7. SAVE MODEL
# =========================
model.save("model/crop_model.h5")

print("✅ Training complete! Model saved.")
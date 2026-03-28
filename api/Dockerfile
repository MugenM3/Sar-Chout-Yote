# ── Base image ────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

# ── Install system dependencies ───────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# ── Install Python dependencies ───────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Copy application code ─────────────────────────────────────────────────────
COPY . .

# ── Expose port ───────────────────────────────────────────────────────────────
EXPOSE 7860

# ── Health check ──────────────────────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/health')"

# ── Start server ──────────────────────────────────────────────────────────────
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "2"]

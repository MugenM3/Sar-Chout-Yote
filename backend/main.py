"""
main.py
-------
FastAPI application entry point for Crop Disease Detection System.
- Serves the frontend HTML page
- Mounts static files (CSS, JS)
- Registers API routes (predict, diseases)
- Configures CORS, error handlers, and startup events
"""

import sys
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse

# ── Path setup ─────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Dist path is: d:\Sar-Chout-Yote\grow-wise-ai-22\dist
DIST_DIR = os.path.join(os.path.dirname(BASE_DIR), "grow-wise-ai-22", "dist")
sys.path.insert(0, BASE_DIR)

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ── Lifespan: startup / shutdown events ──────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup logic before serving requests."""
    logger.info("🌿 Crop Disease Detection API starting up ...")
    # Pre-load the model so first prediction isn't slow
    from model.predict import load_model
    load_model()
    logger.info("🚀 Application ready!")
    yield
    logger.info("Shutting down ...")


# ── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Crop Disease Detection API",
    description=(
        "AI-powered API that detects crop diseases from leaf images using "
        "a MobileNetV2 CNN trained on the PlantVillage dataset (38 classes)."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",       # Swagger UI at /api/docs
    redoc_url="/api/redoc",     # ReDoc at /api/redoc
)

# ── CORS Middleware ────────────────────────────────────────────────────────────
# Allow all origins in development; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Static Files ───────────────────────────────────────────────────────────────
static_dir = os.path.join(BASE_DIR, "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# ── Jinja2 Templates ───────────────────────────────────────────────────────────
templates_dir = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=templates_dir)

# ── Register Routes ────────────────────────────────────────────────────────────
from routes.prediction import router as prediction_router
app.include_router(prediction_router, prefix="/api", tags=["Disease Detection"])


# ── Frontend Routes (React SPA Catch-all) ──────────────────────────────────────

# Mount /assets specifically for React's built CSS/JS
if os.path.exists(os.path.join(DIST_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="react-assets")

@app.get("/{full_path:path}", tags=["Frontend"])
async def serve_react_app(full_path: str):
    """Serve the React application and handle client-side routing."""
    # If the request is for an existing file in 'dist' (like favicon.ico), serve it
    file_path = os.path.join(DIST_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Otherwise, return 'index.html' for React Router to take over
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    return JSONResponse(
        status_code=404,
        content={"error": "Frontend build not found. Run 'npm run build' in the frontend directory."}
    )


# ── Health Check ───────────────────────────────────────────────────────────────

@app.get("/health", tags=["Monitoring"])
async def health_check():
    """
    Health check endpoint.
    Returns API status and whether the ML model is loaded.
    """
    from model.predict import _model
    return {
        "status": "ok",
        "model_loaded": _model is not None,
        "message": "Model ready for predictions" if _model is not None
                   else "Running in demo mode — train the model for real predictions"
    }


# ── Global Exception Handlers ──────────────────────────────────────────────────

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Return a JSON 404 error for API routes."""
    return JSONResponse(
        status_code=404,
        content={"error": "Resource not found", "path": str(request.url)}
    )


@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    """Return a JSON 500 error for unexpected server errors."""
    logger.error(f"Server error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error. Please try again later."}
    )


# ── Dev server entry ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,           # Auto-reload on code changes (dev mode)
        log_level="info"
    )

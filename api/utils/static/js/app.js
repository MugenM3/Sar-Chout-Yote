/**
 * app.js — CropGuard AI Frontend Logic
 * Handles: drag-drop upload, image preview, API calls,
 *          result rendering, tab switching, prediction history,
 *          disease list loading with search/filter.
 */

// ── DOM References ────────────────────────────────────────────────────────────
const fileInput       = document.getElementById('file-input');
const dropArea        = document.getElementById('drop-area');
const previewArea     = document.getElementById('preview-area');
const previewImg      = document.getElementById('preview-img');
const previewFilename = document.getElementById('preview-filename');
const previewSize     = document.getElementById('preview-size');
const btnSelect       = document.getElementById('btn-select');
const btnCamera       = document.getElementById('btn-camera');
const cameraArea      = document.getElementById('camera-area');
const cameraStream    = document.getElementById('camera-stream');
const btnCapture      = document.getElementById('btn-capture');
const btnCloseCamera  = document.getElementById('btn-close-camera');
const cameraCanvas    = document.getElementById('camera-canvas');

const btnPredict      = document.getElementById('btn-predict');
const btnClear        = document.getElementById('btn-clear');
const btnRetry        = document.getElementById('btn-retry');
const btnClearHistory = document.getElementById('btn-clear-history');

const resultIdle      = document.getElementById('result-idle');
const resultLoading   = document.getElementById('result-loading');
const resultContent   = document.getElementById('result-content');
const resultError     = document.getElementById('result-error');

const modelBadge      = document.getElementById('model-badge');
const historyGrid     = document.getElementById('history-grid');
const historyEmpty    = document.getElementById('history-empty');
const diseaseGrid     = document.getElementById('disease-grid');
const diseaseSearch   = document.getElementById('disease-search');
const severityFilter  = document.getElementById('severity-filter');
const navbar          = document.getElementById('navbar');

let currentFile = null;      // Currently selected File object
let predictions  = [];       // In-memory history array
let mediaStream = null;      // Camera stream

// ── Navbar scroll effect ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Check model/health status on load ────────────────────────────────────────
async function checkHealth() {
    try {
        const res = await fetch('/health');
        const data = await res.json();
        if (data.model_loaded) {
            modelBadge.textContent = '✅ Model Live';
            modelBadge.className = 'model-badge live';
        }
    } catch (_) { /* ignore */ }
}

// ── Camera Handlers ───────────────────────────────────────────────────────────
btnCamera.addEventListener('click', async (e) => {
    e.stopPropagation();
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is blocked by your browser. This usually happens if you are not using localhost or a secure HTTPS connection.");
        return;
    }

    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        cameraStream.srcObject = mediaStream;
        dropArea.style.display = 'none';
        cameraArea.style.display = 'flex';
        previewArea.style.display = 'none';
        showResultIdle();
    } catch (err) {
        alert("Unable to access camera. Please make sure you granted camera permissions to the browser.");
        console.error("Camera error:", err);
    }
});

btnCloseCamera.addEventListener('click', stopCamera);

function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    cameraStream.srcObject = null;
    cameraArea.style.display = 'none';
    if (!currentFile) {
        dropArea.style.display = 'flex';
    } else {
        previewArea.style.display = 'flex';
    }
}

btnCapture.addEventListener('click', () => {
    if (!mediaStream) return;
    
    // Draw current video frame to canvas
    cameraCanvas.width = cameraStream.videoWidth;
    cameraCanvas.height = cameraStream.videoHeight;
    const ctx = cameraCanvas.getContext('2d');
    ctx.drawImage(cameraStream, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    // Convert canvas to Blob (file)
    cameraCanvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        stopCamera();
        handleFileSelected(file);
    }, 'image/jpeg', 0.9);
});

// ── Drag & Drop handlers ──────────────────────────────────────────────────────
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) handleFileSelected(files[0]);
});

// Click on drop area to open file picker
dropArea.addEventListener('click', () => fileInput.click());
btnSelect.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });

// File input change
fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFileSelected(fileInput.files[0]);
});

/**
 * Handle a newly selected file — validate, show preview, ready for prediction.
 * @param {File} file
 */
function handleFileSelected(file) {
    // Basic client-side validation
    const allowed = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
    if (!allowed.includes(file.type)) {
        showError('Invalid file type. Please upload a JPG, PNG, BMP, or WEBP image.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 5 MB.`);
        return;
    }

    currentFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewFilename.textContent = file.name;
        previewSize.textContent = `${(file.size / 1024).toFixed(0)} KB`;
        dropArea.style.display = 'none';
        previewArea.style.display = 'flex';
        showResultIdle();  // Reset result side
    };
    reader.readAsDataURL(file);
}

// Clear button — reset upload zone
btnClear.addEventListener('click', () => {
    currentFile = null;
    fileInput.value = '';
    previewImg.src = '';
    dropArea.style.display = 'flex';
    previewArea.style.display = 'none';
    cameraArea.style.display = 'none';
    showResultIdle();
});

// Retry button
btnRetry.addEventListener('click', () => showResultIdle());

// ── Predict ───────────────────────────────────────────────────────────────────
btnPredict.addEventListener('click', runPrediction);

async function runPrediction() {
    if (!currentFile) return;

    btnPredict.disabled = true;
    showResultLoading();

    const formData = new FormData();
    formData.append('file', currentFile);

    try {
        const response = await fetch('/predict', { method: 'POST', body: formData });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: 'Unknown server error' }));
            throw new Error(err.detail || `Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.confidence < 50) {
            // Low confidence — warn but still show result
            console.warn(`Low confidence: ${data.confidence}%`);
        }

        showResult(data);
        addToHistory(data, previewImg.src);

    } catch (err) {
        console.error('Prediction error:', err);
        showError(err.message || 'Network error. Is the server running?');
    } finally {
        btnPredict.disabled = false;
    }
}

// ── Result Display ────────────────────────────────────────────────────────────
function showResultIdle() {
    resultIdle.style.display = 'flex';
    resultLoading.style.display = 'none';
    resultContent.style.display = 'none';
    resultError.style.display = 'none';
    // Re-flex result card
    document.getElementById('result-idle').style.flexDirection = 'column';
    document.getElementById('result-idle').style.alignItems = 'center';
}

function showResultLoading() {
    resultIdle.style.display = 'none';
    resultLoading.style.display = 'flex';
    resultLoading.style.flexDirection = 'column';
    resultLoading.style.alignItems = 'center';
    resultContent.style.display = 'none';
    resultError.style.display = 'none';
}

/**
 * Render the prediction result into the result card.
 * @param {Object} data — PredictionResponse from API
 */
function showResult(data) {
    resultIdle.style.display = 'none';
    resultLoading.style.display = 'none';
    resultError.style.display = 'none';
    resultContent.style.display = 'block';

    const isHealthy = data.status.includes('Healthy');

    // Status badge
    const statusEl = document.getElementById('result-status');
    statusEl.textContent = data.status;
    statusEl.className = `result-status ${isHealthy ? 'healthy' : 'diseased'}`;

    // Severity badge
    const sevEl = document.getElementById('severity-badge');
    sevEl.textContent = data.severity === 'None' ? '✅ Healthy' : `${data.severity} Severity`;
    sevEl.className = `severity-badge severity-${data.severity.toLowerCase()}`;

    // Disease / crop info
    document.getElementById('result-disease').textContent = data.disease;
    document.getElementById('result-crop').textContent = `🌱 ${data.affected_crop}`;

    // Confidence bar (animated)
    const confBar = document.getElementById('confidence-bar');
    const confPct = document.getElementById('confidence-percent');
    confPct.textContent = `${data.confidence.toFixed(1)}%`;
    confBar.style.width = '0%';
    setTimeout(() => { confBar.style.width = `${data.confidence}%`; }, 50);

    // Color the bar based on confidence level
    if (data.confidence >= 80) {
        confBar.style.background = 'linear-gradient(90deg, #4ade80, #22d3ee)';
    } else if (data.confidence >= 60) {
        confBar.style.background = 'linear-gradient(90deg, #fcd34d, #fb923c)';
    } else {
        confBar.style.background = 'linear-gradient(90deg, #f87171, #e879f9)';
    }

    // Tab content
    document.getElementById('result-symptoms').textContent   = data.symptoms;
    document.getElementById('result-solution').textContent   = data.solution;
    document.getElementById('result-prevention').textContent = data.prevention;

    // Demo mode warning
    document.getElementById('demo-warning').style.display = data.is_demo ? 'block' : 'none';

    // Activate the symptoms tab by default
    activateTab('symptoms');
}

function showError(msg) {
    resultIdle.style.display = 'none';
    resultLoading.style.display = 'none';
    resultContent.style.display = 'none';
    resultError.style.display = 'flex';
    resultError.style.flexDirection = 'column';
    resultError.style.alignItems = 'center';
    document.getElementById('error-msg').textContent = msg;
}

// ── Tab Switching ─────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

function activateTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    ['symptoms', 'solution', 'prevention'].forEach(t => {
        document.getElementById(`tab-${t}`).style.display = t === tabName ? 'block' : 'none';
    });
}

// ── Prediction History ────────────────────────────────────────────────────────
function addToHistory(data, imageDataUrl) {
    const entry = {
        disease:    data.disease,
        confidence: data.confidence,
        status:     data.status,
        imageUrl:   imageDataUrl,
        time:       new Date().toLocaleTimeString()
    };

    predictions.unshift(entry);          // Add to front
    if (predictions.length > 5) predictions.pop();  // Keep max 5

    // Persist to localStorage
    localStorage.setItem('cropguard_history', JSON.stringify(predictions));
    renderHistory();
}

function renderHistory() {
    if (predictions.length === 0) {
        historyEmpty.style.display = 'block';
        return;
    }
    historyEmpty.style.display = 'none';

    // Keep only history-item elements, not the empty msg
    const existingItems = historyGrid.querySelectorAll('.history-item');
    existingItems.forEach(el => el.remove());

    predictions.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <img src="${entry.imageUrl}" alt="${entry.disease}" />
            <div class="history-disease">${entry.disease}</div>
            <div class="history-conf">${entry.confidence.toFixed(1)}% confidence</div>
            <div class="history-time">${entry.time}</div>
        `;
        historyGrid.appendChild(item);
    });
}

btnClearHistory.addEventListener('click', () => {
    predictions = [];
    localStorage.removeItem('cropguard_history');
    historyGrid.querySelectorAll('.history-item').forEach(el => el.remove());
    historyEmpty.style.display = 'block';
});

// Load history from localStorage on page load
function loadHistory() {
    try {
        const saved = localStorage.getItem('cropguard_history');
        if (saved) {
            predictions = JSON.parse(saved);
            renderHistory();
        }
    } catch (_) { predictions = []; }
}

// ── Disease List ──────────────────────────────────────────────────────────────
let allDiseases = [];

async function loadDiseases() {
    try {
        const res = await fetch('/diseases');
        allDiseases = await res.json();
        renderDiseases(allDiseases);
    } catch (err) {
        diseaseGrid.innerHTML = `<div class="disease-loading">Could not load disease database.</div>`;
    }
}

function renderDiseases(list) {
    if (list.length === 0) {
        diseaseGrid.innerHTML = `<div class="disease-no-results">No diseases match your search.</div>`;
        return;
    }

    diseaseGrid.innerHTML = list.map(d => {
        const sevColor = {
            High: '#f87171', Medium: '#fcd34d', Low: '#4ade80', None: '#4ade80'
        }[d.severity] || '#94a3b8';

        const sevLabel = d.severity === 'None' ? '✅ Healthy' : d.severity;

        return `
            <div class="disease-card">
                <div class="disease-card-header">
                    <div>
                        <div class="disease-card-name">${d.disease_name}</div>
                        <div class="disease-card-crop">🌱 ${d.affected_crop}</div>
                    </div>
                    <span class="severity-badge severity-${d.severity.toLowerCase()}">${sevLabel}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Search + filter
function filterDiseases() {
    const query = diseaseSearch.value.toLowerCase();
    const sev   = severityFilter.value;
    const filtered = allDiseases.filter(d => {
        const matchSearch = d.disease_name.toLowerCase().includes(query)
            || d.affected_crop.toLowerCase().includes(query);
        const matchSev = !sev || d.severity === sev;
        return matchSearch && matchSev;
    });
    renderDiseases(filtered);
}

diseaseSearch.addEventListener('input', filterDiseases);
severityFilter.addEventListener('change', filterDiseases);

// ── Init ──────────────────────────────────────────────────────────────────────
(function init() {
    checkHealth();
    loadHistory();
    loadDiseases();
    showResultIdle();
})();

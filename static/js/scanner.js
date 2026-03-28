/**
 * scanner.js - Handles camera access and prediction bridging for Sar-Chout-Yote
 */

document.addEventListener('DOMContentLoaded', () => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const shutterBtn = document.querySelector('button.group'); // The large shutter button
    const cameraViewContainer = document.querySelector('section.bg-black');
    const statusText = document.querySelector('.font-label.text-xs');
    const statusPulse = document.querySelector('.bg-white.animate-pulse');

    // Add hidden video and canvas to DOM
    video.style.display = 'none';
    video.autoplay = true;
    video.playsInline = true;
    document.body.appendChild(video);

    // Initial status
    if (statusText) statusText.textContent = 'READY TO SCAN';
    if (statusPulse) statusPulse.classList.remove('animate-pulse');

    // Request camera access
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
            });
            video.srcObject = stream;
            
            // Show video in the viewfinder container if possible
            // For now, we'll keep the mockup image but use the video for capture
            console.log("Camera initialized");
        } catch (err) {
            console.error("Camera error:", err);
            alert("Unable to access camera. Please ensure you've granted permissions.");
        }
    }

    initCamera();

    shutterBtn.addEventListener('click', async () => {
        if (!video.srcObject) return;

        // Visual feedback
        if (statusText) statusText.textContent = 'ANALYZING...';
        if (statusPulse) statusPulse.classList.add('animate-pulse');
        shutterBtn.classList.add('scale-95', 'opacity-50');

        // Capture frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob, 'scan.jpg');

            try {
                // Call our newly integrated FastAPI backend
                // Note: In development, this usually runs on port 8000
                const response = await fetch('http://localhost:8000/predict', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error("Server error " + response.status);

                const result = await response.json();
                
                // Store result and image for the result page
                sessionStorage.setItem('last_diagnosis', JSON.stringify(result));
                
                // Convert canvas to base64 for preview
                const dataURL = canvas.toDataURL('image/jpeg');
                sessionStorage.setItem('last_scan_image', dataURL);

                // Redirect to diagnosis solution page
                window.location.href = '../ai_diagnosis_solution/code.html';
                
            } catch (err) {
                console.error("Prediction failed:", err);
                alert("Diagnosis failed. Is the AI server running at http://localhost:8000?");
                if (statusText) statusText.textContent = 'READY TO SCAN';
                if (statusPulse) statusPulse.classList.remove('animate-pulse');
                shutterBtn.classList.remove('scale-95', 'opacity-50');
            }
        }, 'image/jpeg');
    });
});

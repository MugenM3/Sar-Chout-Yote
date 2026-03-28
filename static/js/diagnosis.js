/**
 * diagnosis.js - Populates the diagnosis result page with real AI data
 */

document.addEventListener('DOMContentLoaded', () => {
    const lastDiagnosisJSON = sessionStorage.getItem('last_diagnosis');
    const lastScanImage = sessionStorage.getItem('last_scan_image');

    if (!lastDiagnosisJSON) {
        console.warn("No diagnosis data found. Showing placeholder.");
        return;
    }

    try {
        const data = JSON.parse(lastDiagnosisJSON);
        
        // Update Hero Section
        const diseaseNameEl = document.querySelector('h1.font-headline');
        const affectedCropEl = document.querySelector('p.text-on-surface-variant span.text-primary');
        const confidenceEl = document.querySelector('.text-5xl.font-extrabold');
        const scanImageEl = document.querySelector('img[alt="Scanned Tomato Leaf"]');
        const statusBadge = document.querySelector('.bg-tertiary-fixed span.material-symbols-outlined + span'); // Wait, the selector might be tricky

        if (diseaseNameEl) diseaseNameEl.textContent = data.disease;
        if (affectedCropEl) affectedCropEl.textContent = data.affected_crop;
        if (confidenceEl) confidenceEl.innerHTML = `${Math.round(data.confidence)}<span class="text-2xl">%</span>`;
        if (scanImageEl && lastScanImage) scanImageEl.src = lastScanImage;

        // Update Solutions (Bento Grid)
        // Action 1: Pruning/Main Solution
        const solutionTitle = document.querySelector('h3.font-headline'); // Returns the first one
        const solutionDesc = document.querySelectorAll('p.text-on-surface-variant.text-sm')[0];
        if (solutionDesc) solutionDesc.textContent = data.solution;
        
        // Symptoms
        const symptomsSection = document.querySelectorAll('p.text-on-surface-variant.text-lg')[0];
        if (symptomsSection) symptomsSection.innerHTML = `Detected on <span class="font-semibold text-primary">${data.affected_crop}</span>. ${data.symptoms}`;

        // Prevention
        const preventionDesc = document.querySelectorAll('p.text-on-surface-variant.text-sm')[3]; // Assuming 4th card is related?
        // Actually it's better to map them properly. The mockup has 4 cards.
        // We can put symptoms in one, solution in another, prevention in 3rd.
        
        const cards = document.querySelectorAll('.bg-surface-container-lowest.p-6');
        if (cards.length >= 3) {
            // Card 1: Solution
            cards[0].querySelector('h3').textContent = "Treatment Plan";
            cards[0].querySelector('p').textContent = data.solution;
            
            // Card 2: Symptoms details
            cards[1].querySelector('h3').textContent = "Observation";
            cards[1].querySelector('p').textContent = data.symptoms;
            
            // Card 3: Prevention
            cards[2].querySelector('h3').textContent = "Future Prevention";
            cards[2].querySelector('p').textContent = data.prevention;
            
            // Card 4: Severity/Info
            cards[3].querySelector('h3').textContent = "Severity Level";
            cards[3].querySelector('p').textContent = `Status: ${data.status}. Severity: ${data.severity}.`;
        }

    } catch (err) {
        console.error("Error parsing diagnosis data:", err);
    }
});

// Mouse tracking for folder tilt effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateFolderTilt();
});

function updateFolderTilt() {
    const closedFolder = document.getElementById('closedFolderElement');
    const portfolio = document.getElementById('portfolio-container');
    
    // Calculate tilt based on mouse position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;
    
    const maxTilt = 11; // Maximum tilt in degrees
    const tiltX = -percentY * maxTilt;
    const tiltY = percentX * maxTilt;
    
    // Apply tilt to closed folder if visible
    if (closedFolder && !document.getElementById('folder-closed').classList.contains('hidden')) {
        closedFolder.style.transform = `perspective(1000px)translateZ(1px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    
    // Apply tilt to open portfolio if visible
    if (portfolio && portfolio.classList.contains('active')) {
        const subtleTiltX = -percentY * 3;
        const subtleTiltY = percentX * 3;
        portfolio.style.transform = `perspective(1000px)translateZ(1px) rotateX(${subtleTiltX}deg) rotateY(${subtleTiltY}deg)`;
    }

    // Apply tilt to CT viewer if open
    // if (ctViewer && ctViewer.classList.contains('open')) {
    //     const viewerTiltX = -percentY * 8;
    //     const viewerTiltY = percentX * 8;
    //     ctViewer.style.transform = `translateY(-50%) perspective(1000px) rotateX(${viewerTiltX}deg) rotateY(${viewerTiltY}deg)`;
    // }
}

function openFolder() {
    document.getElementById('folder-closed').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('portfolio-container').classList.add('active');
        updateFolderTilt();
    }, 500);
}

function closeFolder() {
    const portfolio = document.getElementById('portfolio-container');
    const folderClosed = document.getElementById('folder-closed');
    
    // Add closing animation class
    portfolio.classList.add('closing');
    
    // After animation completes, show closed folder
    setTimeout(() => {
        portfolio.classList.remove('active');
        portfolio.classList.remove('closing');
        folderClosed.classList.remove('hidden');
        
        // Reset to first tab
        const tabs = document.querySelectorAll('.tab');
        const pages = document.querySelectorAll('.page-content');

        tabs.forEach(tab => tab.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));

        tabs[0].classList.add('active');
        document.getElementById('welcome').classList.add('active');

        
        updateFolderTilt();
    }, 800);
}

function switchTab(tabName, element) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    if (element) {
        element.classList.add('active');
    }

    // Update page content
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));

    const target = document.getElementById(tabName);
    if (target) {
        target.classList.add('active');
    }
    
    // Auto-open CT viewer when CT Scan tab is clicked
    if (tabName === 'ct-scan') {
        const panel = document.getElementById('ctViewerPanel');
        if (!panel.classList.contains('open')) {
            toggleCTViewer();
        }
    } else {
        // Close CT viewer when switching away from CT Scan tab
        const panel = document.getElementById('ctViewerPanel');
        if (panel && panel.classList.contains('open')) {
            toggleCTViewer();
        }
    }
}
// Initialize tilt on page load
window.addEventListener('load', updateFolderTilt);

// Toggle CT Viewer Panel
function toggleCTViewer() {
    const panel = document.getElementById('ctViewerPanel');
    panel.classList.toggle('open');
    
    // Initialize viewer when opened for the first time
    if (panel.classList.contains('open') && !window.ctViewerInitialized) {
        initCTViewer();
        window.ctViewerInitialized = true;
    }
}

// CT Scan Viewer Functionality
const totalSlices = 254;
let currentSlice = 0;
let baseInterval = 120;
let speedFactor = 1.0;
let playing = true;

const sliceImg = document.getElementById("sliceImage");
const sliceLabelEl = document.getElementById("sliceLabel");
const speedDisplay = document.getElementById("speedFactor");
const contrastSlider = document.getElementById("contrastSlider");
const imageContainer = document.querySelector('.ct-image-container');

let loopInterval;

function initCTViewer() {
    if (!sliceImg) return; // Exit if CT viewer elements don't exist yet
    
    loopInterval = setInterval(nextSlice, baseInterval / speedFactor);
    
    // Set current date in report
    const reportDateEls = document.querySelectorAll('.report-date');
    reportDateEls.forEach(el => {
        el.textContent = new Date().toLocaleDateString();
    });
}

function nextSlice() {
    if (!playing) return;
    currentSlice = (currentSlice + 1) % totalSlices;
    updateSlice();
}

function updateSlice() {
    const fileNumber = totalSlices - 1 - currentSlice;
    const num = String(fileNumber).padStart(4, "0");
    sliceImg.src = `slices/pat1reg-tp0_slice_${num}.jpg`;
    sliceLabelEl.textContent = `${currentSlice + 1} / ${totalSlices}`;
}

function resetInterval() {
    clearInterval(loopInterval);
    loopInterval = setInterval(nextSlice, baseInterval / speedFactor);
}

// Event listeners for CT viewer (only if elements exist)
if (document.getElementById("faster")) {
    document.getElementById("faster").onclick = () => {
        speedFactor = Math.min(speedFactor + 0.5, 3);
        speedDisplay.textContent = `×${speedFactor.toFixed(2)}`;
        resetInterval();
    };
}

if (document.getElementById("slower")) {
    document.getElementById("slower").onclick = () => {
        speedFactor = Math.max(speedFactor - 0.5, 0.5);
        speedDisplay.textContent = `×${speedFactor.toFixed(2)}`;
        resetInterval();
    };
}

if (sliceImg) {
    sliceImg.addEventListener("mouseenter", () => playing = false);
    sliceImg.addEventListener("mouseleave", () => playing = true);

    sliceImg.addEventListener("wheel", e => {
        e.preventDefault();
        const direction = Math.sign(e.deltaY);
        currentSlice += direction;
        currentSlice = Math.max(0, Math.min(totalSlices - 1, currentSlice));
        updateSlice();
    });
}

if (contrastSlider && imageContainer) {
    contrastSlider.addEventListener("input", () => {
        imageContainer.style.filter = `contrast(${contrastSlider.value}%)`;
    });
}



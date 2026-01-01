const totalSlices = 254; // 0000 to 0253
let currentSlice = 0;     // start from 0
let interval = 100;       // ms per slice
let playing = true;

const img = document.getElementById('sliceImage');
const sliceLabel = document.getElementById('sliceLabel');
const speedDisplay = document.getElementById('speedDisplay');

let loopInterval = setInterval(nextSlice, interval);

function nextSlice() {
    if (!playing) return;
    currentSlice++;
    if (currentSlice > totalSlices - 1) currentSlice = 0;
    updateSlice();
}

function updateSlice() {
    const num = String(currentSlice).padStart(4, '0'); // pad to 4 digits
    img.src = `slices/pat1reg-tp0_slice_${num}.jpg`;
    sliceLabel.textContent = `Slice ${currentSlice + 1} / ${totalSlices}`;
}

// Hover pause
img.addEventListener('mouseenter', () => playing = false);
img.addEventListener('mouseleave', () => playing = true);

// Speed controls
document.getElementById('slower').addEventListener('click', () => {
    interval += 50;
    resetInterval();
});

document.getElementById('faster').addEventListener('click', () => {
    interval = Math.max(10, interval - 50);
    resetInterval();
});

function resetInterval() {
    clearInterval(loopInterval);
    loopInterval = setInterval(nextSlice, interval);
    speedDisplay.textContent = interval + 'ms';
}

// Scroll wheel to move slices manually
img.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        currentSlice = Math.max(0, currentSlice - 1);
    } else {
        currentSlice = Math.min(totalSlices - 1, currentSlice + 1);
    }
    updateSlice();
});
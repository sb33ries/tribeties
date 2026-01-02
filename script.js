const totalSlices = 254;
let currentSlice = 0; // Start at 0 (displays as "1/254", uses file 0253)

let baseInterval = 120;
let speedFactor = 1.0;
let playing = true;

const img = document.getElementById("sliceImage");
const sliceLabel = document.getElementById("sliceLabel");
const speedDisplay = document.getElementById("speedFactor");
const contrastSlider = document.getElementById("contrastSlider");

let loopInterval = setInterval(nextSlice, baseInterval / speedFactor);

function nextSlice() {
    if (!playing) return;
    currentSlice = (currentSlice + 1) % totalSlices; // Increment forward visually
    updateSlice();
}

function updateSlice() {
    // Invert the file number: slice 0 uses file 253, slice 1 uses file 252, etc.
    const fileNumber = totalSlices - 1 - currentSlice;
    const num = String(fileNumber).padStart(4, "0");
    img.src = `slices/pat1reg-tp0_slice_${num}.jpg`;
    sliceLabel.textContent = `Slice ${currentSlice + 1} / ${totalSlices}`;
}

function resetInterval() {
    clearInterval(loopInterval);
    loopInterval = setInterval(nextSlice, baseInterval / speedFactor);
}

document.getElementById("faster").onclick = () => {
    speedFactor = Math.min(speedFactor + 0.5, 3);
    speedDisplay.textContent = `×${speedFactor.toFixed(2)}`;
    resetInterval();
};

document.getElementById("slower").onclick = () => {
    speedFactor = Math.max(speedFactor - 5, 0.5);
    speedDisplay.textContent = `×${speedFactor.toFixed(2)}`;
    resetInterval();
};

img.addEventListener("mouseenter", () => playing = false);
img.addEventListener("mouseleave", () => playing = true);

img.addEventListener("wheel", e => {
    e.preventDefault();

    const direction = Math.sign(e.deltaY); // up = -1, down = +1
    currentSlice += direction;             // Scroll down increases visual slice number

    currentSlice = Math.max(0, Math.min(totalSlices - 1, currentSlice));
    updateSlice();
});

contrastSlider.addEventListener("input", () => {
    img.style.filter = `contrast(${contrastSlider.value}%)`;
});

// Auto date
document.getElementById("reportDate").textContent =
    new Date().toLocaleDateString();

const text = "REPORT";
const typingSpeed = 200;  // milliseconds per character
const erasingSpeed = 150; // milliseconds per character
const pauseBetween = 1500; // pause before erasing or retyping
let index = 0;
let typing = true; // true = typing, false = erasing
const el = document.getElementById("typing-report");

function typeEffect() {
    if (typing) {
        // add one character
        el.textContent += text.charAt(index);
        index++;
        if (index === text.length) {
            typing = false;
            setTimeout(typeEffect, pauseBetween);
        } else {
            setTimeout(typeEffect, typingSpeed);
        }
    } else {
        // erase one character
        el.textContent = text.substring(0, index - 1);
        index--;
        if (index === 0) {
            typing = true;
            setTimeout(typeEffect, pauseBetween);
        } else {
            setTimeout(typeEffect, erasingSpeed);
        }
    }
}

// start typing
typeEffect();
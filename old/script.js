const totalSlices = 254;
let currentSlice = 0; // Start at 0 (displays as "1/254", uses file 0253)

let baseInterval = 120;
let speedFactor = 1.0;
let playing = true;

const img = document.getElementById("sliceImage");
const sliceLabel = document.getElementById("sliceLabel");
const speedDisplay = document.getElementById("speedFactor");
const contrastSlider = document.getElementById("contrastSlider");
const imageContainer = document.querySelector('.image-container');

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
    sliceLabel.textContent = `${currentSlice + 1} / ${totalSlices}`;
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
    imageContainer.style.filter = `contrast(${contrastSlider.value}%)`;
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

// ===== RESEARCH SECTION SCROLL REVEAL =====
const researchSection = document.querySelector('.research-section');

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

if (researchSection) {
    observer.observe(researchSection);
}

// ===== RESEARCH ITEM INTERACTION =====
const researchItems = document.querySelectorAll('.research-item');
const detailContent = document.getElementById('detailContent');
const detailPlaceholder = document.querySelector('.detail-placeholder');

// Sample research data (replace with your actual data)
const researchData = {
    ongoing1: {
        title: "Neural Network Models for Medical Imaging",
        status: "Ongoing",
        date: "2024 - Present",
        description: "Developing deep learning architectures for automated analysis of cardiac CT scans. This work focuses on leveraging convolutional neural networks to identify structural abnormalities and predict clinical outcomes with high accuracy.",
        authors: "S. Li, et al.",
        image: "path/to/your-image.jpg", // Add image path
        links: [
            { text: "View Paper", url: "https://example.com/paper.pdf" },
            { text: "GitHub Repository", url: "https://github.com/yourusername/project" }
        ]
    },
    ongoing2: {
        title: "Cardiac Imaging Analysis Pipeline",
        status: "Ongoing",
        date: "2024 - Present",
        description: "Building an end-to-end computational pipeline for processing and analyzing large-scale cardiac imaging datasets. Integration of image segmentation, feature extraction, and statistical modeling.",
        authors: "S. Li, Co-investigators TBD"
    },
    pub1: {
        title: "Machine Learning Applications in Radiology",
        status: "Published",
        date: "Journal Name, 2024",
        description: "Systematic review examining the current state of machine learning implementation in radiological practice. Analyzes over 200 studies to identify key trends, challenges, and future directions in AI-assisted diagnosis.",
        authors: "S. Li, A. Smith, B. Johnson"
    },
    pub2: {
        title: "Healthcare Data Systems and Interoperability",
        status: "Published",
        date: "Medical Informatics, 2023",
        description: "Investigation of data integration challenges in modern healthcare systems. Proposes novel frameworks for improving interoperability between electronic health records and imaging databases.",
        authors: "S. Li, C. Williams"
    },
    conf1: {
        title: "RSNA 2024: AI in Cardiac Imaging",
        status: "Conference",
        date: "December 2024",
        description: "Poster presentation demonstrating novel applications of artificial intelligence in cardiac CT interpretation. Showcased preliminary results from ongoing research on automated coronary artery calcium scoring.",
        authors: "S. Li"
    }
};

researchItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        researchItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get data and update detail view
        const dataId = item.getAttribute('data-id');
        const data = researchData[dataId];
        
        if (data) {
            // Hide placeholder
            detailPlaceholder.classList.add('hidden');
            
            // Fade out current content
            detailContent.classList.remove('visible');
            
            // Update content after fade out
            setTimeout(() => {
                let mediaHTML = '';
                
                // Add image if exists
                if (data.image) {
                    mediaHTML += `<img src="${data.image}" alt="${data.title}" class="detail-image">`;
                }
                
                // Add video if exists
                if (data.video) {
                    mediaHTML += `
                        <div class="detail-video">
                            <iframe src="${data.video}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    `;
                }
                
                // Add links if exist
                let linksHTML = '';
                if (data.links && data.links.length > 0) {
                    linksHTML = '<div class="detail-links">';
                    data.links.forEach(link => {
                        linksHTML += `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a>`;
                    });
                    linksHTML += '</div>';
                }
                
                detailContent.innerHTML = `
                    <h2>${data.title}</h2>
                    <div class="meta">
                        <span><strong>Status:</strong> ${data.status}</span>
                        <span><strong>Date:</strong> ${data.date}</span>
                    </div>
                    ${mediaHTML}
                    <div class="description">${data.description}</div>
                    <div class="authors">${data.authors}</div>
                    ${linksHTML}
                `;
                
                detailContent.classList.add('visible');
            }, 200);
        }
    });
});
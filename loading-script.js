// Set current date
const dateEl = document.getElementById('current-date');
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
dateEl.textContent = today.toLocaleDateString('en-US', options);

// Typing animation
const typingEl = document.getElementById('typing-text');
const text = "Generating report...";
let index = 0;

function typeText() {
  if (index < text.length) {
    typingEl.innerHTML = text.substring(0, index + 1) + '<span class="cursor"></span>';
    index++;
    setTimeout(typeText, 100);
  } else {
    setTimeout(() => {
      typingEl.innerHTML = "Report complete." + '<span class="cursor"></span>';
      setTimeout(showEnterButton, 500);
    }, 500);
  }
}

function showEnterButton() {
  const btn = document.getElementById('enter-btn');
  btn.style.display = 'inline-block';
  btn.classList.add('show');
}

// Start typing after a brief delay
setTimeout(typeText, 1000);

// Enter button and keyboard handler
const enterBtn = document.getElementById('enter-btn');
const container = document.getElementById('container');

function handleEnter() {
  container.classList.add('fade-out');
  setTimeout(() => {
    // Replace with your portfolio URL or next page
    window.location.href = 'portfolio.html';
  }, 500);
}

enterBtn.addEventListener('click', handleEnter);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && enterBtn.style.display !== 'none') {
    handleEnter();
  }
});
function updateCountdown() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffTime = nextMonth - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').textContent = diffDays + (diffDays === 1 ? ' day' : ' days');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 86400000); // Update every day
  
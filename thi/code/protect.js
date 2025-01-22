// Chống copy
document.addEventListener('copy', (e) => e.preventDefault());

// Chống F12, Developer Tools và xem source
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.key === 'u')) {
    e.preventDefault();
  }
});

const ToolStorage = require('../shared/tool-storage');

let timerInterval;
let isRunning = false;
let sessionCount = 0;

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  const timerDisplay = document.getElementById('timer');
  
  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60 < 10 ? '0' + (timeLeft % 60) : timeLeft % 60;
    timerDisplay.textContent = `${mins}:${secs}`;
    
    if (--timeLeft < 0) {
      clearInterval(timerInterval);
      sessionCount++;
      ToolStorage.set('sessionCount', sessionCount);
      updateTimer();
    }
  }
  
  timerInterval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerInterval);
}

document.getElementById('startPause').addEventListener('click', () => {
  const startPauseButton = document.getElementById('startPause');
  if (isRunning) {
    pauseTimer();
    startPauseButton.textContent = 'Start';
  } else {
    startTimer();
    startPauseButton.textContent = 'Pause';
  }
});

// Initialize session count from storage
const storedSessionCount = ToolStorage.get('sessionCount') || 0;
if (storedSessionCount > 0) {
  sessionCount = storedSessionCount;
}
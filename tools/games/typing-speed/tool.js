const ToolStorage = require('../../shared/tool-storage');

function startTest() {
  const typingText = document.getElementById('typing-text');
  const typingInput = document.getElementById('typing-input');
  const result = document.getElementById('result');

  // Sample text to type
  const sampleText = 'The quick brown fox jumps over the lazy dog';
  typingText.textContent = sampleText;
  typingInput.value = '';

  let startTime, endTime;

  function handleKeyDown(event) {
    if (!startTime) startTime = new Date().getTime();
    if (event.key === 'Enter') {
      event.preventDefault();
      endTest();
    }
  }

  function endTest() {
    const inputText = typingInput.value.trim();
    endTime = new Date().getTime();

    // Calculate WPM and accuracy
    const elapsedTime = (endTime - startTime) / 1000;
    const wordsTyped = inputText.split(' ').filter(Boolean).length;
    const wpm = Math.round((wordsTyped / elapsedTime) * 60);
    const correctWords = sampleText.split(' ').filter(word => inputText.includes(word)).length;
    const accuracy = ((correctWords / wordsTyped) * 100).toFixed(2);

    result.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
    document.removeEventListener('keydown', handleKeyDown);
  }

  typingInput.addEventListener('keydown', handleKeyDown);
}
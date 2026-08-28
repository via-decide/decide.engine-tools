const { generatePuzzle } = require('./puzzle-utils');

module.exports = {
  run: async (input) => {
    const puzzleType = input.type || 'crossword';
    const difficulty = input.difficulty || 1;
    
    try {
      const puzzle = await generatePuzzle(puzzleType, difficulty);
      return { puzzle };
    } catch (error) {
      console.error('Error generating puzzle:', error);
      throw new Error('Failed to generate puzzle');
    }
  }
};
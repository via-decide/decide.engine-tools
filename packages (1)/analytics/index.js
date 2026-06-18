// Core Analytics Package
module.exports = {
  recordEvent: (event, data) => {
    console.log(`[Analytics] Record: ${event}`, data);
  }
};

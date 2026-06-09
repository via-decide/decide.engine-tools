// Core Telemetry Package
module.exports = {
  logState: (component, state) => {
    console.log(`[Telemetry] ${component} state updated`, state);
  }
};

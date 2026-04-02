(function (global) {
  'use strict';

  function createResearchStore() {
    const datasets = [];
    const protocolLogs = [];
    const reports = [];

    function addDataset(name, payload) {
      const item = { name, payload, ts: new Date().toISOString() };
      datasets.push(item);
      return item;
    }

    function addProtocolLog(payload) {
      const item = { payload, ts: new Date().toISOString() };
      protocolLogs.push(item);
      return item;
    }

    function addReport(title, summary, table) {
      const item = { title, summary, table, ts: new Date().toISOString() };
      reports.push(item);
      return item;
    }

    function snapshot() {
      return {
        datasets: datasets.slice(-50),
        protocolLogs: protocolLogs.slice(-200),
        reports: reports.slice(-50)
      };
    }

    return {
      addDataset,
      addProtocolLog,
      addReport,
      snapshot
    };
  }

  global.HighwayResearchOutput = { createResearchStore };
})(window);

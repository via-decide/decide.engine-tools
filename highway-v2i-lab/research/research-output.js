(function (global) {
  'use strict';

  function createResearchStore() {
    const datasets = [];
    const protocolLogs = [];
    const reports = [];
    const leaderboards = {
      protocol: [],
      infrastructure: [],
      architecture: []
    };

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

    function addLeaderboardEntry(kind, payload) {
      if (!leaderboards[kind]) leaderboards[kind] = [];
      leaderboards[kind].push(Object.assign({ ts: new Date().toISOString() }, payload || {}));
      leaderboards[kind] = leaderboards[kind].slice(-200);
      return leaderboards[kind][leaderboards[kind].length - 1];
    }

    function snapshot() {
      return {
        datasets: datasets.slice(-50),
        protocolLogs: protocolLogs.slice(-200),
        reports: reports.slice(-50),
        leaderboards: {
          protocol: leaderboards.protocol.slice(-20),
          infrastructure: leaderboards.infrastructure.slice(-20),
          architecture: leaderboards.architecture.slice(-20)
        }
      };
    }

    return {
      addDataset,
      addProtocolLog,
      addReport,
      addLeaderboardEntry,
      snapshot
    };
  }

  global.HighwayResearchOutput = { createResearchStore };
})(window);

(function (global) {
  'use strict';

  const MESSAGE_TYPES = ['safetyAlert', 'trafficUpdate', 'routingSignal', 'cooperativeControl'];

  function createProtocol(input) {
    const src = input || {};
    return {
      name: String(src.name || 'UnnamedProtocol'),
      broadcastRate: Number(src.broadcastRate || 10),
      latency: Number(src.latency || 14),
      range: Number(src.range || 280),
      routingStrategy: String(src.routingStrategy || 'flooding'),
      congestionControl: String(src.congestionControl || 'fixed-window'),
      messagePriority: src.messagePriority || { safetyAlert: 1, trafficUpdate: 0.6, routingSignal: 0.5, cooperativeControl: 0.8 },
      broadcastInterval: Number(src.broadcastInterval || src.broadcastRate || 10),
      relayProbability: Number(src.relayProbability == null ? 0.75 : src.relayProbability),
      priorityWeights: src.priorityWeights || { safety: 0.45, congestion: 0.2, reliability: 0.2, efficiency: 0.15 },
      ttl: Number(src.ttl || src.messageTTL || 4),
      messageTTL: Number(src.messageTTL || src.ttl || 4),
      adaptiveDelay: Number(src.adaptiveDelay || src.adaptiveLatency || 10),
      adaptiveLatency: Number(src.adaptiveLatency || src.adaptiveDelay || 10)
    };
  }

  const DSRC_Model = createProtocol({
    name: 'DSRC_Model',
    broadcastRate: 10,
    latency: 18,
    range: 260,
    routingStrategy: 'broadcast',
    congestionControl: 'csma-ca',
    relayProbability: 0.72,
    ttl: 4,
    adaptiveDelay: 12
  });

  const CV2X_Model = createProtocol({
    name: 'CV2X_Model',
    broadcastRate: 12,
    latency: 14,
    range: 330,
    routingStrategy: 'scheduled-sidelink',
    congestionControl: 'semi-persistent',
    relayProbability: 0.78,
    ttl: 5,
    adaptiveDelay: 10
  });

  const AMV2X_Model = createProtocol({
    name: 'AM-V2X',
    broadcastRate: 9,
    latency: 12,
    range: 360,
    routingStrategy: 'adaptive-mesh',
    congestionControl: 'priority-adaptive',
    relayProbability: 0.64,
    ttl: 5,
    adaptiveDelay: 7,
    messagePriority: { safetyAlert: 1, trafficUpdate: 0.52, routingSignal: 0.67, cooperativeControl: 0.9 }
  });

  function shouldRelayAMV2X(context) {
    const data = context || {};
    return Boolean(
      data.signalQualityImproves ||
      data.coverageExpands ||
      Number(data.safetyPriority || 0) >= 0.8
    );
  }

  const api = {
    MESSAGE_TYPES,
    createProtocol,
    DSRC_Model,
    CV2X_Model,
    AMV2X_Model,
    shouldRelayAMV2X
  };

  global.ProtocolCore = api;

  const decide = global.DECIDE || { engine: {}, tools: {}, simulation: {}, ui: {} };
  global.DECIDE = decide;
  decide.engine = decide.engine || {};
  decide.engine.protocolCore = api;
})(window);
